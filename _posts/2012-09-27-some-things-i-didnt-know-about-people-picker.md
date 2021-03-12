---
title: Some Things I Didn't Know About People Picker
categories:
- Microsoft
tags:
  - SharePoint
  - PowerShell
  - Active Directory
---

Recently I got to mess with SharePoint 2010's People Picker - a control
that emulates Windows' "Directory Object Picker", allowing the user to
select security principals  

- Active Directory's People Picker:  
  ![](/assets/some-things-i-didnt-know-about-people-picker/ActiveDirectoryObjectPickerDialog.gif)
- The SharePoint 2010 Variant:  
  ![](/assets/some-things-i-didnt-know-about-people-picker/24-browse-for-users.jpg)

After the Devs asked me to customize it for them, I went rummaging
through the dark corners of the internet (pages 5+ on Google), and came
back with several facts that weren't included in the [regular TechNet
documentation](http://technet.microsoft.com/en-us/library/gg602075.aspx)
and I think should have been:  

### Changes can (and even should) be made from PowerShell
Although the official documentation states that there are no PowerShell
commands (as seen in the picture),  
![](/assets/some-things-i-didnt-know-about-people-picker/Capture.png)  
changes don't have to be made from the `stsadm` utility.  
You can instead find the relevant `SPWebApplication` object and use its
PeoplePickerSettings property to modify the PeoplePicker configuration:
  

~~~~powershell
$webApp = Get-SPWebApplication 'SharePoint - 80'
$webApp.PeoplePickerSettings
~~~~
~~~~text
SearchActiveDirectoryDomains                     : {}
ActiveDirectoryCustomQuery                       : 
ActiveDirectoryCustomFilter                      : 
OnlySearchWithinSiteCollection                   : False
PeopleEditorOnlyResolveWithinSiteCollection      : False
DistributionListSearchDomains                    : {}
ActiveDirectorySearchTimeout                     : 00:00:30
NoWindowsAccountsForNonWindowsAuthenticationMode : True
ServiceAccountDirectoryPaths                     : {}
ReferralChasingOption                            : None
ActiveDirectoryRestrictIsolatedNameLevel         : False
AllowLocalAccount                                : True
UpgradedPersistedProperties                      : {}
~~~~
Just make sure that you update after modifying!   
~~~~powershell
$webApp.Update()
~~~~

### Changes apply immediately
After making a change, there is no need for an application pool recycle
or even a page reload. You only need to press the search / check name
button again!  

### People Picker always queries the external data source (e.g. Active Directory), unless specifically told not to

Unless told to limit external queries (see "Force People Picker to pick
only from users in the site collection" on TechNet), the People Picker
will always query the data source, even if you have a perfect match in
the local site's user collection. I think it's a good thing, but you can
always limit external queries using `ActiveDirectoryRestrictIsolatedNameLevel` or `OnlySearchWithinSiteCollection`  

### The Active Directory query differs between "Check Names" and "Browse"
There are two ways to search for users using the people picker - using
the "check names" button and using the "browse" dialog  

![](/assets/some-things-i-didnt-know-about-people-picker/PP.png)

According to the MS documentation, the queries sent to AD after clicking
each one are different, and search for different attributes in users.  
The "check names" command searches those attributes in users:  
`name`, `displayName`, `cn`, `SamAccountName`, `mail`, `proxyAddresses`  
The "browse" command **additionally** searches the attribute `sn` (last name).  
Both commands search the following attributes in groups:  
`name`, `displayName`, `cn`, `samAccountName`  
Sources:  
[Active Directory: People Picker Browse Display
UI](http://msdn.microsoft.com/en-us/library/dd357076%28v=prot.13%29.aspx)  
[Active Directory: People Picker Check Name
UI](http://msdn.microsoft.com/en-us/library/dd303522%28v=prot.13%29.aspx) 
  

### The Active Directory custom query can only add results

Any custom query added to the people picker through
`ActiveDirectoryCustomQuery` is concatenated using an "or" sign (`|`) to
its own query. The implication is that you should only add additional
attributes you want to search, and don't have to rewrite the original
query.  

### In Active Directory mode, the User Profile Application is not queried

Even if you have a working UPA in the farm, it's not queried on AD mode.
The only places that matter are the current site (`SPWeb`)'s local user
collection and the AD.  
  
Enjoy picking some people!
