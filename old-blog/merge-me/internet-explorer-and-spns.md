Title: Internet Explorer and SPNs
Date: 2011-01-06 20:33
Author: Nitzan Raz (noreply@blogger.com)
Tags: Kerberos, Mysteries Solved, Internet Explorer, SharePoint
Slug: internet-explorer-and-spns
OldSlug: internet-explorer-and-spns

Hi.  
After learning how SPNs work (read my ["Who? Why?
Where"](http://oneboredadmin.blogspot.com/2010/10/spns-who-why-where.html)
to learn what's an SPN), I was frustrated to find out that I can't
implement my experience in the real world - I've created a Sharepoint
Central Admin site on port 1234, and wanted to enable kerberos
authentication for it, so I've created an SPN reading "http/server:1234"
on the right account, and it didn't work! The SPN that did work is
"http/server", which should work only for the site on port 80 (because
it's the default port for HTTP). Turns out that IE6 had a bug, which
caused it to always request TGS without port numbers ("http/server"),
even when navigating to a site in a non-default port. A hotfix
([kb908209](http://support.microsoft.com/kb/908209)) was issued and all
was well. Problem is, **we use IE8!** Surely, someone must have fixed
that behavior in the new browsers?  
Apparently, in order to maintain compatibility, new versions of IE(7+)
use the same defected SPN formulation. To switch to the new version, you
have to add this registry key:  

  ------------------------ -----------------------------------------------------------------------------------------------------------------------------------------------------------
  Processor architecture   Registry location

  x86                        
                          HKEY\_LOCAL\_MACHINE\\SOFTWARE\\Microsoft\\Internet Explorer\\Main\\FeatureControl\\FEATURE\_INCLUDE\_PORT\_IN\_SPN\_KB908209:iexplore.exe=1

  x64                        
                          HKEY\_LOCAL\_MACHINE\\SOFTWARE\\WOW6432Node\\Microsoft\\Internet Explorer\\Main\\FeatureControl\\FEATURE\_INCLUDE\_PORT\_IN\_SPN\_KB908209:iexplore.exe=1
  ------------------------ -----------------------------------------------------------------------------------------------------------------------------------------------------------

I used Group Policy Preferences to distribute it to all my servers.  
Good day!

</p>

