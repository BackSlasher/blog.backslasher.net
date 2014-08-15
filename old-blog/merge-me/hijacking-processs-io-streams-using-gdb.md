Title: Hijacking a process's i/o streams using gdb
Date: 2014-06-22 12:13
Author: Nitzan Raz (noreply@blogger.com)
Tags: Scripts, Linux, gdb, Debugging, Bash
Slug: hijacking-processs-io-streams-using-gdb
OldSlug: hijacking-processs-io-streams-using-gdb

<p>
<span style="font-size: x-large;">The Story</span>  
I recently had a very annoying problem - some daemon failed, but ran
fine when told to run at foreground (not daemonize). Running at
foreground is the easiest way to debug processes, because that way you
get their input / output / error streams in your terminal.  
Said daemon had no "log to file" option as well, so the only indication
I had that something was wrong is that the daemon didn't do what it's
supposed to do.  
  
When processes daemonize, they create a sub process that isn't attached
to anything (so it won't be affected by the terminal closing, for
instance).  
The originating process usually exists after creating the sub process,
and so you can't easily capture the output of the sub process.  
  
I eventually realized that I need to "hijack" the stderr stream from the
sub process. I did some stupid attempts, like this (NOT WORKING):

~~~~ {.prettyprint}
tail -f /proc/$(pidof $DAEMON)/ld/2
~~~~

Eventually I wrote something using strace, which was
OK:<a name="more"></a>

~~~~ {.prettyprint}
sudo strace -ff -p $(pidof $DAEMON) -e write=1,2 -s 1024 2>&1 | grep "^ |"
~~~~

<div class="separator" style="clear: both; text-align: center;">

[![](http://4.bp.blogspot.com/-bQpkvwymFNo/U4WiPWWv_bI/AAAAAAAAITQ/rl2xXl_4B2M/s1600/strace-ok-solution.png)](http://4.bp.blogspot.com/-bQpkvwymFNo/U4WiPWWv_bI/AAAAAAAAITQ/rl2xXl_4B2M/s1600/strace-ok-solution.png)

</div>

  
It gave me the output I wanted, and I solved my issue (which was me
passing relative file locations, inaccessible to the sub process created
because it doesn't inherit the parent's working directory). However, I
wanted something more elegant. I found the commands in [this
post](http://gcolpart.evolix.net/blog21/capture-inputoutput-of-a-process-with-gdb/),
which did something better - given a pid, they redirect its input,
output and error streams to some tty (terminal), giving you control over
the process.  
However, it wasn't a fire-and forget script. I tried to fix that :-)  
  
<span style="font-size: x-large;">The Solution</span>  
My script will hook the process to your current terminal.  
**Please note:** I don't think it's a good idea to leave the hijacked
daemon running after finishing troubleshooting. You should probably
restart it.

~~~~ {.prettyprint}
DAEMON=afuseMYT=$(tty)sudo gdb -p $(pidof $DAEMON) <<EOFcall close(0)call close(1)call close(2)call open("$MYT", 2, 0)call dup(0)call dup(0)detachEOF
~~~~

Notice the output - much better:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-Dm0CSmhdUP0/U4WipRYJlHI/AAAAAAAAITY/VZ-5Aq1dHQU/s1600/gdb-great-solution.png)](http://2.bp.blogspot.com/-Dm0CSmhdUP0/U4WipRYJlHI/AAAAAAAAITY/VZ-5Aq1dHQU/s1600/gdb-great-solution.png)

</div>

The way the script works is this:  
First, it uses tty to find the path to the current terminal.  
gdb is then called to close streams 0,1,2 (which are almost always
stdin, stdout, stderr) and open a new stream to the tty found before.
The new stream opens at index 0 (because it's the lowest index
available, since we just closed 0,1,2) and copies it to 1 and 2 as well.
Now stdin, stdout and stderr are all mapped to the current terminal -
success!

</p>

