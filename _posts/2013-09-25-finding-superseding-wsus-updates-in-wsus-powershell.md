---
title: Finding Superseding WSUS updates in PowerShell
categories:
- Microsoft
tags:
  - Scripts
  - PowerShell
  - WSUS
  - One-Liner
---

Whenever I see a superseded update, I usually want to know which update
supersedes it.  
Finding it from the console is easy enough:  

![](/assets/finding-superseding-wsus-updates-in-wsus/WsusSuper.png)

But of course, working through the UI is no fun.  
After you got an update object through PowerShell, like this:  
~~~~powershell
$wsus = Get-WsusServer WSUS2 -PortNumber 8530
$update = $wsus.SearchUpdates('2847204') `
          | ?{$_.ProductTitles -contains 'Windows 7'} `
          | ?{$_.LegacyName -like 'KB2847204-Win7-SP1-X86*'}
~~~~
You can use the method `GetRelatedUpdates` to find related updates. The relationships relevant to us are `UpdatesThatSupersedeThisUpdate` and `UpdatesSupersededByThisUpdate`.  
If we use this code:  
~~~~powershell
$update.GetRelatedUpdates('UpdatesThatSupersedeThisUpdate') | select KnowledgebaseArticles
~~~~
~~~~text
KnowledgebaseArticles
---------------------
{2838727}
~~~~
We get the KB of updates that directly supersede the one we have.
Remember, there can be updates that supersede these!  
  
Enjoy your relationships.

</p>

