Title: setspn duplicates and case sensitivity
Date: 2014-01-09 17:06
Author: Nitzan Raz (noreply@blogger.com)
Tags: Kerberos, Security, Scripts, Windows, Power Management, One-Liner, Event Log, Active Directory
Slug: setspn-duplicates-and-case-sensitivity

<p>
Today I found out that the command I use to find duplicate SPNs which
goes like  

~~~~ {.prettyprint}
setspn -x
~~~~

[![](http://1.bp.blogspot.com/-uIlB991LPhI/Usv-IPGel1I/AAAAAAAAERA/VXHddiEckJ4/s320/SetspnX.PNG)](http://1.bp.blogspot.com/-uIlB991LPhI/Usv-IPGel1I/AAAAAAAAERA/VXHddiEckJ4/s1600/SetspnX.PNG)  
is case sensitive, meaning that the following SPNs don't count as
duplicates:  

~~~~ {.prettyprint}
HOST/blaHOST/BLA
~~~~

This makes sense when using UNIX systems for TGS creation. However,
Active Directory Domain Controllers, being Windows systems, are
case-insensitive and don't differentiate between the two. You could even
get [event
11](http://technet.microsoft.com/en-us/library/cc733945%28v=ws.10%29.aspx)
because of such duplication.  
[![](http://4.bp.blogspot.com/-8gRu-ZzxPKU/Usv-Yfg226I/AAAAAAAAERI/RlYZebwEZok/s320/Event11.PNG)](http://4.bp.blogspot.com/-8gRu-ZzxPKU/Usv-Yfg226I/AAAAAAAAERI/RlYZebwEZok/s1600/Event11.PNG)  
Since setspn didn't work, I wrote a few lines of my own that search the
current domain for duplicate SPNs. Since PowerShell is not case
sensitive (by default), it can find different-cased duplicate SPNs
easily.  

~~~~ {.prettyprint .lang-posh}
Get-ADObject -prop serviceprincipalname -fi {serviceprincipalname -like '*'} | %{    $name = $_.DistinguishedName    $_.ServicePrincipalName | select @{name='SPN';Expression={$_}},@{name='DN';Expression={$name}}} | group SPN  | ?{$_.Count -gt 1} | select count,@{Name='SPN';Expression={$_.Name}},@{Name='DN';Expression={$_.Group | select -exp DN}}
~~~~

Images from [SharePoint
FoxHole](https://draft.blogger.com/blogs.technet.com/b/sharepoint_foxhole/archive/2012/02/03/kerberos-fatfingeritis-how-to-set-your-kerby-spns-the-safe-way.aspx)

</p>

