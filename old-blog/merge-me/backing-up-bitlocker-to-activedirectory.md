Title: Backing up BitLocker to ActiveDirectory - My Additions
Date: 2013-11-25 20:14
Tags: Security, BitLocker, Scripts, Windows, FileSystem, PowerShell, Ramblings, Active Directory
Slug: backing-up-bitlocker-to-activedirectory
OldSlug: backing-up-bitlocker-to-activedirectory

<span style="font-size: x-large;">The Story</span>  
If you thought about deploying BitLocker in your enterprise, you
probably came across the recovery issue - if you lose the encrypting
smart card, corrupt the key file, forget the password or the TPM breaks
down - how can you access the data?  
For small organizations, manual recovery can be enough - when bitlocker
is enabled through the UI (or via cli with RecoveryPasswordProtector),
bitlocker keeps one password numeric, like:   
123456-123456-123456-123456-123456-123456-123456-123456  
And urges you to save this password externally, so you can use it in
emergencies.  
  
For large organizations, documenting these keys (and making sure they're
kept safe) is difficult. Because such organizations are probably good
with keeping their primary store of confidential data (the Active
Directory) safe, it makes sense to keep the BitLocker recovery passwords
there. It's also available out-of-the-box.  
  
There is a [TechNet
article](http://technet.microsoft.com/en-us/library/cc766015%28v=ws.10%29.aspx)
about this, but I think my steps are better:  
  
<span style="font-size: x-large;">The List</span>  
<span style="font-size: large;">1. Extend the AD schema</span>  
Only needed if you don't have 2008+ DCs, because their schema includes
the required objects  
  
<span style="font-size: large;">2. Set AD permissions</span>  
Recovery passwords are saved as objects inside the computer objects, so
you have to give the computers permissions to create such objects. I
think that in 2008+ domains they're already present, but it won't hurt
to add them again  
<span style="font-size: large;">  
</span><span style="font-size: large;">3. Set GP to replicate to
AD</span>  
The GP location is "Computer Configuration\>Administrative
Templates\>Windows Components\>BitLocker Drive Encryption"  
**For NT6** (Server 2008 / Vista), the setting is global and called
"Store BitLocker recovery information in Active Directory Domain
Services".  

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-7zNbx8WKwY0/UpLyY6-PH5I/AAAAAAAAEJw/IcqJGIoiZBU/s1600/BitLockerGP1.png)](http://1.bp.blogspot.com/-7zNbx8WKwY0/UpLyY6-PH5I/AAAAAAAAEJw/IcqJGIoiZBU/s1600/BitLockerGP1.png)

</div>

**For newer versions**, there are different settings for OS drives
("C:"), fixed data drives (additional HDs) and removable data drives
(e.g. Disk-On-Keys), each under the relevant folder and called "Choose
how BitLocker-protected XXX drives can be recovered"  

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-VQYEtX-nWSY/UpLyebjnIsI/AAAAAAAAEJ4/AzHUbgwmWOs/s1600/BitLockerGP2.png)](http://3.bp.blogspot.com/-VQYEtX-nWSY/UpLyebjnIsI/AAAAAAAAEJ4/AzHUbgwmWOs/s1600/BitLockerGP2.png)

</div>

  
Both GPs have settings in common:  
**Passwords or Packages?** Each drive is actually encrypted with a long
key which in turn is encrypted by the password. This negates the
security vulnerabilities of encrypting large amounts of data with
human-memorable passwords. As long as the drive is healthy, the password
suffices to read the data because the key can be decrypted. But if the
drive is damaged and the part containing the key can't be read, the
password is useless.  
Storing the entire key package in AD allows reading data even from a
key-damaged drive.  
On the other hand, storing only the password is safer (since the
password can be easily changed if the AD is compromised).  
**No Encryption Before Backup Completion:** AD backup is among the first
things that happen during a drive encryption (right after password and
key package generation). Both GPs have a checkbox to stop the encryption
process if the backup fails, saving the sysadmin (you!) from one day
finding an encrypted drive with no valid AD-backed key.  
  
<span style="font-size: large;">4. Trigger Backup</span>  
Backups to AD only happen when BitLocker passwords are modified (so if
some drive was encrypted before you completed the previous steps, the
container won't be backed up). To trigger backups manually, use
manage-bde, as explained
[here](http://blogs.technet.com/b/askcore/archive/2010/04/06/how-to-backup-recovery-information-in-ad-after-bitlocker-is-turned-on-in-windows-7.aspx).  
If you're on Windows 8 and want a simple script to backup whatever key
you have, here:  

~~~~ {.brush:ps}
$drive = Get-BitLockerVolume | ?{$_.KeyProtector | ?{$_.KeyProtectorType -eq 'RecoveryPassword'}} | select -f 1$key = $drive | select -exp KeyProtector | ?{$_.KeyProtectorType -eq 'RecoveryPassword'} | select -f 1Backup-BitLockerKeyProtector $drive.MountPoint $key.KeyProtectorIdWrite-Host "Backing up drive $drive, key $($key.KeyProtectorId), password $($key.RecoveryPassword)"
~~~~

  
<span style="font-size: large;">5.Test search</span>  
Use the command "Find BitLocker recovery password" under dsa.msc:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-GsBq73qg5fo/UpNYalYS7zI/AAAAAAAAEKI/vvwsfF-Tesk/s1600/BitLockerAD1.gif)](http://3.bp.blogspot.com/-GsBq73qg5fo/UpNYalYS7zI/AAAAAAAAEKI/vvwsfF-Tesk/s1600/BitLockerAD1.gif)

</div>

Then enter the first "box" from the recovery guid, and make sure the
password is found:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-3gtF9KuFiZQ/UpNcVvC9NuI/AAAAAAAAEKU/b0AgMn5dv9s/s1600/BitLockerAD2.png)](http://3.bp.blogspot.com/-3gtF9KuFiZQ/UpNcVvC9NuI/AAAAAAAAEKU/b0AgMn5dv9s/s1600/BitLockerAD2.png)

</div>

  
Have fun!

</p>

