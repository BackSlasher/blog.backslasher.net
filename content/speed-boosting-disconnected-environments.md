Title: Speed boosting disconnected environments
Date: 2011-01-06 20:42
Category: Microsoft
Tags: SCOM, Ramblings, SQL
Slug: speed-boosting-disconnected-environments
OldSlug: speed-boosting-disconnected

Hi there.  
Not a while ago, I've created a post about [stsadm.exe / new SPSite() being slow](stsadm-new-spsite-is-slow.html)
in disconnected environments. Just wanted to point out that I've tried
changing the setting on some other servers, and the results were **most
interesting**. Almost every other MS product, starting from SQL Studio
and ending in SCOM Console, loaded up faster, probably for being signed
using AuthentiCode. So, if you have a disconnected server hosting some
MS product, try changing this setting too! Remember it might reduce
security when used with applications that actually **can** access their
CRL listings, so if that's the case (You should know, since it would
probably be an application developed in-house), use the MS application's
`.config` file and not the `machine.config` one.  
Happy boosting!
