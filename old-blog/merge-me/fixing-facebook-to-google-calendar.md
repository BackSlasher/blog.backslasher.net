Title: Fixing Facebook to Google Calendar synchronization
Date: 2012-03-24 17:39
Author: Nitzan Raz (noreply@blogger.com)
Tags: Mysteries Solved, Facebook, iCal, Calendar, Yii
Slug: fixing-facebook-to-google-calendar

I recently managed to sync my Facebook events to my Google Calendar (and
thusly to my Android phone). At first the task seemed simple, because
Facebook offers you a link to export your events in
[iCal](http://en.wikipedia.org/wiki/ICal) format, but once imported to
Google Calendar all you can see from the events is a "busy/free" block,
like this  

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-4tURjEWab9I/T24AqeoGfgI/AAAAAAAABJ8/OWo2ez-ic-E/s1600/busycalendar.PNG)](http://1.bp.blogspot.com/-4tURjEWab9I/T24AqeoGfgI/AAAAAAAABJ8/OWo2ez-ic-E/s1600/busycalendar.PNG)

</div>

Of course it won't do at all, as you want to be able to see all of the
event details!  
After some fiddling (with [Fiddler](http://fiddler2.com/)) I saw that
the iCal events had a field called "CLASS", which was set to "PRIVATE"
on all of my Facebook events.  
  
Facebook is probably using that field to signify which events are public
and which are invite-only, like mine where.  

<div style="text-align: center;">

[![](http://4.bp.blogspot.com/-758ofqEnBwc/T24BqMM1wpI/AAAAAAAABKE/wkSjdSBvYxE/s1600/inviteOnly.PNG) ](http://4.bp.blogspot.com/-758ofqEnBwc/T24BqMM1wpI/AAAAAAAABKE/wkSjdSBvYxE/s1600/inviteOnly.PNG)

</div>

<div style="text-align: left;">

Google Calendar must be interpreting the "private" as an event which is
sensitive and cannot be fully shown - only the "busy/free" field.

</div>

<div style="text-align: left;">

  

</div>

<div style="text-align: left;">

I didn't have the intention to find which one is using this field
"correctly", but something had to be done. After editing the iCal with
notepad and modifying this field to "PUBLIC", the events showed up fine,
So I knew what I had to do.

</div>

<div style="text-align: left;">

  

</div>

<div style="text-align: left;">

I created another Yii application called
"[eventFix](http://apps.oneboredadmin.com/eventFix/)" that helps users
feed their Facebook events url and get a proxy url - one that goes
through my application which replaces all instances of "CLASS:PRIVATE"
to "CLASS:PUBLIC". I'm using it already!

</div>

<div style="text-align: left;">

If you're worried about me sniffing your precious events, I can probably
tell you that I don't really care / have the db space for that. But if
you're uncomfortable using this applications for that reason, don't.

</div>

<div style="text-align: left;">

  

</div>

<div style="text-align: left;">

I'm sure other people have encountered the same problem and came up with
their own solutions, and I'm sure some of those are better than mine. I
don't care, I did it for the practice.

</div>

<div style="text-align: left;">

  

</div>

<div style="text-align: left;">

Have fun syncing!

</div>

</p>

