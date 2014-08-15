Title: Some Things I Didn't Know About People Picker
Date: 2012-09-27 19:20
Tags: SharePoint, PowerShell, Active Directory
Slug: some-things-i-didnt-know-about-people
OldSlug: some-things-i-didnt-know-about-people

Recently I got to mess with SharePoint 2010's People Picker - a control
that emulates Windows' "Directory Object Picker", allowing the user to
select security principals  

  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  [![](http://2.bp.blogspot.com/-1rJzPzGclOs/UGSF-KLZl2I/AAAAAAAAB3o/PB-su2Swl6s/s320/ActiveDirectoryObjectPickerDialog.gif)](http://2.bp.blogspot.com/-1rJzPzGclOs/UGSF-KLZl2I/AAAAAAAAB3o/PB-su2Swl6s/s1600/ActiveDirectoryObjectPickerDialog.gif)
  The Original "Directory Object Picker"
  ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  [![](http://1.bp.blogspot.com/-CzN5K0oiJcU/UGSGgtYDgVI/AAAAAAAAB3w/CtmayHrU0XY/s320/24-browse-for-users.jpg)](http://1.bp.blogspot.com/-CzN5K0oiJcU/UGSGgtYDgVI/AAAAAAAAB3w/CtmayHrU0XY/s1600/24-browse-for-users.jpg)
  The SharePoint 2010 Variant
  ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

After the Devs asked me to customize it for them, I went rummaging
through the dark corners of the internet (pages 5+ on Google), and came
back with several facts that weren't included in the [regular TechNet
documentation](http://technet.microsoft.com/en-us/library/gg602075.aspx)
and I think should have been:  

Changes can (and even should) be made from PowerShell
-----------------------------------------------------

Although the official documentation states that there are no PowerShell
commands (as seen in the picture),  

<div class="separator" style="clear: both; text-align: center;">

[![](http://4.bp.blogspot.com/-dFpglBaTFjk/UGSQaSZzrII/AAAAAAAAB4A/1Wp-VXOKBEg/s320/Capture.PNG)](http://4.bp.blogspot.com/-dFpglBaTFjk/UGSQaSZzrII/AAAAAAAAB4A/1Wp-VXOKBEg/s1600/Capture.PNG)

</div>

changes don't have to be made from the stsadm utility.  
You can instead find the relevant SPWebApplication object and use its
PeoplePickerSettings property to modify the PeoplePicker configuration:
  

~~~~ {.brush:ps}
$webApp = Get-SPWebApplication 'SharePoint - 80'$webApp.PeoplePickerSettings
~~~~

    SearchActiveDirectoryDomains                     : {}ActiveDirectoryCustomQuery                       : ActiveDirectoryCustomFilter                      : OnlySearchWithinSiteCollection                   : FalsePeopleEditorOnlyResolveWithinSiteCollection      : FalseDistributionListSearchDomains                    : {}ActiveDirectorySearchTimeout                     : 00:00:30NoWindowsAccountsForNonWindowsAuthenticationMode : TrueServiceAccountDirectoryPaths                     : {}ReferralChasingOption                            : NoneActiveDirectoryRestrictIsolatedNameLevel         : FalseAllowLocalAccount                                : TrueUpgradedPersistedProperties                      : {}

Just make sure that you update after modifying!   

~~~~ {.brush:ps}
$webApp.Update()
~~~~

Changes apply immediately
-------------------------

After making a change, there is no need for an application pool recycle
or even a page reload. You only need to press the search / check name
button again!  

People Picker always queries the external data source (e.g. Active Directory), unless specifically told not to
--------------------------------------------------------------------------------------------------------------

Unless told to limit external queries (see "Force People Picker to pick
only from users in the site collection" on TechNet), the People Picker
will always query the data source, even if you have a perfect match in
the local site's user collection. I think it's a good thing, but you can
always limit external queries using
"ActiveDirectoryRestrictIsolatedNameLevel" or
"OnlySearchWithinSiteCollection"  

The Active Directory query differs between "Check Names" and "Browse"
---------------------------------------------------------------------

There are two ways to search for users using the people picker - using
the "check names" button and using the "browse" dialog  

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-aMZ0QTekj-Y/UGSbNfLtPYI/AAAAAAAAB4Q/A9qL2r49m3w/s320/PP.PNG)](http://1.bp.blogspot.com/-aMZ0QTekj-Y/UGSbNfLtPYI/AAAAAAAAB4Q/A9qL2r49m3w/s1600/PP.PNG)

</div>

According to the MS documentation, the queries sent to AD after clicking
each one are different, and search for different attributes in users.  
The "check names" command searches those attributes in users:  
'name', 'displayName', 'cn', 'SamAccountName', 'mail','proxyAddresses'  
The "browse" command **additionally**searches the attribute
**'sn'**(last name).  
Both commands search the following attributes in groups:  
'name', 'displayName', 'cn', 'samAccountName'  
Sources:  
[Active Directory: People Picker Browse Display
UI](http://msdn.microsoft.com/en-us/library/dd357076%28v=prot.13%29.aspx)  
[Active Directory: People Picker Check Name
UI](http://msdn.microsoft.com/en-us/library/dd303522%28v=prot.13%29.aspx) 
  

The Active Directory custom query can only add results
------------------------------------------------------

Any custom query added to the people picker through
ActiveDirectoryCustomQuery is concatenated using an "or" sign ("|") to
its own query. The implication is that you should only add additional
attributes you want to search, and don't have to rewrite the original
query.  

In Active Directory mode, the User Profile Application is not queried
---------------------------------------------------------------------

Even if you have a working UPA in the farm, it's not queried on AD mode.
The only places that matter are the current site (SPWeb)'s local user
collection and the AD.  
  
Enjoy picking some people!

</p>

