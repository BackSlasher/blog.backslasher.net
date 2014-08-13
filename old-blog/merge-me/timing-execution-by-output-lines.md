Title: Timing Execution By Output Lines
Date: 2014-06-22 12:12
Author: Nitzan Raz (noreply@blogger.com)
Tags: Programming, Perl, Scripts, Linux, One-Liner, Bash
Slug: timing-execution-by-output-lines

<p>
<span style="font-size: x-large;">The Story</span>  
Today I got annoyed that some puppet agent runs took me over 90 seconds
to complete, even though they actually did nothing (no change was
needed).  
I wanted to see which part of the run took the longest, so I tried this:
  

~~~~ {.prettyprint}
sudo puppet agent --test --debug
~~~~

Unfortunately, I don't have the ability to follow the terminal for 90
seconds with full attention, so the only thing I recognized was small
bursts of text:  

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  [![](http://4.bp.blogspot.com/-dYhGne2cBbE/U5BXn8uX09I/AAAAAAAAIWI/Lj55d97lVWw/s1600/can-you-follow.png)](http://4.bp.blogspot.com/-dYhGne2cBbE/U5BXn8uX09I/AAAAAAAAIWI/Lj55d97lVWw/s1600/can-you-follow.png)
  Can you follow?
  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

I wished puppet's output would have timestamps, but there's no such
feature.  
Luckily, I have scripting!<a name="more"></a>  
I wanted the solution to be a one-liner (and not a file to be executed)
to keep it portable (as in not having to copy the file to every server).
I considered using awk, python or bash loops, but ended up using perl
because... it gave me the best functionality to code ratio :)   

  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  [![](http://1.bp.blogspot.com/-xclhj8_ItqU/U5BgaS0Su-I/AAAAAAAAIWY/4U_qoscjTQQ/s1600/much-better.png)](http://1.bp.blogspot.com/-xclhj8_ItqU/U5BgaS0Su-I/AAAAAAAAIWY/4U_qoscjTQQ/s1600/much-better.png)
  Now we know how long each line took
  ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<span style="font-size: x-large;">The Script</span>  
I use this code to simulate a real application:   

~~~~ {.prettyprint}
(sleep 2;echo 'a';sleep 2;echo 'err' 1>&2;echo 'b';echo 'c')
~~~~

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-9f3qyyesWm4/U5BmoInQnCI/AAAAAAAAIWo/ZyjwMj6qtxs/s1600/timing-1.png)](http://2.bp.blogspot.com/-9f3qyyesWm4/U5BmoInQnCI/AAAAAAAAIWo/ZyjwMj6qtxs/s1600/timing-1.png)

</div>

My one-liner will prepend to each line the seconds passed since the
script's start. That way, if you see a large number gap between two
lines, you can probably tell what's wasting your time.   

~~~~ {.prettyprint}
YOURCODEHERE | perl -e '$b=time();while (<stdin>) {print ((time()-$b)," $_")};'
~~~~

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-xMLltt5V5SI/U5BnIJreO-I/AAAAAAAAIWw/T_4jeaqxHwI/s1600/timing-2.png)](http://3.bp.blogspot.com/-xMLltt5V5SI/U5BnIJreO-I/AAAAAAAAIWw/T_4jeaqxHwI/s1600/timing-2.png)

</div>

**Possible tweaks:**  
Consider using |& instead of  | to pipeline errors (STDERR) too -
sometime they're more informative than the standard output, like this:   

~~~~ {.prettyprint}
YOURCODEHERE |& perl -e '$b=time();while (<stdin>) {print ((time()-$b)," $_")};'
~~~~

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-ngIhf10rM3s/U5BnqqbLQWI/AAAAAAAAIW4/SaxGZ8NYQ2o/s1600/timing-3.png)](http://3.bp.blogspot.com/-ngIhf10rM3s/U5BnqqbLQWI/AAAAAAAAIW4/SaxGZ8NYQ2o/s1600/timing-3.png)

</div>

I really wanted the time measured from the script's start, and not the
computer local time. If you'd rather have that, try something like:   

~~~~ {.prettyprint}
YOURCODEHERE | perl -e 'while (<stdin>) {print ((scalar localtime())," $_")};'
~~~~

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-ulgE_FBwpso/U5BnvRK_a8I/AAAAAAAAIXA/LONxOoSDwQY/s1600/timing-4.png)](http://2.bp.blogspot.com/-ulgE_FBwpso/U5BnvRK_a8I/AAAAAAAAIXA/LONxOoSDwQY/s1600/timing-4.png)

</div>

  
By the way, puppet's run took so long due to some SQL queries being run
as part of the puppetdb class.

</p>

