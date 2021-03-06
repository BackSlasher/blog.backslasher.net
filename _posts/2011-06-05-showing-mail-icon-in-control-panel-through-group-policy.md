---
title: Showing "Mail" icon in control panel through Group Policy
categories:
- Microsoft
tags:
  - Group Policy
  - Terminal Server
  - Office
---

I recently had to lock down a Windows 2008R2 remote desktop server
(terminal server)  
One of the requirements was to show only some control panel items, a
setting that can be achieved using the Group Policy setting "Show only
specified Control Panel items" (under `Policies > Administrative
Templates > Control Panel`), but that setting requires the applet's
*canonical name*, like `Microsoft.Mouse`. All applets included with
Windows have their own canonical names, found in [this article](http://msdn.microsoft.com/en-us/library/ee330741(VS.85).aspx)  
I couldn't find the mail icon's canonical name anywhere, and eventually
found out that writing down the applet's filename - `mlcfg32.cpl` is
enough.
