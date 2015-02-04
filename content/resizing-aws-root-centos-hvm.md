Title: Resizing AWS root EBS in CentOS HVM
Date: 2015-02-01 12:00
Category: FOSS
Tags: Linux, AWS, Virtualization, Mysteries Solved, Ruby, Perl, Scripts, Storage
Slug: resizing-aws-root-centos-hvm

### The Story
Today I started using HVM instances in AWS, because r3 instances (memory optimized) are only available on HVM ([the difference](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/virtualization_types.html)).
Because the CentOS image my company uses isn't available as HVM, I switched to [this](https://aws.amazon.com/marketplace/pp/B00NQAYLWO) image, which had an annoying side effect.

### The Problem
After launching an instance, I always extend the root volume, which starts at a measly 8GB. Linux runs fine on 8GB, but our devs depend on some maneuvering space.  
The EBS volume itself is extended when launching the instance. However, one must also extend the partitions/filesystems inside the volume.  
**Our previous image** provided a root EBS that contained the filesystem directly, like this:
```text
$ lsblk
NAME    MAJ:MIN RM  SIZE RO TYPE  MOUNTPOINT
...
xvde    202:64   0  100G  0 disk  /
...
```
Here we only have to extend the filesystem, which can be done using something like:
```bash
resize2fs $(mount | perl -ne 'print $1,"\n" if /^(\S+) on \/ /')
```
**On the HVM image**, however, the EBS was partitioned (using MBR) and had a single partition, which contained the filesystem, like this:
```text
$ lsblk
NAME    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
...
xvda    202:0    0  100G  0 disk
└─xvda1 202:1    0  100G  0 part /
...
```
This means that we must extend the partition before extending the filesystem, which proved to be a difficult task.  
The standard procedure is deleting the partition and recreating with the same settings, however:

1. Since we're extending a partition which contains the root filesystem, we can't unmount it.
2. When changing a partition that contains a filesystem that is mounted, the kernel refuses to re-read the filesystem, meaning you can't make sure everything works until you reboot
3. If you're rebooting with a broken partition/filesystem configuration, the VM won't boot. Since AWS offers no direct method of interfacing with the VM directly, one can't easily troubleshoot the VM.

Because of this, I spent 6 hours and 6 servers on trying to extend the partition.

### The Solution
As AWS say in [their article](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/storage_expand_partition.html), the best solution I found is using a helper VM.

1. Prepare a helper VM running Linux, with `parted` installed.
2. Stop both the instance you wish to extend and the helper.
3. Note the instance id of both instances and the volume ID of the root EBS.
    We'll assume we're talking about `i-victim`,`i-helper`,`v-victim`
4. Note `i-victim`'s root device configuration. We'll assume it's `/dev/sda1`  
    ![](|filename|/images/resizing-aws-root-centos-hvm/sol1.png)
5. Detach `v-victim` from `i-victim` and attach it to `i-helper`. The device letter doesn't matter, you should be able to recognize it on the OS. We'll assume it's `/dev/xvdf`.  
    ![](|filename|/images/resizing-aws-root-centos-hvm/detach.png)
6. Start `i-helper`, connect to it via SSH, and commence surgery
    1. Use `parted /dev/xvdf p` to view the current partition makeup, and save it in case something bad happens.

            :::text
            Model: Xen Virtual Block Device (xvd)
            Disk /dev/xvdf: 322GB
            Sector size (logical/physical): 512B/512B
            Partition Table: msdos

            Number  Start   End    Size   Type     File system  Flags
             1      1049kB  8GB    8GB    primary  ext4         boot

        Note the difference between the drive size (`322GB`) and the partition size (`8GB`)

    2. Like in the article, delete the partition and create a new one, with the same start and type. Put `100%` as the end, and run `set 1 boot on` to enable the boot flag on the new partition .  
	   Example code:

            :::text
            $ sudo parted /dev/xvdf rm 1
			$ sudo parted /dev/xvdf mkpart primary 1049kB 100%
			$ sudo parted /dev/xvdf set 1 boot on

        **Note:** The start (`1049kB`) should be based on the start of the original partition.  
        The new partition should be recognized by the kernel, and the filesystem itself can be treated.

    3. Execute `e2fsck -f /dev/xvdf1 && resize2fs /dev/xvdf1` to fsck and extend the filesystem
    4. You can mount-test the partition on the server, just to make sure everything is OK, using something like `mkdir /tmp/bla && mount /dev/xvdf1 /tmp/bla`

7. Stop `i-helper`
8. Detach `v-victim` from `i-helper`
9. Attach `v-victim` to `i-victim`, using the binding from step 4.  
    ![](|filename|/images/resizing-aws-root-centos-hvm/attach.png)
10. Start `i-victim` and pray.

Everything should work out OK
