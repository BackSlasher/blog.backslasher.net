---
title: Making Sure Only Your PDC is Scavanging DNS Records
categories:
- Microsoft
tags:
  - DNS
  - Scripts
  - PowerShell
  - Active Directory
---

I recently looked over out DNS server settings, and I found out that
more than one DNS server (DC in our case) was scavenging records.  
In order to put that right, I made a small script that makes sure that
only the PDC is scavenging records:  

~~~~powershell
param(
 $scavengeInterval = 7
)
 
Get-ADDomainController -fi * | %{
 $config = gwmi MicrosoftDNS_Server -Namespace 'root\microsoftdns' -comp $_.name
 if($_.OperationMasterRoles -contains 'PDCEmulator') {$config.ScavengingInterval = $scavengeInterval}
 else {$config.ScavengingInterval = 0}
 $config.put()
}
~~~~
  
Enjoy!
