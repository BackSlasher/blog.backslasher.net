Title: Event Log Permissions, With Scripts!
Date: 2011-01-13 11:48
Category: Microsoft
Tags: Security, Scripts, PowerShell, Registry, Event Log
Slug: event-log-permissions-with-scripts
OldSlug: event-log-permissions-with-scripts

I'm going to keep it short, because there's a lot of technical background.  
So, I'm assuming you know about:  

-   [Assigning permissions to the registry](http://technet.microsoft.com/en-us/library/cc728310%28WS.10%29.aspx)
-   [SDDLs](http://msdn.microsoft.com/en-us/library/aa379567%28v=vs.85%29.aspx)
-   Event Log concepts (sources, logs)

  
So, to business:  
### Intro
Event viewer data is stored in `.evt`/`.evtx` files in `%SystemRoot%\System32\Winevt\Logs\`, but as with any half-decent DB, no one but `SYSTEM` is touching the files themselves.  
The permissions are basically divided into two interesting parts - event-related permissions (reading / writing / clearing event logs) and source-related permissions (creating / deleting sources).  
#### Other permissions
Of course there is also creating / deleting logs themselves, but it
happens so rarely that I just do it with my admin account.
### Event-Related
Event-related permissions are per log (`application`/`system` etc.) and are stored in an SDDL in `HKLM\SYSTEM\CurrentControlSet\services\eventlog\LOGNAME:CustomSD`  
To grant or deny principles some privileges, edit the SDDL, using the
following bits:

- 0x01: Read
- 0x02: Write
- 0x04: Clear

**Note:** Restart is required to apply those permissions

#### Scripting Time
I use PowerShell to read the registry value, parse the SDDL into an ACL object, edit it, and export the SDDL-equivalent back into the registry.  
This stub of a script will grant some principle permissions to read from and write to a certain log:  

~~~~powershell
param(
[string]$Principle = 'Builtin\Remote Desktop Users',
[string]$LogName = 'Application'
)
 
# Get SDDL:
$orgSDDL = gp ('HKLM:\SYSTEM\CurrentControlSet\Services\Eventlog\'+$LogName) CustomSD | select -exp CustomSD;
 
write-host 'Before:'
$orgSDDL;
 
# Create ACL
$acl = new-object System.Security.AccessControl.RegistrySecurity;
$acl.SetSecurityDescriptorSddlForm($orgSDDL);
 
# Create ACE
$ace = New-Object System.Security.AccessControl.RegistryAccessRule $Principle,3,'allow';
 
# Combine ACL
$acl.AddAccessRule($ace);
$newSDDL = $acl.SDDL;
 
write-host 'After:'
$newSDDL;
 
# Store SDDL:
sp ('HKLM:\SYSTEM\CurrentControlSet\Services\Eventlog\'+$LogName) CustomSD $newSDDL;
~~~~

### Source-Related
Sources are actually manipulated using the registry (not through some API), and therefore require actual permissions on the registry key of the log itself. For instance, to create a new event source in the `Application` log, I would need the privilege to create a key under
`HKLM\SYSTEM\CurrentControlSet\services\eventlog\Application`.  
**Note:** Consider creating all of the event sources in one concentrated blow as
an admin, to avoid messing with the registry's permissions.  
No restart is required to apply these permissions.
#### Scripting Time
Granting / denying privileges on the registry is fairly easy with PowerShell. Here's a bit that adds read/write permissions for sources on a specific log to a specific principle:
~~~~powershell
# Set parameters:
param(
[string]$Principle = 'Builtin\Remote Desktop Users',
[string]$LogName = 'Application'
)
 
# Compose Key:
$LogPath = 'HKLM:\SYSTEM\CurrentControlSet\services\eventlog\'+$LogName;
if(Test-Path $LogPath)
{
    $acl = Get-Acl $LogPath
    $ace = New-Object System.Security.AccessControl.RegistryAccessRule $Principle,'WriteKey, ReadKey','allow'
    $acl.AddAccessRule($ace)
    #Set-Acl $LogPath $acl
}else{Write-Error "Cannot acesss log $LogName"}
~~~~

### Further Reading
-   [System.Security.AccessControl
    namespace](http://msdn.microsoft.com/en-us/library/system.security.accesscontrol.aspx)
-   [Event
    Sources](http://msdn.microsoft.com/en-us/library/aa363661%28VS.85%29.aspx)

Enjoy messing with the event log!
