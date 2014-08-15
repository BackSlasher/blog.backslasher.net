Title: Automatically Mounting USB drives and Surviving Reconnects
Date: 2014-06-23 13:04
Category: FOSS
Tags: Mysteries Solved, Scripts, Linux, FileSystem, Raspberry Pi, raspberrySeed, udev
Slug: automatically-mounting-usb-drives-and
OldSlug: automatically-mounting-usb-drives-and

Today I solved a problem that has been bothering me for a while - being unable to automatically "remount" my USB drive in case it disconnects and reconnects.

###The Story
My raspberrySeed (rPi + Debian + Deluge) has a USB drive connected (to keep the downloaded content in). The filesystem on that drive should be always mounted to the same directory, which is not trivial in Linux.  
Unlike Windows, which tries to assign consistent drive letters to the mounted filesystems (If your disk-on-key gets the letter "F:", after disconnecting and connecting it, it'll still be "F:" if not occupied), Linux chooses the lowest block device name (sda, sdb...) available for a new device, so no consistency is guranteed.  
If you want consistency, you're offered to mount your filesystems
according to their [UUID (or LABEL)](https://help.ubuntu.com/community/UsingUUID), which can be found by listing the following directories (after knowing the current block device you're interested in):  
~~~~text
user@computer:~$ ls -l /dev/disk/by-uuid/
total 0
lrwxrwxrwx 1 root root 10 apr 15 10:58 aSECRETa-aaaa-aaaa-aaaa-aaaaaaaaaaaa -> ../../dm-0
lrwxrwxrwx 1 root root 10 apr 15 10:58 aSECRETa-aaaa-aaaa-aaaa-aaaaaaaaaaaa -> ../../sda6
lrwxrwxrwx 1 root root 10 apr 15 10:58 aaaaSECRETaaaaaa -> ../../sda1
lrwxrwxrwx 1 root root 10 apr 15 10:58 aTHEaONE-aaaa-aaIa-aaaa-aWANTaaaaaaa -> ../../sdb2
lrwxrwxrwx 1 root root 10 apr 15 10:58 aSECRETa-aaaa-aaaa-aaaa-aaaaaaaaaaaa -> ../../sda5
lrwxrwxrwx 1 root root 10 apr 15 10:58 aaaaSECRETaaaaaa -> ../../sdb1

user@computer:~$ ls -l /dev/disk/by-label/
total 0
lrwxrwxrwx 1 root root 10 apr 15 10:58 some.Partition -> ../../sdb1
lrwxrwxrwx 1 root root 10 apr 15 10:58 partition-name -> ../../sdb2
~~~~
If you know your stuff, you can see that those are just symlinks, maintained by udev.  
After finding the right UUID, you can add this line to your `/etc/fstab` file, to make Linux mount it to `/media/dest` (an empty directory) automatically on boot:   
~~~~text
UUID=aTHEaONE-aaaa-aaIa-aaaa-aWANTaaaaaaa /media/dest ext4 defaults,auto 0 0
~~~~
Looks ideal, but if we check the command `mount`, we'll see that it's resolving the symlink and mounting the actual block device:   
~~~~text
user@computer:~$ sudo mount -a
user@computer:~$ mount
...
/dev/sdb2 on /media/dest type ext4 (rw,relatime,data=ordered)
...
~~~~

My problem was that by when my disk disconnects-reconnects (quite common in my setup, due to power surges, faulty cables etc.), it gets a new block device and the mount remains connected to the old one:

~~~~text
user@computer:~$ ls -l /dev/disk/by-uuid/aTHEaONE-aaaa-aaIa-aaaa-aWANTaaaaaaa
lrwxrwxrwx 1 root root 10 apr 15 10:58 aTHEaONE-aaaa-aaIa-aaaa-aWANTaaaaaaa -> ../../sdc2

user@computer:~$ mount | grep /media/dest
/dev/sdb2 on /media/dest type ext4 (rw,relatime,data=ordered)

user@computer:~$ ls /media/dest
ls: cannot access dest: Input/output error

user@computer:~$ sudo mount -a
user@computer:~$ mount | grep /media/dest
/dev/sdc2 on /media/dest type ext4 (rw,relatime,data=ordered)
~~~~

See the problem? Without manually telling Linux to re-evaluate the symlink, the mount remains connected to the old block device, rendering it useless.

### The Solution
The best solution I found is using [udev rules](https://wiki.debian.org/udev).  
`udev` is the Linux subsystem in charge of handling physical devices, and  among many other things, is in charge of creating the "by-uuid" and "by-label" symlinks we saw before.  
The processing occurs according to rules called "udev rules", listed in `/lib/udev/rules.d/`  
So here is my solution:  
  
#### 1. Identify filesystem UUID and destination directory
Use some trick (`gnome-disks` on another system, listing `/dev/disks/by-uuid` as seen earlier) to find your filesystem's UUID.  
Let's say it's `aaDREAMa-aaaa-aaaa-aaaa-aFILESYSaaaa`  
Also prepare a directory to mount to. It should be empty.  
Let's say it's `/media/dest`   
  
#### 2. Create fstab entry - do not use automount
Edit `/etc/fstab` to contain all configuration related to your filesystem.  
It's not mandatory (you can specify the destination mount in the udev rule), but I think it's better to keep that configuration in a standard location. You can use something like this:

~~~~bash
echo -e 'UUID=aaDREAMa-aaaa-aaaa-aaaa-aFILESYSaaaa /media/dest auto defaults,noauto 0 0' | sudo tee -a /etc/fstab
~~~~

#### 3. Create udev rules to mount / unmount whenever the device is connected / disconnected 
This is the fun part. Create a file in `/lib/udev/rules.d`. I chose `/lib/udev/rules.d/99-automount-usb.rules` to make sure it runs last (after the by-uuid symlink has been created), and put two actions in it - one will mount the device when connected, and another dismounts it
when it's disconnected:

~~~~bash
echo 'ACTION=="add", ENV{ID_FS_UUID_ENC}=="aaDREAMa-aaaa-aaaa-aaaa-aFILESYSaaaa", RUN+="/bin/mount /dev/%k"' | sudo tee '/lib/udev/rules.d/99-automount-usb.rules'echo 'ACTION=="remove", ENV{ID_FS_UUID_ENC}=="aaDREAMa-aaaa-aaaa-aaaa-aFILESYSaaaa", RUN+="/bin/umount /dev/%k"' | sudo tee -a '/lib/udev/rules.d/99-automount-usb.rules'
~~~~

#### 4. Test
Apply the settings using

~~~~bash
sudo udevadm control --reload-rules
~~~~

Now stop any processes interacting with the device (like Deluge), disconnect and reconnect it, and note the output of:

~~~~bash
mount | grep /media/dest;ls /media/dest
~~~~

If everything works, it should either return nothing when the drive is unplugged, and somthing like this when it is:

~~~~text
/dev/sdb1 on /media/dest type ext4 (rw,relatime,data=ordered)
<Files inside the mobile drive's filesystem>
~~~~
  
###Further reading:

-   <http://www.reactivated.net/writing_udev_rules.html>
-   <http://ubuntuforums.org/showthread.php?t=168221> (Commands are out
    of date, but still decent)
-   <https://wiki.archlinux.org/index.php/udev>
