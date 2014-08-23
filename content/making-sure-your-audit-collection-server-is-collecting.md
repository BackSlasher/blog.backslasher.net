Title: Making sure your Audit Collection Server is collecting
Date: 2011-10-22 21:23
Category: Microsoft
Tags: ACS, PowerShell, SCOM, SQL
Slug: making-sure-your-audit-collection-server-is-collecting
OldSlug: making-sure-your-audit-collection

A few days ago I wanted to make sure that my ACS (Audit Collection
Server) is collecting events from all of my DCs.  
For those unfamiliar with ACS, it's an additional component to SCOM
(System Center Configuration Manager) that allows you to collect events
from the security log of several machines into a dedicated db, for
analysis and reporting.  
First of all, to start event collection you have to:  

1.  Install ACS on SCOM (duh)
2.  Install SCOM agents on the machines you wish to collect events from
3.  Enable the windows service called "Operations Manager Audit
    Forwarding Service" (`AdtAgent`) on the ACS "clients" and set it to
    automatic. You can do it either manually, using Group Policy or
    through a task in the SCOM console (called "Enable Audit
    Collection").

To extract data from the ACS database, you can query it directly or use
some reoprts that come included with SCOM [(google to find out how)](http://www.google.co.il/search?q=scom+reports).  
So how can you check that computers are actually reporting to ACS?  
You can query the db, with something like:  

~~~~sql
SELECT Max(CreationTime),AgentMachine FROM [AdtServer].[dvAll5] GROUP BY AgentMachine
~~~~

or you can use AdtAdmin.exe from your SCOM installation media (`acs\i386\AdtAdmin.exe`) and parse it's input with PowerShell thusly:  

~~~~powershell
AdtAdmin.exe -stats -collector:<SCOMSERVER> | ConvertFrom-CSV | select Name,'Last Action'
~~~~

Of course you don't have to filter all of the other properties, but
these two are the bare necessities.  
Enjoy!
