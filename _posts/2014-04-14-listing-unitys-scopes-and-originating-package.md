---
title: Listing Unity's Scopes and Originating Package
categories:
- FOSS
tags:
  - Unity
  - Scripts
  - Linux
  - Parallel
  - Ubuntu
  - Bash
---

I recently upgraded to Ubuntu 14.04 (beta2), and I got all of my
"lenses" (searching additional items in the dash menu), that look like
this:  

![](/assets/listing-unitys-scopes-and-originating-package/lenses.png)

Of course there's a way to disable those lenses, but I actually want to
remove those I'll never use (like flickr).  
The problem  - lenses are installed using packages that don't always
match the lens' name. Using `apt-file` (a utility for finding files inside
packages) and `parallel`, I built a little script.  
First, install `parallel` and `apt-file`, and update apt-file's cache:  

~~~~bash
sudo apt-get install parallel apt-file
sudo apt-file update
~~~~

Then execute this script:  

~~~~bash
find /usr/share/unity/scopes/ -name \*.scope | parallel '
 ROW=$(apt-file search {});
 FILE=$(echo $ROW | cut -f 2 -d ":");
 PACK=$(echo $ROW | cut -f 1 -d ":");
 NAME=$(cat $FILE | grep ^Name | head -1 | sed "s/^Name\=//");
 echo "$PACK: $NAME"' | sort
~~~~

you'll see a list of lens friendly names, sorted by containing package,
like this:  

~~~~text
...
unity-scope-gourmet: Gourmet
unity-scope-guayadeque: Guayadeque
unity-scope-manpages: Manpages
unity-scope-musicstores: Music store
unity-scope-musique: Musique
unity-scope-openclipart: OpenClipArt
unity-scopes-master-default: Applications
unity-scopes-master-default: Books
...
~~~~

That way you can see which lenses you'll never use and remove the
matching package (using `apt-get` or your favorite package manager).  
Of course, if you remove a package you'll lose access to all lenses inside it, so think it through!  
