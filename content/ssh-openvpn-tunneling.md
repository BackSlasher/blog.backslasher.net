title: SSH vs OpenVPN for Tunneling
date: 2014-12-18 12:00
category: FOSS
slug: ssh-openvpn-tunneling
tags: Mysteries Solved, Networking, Linux, SSH, Security

### The Story
I was asked to take care of a security challange - setup Redis replication between two VMs over the internet.  
The VMs were in different continents, so I had keep the bandwidth impact to a minimum.
I thought of 3 options:

* `stunnel`, which uses tunnels TCP connections via SSL
* SSH, which has TCP tunneling over it's secure channel ([amongst its weponary](|filename|/images/ssh-openvpn-tunneling/inquisition.jpg))
* OpenVPN, which is designed to encapsulate, encrypt and compress traffic among two machines

I quickly dropped stunnel because its setup is nontrivial compared to the other two (no logging, no init file...), and decided to test SSH and OpenVPN.  
I was sure that when it comes to speed, OpenVPN will be the best, because:

1. The first Google results say so (and they even look credible)
    * [http://superuser.com/a/238801](http://superuser.com/a/238801)
    * [http://security.stackexchange.com/a/68367](http://security.stackexchange.com/a/68367)
    * [http://support.vpnsecure.me/articles/tips-tricks/comparison-chart-openvpn-pptp-ssh-tunnel](http://support.vpnsecure.me/articles/tips-tricks/comparison-chart-openvpn-pptp-ssh-tunnel)
2. Logic dictates that SSH tunneling will suffer from [TCP over TCP](http://sites.inka.de/bigred/devel/tcp-tcp.html), since SSH runs over TCP
3. OpenVPN, being a VPN software, is solely designed to move packets from one place to another.  

I was so sure of that, that I *almost* didn't test.  
I was quite surprised.

### Test 1
I only compared speed, since I decided the encryption of both programs will be enough.  
My test consisted of this procedure:

1. Create a functioning, data-filled Redis instance in `server A`, port 6379
2. Start an empty Redis instance in `server B`, port 6379
3. Setup tunneling (according to the method I was testing)
4. Execute `redis-cli -p 6379 slaveof <Target port>` on `server B`
5. Wait for `MASTER <-> SLAVE sync started` to appear on `server B`'s Redis
6. Wait for `MASTER <-> SLAVE sync: Finished with success` to appear on `server B`'s Redis
7. Cleanup

I recorded the time it took `server B` to go from step 5 to step 6, effectivly measuring the duration of a full replication.  
The Redis data set was about 1GB. Not the biggest I've ever seen, but enough for my tests.
I played around with a few parameters, and these are my results:  

<style type="text/css">th,td{padding: 20px;}</style>
| platform | protocol | compression | duration |
|----------|----------|-------------|----------|
| OpenVPN  | TCP      | no          | 21m      |
|          |          | yes         | 15m      |
|          | UDP      | no          | 6m       |
|          |          | yes         | 5m       |
| SSH      | TCP      | default     | 1m50s    |
|          |          | no          | 1m30s    |
|          |          | yes         | 2m30s    |

As you can see, SSH beats OpenVPN. By far.  
I was surprised to see this, so I did some additional tests, using `iperf`.

### Test 2
My second test utilized `iperf`, and I left OpenVPN compression on, because disabling it clearly wasn't helping.  
Server A was running the iperf server, using `iperf -s`.  
Server B was running the iperf client, using `iperf -c <SERVER ADDRESS> -p <PORT>`.  
Below is my test summary.

| platform | protocol |  encrpytion | speed (M**b**/s) |
|----------|----------|-------------|------------------|
| OpenVPN  | TCP      | BlowFish    | 13               |
|          |          | AES-256-CBC | 12               |
|          | UDP      | BlowFish    | 43               |
|          |          | AES-256-CBC | 36               |
| SSH      | TCP      | AWS128-CTR  | 91               |

Although the gap is reduced, SSH stil wins.
After some helpful hints at [ServerFault](http://serverfault.com/questions/653211/ssh-tunneling-is-faster-than-openvpn-could-it-be), I understood why, contrary to public opinion, SSH is faster.

### The solution
The difference between SSH and OpenVPN, giving SSH its edge, is on which [OSI layer](http://en.wikipedia.org/wiki/OSI_model) they work.  

#### OpenVPN
Being a VPN service, OpenVPN can operate as:

* `TUN`, a level 3 (IP) device
* `TAP`, a level 2 (MAC) device

Being a network device allows OpenVPN to support diverse protocols (anything over IP with `TUN` and anything over Eth802.3 with `TAP`) with diverse destinations (different IP addresses, broadcasts etc.) and diverse ports. However, to do that, it has to preserve the original packet structure, so it has to take most of the original packet, wrap it in its own packet (to encrypt and give it a new destination), and send it to ther other OpenVPN instance, where it's unpacked.  
This generates overhead, like this:

![](|filename|/images/ssh-openvpn-tunneling/diag-openvpn.jpg)

#### SSH connection forwarding
On the other hand, SSH connection forwarding operates at layer 4 (TCP). Because of that, you can only forward one port (unless you're using dynamic forwarding, which has its own overhead), and it has to be on TCP/IP.
However, because SSH operates at a higher OSI layer, less of the original data has to be preseved, so it has less overhead. It looks like this:

![](|filename|/images/ssh-openvpn-tunneling/diag-ssh.jpg)

### Some SSH `netstat`s
I recorded my socket status when running `redis-cli` over SSH forwarding.  
The redis server is listening on port 6379, and the forwarding is on port 20000.  
The commands I used are:
~~~bash
ssh -f <SERVER IP> -L 20000:127.0.0.1:6379 -N
redis-cli -p 20000
~~~
I removed the listening `sshd` socket, because it's irrelevant.  
**Before running `redis-cli`**, we can see SSH has an established a tunnel and  listening `localhost` socket on the client
```text
backslasher@client$ netstat -nap | grep -P '(ssh|redis)'
...
tcp        0      0 127.0.0.1:20000             0.0.0.0:*                   LISTEN      20879/ssh
tcp        0      0 10.105.16.225:53142         <SERVER IP>:22              ESTABLISHED 20879/ssh
...

backslasher@server$ netstat -nap | grep -P '(ssh|redis)'
...
tcp        0      0 0.0.0.0:6379                0.0.0.0:*                   LISTEN      54328/redis-server
tcp        0      0 <SERVER IP>:22              <CLIENT IP>:53142           ESTABLISHED 53692/sshd
...
```
**After running `redis-cli`**, we can see the redis socket on the server, originating from sshd
```text
backslasher@client$ netstat -nap | grep -P '(ssh|redis)'
...
tcp        0      0 127.0.0.1:20000             0.0.0.0:*                   LISTEN      20879/ssh
tcp        0      0 127.0.0.1:20000             127.0.0.1:53142             ESTABLISHED 20879/ssh
tcp        0      0 127.0.0.1:53142             127.0.0.1:20000             ESTABLISHED 21692/redis-cli
...

backslasher@server$ netstat -nap | grep -P '(ssh|redis)'
...
tcp        0      0 0.0.0.0:6379                0.0.0.0:*                   LISTEN      54328/redis-server
tcp        0      0 127.0.0.1:6379              127.0.0.1:42680             ESTABLISHED 54328/redis-server
tcp        0      0 127.0.0.1:42680             127.0.0.1:6379              ESTABLISHED 54333/sshd
tcp        0      0 <SERVER IP>:22              <CLIENT IP>:53142           ESTABLISHED 52889/sshd
...
```
As we can see, SSH creates a loopback port on both client and server, so neither address each other directly.  
Thanks to that, this information (client IP/port, server IP/port) doesn't have to be transferred, saving overhead.

### TL;DR
As long as you only need one TCP port forwarded, SSH is a much faster choice, because it has less overhead.
