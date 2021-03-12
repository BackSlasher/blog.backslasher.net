---
title: Accessing a specific server in an HTTP cluster
categories:
- FOSS
tags:
  - HTTP
  - Web
  - Scripts
  - PowerShell
  - curl
  - linux
---

## The Problem
### Part1 - Fault tolerence
A common configuration of web servers is setting up multiple servers to serve the same content, with a load-balancing method redirecting / forwarding clients to a specific server.  
For instance, let's say I'm using servers `server` and `otherserver` to serve the site `cluster-name`.  
The cheapest (as in "not requiring any additional software/hardware") way of doing it is creating the following DNS records:
```text
cluster-name IN CNAME server
cluster-name IN CNAME otherserver
```
Due to  [round-robin DNS](http://en.wikipedia.org/wiki/Round-robin_DNS), about 50% of the clients querying for `cluster-name` will get the record pointing to `server` first (and therefor access it), and the other ones will get `otherserver` first. As long as the `server` and `otherserver` are configured to reply to requests containing `Host:"cluster-nane"` with the right application, everything works fine.  
### Part2 - Monitoring 
A popular weay to monitor web applications is hitting a specific page and making sure it comes out OK (for example, fetching `/test` and making sure it's empty).  
When you have just one server, this is easy to test. For example, one can use:
~~~bash
SERVER='http://site-adress'
[ -z $(curl -s "$SERVER/test") ] || echo '$SERVER is damaged'
~~~
However, when using a configuration with mutliple servers, you can't use the cluster name, because you'll get a random server, and as a responsible admin you want to test all of them individually.  
When the servers redirect any hostname to this site, this is still relatively easy to script, like:
~~~bash
SERVERS=( 'server' 'otherserver' )
for SERVER in "${SERVERS[@]}"; do
	[ -z $(curl -s "http://$SERVER/test") ] || echo '$SERVER is damaged'
done
~~~
However, most sites are configured on [virtual hosting](http://en.wikipedia.org/wiki/Virtual_hosting), so they respond only to a specific hostname (mostly to allow serving several sites on the same port). When using the above script on such sites, it won't work (because the host name is wrong).

## The Solution
Any proper solution should modify the client (the system running the monitoring script) and not the server, so I'm not talking about serving the site at another IP etc.
### The primitive one
The most primitive way of accessing a specific server is by modifying the HOSTS file, adding a record like
~~~
<server ip>    cluster-name
~~~
However, modifying the HOSTS file requires root/admin privilleges, might affect other processes on the machine and feels messy.

### The universal one
This method works with every tool I saw, because it's utilizing [HTTP/Web Proxy](http://en.wikipedia.org/wiki/Proxy_server#Web_proxy_servers) support, which is pretty basic.  
Normally, the client opens a socket to the hostname/port combination in the URL, writes the HTTP request and reads the response.  
When using an HTTP proxy, the client opens a socket to the proxy hostname/port combination and reads the response. The proxy is in charge of contacting the actual host via the `Host` HTTP header.  
By specifying the server as the proxy, we can keep the request "addressed" to `cluster-name` (by using the HTTP header `Host: "cluster-name"`), but actually access the server we want.  
And now for some examples, assuming `server:port` is the actual server/port listening, and `http://cluster-name/site` is the target site.
#### Using cURL / wget
Both applications can use the environment variable `http_proxy`, so the syntax is quite elegant.
~~~bash
http_proxy='http://server:port' curl 'http://cluster-name/site'
http_proxy='http://server:port' wget 'http://cluster-name/site'
~~~
#### Using PowerShell
~~~powershell
$prox = new-object System.Net.WebProxy 'http://server:port'
$req = [System.Net.WebRequest]::Create('http://cluster-name/site')
$req.Proxy = $prox
$req.GetResponse()
~~~
#### Using Python
Using the [requests](http://docs.python-requests.org/en/latest/) module
~~~python
import requests
proxies = {
	'http': 'http://server:port'
}

requests.get('http://cluster-name/site', proxies=proxies)
~~~
#### Using Ruby
~~~ruby
require 'net/http'
Net::HTTP.new('cluster-name', nil, 'server', 'port').start {
	|http| http.get('cluster-name/site')
}
~~~
