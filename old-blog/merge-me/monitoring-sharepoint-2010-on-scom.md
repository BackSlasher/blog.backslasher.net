Title: Monitoring SharePoint 2010 on SCOM - Minimal Permissions
Date: 2011-07-18 13:15
Author: Nitzan Raz (noreply@blogger.com)
Tags: SharePoint, SCOM
Slug: monitoring-sharepoint-2010-on-scom
OldSlug: monitoring-sharepoint-2010-on-scom

Hi.  
I've recently started monitoring my new SharePoint 2010 farms on SCOM,
and found the management pack's documentation to be rather lacking in
setup instructions, and the required permissions for SCOM's account on
the farm were rather shocking:  

-   Local admin on all SharePoint servers
-   Local admin on all SQL servers
-   dbowner on all SharePoint's databases
-   Membership in the Farm Administrators group

 After some experimenting, I managed to reduce the permissions to a
normal level, and create my own (working!) workflow:  
<span style="font-size: x-small;">(treat FARM as a unique identifier for
your farm)</span>  

<ol>
<li>
Prepare a special AD account (one for every farm) for SCOM's monitoring,
such as SCOM-Sharepoint-FARM

</li>
<li>
Grant that account:

</li>
1.  Membership in the "Farm Administrators" group on the SharePoint farm
    (via Central Administration)
2.  dbowner on the farm's DBs (or sysadmin on the SQL server, if it only
    holds this farm's DBs anyway)

<li>
Using SCOM's console, Create a Windows Run-As account (under
administration, be careful) named something like "SP FARM Monitoring"

</li>
<li>
Edit the SharePoint MP's xml file thusly:

</li>
1.  If you installed the MP on the SCOM server (as you should), copy the
    "SharePointMP.Config" file from <u>C:\\Program Files (x86)\\System
    Center Management Packs\\Microsoft SharePoint 2010 Products OpsMgr
    2007 MP en-us\\</u> to <u>C:\\Program Files\\System Center
    Management Packs\\</u>. It should stay there.
2.  Open the file in your favorite XML editor
3.  Add an Association node like:  
   \<Association Account="NAME" Type="Agent"\>\</Association\>  
   Where NAME is SCOM's Run-As account
4.  Inside the Association node, add a Machine node for every computer
    inside the farm, thusly:  
   \<Machine Name="MACHINE" /\>

<li>
Add every SharePoint server to SCOM's monitored servers (through
discovery wizard)

</li>
<li>
Execute the task "Configure SharePoint Management Pack" (in
Monitoring\>SharePoint 2010 Products\>Administration). Change the task
credentials to an account with farm administrator privileges (like
yours), otherwise the task will execute with SCOM's default action
account, which might not have enough permissions.

</li>
<li>
Wait for about an hour, and check out the Diagram View!

</li>
</ol>
If your servers won't appear, check the "unidentified machines" view,
the Agent's health, and the server's event log.  

<ol>
</ol>
</p>

