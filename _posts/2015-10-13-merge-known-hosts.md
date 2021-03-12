---
title: Merging known_hosts files
categories:
- FOSS
tags:
  - Python
  - Scripts
  - SSH
---

## The Story
Some time ago, some colleague rebuilt several servers and reused their names (think `sql1`,`sql2` etc).  
Obviously the new servers had different SSH server keys than the old ones, so my `known_hosts` file was out of date.  
I considered manually removing the old key fingerprints, but decided that I should make this process more robust, so instead I created a script that fetches all server SSH keys from our Chef server (coming soon).  
However, I found no script to merge the new file with the one I had. So I made one.

## The Script

### Update 22.10.15
My script was only allowing the first key type for each host. Fixed

```python
#!/usr/bin/env python

# Merges known_hosts files 
# http://blog.backslasher.net/merge-known-hosts.html

import argparse
parser = argparse.ArgumentParser(
    description='Merge known_hosts files sequentially',
    epilog="\
Duplicates are removed with eariler appearances having higher precedence (if a host is mentioned several times, only the first appearance is used). \
One can use only one file, like `merge-known-hosts.py ~/.ssh/known_hosts -o ~/.ssh/known_hosts` to remove duplicates. \
"
    )
parser.add_argument('files', type=str, nargs='+', help='files that should be merged')
parser.add_argument('-o', '--output', type=str, nargs='?', help='output file (defaults to STDOUT). Only opened after merge is complete, so can be used for inplace merge.')
args = parser.parse_args()

if args.output:
  import StringIO
  output = StringIO.StringIO()
else:
  import sys
  output = sys.stdout

familiar_hosts = set()
for file in args.files:
  with open(file) as f:
    for line in f:
      line_split = line.rstrip().split(' ')
      hosts = line_split.pop(0).split(',')
      key_type = line_split.pop(0)
      hosts = [ host for host in hosts if (host,key_type) not in familiar_hosts ] # Filter out familiar hosts
      if not hosts: continue # skip this row if no hosts left
      familiar_hosts.update([(host,key_type) for host in hosts])
      output.write('%s %s %s\n' %
          (','.join(hosts), key_type, ' '.join(line_split))
          )

if args.output:
  with open(args.output,'w') as f:
    f.write(output.getvalue())
```

### Interesting points:
* The script starts printing lines immediately. This means that it'll work on large files / pipes / whatever.  
  The only exception is when the output destination is a file. In order to avoid writing to the same file I'm reading (and corrupting it), I write to a "memory stream" and write it all to the file at the end.
* `familiar_hosts` is a set and not a list. This is because I don't need it ordered, and membership checks (testing if a host was already mentioned before) is much quicker in a set.  
  However, the `hosts` list that represents the hosts in the current row, **is** a list (and not a set) because I wanted to keep the ordering of the source file (when using a set, Python placed the IP addresses before the hostnames in the same row).
* I'm not hashing my `known_hosts` file (see "HashKnownHosts" under `man ssh_config`) because it prevents autocomplete in my SSH client. If you are using hashing, you should ensure that you're consistent - either have all input files hashed, or none of them. My script won't bother hashing plaintext hosts when looking for duplicates (if you implement it and find it useful, please send me a patch!)
