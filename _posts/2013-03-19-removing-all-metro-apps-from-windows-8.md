---
title: Removing all Metro Apps from Windows 8
categories:
- Microsoft
tags:
  - Scripts
  - PowerShell
  - One-Liner
---

I wanted to open some photos today (to add to my blog) on my Windows 8
workstation, and it kept opening the full-screen metro app instead of
the normal picture viewer. It really annoyed me, and I looked for a
quick and dirty way to remove **ALL** metro apps. This one-liner I wrote
quickly removes all metro apps that can be removed. I know I liked it!

~~~~powershell
Get-AppxPackage | Remove-AppxPackage -ErrorAction SilentlyContinue
~~~~

Enjoy!
