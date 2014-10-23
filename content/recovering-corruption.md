Title: Recovering from Disk Corruption on Debian
Date: 2014-10-03 13:32 
Category: FOSS
Tags: troubleshooting, disks, linux, scripts, debian
status: draft

I recently found corruptions in my CubieTruck's internal NAND. Fixing it took some stages that weren't obvious to me, so I thought I'd share them.

## 0. Detect corruption
You might see these messages in your syslog:
```text
Oct  3 13:55:35 cubie kernel: EXT4-fs error (device nandb): ext4_iget:3785: inode #459061: comm ls: bad extended attribute block 4294967295
```

And if you want to check, you can try triggering these by listing all files in your system:
```bash
sudo ls -R / >/dev/null
```

## 1. Unmount damaged filesystem
If the corrupted filesystem is `/`, we're in trouble

## 2. Repair filesystem
Both fsck and badblocks

## 3. Repair Packages
Files provided by packages are the easiest to fix (as they only require us to reinstall the package).
Fisrt, make sure you have `debsums`, which allows you to compare the installed files to the files included in the package.
Use this code to find all different files (excluding config files, whose change makes sense) and list their owning packages:
```bash
sudo debsums --changed 2> /tmp/debsums
perl -nle 'm/\(from (.+) package\)/;print $1' /tmp/debsums | sort | uniq -c
```
In my case, I saw something like:
```text
    507 owncloud
```
meaning my owncloud package was damaged. To fix it, I used `apt-get`, like this:
```bash
sudo apt-get install --reinstall owncloud
```
If you wish to automate it, you can do something like:
```bash
sudo apt-get install --reinstall $(perl -nle 'm/\(from (.+) package\)/;print $1' /tmp/debsums | sort | uniq)
```
