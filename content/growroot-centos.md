Title: Installing Growroot on CentOS
Date: 2015-07-02 09:00
Category: FOSS
Tags: Linux, Virtualization, AWS, Disk, CentOS
Slug: growroot-centos

## The story
I currently work with CentOS on Amazon EC2. As I [previously written](|filename|/resizing-aws-root-centos-hvm.md), The HVM version of the AMI is created with a partitioned disk, instead of having the filesystem written directly on the block device.  
Problem is, when creating a root device bigger than the default (8G), you have to resize both the partition and the filesystem. While the filesystem can be resized online, the partition can't.  
The issue looks something like this:
```bash
lsblk
```
Without a partition:
```text
NAME    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
xvde    202:64   0   30G  0 disk /
```

With a partition:
```text
NAME    MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT
xvda    202:0    0  30G  0 disk
└─xvda1 202:1    0   8G  0 part /
```

The partition can actually be resized (as in deleted and recreated), but the updated partition table won't be available because the partition is in use (and you can't unmount the root partition).

## The ugly solution
Before learning of a better way, I wrote this script. It checks if the root device is a partition, and if so whether it's filling up the parent disk.
If not, it deletes the root partition and recreates it to fill up the entire disk. Although it has been tested, I don't think it's a good idea to use it.
```bash
echo BEFORE PARTITION RESIZE
ROOT_DEVICE=$(df / | tail -n1 | cut -f1 -d ' ')
ROOT_TYPE=$(lsblk $ROOT_DEVICE -no TYPE)
if [ "$ROOT_TYPE" = "part" ] ; then
    # find the parent disk
    ROOT_MAJMIN=$(lsblk $ROOT_DEVICE -no MAJ:MIN | tr -d ' ')
    ROOT_SIZE=$(cat /sys/dev/block/${ROOT_MAJMIN}/size)
    PARENT_SIZE=$(cat /sys/dev/block/${ROOT_MAJMIN}/../size)
    ROOT_START=$(cat /sys/dev/block/${ROOT_MAJMIN}/start)
    PARENT_NAME=$(cat /sys/dev/block/${ROOT_MAJMIN}/../uevent | perl -ne 'print $1,$/ if /^DEVNAME=(.+)$/')
    # Check if the same size
    if (( $PARENT_SIZE - $ROOT_START > $ROOT_SIZE )); then
        echo "Recreating partition ${ROOT_DEVICE} on /dev/${PARENT_NAME}, starting in ${ROOT_START}"
        echo -e "u\np\nd\nn\np\n1\n${ROOT_START}\n\na\n1\np\nw\n" | fdisk /dev/${PARENT_NAME}
        reboot
        sleep 60
    else
        echo "Partition ${ROOT_DEVICE} is fine"
    fi
else
    echo "${ROOT_DEVICE} is not a partition - its ${ROOT_TYPE}"
fi
echo AFTER PARTITION RESIZE
```
And I have a similar one for the filesystem:
```bash
ROOT_DEVICE=$(df / | tail -n1 | cut -f1 -d ' ')
ROOT_DEVICE_SIZE_B=$(blockdev --getsize64 $ROOT_DEVICE)
ROOT_FS_BLOCK_COUNT=$(tune2fs -l $ROOT_DEVICE | perl -ne 'print $1,$/ if /Block count:\s+(\d+)$/')
ROOT_FS_BLOCK_SIZE=$(tune2fs -l $ROOT_DEVICE | perl -ne 'print $1,$/ if /Block size:\s+(\d+)$/')
# If the root FS is smaller in at least one block size than the root device size
if (( ( $ROOT_FS_BLOCK_COUNT +1 ) * $ROOT_FS_BLOCK_SIZE < $ROOT_DEVICE_SIZE_B )); then
    echo resizing filesystem
    resize2fs $ROOT_DEVICE
fi
```

## The proper solution
Just before deploying my script, I stumbled upon [dracut-modules-growroot](http://rpm.pbone.net/index.php3/stat/4/idpl/25071492/dir/redhat_el_6/com/dracut-modules-growroot-0.20-2.el6.noarch.rpm.html), which (like most things cloud) was imported from [Ubuntu](https://launchpad.net/ubuntu/utopic/+package/cloud-initramfs-growroot).  
It's available via EPEL, and when installed to the initramfs, it enlarges the root partition (if needed) before actually mounting it. This saves you the reboot, because when in the initramfs stage, the root partition isn't really mounted, so it can be modified easily.  
The steps I use in my image are:

1. Install all available updates

        :::bash
		yum update -y

2. Install the EPEL helper package

        :::bash
		yum install -y epel-release

3. Install `perl`, `cloud-init` and `dracut-modules-growroot`

        :::bash
		yum install -y perl cloud-init dracut-modules-growroot

    This has to be done after installing `epel-release`, because otherwise YUM won't look in the EPEL repository, where dracut-modules-growroot is available.  
	I also like using perl (see next step), so I install it here.  
	Cloud Init is useful in running startup scripts, but it also has an [enabled-by-default module](https://cloudinit.readthedocs.org/en/latest/topics/modules.html?highlight=growpart#module-cloudinit.config.cc_growpart) (great documentation, right?) that resizes the root filesystem (`resize2fs`-like) if its block device is bigger.  
	You can avoid installing it, but then you'll have to resize the filesystem on your own (see my second ugly script).

4. Rebuild **all** initramfs images.

        :::bash
		rpm -qa kernel | perl -pe 's/^kernel-//'  | xargs -I {} dracut -f /boot/initramfs-{}.img {}

    This is very important. Without rebuilding the initramfs images, the module won't be available and nothing will get done.  
	Also note that I'm explicitly rebuilding an image for every kernel package installed - this is because we might be running kernel A, and just installed newer kernel B with `yum update -y`, so if I only used `dracut -f` only kernel A's image will be rebuilt, and next time we'll boot from kernel B's image, that doesn't have the module.

The full script:
```bash
yum update -y
yum install -y epel-release
yum install -y perl cloud-init dracut-modules-growroot
rpm -qa kernel | perl -pe 's/^kernel-//'  | xargs -I {} dracut -f /boot/initramfs-{}.img {}

```

## Troubleshooting

You can easily compare the sizes of your root block device, it's parent and the root filesystem itself by running:
```bash
echo lsblk;lsblk
echo df; df -h /
```
A successful result should look like this:
```
lsblk
NAME    MAJ:MIN RM SIZE RO TYPE MOUNTPOINT
xvda    202:0    0  30G  0 disk
└─xvda1 202:1    0  30G  0 part /
df
Filesystem      Size  Used Avail Use% Mounted on
/dev/xvda1       30G  963M   27G   4% /
```
If the script completes successfully but the partition isn't magically resized, you can use this to search for growroot's files in the initrd image that was used to boot:
```bash
sudo lsinitrd | grep grow
```
For me, it looks like this:
```text
-rwxr-xr-x   1 root     root          133 Nov 22  2013 cmdline/99growroot-dummy.sh
-rwxr-xr-x   1 root     root         2167 Nov 22  2013 pre-mount/99growroot.sh
-rwxr-xr-x   1 root     root        16069 Nov 22  2013 usr/bin/growpart
```

If the files are there but still no magic, try fishing in `/var/log/{messages,secure}` or `dmesg`. I always had everything working if the files were actually there.
