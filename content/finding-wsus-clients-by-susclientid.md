Title: Finding WSUS Clients by SusClientId
Date: 2013-01-02 11:41
Category: Microsoft
Tags: Mysteries Solved, Scripts, PowerShell, WSUS, Registry
Slug: finding-wsus-clients-by-susclientid
OldSlug: finding-wsus-clients-by-susclientid

Today someone showed me a strange problem - he had servers that recently
installed new updates from his WSUS server, but he couldn't find them in
the WSUS console by their name.  
Obviously the servers have been renamed and didn't have time to report
to the WSUS server, but he wanted to find the client entry in WSUS
nevertheless.  
I wrote him a small script that finds the client's `SusClientId` (which is
a self-generated guid that is used to identify the client in the WSUS
server), searches for that entry in the WSUS server and retrives the
name (so you can go back to messing with the WSUS console).  
One interesting thing to note about this script - all of the WSUS server
connection data is compacted into a uri. I find it much easier than to
specify a server name, port number and whether to use https. Also, it's
built around Windows Server 2012's module, so it won't work "as is" on
Windows Server 2008R2.  
  

~~~~powershell
param(
    [uri]$wsusUri = 'https://WSUS-Server:443',
    $ComputerName = 'OtherServer'
)
$wsus = Get-WsusServer $wsusUri.Host -PortNumber $wsusUri.Port -UseSsl:($wsusUri.Scheme -eq 'https')
$baseKey = [Microsoft.Win32.RegistryKey]::OpenRemoteBaseKey('LocalMachine',$ComputerName);
$key = $baseKey.OpenSubKey('SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate');
$id = $key.GetValue('SusClientId')
$wsus.GetComputerTarget($id).FullDomainName
~~~~
