Title: DNS Namesake - the DNS MitM
Date: 2016-11-05 12:00
Category: FOSS
Tags: DNS, Python
Slug: dns-namesake
Status: draft

# The Story
Imagine this situtation:
```text
      THE WORLD
       /
  company.com
      |
A     s1.red.company.com
A     s2.red.company.com
       ...
A     sN.red.company.com
CNAME lb.red.company.com -> s1.red.company.com
CNAME lb.red.company.com -> s2.red.company.com
       ...
CNAME lb.red.company.com -> sN.red.company.com

A     s1.blue.company.com
A     s2.blue.company.com
       ...
A     sN.blue.company.com
CNAME lb.blue.company.com -> s1.blue.company.com
CNAME lb.blue.company.com -> s2.blue.company.com
       ...
CNAME lb.blue.company.com -> sN.blue.company.com

CNAME color.company.com -> lb.red.company.com
```
In the diagram above, we have multiple RED and BLU servers, and records `red.company.com`/`blu.company.com` pointing to the servers using some sort of LB mechanism. We also have a `color` record, currently pointing to RED.  
**Your mission:**: Run a process of a specific application in an environment where a query for `color` points to `blu`.
**The hard part**:
1. You have to simulate the LB, so different queries for `color` return different `blu` servers.  
    This means we can't use `/etc/hosts` and point `color` to a random `blu` server.
2. The application sends other DNS queries that we can't predict ahead of time.  
   This means we can't point the app to a custom DNS server that only has the `color` record.
3. The application is blackboxed and we have no access to its source code.  
    This means we can't work around the DNS problem by replacing some app logic.

## Why it's a hard problem
Since we have to modify the DNS response returning to the app, and we have to let some queries remain untouched, the solution should look like a DNS Man-in-the-Middle.  
There are two options I've discarded because they're difficult:

1. Make the production server treat our app differently: This is impossible to do with the slim DNS server applications that companies usually run
2. Use 
