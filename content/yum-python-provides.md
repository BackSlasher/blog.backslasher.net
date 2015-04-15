Title: Scripting YUM provides search using Python
Date: 2015-04-14 16:50
Category: FOSS
Tags: Python, Scripts, CentOS, Linux
Slug: yum-python-provides

## The Story
Today I had a list of files (nagios check scripts), and I wanted to check for every file if there's a package containing it (I'm a big fan of getting files from the repo rather than downloading manually).
Although YUM provides a way to search for packages containing a file pattern, like this:
```bash
yum provides '*/check_mailq'
```
The output is quite complicated to parse:
```text
Loaded plugins: fastestmirror, presto
Loading mirror speeds from cached hostfile
 * base: mirrors.seas.harvard.edu
 * epel: mirror.symnds.com
 * extras: mirror.ash.fastserv.com
 * updates: mirror.cogentco.com
private-chef-1.4.15-1.el6.x86_64 : The full stack of private-chef
Repo        : chef-stable
Matched from:
Filename    : /opt/opscode/embedded/nagios/libexec/check_mailq



private-chef-1.4.14-1.el6.x86_64 : The full stack of private-chef
Repo        : chef-stable
Matched from:
Filename    : /opt/opscode/embedded/nagios/libexec/check_mailq



nagios-plugins-mailq-1.4.16-10.el6.x86_64 : Nagios Plugin - check_mailq
Repo        : epel
Matched from:
Filename    : /usr/lib64/nagios/plugins/check_mailq
```
The first part is irrelevant (info messages that should IMO go to `stderr`), and every entry in the actual result contains multiple lines... bah.
Luckily, YUM is completely written in python so we can copy its behaviour with a custom script.

## The Solution
I used [this post](http://mo.morsi.org/blog/node/220) to help me with basic discovery. The rest is my work.  
This script requires root (or `sudo`). I didn't bother finding out how to run it otherwise.
```python
import yum
yb=yum.YumBase()
yb.doConfigSetup(debuglevel=-1,errorlevel=-1) # Hide info messages
files=['YOUR','file','name','go','here']

res={}
for f in files:
  r=yb.searchPackageProvides(['*/'+f]) # ,('*/'+f+'.*')
  res[f]=map(lambda x: x.name, r)
```
The following part varies by your objective. I wanted to list the packages required for each file, and also a sorted list of all relevant packages:
```python
print '**No matches:'
for p in filter(lambda x: len(res[x])==0, res): print p

print
print '**Matches:'
for p in filter(lambda x: len(res[x])>0, res): print p,res[p]

print
print '**Duplicates:'
for p in filter(lambda x: len(res[x])>1, res): print p,res[p]

print
print '**Packages to be installed:'
pkgs=map(lambda x: res[x],filter(lambda x: len(res[x])>0, res))
print sorted(list(set([item for sublist in pkgs for item in sublist])))
```
The result is quite nice:
```python
**No matches:
check_sockets.sh
check_threads.sh
check_exit_code.pl
check_duplicate_process

**Matches:
check_nagios ['nagios-plugins-nagios']
check_breeze ['nagios-plugins-breeze']
check_mrtgtraf ['nagios-plugins-mrtgtraf']
check_ldap ['check-mk', 'check-mk-docs', 'nagios-plugins-ldap']
check_ircd ['nagios-plugins-ircd']

**Duplicates:
check_ldap ['check-mk', 'check-mk-docs', 'nagios-plugins-ldap']
check_dns ['nagios-plugins-dns', 'check-mk', 'check-mk-docs']
check_smtp ['check-mk', 'nagios-plugins-smtp', 'check-mk-docs']

**Packages to be installed:
['check-mk', 'check-mk-docs', 'nagios-plugins-breeze', 'nagios-plugins-dns', 'nagios-plugins-ircd', 'nagios-plugins-ldap', 'nagios-plugins-mrtgtraf', 'nagios-plugins-nagios', 'nagios-plugins-smtp']
```
Looks good.
