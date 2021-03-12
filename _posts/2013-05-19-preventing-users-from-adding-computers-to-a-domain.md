---
title: Preventing Users from Adding Computers to a Domain
categories:
- Microsoft
tags:
  - Group Policy
  - Security
  - Mysteries Solved
  - Scripts
  - PowerShell
  - Active Directory
---

Some time ago, we've come to the conclusion that the computer accounts
in the domain are disorganized. After doing the tedious job of sorting
existing accounts, we saw that new computer accounts are still being
added to the "Computers" container, and we had no idea which computer
was behind them (server/workstation, test/production etc.). After doing
some research, we managed to block everyone from joining computers to
the domain without pre-creating a computer account (inside organized
OUs).  
  
### The domain join process
To join a domain, Windows needs a computer account. Windows tries to get
its own computer account using these methods, in that order:  

1.  Searches for an existing account with an identical name to its own.  
   If a matching account is found (and is disabled), Windows attempts
    to make it its own (write FQDN, reset password etc.)
2.  Tries to create a new account using the user's permissions in the
    default computers container
3.  Tries to use the "Add workstations to domain" privilege to create a
    new account in the default computers container

### A little about "Add workstations to domain":
Microsoft intends for users to join their own workstations to the
domain, probably to reduce load on helpdesks. For this to work, DCs have
a [User Right Assignment](http://technet.microsoft.com/en-us/library/cc780182%28v=ws.10%29.aspx) called
"Add workstations to domain".  
By default, Authenticated users are members of this group, meaning that
all domain users can use this privilege.  

![](/assets/preventing-users-from-adding-computers-to-a-domain/AddWorkstationsToDomain.png)

Users with this privilege can create up to 10 (by default) computer
accounts in the default computers container.  
The limit of accounts every user can create is defined in the domain
object, under the property `ms-DS-MachineAccountQuota`. To view it,
execute

~~~~powershell
get-addomain | select -exp DistinguishedName | get-adobject -prop 'ms-DS-MachineAccountQuota' | select -exp ms-DS-MachineAccountQuota
~~~~

The amount of computers a user has already joined is determined by
counting the machines with `ms-DS-CreatorSID` identical to the user's
SID. To find all computers added to the domain using this privilege, you
can try   

~~~~powershell
Get-ADComputer -fi {ms-DS-CreatorSID -like '*'}
~~~~

To find computers added to the domain using this privilege by a specific
user, execute:   

~~~~powershell
$sid = (get-aduser OneBoredAdmin).SID
Get-ADComputer -fi {ms-DS-CreatorSID -eq $sid}
~~~~

To get a summary of all privilege-added computers and the users that
added them, try:

~~~~powershell
get-adcomputer -fi {ms-DS-CreatorSID -like '*'} -prop ms-DS-CreatorSID | group ms-DS-CreatorSID | %{
    $ret = $_ | select Count,@{name='UserName';Expression={$_.Name}},@{name='ComputerNames';Expression={$_.Group | select -exp Name}}
    # Try to resolve the SID into an account
    try{
        $_.Name = $_.Name.Translate([System.Security.Principal.NTAccount])
    }catch{}
    $ret
}
~~~~

By the way, when using this privilege to create an account, the account
is created with "Domain Admins" as its owner (and not the creating
user), and the user's SID in the `ms-DS-CreatorSID` property.  

### Action Plan
**Note:** While these actions should work as planned and prevent users from
adding computers without having a computer account ready, step 1 will
break DC demotion. You can either redirect your default computer
directory to another OU for the process (see
[KB324949](http://support.microsoft.com/kb/324949)) or restore the
original permissions. Since demoting isn't a daily action, I still think
this procedure is worth doing.  
  
In order to prevent users from joining computers to the domain without
pre-creating a computer account, you have to perform these actions:  

1.  Remove permissions to create computer accounts on the default
    computers container. To check what is the current default computers
    container in your domain, you can try:

        :::powershell
        (Get-ADDomain).ComputersContainer

2.  Prevent users from using the "Add workstations to domain" privilege.
    This can be done either by modifying the `ms-DS-MachineAccountQuota`
    property on the domain to zero, or removing "Authenticated users"
    from the URA on the DCs (use Group Policy to make sure it'll apply to future
    DCs as well).

As long as you don't perform those two steps, users will still be able
to add computers to the domain.  

##### Further reading:

-   [Add workstations to domain](http://technet.microsoft.com/en-us/library/cc780195%28v=ws.10%29.aspx)
-   [Default limit to number of workstations a user can join to the domain](http://support.microsoft.com/kb/243327)
