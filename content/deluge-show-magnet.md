Title: Getting Magent Links from Deluge
Date: 2017-04-01 12:00
category: FOSS
Tags: Python, Scripts, BitTorrent, Deluge
Slug: deluge-show-magnet

My latest weekend-hack is a plugin that shows the magnet link for a torrent entry

## Why
I had something torrented a long time ago, and a friend asked me for the torrent.  
However, I haven't kept the original `.torrent` file, she was tech-oriented enough so I can give her the hash/trackers by hand.  
I ended up manually composing a magnet link for her, and figured "I wish this was a built-in functionality in Deluge".  

I then saw [ticket #1337](http://dev.deluge-torrent.org/ticket/1337) that asked for something like this, which was implemented using [CopyMagnetURI](http://forum.deluge-torrent.org/viewtopic.php?f=9&t=47501) plugin.  
My problem with this plugin is that it didn't work for me, and I figured interfacing with the clipboard is inherently more complicated that just displaying the link.  
I decided I'll roll my own

## Result
Check it out:
<https://github.com/BackSlasher/deluge-ShowMagnet>

![Screenshot](https://raw.githubusercontent.com/BackSlasher/deluge-ShowMagnet/master/readme/screnshot.png)

## Process
I started from copying the [Deluge Pieces Plugin](https://github.com/nicklan/Deluge-Pieces-Plugin), because it had some of the behaviour I was looking for (adding a UI element to the torrent details pane).  
I then removed all of the bits related to the pieces, and instead displayed a label that occupied the whole panel.  
I then moved to understanding how to build a magnet URI from torrent information, and added this to `core.py` to make it reusable from the WebUI, if I ever feel like it.  
After that came integration, and voilà!
