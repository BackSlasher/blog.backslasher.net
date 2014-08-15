Title: Solving and preventing "Topology Discovery failed, error 0x80040a02"
Date: 2011-06-05 19:00
Tags: Group Policy, Exchange, Active Directory
Slug: solving-and-preventing-topology
OldSlug: solving-and-preventing-topology

Hi.  
Recently our Exchange 2003 environment broke down when we demoted our
last ancient DCs. We panicked and re-promoted them, but no avail. The
Exchange servers won't finish loading (they'd get stuck on "Applying
computer settings", while actually waiting for the Exchange System
Attendant service to finish starting).  
The error listed in the event viewer was from MSExchangeDSAccess,
claiming that "Topology Discovery failed". After some searching, we
found [KB919089](http://support.microsoft.com/kb/919089), which
indicated we should run Exchange's **setup.exe /domainprep** on every
DC.  
While executing it on one DC did solve the problem, I wasn't planning to
add this to my DC construction document. Therefore, my solution was
setting the following setting to all DCs through Group Policy:  
Open Computer Configuration \> Policies \> Windows Settings \> Security
Settings \> Local Policies \> User Rights Assignment \> Manage auditing
and security log  
And add "DOMAIN\\Exchange Enterprise Servers" to the list.  
  
Have a nice day!
