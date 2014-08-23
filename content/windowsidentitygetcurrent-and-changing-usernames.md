Title: WindowsIdentity.GetCurrent and changing usernames
Date: 2010-10-25 10:02
Category: Microsoft
Tags: Programming, Active Directory, Security, PowerShell
Slug: windowsidentitygetcurrent-and-changing-usernames
OldSlug: windowsidentitygetcurent-and-changing

We've recently encountered an interesting problem:  
One of our applications had a service using .net remoting with
impersonation turned on.  
Inside this service we had some code using
[WindowsIdentity.GetCurrent()](http://msdn.microsoft.com/en-us/library/sfs49sw0%28v=vs.110%29.aspx)
to find the user in AD and check some of its properties.  
Our issue was thus:  

1.  User `X` logs in and uses the service. All is well.
2.  User `X` has its `LogonName` and `SAMAccountName` changed to `Y`
3.  User `Y` logs on and uses the service.
4.  When the service is calling `WindowsIdentity.GetCurrent()`, the
    username returned is `X`, even though the name has changed.
5.  After restarting the server (not only the service, the entire OS),
    All is well (until the next time a user chnages the LogonName).

We eventually discovered that WindowsIdentity uses
[LsaLookupSids](http://msdn.microsoft.com/en-us/library/windows/desktop/ms721799%28v=vs.85%29.aspx),
which caches the SID/username mappings instead of asking the DC again.
To prevent that, there is a registry value that can be changed to stop
caching, according to
[kb946358](http://support.microsoft.com/kb/946358):  
~~~~registry
System\CurrentControlSet\Control\Lsa:LsaLookupCacheMaxSize=0
~~~~
I made it into a little script, that we used as a mid-term solution to
clear the server's cache without disrupting service:
~~~~powershell
param([string[]]$servers)
$servers | %{
 $base = [microsoft.win32.registrykey]::OpenRemoteBaseKey('LocalMachine',$_)
 $sub = $base.OpenSubKey('System\CurrentControlSet\Control\Lsa',$true)
 $sub.SetValue('LsaLookupCacheMaxSize',0)
 Start-Sleep -Seconds 5
 $sub.DeleteValue('LsaLookupCacheMaxSize')
 $sub.Close()
 $base.Close()
}
~~~~

Enjoy!
