---
title: Adding Repositories for Inspection
categories:
- FOSS
tags:
  - Scripts
  - Linux
  - Debian
  - Apt Pinning
  - One-Liner
  - Apt
---

Sometime I want to inspect software repositories. However, I don't want my machine to actually install anything from it.  
To do so, I made a small bash function that both adds the repository and pins it to priority -1, telling apt to never install anything from it
(unless manually told to).  
The files created in the process are printed to screen so they can be easily deleted.   
~~~~bash
#Usage:   add-repository-for-inspection NAME REPOINFO
#Example: add-repository-for-inspection wheezy-backports http://debian.co.il/debian wheezy-backports main

function add-repository-for-inspection
{
 NAME="$1"
 shift 1
 REPO="$@"
 # Add repository
 echo "deb $REPO" | sudo tee /etc/apt/sources.list.d/$NAME.list >/dev/null && echo "/etc/apt/sources.list.d/$NAME.list"
 RELEASE="$2"
 echo -e "Package: *\nPin: release a=$RELEASE\nPin-Priority: -1" | sudo tee /etc/apt/preferences.d/$NAME >/dev/null && echo "/etc/apt/preferences.d/$NAME"
}
~~~~
**Note**: It's still best to remove the files and apt-get update immediately
after checking.  

For instance, I can check for alternative versions of XBMC in `wheezy-backports` without risking accidental installations:   
~~~~ bash
FILES=$(add-repository-for-inspection wheezy-backports http://debian.co.il/debian wheezy-backports main) && sudo apt-get update &>/dev/null && apt-cache policy xbmc && sudo rm -f $FILES && sudo apt-get update &>/dev/null
~~~~
