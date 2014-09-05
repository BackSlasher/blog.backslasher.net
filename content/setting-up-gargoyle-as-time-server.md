Title: Setting up Gargoyle as a Time Server
Date: 2014-06-11 12:12
Category: FOSS
Tags: Mysteries Solved, Gargoyle, Linux, Raspberry Pi, Debian, raspberrySeed, NTP
Slug: setting-up-gargoyle-as-time-server
OldSlug: setting-up-gargoyle-as-time-server

<span style="font-size: x-large;">The Story</span>   
For reasons unknown to me, Debian's NTP daemon only works on udp port
123, even when operating as a client.  
This is a problem because my network configuration does not allow
incoming packets on this port, thus preventing my raspberrySeed
(raspberry pi running Debian, deluge, flexget) from syncing, causing it
to slowly drift away from the real world.  
To solve the issue, I did two things:  
### The Solution
#### 1. Turn Gargoyle into an NTP server
Since Gargoyle is already syncing from outside, I only had to tell it to
act as a server.  
First, `ssh` into your gargoyle setup.  
Edit the file `/etc/config/system`, and under `timeserver`, change the
option `enable_server` to `'1'`.  

![](|filename|/images/setting-up-gargoyle-as-time-server/gargoyle-time-settings.png)

After editing the file, restart the service using   
~~~~bash
/etc/init.d/sysntpd restart
~~~~
And ensure the argument `-l` was added to the ntp daemon command line,
using this code:   
~~~~bash
ps | grep ntp
~~~~

![](|filename|/images/setting-up-gargoyle-as-time-server/gargoyle-ntp-working.png)

#### 2. Tell debian to ask Gargoyle:
ssh to your debian machine, and edit the file `/etc/ntp.conf`.  
Comment out all of the server entires, and only leave one pointing to
the name/IP address of Gargoyle:  

![](|filename|/images/setting-up-gargoyle-as-time-server/debian-ntp-config.png)

After that, restart the ntp daemon by running   
~~~~bash
sudo service ntp restart
~~~~
Wait a couple of minutes and use this to test everything is OK:   
~~~~bash
ntpq -p
~~~~
You should see one entry for your Gargoyle router, with the other fields
making sense (not all zeroes):  
![](|filename|/images/setting-up-gargoyle-as-time-server/debian-time-ok.png)
  
Enjoy your new time configuration!
