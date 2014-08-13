Title:  Linux and SSDs - Should You TRIM?
Date: 2014-07-16 14:54
Tags: Debian, FileSystem, Linux, Mysteries Solved, Performance, Ramblings, Ubuntu
Category: Linux

**Note**: Although my experience is with Debian, I think this post helps anyone using some modern Linux distribution.  
# What is TRIM?
As a Windows sysadmin, I didn't really consider the cons of running on top of [Solid-State Drives](http://en.wikipedia.org/wiki/Solid_state_drives), or SSDs. These drives are based on [flash memory](http://en.wikipedia.org/wiki/Flash_memory) (similar to a Disk-On-Key), rather than metallic plates.  
A big difference between magnetic hard drives and SSDs is block reuse.
<!-- PELICAN_END_SUMMARY -->

## The Problem
Every storage device is seen (with the driver's help) as a collection of sectors (or "blocks") by the operating system, which can read and write a fixed amount of data (512 bytes / 4KB) to every sector. File systems are different ways of using said sectors to store files, directories, metadata etc.  
In magnetic hard drives, used and unused blocks take the same time to write to. Modern file systems exploit that fact in different ways. For example:

+ Instead of deleting a file, they just "forget" about it, leaving the blocks in their used state ([Example](http://whereismydata.wordpress.com/2009/05/02/forensics-what-happens-when-files-are-deleted/))
+ [Copy-On-Write](http://en.wikipedia.org/wiki/Copy_on_write) techniques allow file systems to "effortlessly" remember the previous content of files (for versioning, corruption protection etc.), by writing modified content on free blocks

In SSDs, however, this is not the situation. I read a metaphor somewhere thats it's like building a house where a house is already present - you have to demolish the existing house, and only after that you can build your own.
For that reason, used blocks take more time writing to, because the SSD has to erase the block first. The result - after many writes, the performance of SSDs degrades dramatically, even lower than traditional HDs.  
**Note**: There is an additional issue called [Write amplification](http://en.wikipedia.org/wiki/Write_amplification), where you can only delete clusters of blocks, requiring the SSD to rearrange partially used blocks. In modern SSD drives, this is solved by the drive's own firmware/configuration as long as you keep the file system trimmed.
## The Solution
The solution to that problem is a new OS-Device command called "[TRIM](http://en.wikipedia.org/wiki/TRIM)", telling the drive "I don't need this block anymore. Erase it when you have the time". This is a new idea, because traditional HDs don't need that information.
# Trimming and You
## Naming
You'll often see TRIM being called "discard". This is because the concept  has been generalised, and can apply to [thin-provisioned](http://en.wikipedia.org/wiki/Thin_provisioning) LUNs as well.
## Timing
The most obvious way to use TRIM is like Windows does - whenever blocks are no longer needed (e.g. a file was deleted), let the SSD know.  
In Linux, this option has **negative performance impact**, because the Linux kernel [currently handles one block at a time](http://en.opensuse.org/SDB:SSD_discard_%28trim%29_support#Kernel_support). For instance, if I delete a file containing 500 blocks, instead of one IO operation (removing the pointer to the file from the directory listing), the kernel will issue 501 IO operations (remove the pointer, TRIM block 1, TRIM block 2...).  
In the general use-case, this [ruins](http://people.redhat.com/lczerner/discard/ext4_discard.html) the performance advantage of SSDs.  
I think this is only a temporary setback, because Windows (supposedly) handles TRIM the correct way - using a range.

If we take an example from Ubuntu, version 14.04 supports trimming but [uses a weekly scheduled execution](https://launchpad.net/ubuntu/+source/util-linux/2.20.1-5.1ubuntu14) of [fstrim](http://man7.org/linux/man-pages/man8/fstrim.8.html). According to a quick Google search, this seems to be the preferred method, because you can execute it in a maintenance window, when I/O isn't peaking.

##Support
Support for TRIM in Linux is partial.  
Mainstream **file systems** (ext4, btrfs) support TRIM, either immediately (using "discard" mount option) or on demand ("fstrim").  
Some **containers** (LVM, md) support passing TRIM commands from the contained file system and some don't. Some containers even issue "discard" requests by themselves if configured to, like LVM (with `issue_discards` enabled) when removing volumes. These individual discards are only relevant when making configuration changes (deleting a RAID array) frequently, or when using snapshots.

## Testing
There are many posts on testing TRIM, like [this one](http://andyduffell.com/techblog/?p=852), but they only test whether trimming already works, and not if you need it. IMHO, the only proper method to know is benchmarking, manually trimming (using fstrim) and benchmarking again.

**TL;DR:** Yes, you should trim, and by cronning `fstrim`. It's worth it.
