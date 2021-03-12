---
title: Dry Run for Python Pip
categories:
- FOSS
tags:
  - Scripts
  - Python
  - Pip
---

As I wrote [some time ago](|filename|/backslasher-python.md), I started my own [python cookbook](https://github.com/BackSlasher/chef-backslasher-python) for Chef because I didn't like the direction the "default" one was going.  
I recently added a new feature that I wanted to talk about. I called it `smart_install` in the cookbook, but it's actually a "dry-run" mode for `pip install`

### Motivation
When installing a Pip package using Chef, I have the "install" command, which is something like `pip install PACKAGENAME`. After I do so, I consider the resource "updated" (as in, its state has changed), which means it'll notify any resoures subscribed to it (e.g. restarting a service after a package is upgraded).  
I have 3 constraints:

1. The `install` action of the Pip resource should look like it ran `pip install` every time. In other words, if `pip install` would do something, it should run.
2. The `install` action shouldn't notify other resources that subscribed to it if `pip install` would have done nothing (e.g. if package is installed at the right version).
3. The `install` action should notify other resources that subscribed to it if `pip install` would have done something (e.g. installed a package if it's missing).

I saw 2 options to solve my constraints:

1. Run `pip install` every time, and parse its output to determine whether it did something or not.
2. Mark the resource as updated whenever I run `pip install`, and use something beforehand to determine whether running `pip install` is even needed (as in, would it do something).

Option 1 seemed too unreliable for me as it involved parsing a pretty verbose output that could change greatly between Pip versions, and might also include custom output (from installed packages' code), so I had to go for option 2.  

### Initial implementation
The first implementation, which currently stays as a fallback to "smart install", is taken primarily from the original Python cookbook.  
It involves running `pip list` and parsing its output to see which version is installed now, if any:
```ruby
# https://github.com/BackSlasher/chef-backslasher-python/blob/5de6e03/providers/pip.rb#L51
my_line = pip_command('list').stdout.lines.map{|line| pattern.match(line)}.compact.first
```
This information is joined with what little info we have about the package we're about to install (e.g. do we have a manually set version) and our intended action (install/upgrade) to decide whether to run `pip install`.

My primary issue with it is that it didn't work when installing from a URL / complex requirement line (e.g. `requests>=2`), and enriching it to work with these meant a lot of complexity (like downloading the package at the provided URL, extracting it and parsing its version) that I wasn't going to implement.

### Smart install
To handle more complicated cases, I've decided to create a Python script that uses Pip's libraries to decide whether `pip install` would do something.  
At first, I copied a lot of logic from `pip.commands.install` and `pip.req` to fill a `to_install` array (the name given in the Pip code to a collection of "requirements" to be installed), and then check whether this array has anything in it.  
Problem was, some method headers differ between my tested Pip versions, so I decided to avoid using that script because it might break pretty easily, in addition to it being pretty bulky.  
The solution I settled on might look clever to some and stupid to others. I decided to patch the "install" method on the `RequirementSet` object (used to represent a collection of needed packages) to add them all to my own array. I'm then checking whether this array is empty or not, and printing the result.  
The script looks like this:
```python
# https://github.com/BackSlasher/chef-backslasher-python/blob/90631c3/files/default/smart_install.py
from pip.req import RequirementSet

to_install=[]

def my_install(self, install_options, global_options=(), *args, **kwargs):
    global to_install
    to_install.extend([r for r in self.requirements.values() if not r.satisfied_by])

RequirementSet.install = my_install

import pip
import sys
args = sys.argv[1:]
if '-q' not in args: args.append('-q') # keep it quiet
pip.main(args)

#print 'to_install is',[r.name for r in to_install]
print any(to_install)
```

Interesting points:  

* The script is invoked just like Pip would, i.e. `python /tmp/smart_install.py install requests>=2`
* I'm forcing `-q` or "quiet" mode to avoid littering STDOUT with Pip's usual chatter.
* A non-0 exit code means failure to run. Whether anything is to be installed is determined by the script returning `True`/`False`.

### Conclusion
I'm not sure the script is fit for every use-case, so it's disabled by default. I'm especially afraid of it actually doing something (and not tellng Chef that it did).  
I would like to integrate it into Pip some day as `--dry-run` (thinking big). I still haven't decided how it will behave in the way of output - I'm not big on changing the exit code on one hand, and afraid of my meaningful output drowning in Pip's output.  
As usual, any comments are welcome!
