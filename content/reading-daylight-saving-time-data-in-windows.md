Title: Reading Daylight Saving Time Data in Windows
Date: 2013-09-04 16:48
Category: Microsoft
Tags: WMI, Calendar, Windows, W32tm, PowerShell, DST
Slug: reading-daylight-saving-time-data-in-windows
OldSlug: reading-daylight-saving-time-data-in

When it comes to DST complexity, Israel has it worst (I think). We have
our DST definition changed on a yearly basis, and consequently we have
to repeat the DST deployment cycle (install update, check for timezone
data, test DST-sensitive resources like Outlook calendars...) twice a
year.  
Even simple users are familiar with the UI reminder for DST (when it
starts / ends) that appears about 2 weeks before the due date, and looks
something like this:  

![](|filename|/images/reading-daylight-saving-time-data-in-windows/dstUI.jpg)

There are two alternatives that are easier to script and are not
date-dependent, but they're harder to understand:  

#### CMD - `W32tm /tz`
This command will give you the computer's timezone configuration,
including the DST data - the bias, beginning and end of Standard/DST times:

![](|filename|/images/reading-daylight-saving-time-data-in-windows/dstW32tm.png)

#### PowerShell - WMI
Using the class `win32_timezone` you can get the same data (and you can
even access it remotely). Just select the relevant fields:  

![](|filename|/images/reading-daylight-saving-time-data-in-windows/dstPowerShell.png)
  
### Readability
The problem with those two methods is that the output is not trivially
understood (unlike "DST ends on XXXX/XX/XX, the clock goes back 1 hour")
After finding [this page](http://msdn.microsoft.com/en-us/library/windows/desktop/aa394498%28v=vs.85%29.aspx)
explaining about the WMI class, I hope I can save you some effort:  

| w32tm letter | WMI field                     | Description |
|--------------|-------------------------------|-------------|
| M            | StandardMonth / DaylightMonth | 1-based-index (1=Jan,12=Dec) of the month in which the time is applied. |
| DoW          | StandardDayOfWeek / DaylightDayOfWeek | 0-based-index (0=Sun,1=Mon,6=Sat) of the day-of-the-week in which the time is applied |
| D            | StandardDay / DaylightDay | The occurrence of the day-of-week in the month in which the time is applied.<br/>`5` is the last instance. | 

#### Examples
If `M=10,D=2,W=0`, the time will be applied on the **second** **Sunday**  of **October**.  
If `M=12,D=1,W=0` then time will be applied on the **first** **Sunday** of **December.**  
If `M=10,D=5,W=0` means the **last** **Sunday** of **October**

And there you have it.  
FYI, the latest DST update is [kb2863058](http://support.microsoft.com/kb/2863058)
