Title: "The module ... owssvr.dll could not be loaded due to a configuration problem"
Date: 2011-07-07 16:09
Category: Microsoft
Tags: Mysteries Solved, SharePoint, IIS
Slug: module-owssvrdll-could-not-be-loaded
OldSlug: module-owssvrdll-could-not-be-loaded

Recently, one of my teammates installed ArcGis Server 9.3 on our fresh
SharePoint 2010 box, causing all sites to respond with `503 Service
Unavailable`. A quick inspection showed that the application pools have
stopped themselves, and the Windows application event log was spammed
with:  

~~~text
Event ID: 2282
Source: Microsoft-Windows-IIS-W3SVC-WP
Description:
The Module DLL C:\Program Files\Common Files\Microsoft Shared\Web Server Extentions\14\isapi\owssvr.dll' could not be loaded due to a configuration problem. The current configuration only supports loading images built for a x86 processor architecture. The data field contains the error number...
~~~

After some investigation, I found out that the installation switched all
of the application pools into 32-bit mode, causing SharePoint's x64 dlls
to fail to load.  
The solution I found - go over every pool in the IIS manager under
`Application pools`, open `advanced settings` and set `Enable 32-Bit
Application` to `False`.  
Also, make sure you click `Set Application Pool Defaults` and change the
settings there, for your future pools.
