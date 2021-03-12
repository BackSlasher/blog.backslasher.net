---
title: Sending mail on coredumps
categories:
- FOSS
tags:
  - Linux
  - Scripts
  - Python
  - Email
---

## The Story
I recently found out that some of our backend code suffers from memory-related ceashes, namely `SIGSEGV` (a program tries to access memory it doesn't own). My initial response was to install and enable [Abrt](https://fedorahosted.org/abrt/), which is a collection of utilities used in RHEL. Ubuntu has a similar tool called [Apport](https://wiki.ubuntu.com/Apport).  
I like this tool because it sends the root user an email after every coredump / kernel oops / kernel panic, with the coredump attached (configurable) and helpful information about the process's state (environment variables, open files, uid...).  
However, our issue was that our crashing processes are quite big (at least 2G of working memory) and might crash a lot, so taking coredumps for these processes was putting quite a strain on our servers' I/O. 

## A bit about Abrt
Abrt is built from multiple processes. The ones relevant to my issue were:

1. `abrt-hook-ccpp`, registered as the kernel's `core_pattern`, meaning it's invoked whenever a process should coredump. This utility creates a "dump" directory under `/var/spool/abrt` and puts the coredump and process trivia there
2. `abrtd`, a deamon that monitors said directory, and whenever a new dump directory appears, it reads the data inside and takes action (sends emails, reports to RHEL's support API...)
3. `abrt-ccpp`, a service that runs on startup and registers `abrt-hook-ccpp` as the `core_pattern`

`abrt-ccpp` is registered by modifying `/proc/sys/kernel/core_pattern`, which usually specifies the filename to write core dumps to. However, when specifying a path that starts with `|`, it's instead treated as a program to execute on coredumps. The program's `STDIN` contains the coredump, and the offending process's `/proc/` directory is kept alive so you can collect the interesting data.  
I couldn't utilize Abrt and skip the coredump - `abrt-hook-ccpp` refused to skip creating the coredump, and `abrtd` refused to process directories without the coredump. I had to emulate the behaviour on my own script.

## The Script
This is my crude replacement - it's supposed to be called from `core_pattern`, so I also wrote a "service" to register it.  
It's written in Python (and not Ruby, for instance) because Python comes installed on every server I encountered so far (because it powers Apt and Yum).  
It basically harvests all interesting data from the failing process and emails it. The current list is:

* **cgroup**
* **cmdline**: The commmand used to start the process, arguments and everything
* **executable**: Path to the binary file being executed
* **signal**: The signal causing the process to coredump
* **hostname**
* **kernel**
* **pwd**: Current working directory for the faulting process
* **start_time**
* **end_time**
* **uid**
* **username**
* **dso_list**: Loaded dynamic libraries
* **environ**: Environment variables
* **limits**: Ulimits for the process
* **maps**: Allocated memory areas (including memory-mapped files)
* **open_fds**: Open file descriptors (files, sockets, pipes...)

```python
#!/usr/bin/env python

###########
# Nitz Abrt
###########
#
# A crude emulation of the Abrt utility for monitoring and diagnosing segfaults
# Should be hooked from core_pattern - see your sysadmin
# http://blog.backslasher.net/mail-coredumps.html

import sys
import os
import pwd
import syslog

def usage():
  print 'Usage: {} %s %c %p %u %g %t e'.format(__file__)
  print ('%s  number of signal causing dump\n'
         '%c  core file size soft resource limit of crashing process\n'
         '%p  PID of dumped process\n'
         '%u  (numeric) real UID of dumped process\n'
         '%g  (numeric) real GID of dumped process\n'
         '%t  time of dump, expressed as seconds since the Epoch, 1970-01-01 00:00:00 +0000 (UTC)\n'
         'e   ignored\n'
         '\n'
         'Should be called from core_pattern\n'
  )
  sys.exit(1)

if(len(sys.argv)!=8): usage()

signal=sys.argv[1]
pid=sys.argv[3]
uid=int(sys.argv[4])
dump_time = sys.argv[6]

proc_path='/proc/%s/' % pid



def read_file(filename):
  filename = os.path.join(proc_path,filename)
  return open(filename,'r').read()

def get_symlink(filename):
  filename = os.path.join(proc_path,filename)
  return os.path.join(os.path.dirname(filename), os.readlink(filename))

def get_start_time():
  return int(os.path.getctime(proc_path))

def get_dso():
  filename = os.path.join(proc_path,'maps')
  files = set([x.strip()[x.find('/'):] for x in open(filename,'r').readlines() if x.find('/') > -1])
  return '\n'.join(files)

def list_dir_symlink(dirname):
  dirname = os.path.join(proc_path,dirname)
  link_hash = dict((i,os.readlink(os.path.join(dirname,i))) for i in os.listdir(dirname))
  return '\n'.join(['%s: %s' % (k,link_hash[k]) for k in sorted(link_hash.keys())])

exe_path=get_symlink('exe')

import fnmatch
blacklist = ['*/php-fpm'] # These executables are uninteresting
for pattern in blacklist:
  if fnmatch.fnmatch(exe_path,pattern):
    print '%s is blacklisted by pattern "%s". Ignoring' % (exe_path,pattern)
    exit(1)

data = {
  'cgroup': read_file('cgroup'),
  'cmdline': read_file('cmdline').replace('\0','\n').strip(),
  'executable': exe_path,
  'signal': signal,
  'hostname': os.uname()[1],
  'kernel': os.uname()[2],
  'pid': pid,
  'pwd': get_symlink('cwd'),
  'start_time': get_start_time(),
  'end_time': dump_time,
  'uid': uid,
  'username': pwd.getpwuid(uid).pw_name,
  'dso_list': get_dso(),
  'environ': '\n'.join(read_file('environ').split('\0')),
  'limits':read_file('limits'),
  'maps': read_file('maps'),
  'open_fds': list_dir_symlink('fd')
}
data_str = '\n'.join(['#%s:\n%s' % (k,data[k]) for k in sorted(data.keys())])

mail='To:root\nSubject:nabrt crash %s\n\n%s' % (exe_path.split('/')[-1], data_str)
import subprocess
pmail = subprocess.Popen(['mail','-t'],stdin=subprocess.PIPE)
pmail.stdin.write(mail)
pmail.stdin.close()
```


## Bonus - modifying `STDIN`
Because `abrt-hook-ccpp` takes its coredump from `STDIN`, I thought I could still utilize it by calling it with a modified STDIN that contains very little.
This idea failed because `abrtd` wouldn't work with a "corrupted" coredump, but I think it's a novel idea and a cute script:
```bash
#!/bin/sh
(head -c $((5*1024)) <&0 ) |          # Only take the first 5 MB from STDIN and pass it along
exec /usr/libexec/abrt-hook-ccpp "$@" # Become original hook
```
I initially tried closing `STDIN` completely, but turns out the kernel is only keeping the `/proc` directory of the faulting process when that stream is open - it thinks you're done collecting diagnostics when you close that stream.
