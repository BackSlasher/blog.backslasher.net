---
title: Mass Setting Permissions on Remote Shares
categories:
- Microsoft
tags:
  - Security
  - Scripts
  - NetApp
  - FileSystem
  - PowerShell
---

I was recently asked by one of my teammates to add several NTFS
permissions to the root folders of a bunch of shares. Seems easy, but I
had two problems:  

1.  The shares were stored on a NetApp Filer, so I couldn't use any WMI
    trickery (or the new SMB module for Windows 8)
2.  There are about 2,000 shares, so the good old manual method is out
    of the question

Of course, PowerShell has a solution.  
The script was composed of two parts:  

1.  Discovering all shares on the Filer
2.  Setting the permissions on each share

<span style="font-size: large;">Discovery</span>  
For the share discovery, I looked for an elegant way but could not find
one. Eventually I noticed that "net view" worked, so I figured I can
parse its output.  

~~~text
Shared resources at \\SERVER



Share name            Type   Used as  Comment

-------------------------------------------------------------------------------
Files                 Disk
Lexmark C772 PS (MS)  Print           Lexmark C772 PS (MS)
Lexmark E360dn (MS)   Print           Lexmark E360dn (MS)
NETLOGON              Disk            Logon server share
SYSVOL                Disk            Logon server share
The command completed successfully.
~~~

As you can see, some cleanup is required.  
I started with skipping the first seven rows to remove the fancy
header.  
Then I filtered only rows that contain `disk` with spaces before and at
least 5 after (even though there are no Print shares on the Filer
anyway).  
Finally, I used a regex trick (`-match`ing to `out-null` and extracting
members of `$matches`) to extract the Share name from each line.  
This resulted in:

~~~~powershell
$server = 'SERVERNAME'
$rawShares = net view \\$server /all | select -s 7 | ?{$_ -match 'disk\s{5,}'} | %{$_ -match '^(.+?)\s+Disk\s{5,}'|out-null;$matches[1]}
~~~~

### Permission Settings
This part is pretty unadventurous, although it's the one most prominent
to fail (due to access denied errors etc.).  
I firstly created an array of ACEs (Access Control Entries) I wanted to
add:

~~~powershell
$aces = @(
 (new-object System.Security.AccessControl.FileSystemAccessRule 'DOMAIN\Filer Admins','FullControl','ContainerInherit,ObjectInherit','None','Allow'),
 (new-object System.Security.AccessControl.FileSystemAccessRule 'DOMAIN\Filer Readers','Read','ContainerInherit,ObjectInherit','None','Allow')
)
~~~

After this, it's all about enumerating the shares and adding the ACEs:

~~~~powershell
$rawShares | %{
 $share = "\\$server\$_"
 $acl = get-acl $share
 $aces | %{$acl.AddAccessRule($_)}
 set-acl $share $_
}
~~~~

And that's it.
### Decorations
Because I wanted to add error handling and basic reporting, I added to
the `foreach` block:

-   `try`/`catch` blocks
-   Generation of a small report object

Thusly:

~~~~powershell
$rawShares | %{
 $share = "\\$server\$_"
 $err = $null
 try{
 $acl = get-acl $share
 $aces | %{$acl.AddAccessRule($_)}
 set-acl $share $_
 }catch{
 $err=$_
 }
 5 | select `
 @{name='Path';expression={$share}},
 @{name='Error';expression={$err.Exception.Message}}
} | out-gridview
~~~~

And that's it.  
The whole script looks like this:

~~~~powershell
param(
$server = 'SERVERNAME'
)
 
# Get all shares
$rawShares = net view \\$server /all | select -s 7 | ?{$_ -match 'disk\s{5,}'} | %{$_ -match '^(.+?)\s+Disk\s{5,}'|out-null;$matches[1]}
 
# Prepare new ACEs
$aces = @(
 (new-object System.Security.AccessControl.FileSystemAccessRule 'DOMAIN\Filer Admins','FullControl','ContainerInherit,ObjectInherit','None','Allow'),
 (new-object System.Security.AccessControl.FileSystemAccessRule 'DOMAIN\Filer Readers','Read','ContainerInherit,ObjectInherit','None','Allow')
)
 
# Add ACEs to share ACLs
$rawShares | %{
 $share = "\\$server\$_"
 $err = $null
 try{
 $acl = get-acl $share
 $aces | %{$acl.AddAccessRule($_)}
 set-acl $share $_
 }catch{
 $err=$_
 }
 5 | select `
 @{name='Path';expression={$share}},
 @{name='Path';expression={$err.Exception.Message}}
} | out-gridview
~~~~

Enjoy!
