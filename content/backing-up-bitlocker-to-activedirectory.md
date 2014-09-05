Title: Backing up BitLocker to ActiveDirectory - My Additions
Date: 2013-11-25 20:14
Category: Microsoft
Tags: Security, BitLocker, Scripts, Windows, FileSystem, PowerShell, Ramblings, Active Directory
Slug: backing-up-bitlocker-to-activedirectory
OldSlug: backing-up-bitlocker-to-activedirectory

### The Story
If you thought about deploying BitLocker in your enterprise, you probably came across the recovery issue - if you lose the encrypting smart card, corrupt the key file, forget the password or the TPM breaks down - how can you access the data?  
For small organizations, manual recovery can be enough - when bitlocker is enabled through the UI (or via cli with `RecoveryPasswordProtector`), bitlocker keeps one password numeric, like `123456-123456-123456-123456-123456-123456-123456-123456`, and urges you to save this password externally, so you can use it in
emergencies.  

For large organizations, documenting these keys (and making sure they're kept safe) is difficult.  
Because such organizations are probably good with keeping their primary store of confidential data (the Active Directory) safe, it makes sense to keep the BitLocker recovery passwords there. It's also available out-of-the-box.  
  
There is a [TechNet article](http://technet.microsoft.com/en-us/library/cc766015%28v=ws.10%29.aspx) about this, but I think my steps are better:  
  
### The Solution
#### 1. Extend the AD schema
Only needed if you don't have 2008+ DCs, because their schema includes the required objects  
  
#### 2. Set AD permissions
Recovery passwords are saved as objects inside the computer objects, so you have to give the computers permissions to create such objects.  
I think that in 2008+ domains they're already present, but it you might want to add them anyway, to make sure  

#### 3. Set GP to replicate to AD
The GP location is `Computer Configuration>Administrative Templates>Windows Components>BitLocker Drive Encryption`  
**For NT6** (Server 2008 / Vista), the setting is global and called "Store BitLocker recovery information in Active Directory Domain Services":

![](|filename|/images/backing-up-bitlocker-to-activedirectory/BitLockerGP1.png)

**For newer versions**, there are different settings for OS drives ("C:"), fixed data drives (additional HDs) and removable data drives (e.g. Disk-On-Keys), each under the relevant folder and called "Choose how BitLocker-protected XXX drives can be recovered":

![](|filename|/images/backing-up-bitlocker-to-activedirectory/BitLockerGP2.png)

Both GPs have settings in common:  
**Passwords or Packages?** Each drive is actually encrypted with a long key which in turn is encrypted by the password. This negates the security vulnerabilities of encrypting large amounts of data with human-memorable passwords. As long as the drive is healthy, the password suffices to read the data because the key can be decrypted. But if the drive is damaged and the part containing the key can't be read, the password is useless.  
Storing the entire key package in AD allows reading data even from a key-damaged drive.  
On the other hand, storing only the password is safer (since the password can be easily changed without re-encrypting the disk, if the AD is compromised).  
**No Encryption Before Backup Completion:** AD backup is among the first things that happen during a drive encryption (right after password and key package generation). Both GPs have a checkbox to stop the encryption process if the backup fails, saving the sysadmin (you!) from one day finding an encrypted drive with no valid AD-backed key.  
  
#### 4. Trigger Backup
Backups to AD only happen when BitLocker passwords are modified (so if some drive was encrypted before you completed the previous steps, the container won't be backed up). To trigger backups manually, use `manage-bde`, as explained [here](http://blogs.technet.com/b/askcore/archive/2010/04/06/how-to-backup-recovery-information-in-ad-after-bitlocker-is-turned-on-in-windows-7.aspx).  
If you're on Windows 8 and want a simple script to backup whatever key you have, here:  

~~~~ powershell
$drive = Get-BitLockerVolume | ?{$_.KeyProtector | ?{$_.KeyProtectorType -eq 'RecoveryPassword'}} | select -f 1
$key = $drive | select -exp KeyProtector | ?{$_.KeyProtectorType -eq 'RecoveryPassword'} | select -f 1
Backup-BitLockerKeyProtector $drive.MountPoint $key.KeyProtectorId
Write-Host "Backing up drive $drive, key $($key.KeyProtectorId), password $($key.RecoveryPassword)"
~~~~

  
#### 5. Test Search:
Use the command "Find BitLocker recovery password" under `dsa.msc`:

![](|filename|/images/backing-up-bitlocker-to-activedirectory/BitLockerAD1.gif)

Then enter the first "box" from the recovery guid, and make sure the
password is found:

![](|filename|/images/backing-up-bitlocker-to-activedirectory/BitLockerAD2.png)

Have fun!
