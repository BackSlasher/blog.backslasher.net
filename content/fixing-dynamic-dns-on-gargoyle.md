Title: Fixing Dynamic DNS on Gargoyle
Date: 2014-03-23 13:07
Category: FOSS
Tags: DNS, Mysteries Solved, Gargoyle, Scripts, Linux, Networking, DDNS, Bash
Slug: fixing-dynamic-dns-on-gargoyle
OldSlug: fixing-dynamic-dns-on-gargoyle

**Note**: I switched to `inadyn` on my home server eventually. I left this article because it's still relevant

I was digging through the logs of my latest
[Gargoyle](http://www.gargoyle-router.com/) installation (a router
firmware based on OpenWrt, with a better UI in my opinion), and found
out that [Dynamic DNS](http://en.wikipedia.org/wiki/Dynamic_DNS) updates
were failing.  
I was a little disappointed that I couldn't find any documentation about
what to do - the messages, both in the log and in the UI weren't too
informative.  
They were either:  

![](images/fixing-dynamic-dns-on-gargoyle/DDNSCliError.png)

`Successfully retrieved local ip from url`..., so no real error there  
Or:  

![](images/fixing-dynamic-dns-on-gargoyle/DDNSUIError.png)

~~~
Update of new dynamic DNS service configuration(s) failed
...
Service(s) could not be update properly and have therefore been
removed.
~~~
Which gives me no info.  
Luckily, it's all Linux, so I quickly found the configuration files and
got to work.  
Because my DDNS provider is [dnsexit.com](http://dnsexit.com/), I
searched for files containing "dnsexit" in the `/etc` directory (which
is where configuration is usually kept), like this:  
~~~~bash
grep -r "dnsexit" /etc
~~~~
I found the configuration in `/etc/ddns_providers.conf`. You'll see
there the configuration for all of different DDNS providers. I'll copy
my current one:  
~~~~text
service dnsexit.com
 url_template   https://www.dnsexit.com/RemoteUpdate.sv?login=[[USERNAME]]&password=[[PASSWORD]]&host=[[DOMAIN]]&myip=[[IP]]
 required_variables  domain username password
 required_variable_names  DyDNS.DoNm,DyDNS.UsrN,DyDNS.Pssw
 success_regexp   /^0=Success|1=IP*/
~~~~

Using this configuration, we can deduce that hitting the url under
`url_template` while replacing all double-bracketed variables with
actual values will try and update my IP, and the response has to match
the [regular expression](http://en.wikipedia.org/wiki/Regular_expression) under
`success_regexp`. My next action was building this small bash script to
try and emulate Gargoyle's actions:   

~~~~bash
HOST=BESTHOSTEVER.com
USER=SOMETHING
PASS=SOMETHINGELSE

IP=$(curl -s ifconfig.me/ip)
curl "https://www.dnsexit.com/RemoteUpdate.sv?login=$USER&password=$PASS&host=$HOST&myip=$IP"
~~~~

Note the line starting with IP. It uses `cURL` to hit a nice website,
which is supposed to return your external IP address. The result I got
looked like:   

~~~~text
 HTTP/1.1 200 OK
4=IP not changed. To save our system resources, please don't post updates unless the IP got changed.
~~~~

So it looks like dnsexit says something like "no change is needed.
Please don't bother us for no reason." According to [this document](http://downloads.dnsexit.com/ipUpdate.doc) I found, the code
returned should be 1 (same IP) and not 4 (stop hammering our servers),
because I tried that action once every couple of hours. I can instruct
Gargoyle to accept this as a reasonable answer by modifying
"success\_regexp" to this:   

~~~~text
 success_regexp   /^0=Success|1=IP|4=IP not changed*/
~~~~

After backing up the file, editing and trying again, lo and behold!
Everything works!
