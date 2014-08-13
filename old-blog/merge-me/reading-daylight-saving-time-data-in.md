Title: Reading Daylight Saving Time Data in Windows
Date: 2013-09-04 16:48
Author: Nitzan Raz (noreply@blogger.com)
Tags: WMI, Calendar, Windows, W32tm, PowerShell, DST
Slug: reading-daylight-saving-time-data-in

When it comes to DST complexity, Israel has it worst (I think). We have
our DST definition changed on a yearly basis, and consequently we have
to repeat the DST deployment cycle (install update, check for timezone
data, test DST-sensitive resources like Outlook calendars...) twice a
year.  
Even simple users are familiar with the UI reminder for DST (when it
starts / ends) that appears about 2 weeks before the due date, and looks
something like this:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-Bwf77YNIXJQ/UiddS4pK87I/AAAAAAAAD3E/v3VGRd88SYY/s320/dstUI.jpg)](http://3.bp.blogspot.com/-Bwf77YNIXJQ/UiddS4pK87I/AAAAAAAAD3E/v3VGRd88SYY/s1600/dstUI.jpg)

</div>

The are two alternatives that are easier to script and are not
date-dependent, but they're harder to understand:  
<span style="font-size: large;">CMD - W32tm /tz</span>  
This command will give you the computer's timezone configuration,
including the DST data - the bias, beginning and en<span
style="font-size: small;">d of Standard/DST times:</span>  

<div class="separator" style="clear: both; text-align: center;">

<span style="font-size: small;"></span>

</div>

<div class="separator" style="clear: both; text-align: center;">

<span
style="font-size: small;">[![](http://4.bp.blogspot.com/-xOxCXLhuaug/UideDjTqkiI/AAAAAAAAD3M/Aa94198ko9U/s320/dstW32tm.png)](http://4.bp.blogspot.com/-xOxCXLhuaug/UideDjTqkiI/AAAAAAAAD3M/Aa94198ko9U/s1600/dstW32tm.png)</span>

</div>

<span style="font-size: large;">PowerShell - WMI</span>  
Using the class "win32\_timezone" you can get the same data (and you can
even access it remotely). Just select the relevant fields:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://4.bp.blogspot.com/-hSknniFMqiA/UidebqOc2PI/AAAAAAAAD3U/bj7iSzQwVhY/s320/dstPowerShell.png)](http://4.bp.blogspot.com/-hSknniFMqiA/UidebqOc2PI/AAAAAAAAD3U/bj7iSzQwVhY/s1600/dstPowerShell.png)

</div>

  
<span style="font-size: large;">Readability</span>  
The problem with those two methods is that the output is not trivially
understood (unlike "DST ends on XXXX/XX/XX, the clock goes back 1 hour")
After finding [this
page](http://msdn.microsoft.com/en-us/library/windows/desktop/aa394498%28v=vs.85%29.aspx)
explaining about the WMI class, I hope I can save you some effort:  

  -------------- --------------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  W32TM letter   WMI field                               Description
  M              StandardMonth / DaylightMonth           1-based-index (1=Jan,12=Dec) of the month in which the time is applied.
  DoW            StandardDayOfWeek / DaylightDayOfWeek   0-based-index (0=Sun,1=Mon,6=Sat) of the day-of-the-week in which the time is applied
  D              StandardDay / DaylightDay               The occurrence of the day-of-week in the month in which the time is applied. For example, if M=10,D=2,W=0, the time will be applied on the **second** **Sunday**of **October**. If it's M=12,D=1,W=0 then time will be applied on the **first** **Sunday** of **December.**The exception to this rule is D=5, which means the last occurrence, so M=10,D=5,W=0 means the **last** **Sunday**of **October**
  -------------- --------------------------------------- ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

And there you have it.  
FYI, the latest DST update is
[kb2863058](http://support.microsoft.com/kb/2863058)

</p>

