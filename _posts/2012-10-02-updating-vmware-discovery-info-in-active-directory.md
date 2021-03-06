---
title: Updating VMware discovery info in Active Directory
categories:
- Microsoft
tags:
  - VMware
  - Scripts
  - PowerShell
  - Active Directory
---

Recently I decided I want to store physical discovery data (name,
physical location, host if it's a VM) on the machine's account in Active
Directory, because we have a lot of machines and during a crisis we
sometimes forget where they are.  
I started with our VMware infrastructure, and decided to list 3 of the
VM's attributes in AD:  

1.  The VM name, since it's sometimes different from the OS name (a VM
    can be called "A" and contain a Windows OS called "B" in the domain)
2.  The current VMware host, because if the machine disappears we want
    to know where it was last seen
3.  The VM Uid - a pathlike expression containing the VM's and the
    cluster's unique identifiers, allowing the virtualization team to
    quickly find the VM in their datastore

I decided to write them into one of the extension attributes - there
are10 such attributes set aside by AD for such tasks. I chose
`extensionAttribute3`.  
The script finds all VMs in a given vSphere, and finds those whose OS is
in the same domain as the current user. For those VMs, it creates the
description string, searches for the AD computer account matching the
VM's OS name and updates its extension attribute.  
  

~~~~powershell
param(
$viServer = 'VSPHERE'
)
 
$myDomain = $env:USERDNSDOMAIN
 
# VMWare init
gsnp -reg | ?{('VMware.VimAutomation.Core','VMware.VimAutomation.License','VMware.DeployAutomation','VMware.ImageBuilder') -contains $_.name} | asnp
Disconnect-VIServer -Confirm:0
Connect-VIServer $viServer | out-null
 
# AD init
ipmo ActiveDirectory
 
Get-VM | %{
 $vm = $_
 $guest = Get-VMGuest $vm
 $ret = $vm | select name,VMHost,Folder,Uid
 $ret | Add-Member NoteProperty 'HostName' ($guest.HostName)
 $ret
} | ?{$_.HostName -match ([regex]::escape($myDomain)+'$'} | %{
 $descString = ('VMWare: {1}/{0} | {2}' -f $_.name,$_.VMHost,$_.Uid).toString()
 $_ | select HostName, @{name='descString';expression={$_.descString}}
} | %{
 $hostName = $_.hostName
 $comp = get-ADComputer -fi {dnsHostName -eq $HostName} -ErrorAction 'continue'
 $descString=$_.descString
 if($comp){
  set-ADComputer $_ -Add @{'extensionattribute3'=$descString}
  $_
 }
}
~~~~
