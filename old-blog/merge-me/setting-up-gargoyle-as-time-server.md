Title: Setting up Gargoyle as a Time Server
Date: 2014-06-22 12:12
Author: Nitzan Raz (noreply@blogger.com)
Tags: Mysteries Solved, Gargoyle, Linux, Raspberry Pi, Debian, raspberrySeed, NTP
Slug: setting-up-gargoyle-as-time-server

<span style="font-size: x-large;">The Story</span>   
For reasons unknown to me, Debian's NTP daemon only works on udp port
123, even when operating as a client.  
This is a problem because my network configuration does not allow
incoming packets on this port, thus preventing my raspberrySeed
(raspberry pi running Debian, deluge, flexget) from syncing, causing it
to slowly drift away from the real world.  
To solve the issue, I did two things:  
<span style="font-size: x-large;">The Solution</span>   
<span style="font-size: large;">1. Turn Gargoyle into an NTP
server</span>  
Since Gargoyle is already syncing from outside, I only had to tell it to
act as a server.  
First, ssh into your gargoyle setup.  
Edit the file "/etc/config/system", and under "timeserver", change the
option "enable\_server" to 1.  

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-Uk-0iMNLIGc/U5iOmOlWvYI/AAAAAAAAIZU/O2lzkOsZVpQ/s1600/gargoyle-time-settings.png)](http://3.bp.blogspot.com/-Uk-0iMNLIGc/U5iOmOlWvYI/AAAAAAAAIZU/O2lzkOsZVpQ/s1600/gargoyle-time-settings.png)

</div>

<a name="more"></a>  
After editing the file, restart the service using   

~~~~ {.prettyprint}
/etc/init.d/sysntpd restart
~~~~

And ensure the argument "-l" was added to the ntp daemon command line,
using this code:   

~~~~ {.prettyprint}
ps | grep ntp
~~~~

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-xn4yhaENix8/U5iQBJ4RmnI/AAAAAAAAIZc/vvxuvidPovY/s1600/gargoyle-ntp-working.png)](http://3.bp.blogspot.com/-xn4yhaENix8/U5iQBJ4RmnI/AAAAAAAAIZc/vvxuvidPovY/s1600/gargoyle-ntp-working.png)

</div>

<span style="font-size: large;">2. Tell debian to ask Gargoyle:</span>  
ssh to your debian machine, and edit the file "/etc/ntp.conf".  
Comment out all of the server entires, and only leave one pointing to
the name/IP address of Gargoyle:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-OORJpVNMcfs/U5iSy3v7HpI/AAAAAAAAIZo/RySQyz99sJo/s1600/debian-ntp-config.png)](http://1.bp.blogspot.com/-OORJpVNMcfs/U5iSy3v7HpI/AAAAAAAAIZo/RySQyz99sJo/s1600/debian-ntp-config.png)

</div>

After that, restart the ntp daemon by running   

~~~~ {.prettyprint}
sudo service ntp restart
~~~~

Wait a couple of minutes and use this to test everything is OK:   

~~~~ {.prettyprint}
ntpq -p
~~~~

You should see one entry for your Gargoyle router, with the other fields
making sense (not all zeroes):  

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-Fg3sI2RVsVE/U5iUDmQ4r7I/AAAAAAAAIZ0/Zph5LLSTeAk/s1600/debian-time-ok.png)](http://1.bp.blogspot.com/-Fg3sI2RVsVE/U5iUDmQ4r7I/AAAAAAAAIZ0/Zph5LLSTeAk/s1600/debian-time-ok.png)

</div>

  
Enjoy your new time configuration!

</p>

