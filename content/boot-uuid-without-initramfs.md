Title: Booting with UUID without initramfs
Date: 2015-01-30 12:00
Category: FOSS
Tags: Linux, Boot, Mysteries Solved, ARM
Slug: boot-uuid-without-initramfs

## The Story
I recently wiped my CubieTruck (a single board computer, like RaspberryPi), and tried installing the root filesystem on a hard drive instead of the built-in NAND, due to the NAND's tendency to get corrupted.  
I used Igor Pečovnik's [Image](http://www.igorpecovnik.com/2013/12/24/cubietruck-debian-wheezy-sd-card-image/), which is really convenient, as I like it better than the images offered at the official site, and it's obviously **much** easier than building by myself.  
However, I had one serious issue.  
## The problem
Igor's image is designed to be installed on and booted from an SD card, and includes a script to install the OS to a hard drive, which does 3 things:

1. Formats and prepares the hard drive
2. Copies the root FS to the hard drive
3. Modifies the SD card's `/boot` directory to load the root FS from the hard drive

Igor, assuming there's only one hard drive, always targets `/dev/sda1` as the hard drive. This was an issue for me, as I have two hard drives - an internal one that I installed the OS on, and an external one that I connect every now and then.

The uEnv file (the entry point for CubieTruck's boot sequence) contains something like `rootfs=/dev/sda1`, and when both my drives were connected, my external hard drive was discovered first, meaning `/dev/sda1` was pointing to it, causing the kernel to panic as it couldn't find a proper root fs.  
Being used to a standard-built Linux kernel, I modified the uEnv file to look like `root=UUID=<PARTITION GUID>`, which works around the naming issue.  
It didn't work, causing the boot sequence to hang with:
```text
waiting for root device UUID=<Whatever I wrote in uEnv>
```

## The Solution
I tried some tricks, including referring to `/dev/disk/by-uuid/`, but no luck. Eventually I found [this](http://unix.stackexchange.com/a/151483) lifesaver, that made me realize that `initramfs` isn't included in Igor's build, and without it there's no `UUID` or `LABEL` mapping, only `PARTUUID` mapping. Using the value taken from `blkid` (like `rootfs=PARTUUID=<SOME GUID>`), the boot went OK.  
**However**, when editing the `/etc/fstab` file (which also contained `/dev/sda1` as the root mountpoint), I noticed that `mount PARTUUID=<Something>` didn't work. Thanks to [this post](http://forums.linuxmint.com/viewtopic.php?f=90&t=162677), I learnt that support for `PARTUUID` was added to `mount`, but the Ubuntu version is too old to contain it. This might change, but I worked around this by using good <del>old</del> new `UUID` in `/etc/fstab`.

Now all is well.

## TL;DR
Use `PARTUUID` in `uEnv`, found via `blkid`.  
With `/etc/fstab`, test with `mount` before using. If it fails, work around with `UUID`.

