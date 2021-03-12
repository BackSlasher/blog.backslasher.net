---
title: A few seconds about psbase
categories:
- Microsoft
tags:
  - Scripts
  - PowerShell
---

I really like Powershell's dynamic type system, which allows you to, among other things, view XML nodes really easily. For example, to view the connectionStrings stored in your machine.config, all you have to do is something like:  

~~~powershell
([xml](gc 'C:\windows\Microsoft.NET\Framework\v2.0.50727\CONFIG\machine.config')).configuration.connectionStrings.add
~~~ 
And you have a set of working PS objects.  
**However**, when you try to view the properties/methods of the XmlNode object, such as "ParentNode" (using Get-Member, for instance), you only see the data properties of the XML element contained (such as "key").  
The answer - `PSBase`. It's a hidden member every object has (along with
some other ones, see [here](http://blogs.msdn.com/b/powershell/archive/2006/11/24/what-s-up-with-psbase-psextended-psadapted-and-psobject.aspx) for greater detail), which displays the raw object, without PowerShell's good-intentioned intervention.  
I like to use it while writing scripts, to find the members I need to accomplish stuff. As long as these members aren't hidden by an identically-named member created by PowerShell, they'll behave fine without PSBase if called explicitly (e.g. `$bla.ParentNode`).
