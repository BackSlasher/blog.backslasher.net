Title: Enabling Remote Desktop Remotely
Date: 2013-11-01 20:52
Category: Microsoft
Tags: Security, Scripts, Windows, PowerShell, Terminal Server, Registry, One-Liner
Slug: enabling-remote-desktop-remotely
OldSlug: enabling-remote-desktop-remotely

According to [this Technet article](http://technet.microsoft.com/en-us/library/cc782195%28v=ws.10%29.aspx), to enable remote desktop remotely by using the registry you need to set the key `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Terminal Server:fDenyTSConnections=0`
and then reboot the server.  
Rebooting is actually unnecessary - you can just restart the service `TermService`  
If you'd like to script it all:  
~~~~powershell
param([string]$computerName='.')
# Set registry
$base=[Microsoft.Win32.RegistryKey]::OpenRemoteBaseKey('LocalMachine',$computerName)
$key=$base.OpenSubKey('SYSTEM\CurrentControlSet\Control\Terminal Server',1)
$key.SetValue('fDenyTSConnections',0)
$key.close()
$base.close()
# Restart service
Get-Service TermService -comp $computerName | Restart-Service -force
~~~~

