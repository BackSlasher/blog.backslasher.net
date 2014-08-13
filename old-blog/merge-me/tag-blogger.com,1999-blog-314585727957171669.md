Title: Setting a Primary Monitor in Ubuntu - The Static Way
Date: 2014-05-14 18:04
Author: Nitzan Raz (noreply@blogger.com)
Slug: tag:blogger.com,1999:blog-314585727957171669

I have a [dual monitor](http://en.wikipedia.org/wiki/Dual_monitor) setup
at home (actually everywhere. It's so convenient), and some applications
(e.g. XBMC, games like FTL) only work on one full screen. That's fine,
but their choosing THE WRONG SCREEN!  
Imagine having this setup:  
  

  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  [![](http://2.bp.blogspot.com/-duPhbZuYgK8/U3OmwnHQ0YI/AAAAAAAAG20/ZLpAmHoWOAw/s1600/jdmbyy.jpg)](http://2.bp.blogspot.com/-duPhbZuYgK8/U3OmwnHQ0YI/AAAAAAAAG20/ZLpAmHoWOAw/s1600/jdmbyy.jpg)
  Not mine, from [this page](http://www.hackforums.net/archive/index.php/thread-1363261-4.html)
  -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

  
  
And then having to play games and watch movies on your smaller screen.
Pretty annoying!  
I saw some solutions online involving session startup scripts etc, but I
find it incredibly ugly. I wanted a static solution based on
[X11](http://en.wikipedia.org/wiki/X11)'s configuration files, because:  

-   Scripts tend to break surprisingly
-   The scripts mostly rely on
    [lightdm](http://en.wikipedia.org/wiki/LightDM). I may switch
    lightdm to gdm, but it'll take some time until I ditch X11!

Anyway, I had some issues:  

1.  Ubuntu doesn't have 1 X11 config file (the much-referenced
    xorg.conf), but rather a config directory in
    /usr/share/X11/xorg.conf.d/
2.  Ubuntu contains no specific screen configuration (seems most of the
    resolution and location IS contained in other locations)
3.   When developing

</p>

