Title: Using RPMBuild - My Shortlist
Date: 2015-07-22 08:00
Category: FOSS
Tags: RPM, Linux, CentOS, RHEL, Scripts, Building
Slug: rpmbuild

## The Story
I was trying to tinker with [Abrt](https://github.com/abrt/abrt), a daemon in charge of collecting and diagnosing various crashes in RHEL (more on that in a different post).  
Because the crash hook is written in C (it was designed to be really quick), I couldn't use my usual method of editing the actual files and adding debug prints etc. I had to recompile the package from source, which proved to be a non-trivial task. The documentation I found was separated over several locations so I thought I'd list my way here:

## My Solution

Related articles from CentOS wiki:

* [Build environment](http://wiki.centos.org/HowTos/SetupRpmBuildEnvironment)
* [Rebuilding Source RPM](http://wiki.centos.org/HowTos/RebuildSRPM)

### 1. Create a build VM
Building is still a messy process. If you don't feel like cleaning up manually, you can just utilize a VM (I have a Vagrant config just for that). It should be running the same OS version you're building for (in my case, CentOS 6.6)

### 2. Install build tools
I always install the package group "development tools" in addition to "rpm-build", which contains a script for building RPMs.
```bash
sudo yum groupinstall 'development tools'
sudo yum install rpm-build
```
Also create a build root directory:
```bash
[ ! -d ~/rpmbuild ] || rm -r ~/rpmbuild # Delete dir if exists
mkdir -p ~/rpmbuild/{BUILD,RPMS,SOURCES,SPECS,SRPMS}
```

### 3. Grab source RPM
While it IS possible to build from real source (cloning the github repo for instance), I haven't had much luck with it. Even after generating the Makefile successfully, the build failed on some weird C syntax errors.  
For every binary RPM available from your repository, there should be a source RPM available as well - this one contains the source code and the metadata required to create the binary RPM. I use that RPM but to the source before building.  
While I couldn't activate a source repository (which is supposed to be a thing), I managed to hunt my source package down by modifying a URL I to match my OS/package. Maybe you'll have to do the same.  
Mine looks like:  
[http://vault.centos.org/6.6/os/Source/SPackages/abrt-2.0.8-26.el6.centos.src.rpm](http://vault.centos.org/6.6/os/Source/SPackages/abrt-2.0.8-26.el6.centos.src.rpm)  
You need to download and install the downloaded package (**without root**), which will deploy many files into your build root directory:
```bash
wget 'http://vault.centos.org/6.6/os/Source/SPackages/abrt-2.0.8-26.el6.centos.src.rpm' &&
rpm -iv *.rpm && # NO SUDO
rm *.rpm
```

### 4. Modify source
You can now inspect the files and modify whichever you want. Poke around in `~/rpmbuild/SOURCES`. I usually create a git repo in that directory before tinkering so I can easily track my customizations and revert if I mess something up.

## 5. Build
We now use the rpmbuild script to build the package by pointing it to a `spec` file. It *should* handle everything and leave you with a collection of binary RPMs, but obviously it might fail.  
I had an issue that even though I got the CentOS source package and ran it on a CentOS machine, the version was tagged as `el6` (Enterprise Linux 6), and not `el6.centos`, which is the tag that all CentOS packages that come from the official repos use. This is important because the dependencies of packages are often hardcoded to this tag, so trying to install those RPMs will cause it to complain (e.g. that you have `abrt-libs.2.0.8-30.el6.centos` and not `abrt-libs.2.0.8-30.el6`).  
To solve it, you should append something like `--define 'dist .el6.centos'` to your rpmbuild command.  
Mine looked like:
```bash
rpmbuild -ba ~/rpmbuild/SPECS/abrt.spec --define 'dist .el6.centos'
```

### 6. Install
After you're done building, you can now install the RPMS available at `~/rpmbuild/RPMS`. You might want to install the original repository packages first, just to have it install all of the external prerequisites (e.g. `gdb`) without bothering you. Use `sudo rpm -Uv` when installing, so you'll get a report of the files being installed / replaced. That way you can make sure your modified binaries are there.
