Title: Finding Superseding WSUS updates in PowerShell
Date: 2013-09-25 16:11
Tags: Scripts, PowerShell, WSUS, One-Liner
Slug: finding-superseding-wsus-updates-in
OldSlug: finding-superseding-wsus-updates-in

Whenever I see a superseded update, I usually want to know which update
supersedes it.  
Finding it from the console is easy enough:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://4.bp.blogspot.com/-yG_cN-ZXYAo/UkMKEVBvz-I/AAAAAAAAD8Q/lz_QV9T6B44/s320/WsusSuper.png)](http://4.bp.blogspot.com/-yG_cN-ZXYAo/UkMKEVBvz-I/AAAAAAAAD8Q/lz_QV9T6B44/s1600/WsusSuper.png)

</div>

But of course, working through the UI is no fun.  
After you got an update object through PowerShell, like this:  

~~~~ {.brush:ps}
$wsus = Get-WsusServer WSUS2 -PortNumber 8530$update = $wsus.SearchUpdates('2847204') `          | ?{$_.ProductTitles -contains 'Windows 7'} `          | ?{$_.LegacyName -like 'KB2847204-Win7-SP1-X86*'}
~~~~

You can use the method "GetRelatedUpdates" to find related updates. The
relationships relevant to us are "UpdatesThatSupersedeThisUpdate" and
"UpdatesSupersededByThisUpdate".  
If we use this code:  

~~~~ {.brush:ps}
$update.GetRelatedUpdates('UpdatesThatSupersedeThisUpdate') | select KnowledgebaseArticlesKnowledgebaseArticles---------------------{2838727}
~~~~

We get the KB of updates that directly supersede the one we have.
Remember, there can be updates that supersede these!  
  
Enjoy your relationships.

</p>

