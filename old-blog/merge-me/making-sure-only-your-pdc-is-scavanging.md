Title: Making Sure Only Your PDC is Scavanging DNS Records
Date: 2012-12-18 17:25
Author: Nitzan Raz (noreply@blogger.com)
Tags: DNS, Scripts, PowerShell, Active Directory
Slug: making-sure-only-your-pdc-is-scavanging
OldSlug: making-sure-only-your-pdc-is-scavanging

<p>
I recently looked over out DNS server settings, and I found out that
more than one DNS server (DC in our case) was scavenging records.  
In order to put that right, I made a small script that makes sure that
only the PDC is scavenging records:  

~~~~ {.brush:ps}
param( $scavengeInterval = 7)Get-ADDomainController -fi * | %{ $config = gwmi MicrosoftDNS_Server -Namespace 'root\microsoftdns' -comp $_.name if($_.OperationMasterRoles -contains 'PDCEmulator') {$config.ScavengingInterval = $scavengeInterval} else {$config.ScavengingInterval = 0} $config.put()}
~~~~

  
Enjoy!

</p>

