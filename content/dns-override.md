Title: DNS Override for a Single Process
Date: 2016-09-23 12:00
Category: FOSS
Tags: DNS, Scripting, C, Linux
Slug: dns-override

## The Problem
I needed to run a mobile emulator on my laptop, in order to test some DNS server changes before releasing them.  
However, since the emulator had no option to override its DNS settings it used my laptop's DNS settings, so to make it query a different server I had to modify my laptop's settings.  
This meant that I broke a lot of other programs running on my laptop, so for example I couldn't edit the DNS server and test the emulator at the same time. Very frustrating.  

## The Solution
I made a script that's using `LD_PRELOAD` to monkey-patch `fopen` and return a custom version of `/etc/resolv.conf`.  
It basically works like this:  

1. Create a new `resolv.conf` file and store it in an environment variable
2. Append my shared library to `LD_PRELOAD` to make my `fopen` hide the standard one
3. `exec` to the binary you want to run
4. When the binary calls `fopen`, our function is called. If the requested file is not `/etc/resolv.conf`, we pass everything to the original function. If it is, we open a pointer to the modified file instead

**The code is available under [dns-override](https://github.com/BackSlasher/dns-override)**

### Interesting points:
1. Took me a while to figure out there are `fopen` and `fopen64`
2. I'm opening read streams for `/etc/resolv.conf`, even when write streams are required. Could produce some weird behaviour
3. My original goal was passing something like `DNS_SERVERS=1.2.3.4` to the library, but it was much easier generating the entire `resolv.conf` file in a shell script.
4. I'm only targeting `glibc`'s `resolv`. However, that should cover all of my use cases so I'm happy.
