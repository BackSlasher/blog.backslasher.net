---
title: AWS's Block Device Mapping in CentOS
categories:
- FOSS
tags:
  - Linux
  - AWS
  - Virtualization
  - Mysteries Solved
  - Ruby
  - Perl
  - Scripts
  - Chef
---

### The Story
I'm using Amazon's EC2 for some of my VMs, which run CentOS. 
When viewing Block Device Mappings (mapping between the virtual storage - ebs, ephemerals etc. and the block devices inside the VM) in CentOS 6.5, I ran into an annoying issue.
When inspecting my instance metadata using:
~~~bash
curl http://169.254.169.254/latest/meta-data/block-device-mapping/ephemeral0
~~~
My ephemeral drive shows up as `sdb`.  
However, when viewing my actual devices, I found it became `sdf`:  
~~~bash
ls -l /dev/sd*
~~~
~~~text
lrwxrwxrwx. 1 root root 4 2014-12-10 13:09 /dev/sda -> xvde
lrwxrwxrwx. 1 root root 4 2014-12-10 13:09 /dev/sdf -> xvdf
lrwxrwxrwx. 1 root root 4 2014-12-10 13:09 /dev/sdg -> xvdg
~~~

This means I can't rely on the mappings for my scripts, meaning I can't easily differentiate between ephemeral drives (fast, free and get wiped every time the instance stops) and EBS drives. Pretty problematic.

### Red herrings
I found a udev rule in `/etc/udev/rules.d/99-ami-udev.rules`, which looked like
~~~text
KERNEL=="xvd*", PROGRAM="/usr/sbin/ami-udev %k", SYMLINK+="%c"
~~~
Which led me to `/usr/sbin/ami-udev`
~~~bash
#!/bin/bash
if [ "$#" -ne 1 ] ; then
  echo "$0 <device>" >&2
  exit 1
else
  if echo "$1"|grep -qE 'xvd[a-z][0-9]?' ; then
    echo sd$( echo ${1:3:1} | sed "y/[e-v]/[a-z]/" )${1:4:2}
  else
    echo "$1"
  fi
fi
~~~
which led me to read about `sed`s "transliteration". 

**All for nothing, because the problem wasn't there**

### The true issue
For reasons I don't completely understand (I'm sure they're valid, I just don't understand them), RHEL guys decided to change `xen_blkfront`, the module in charge of loading virtualized Xen hard drives.  
[This Bugzilla entry](https://bugzilla.redhat.com/show_bug.cgi?id=729586) points out the issue - virtual SCSI devices (which is what Amazon is using) are now starting at "e", meaning the first device is `xvde` (rather than `xvda`).

While not an issue by itself, Amazon's metadata service is unaware of this change, causing the metadata to disagree with the real data.

### The road I didn't take
The first solution that I tried is to modify the parameter mentioned in the entry (`sda_is_xvda`) to cause the kernel to start naming the devices in the "right" order.  
This method has the following steps:

* Make sure nothing depends on the current block device names
* Add an entry to `modprobe` to change the parameter `sda_is_xvda` to 1.  
  I did it using

        :::bash
        echo options xen_blkfront sda_is_xvda=1 | sudo tee /etc/modprobe.d/xen_blkfront.conf		

* Rebuild the kernel image (since this is part of the image)

        :::bash
        sudo dracut -f

* Reboot and check for modified drives

I chose not to do this because I didn't want to customize my kernel if I didn't have to, not to mention mandating a reboot before continuing my setup.

### The road I took
While less elegant, I've decided to compensate for RHEL's nonsense in my scripts.  
It's not that complicated (`echo sdb | perl -p -e 'substr($_,2,1)=~tr{a-j}{e-p}'` prints `sdf`), but I needed a way to make sure the server has this "`xvde` is the first iscsi device" configuration before compensating for it.  
My solution to this issue was to compare this (root drive as seen by AWS):
~~~bash
r=$(curl -s http://169.254.169.254/latest/meta-data/block-device-mapping/root)
echo ${r: -2:1}
~~~
to this (root drive IRL):
~~~bash
mount | perl -nae 'print substr($F[0],-1),"\n" if / on \/ /;'
~~~
If these results are different, that means that AWS and our OS aren't seeing eye-to-eye, and we need to compensate.  

### Bonus - Chef test
This is my real implementation in Chef:
~~~ruby
aws_root=node[:ec2][:block_device_mapping_root][-2,1]
real_root=`mount`.split("\n").select{ |i| i[/ on \/ /]}.first[/^([^ ]+[a-zA-Z])\d? /,1][-1,1]
block_diff=(aws_root == real_root) ? nil : real_root[0].ord - aws_root[0].ord
~~~
