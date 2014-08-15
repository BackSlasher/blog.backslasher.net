Title: Putting your Windows to sleep
Date: 2013-08-10 13:01
Author: Nitzan Raz (noreply@blogger.com)
Tags: Group Policy, Mysteries Solved, Windows, Power Management, Ramblings, Registry, Performance
Slug: putting-your-windows-to-sleep
OldSlug: putting-your-windows-to-sleep

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  [![](http://4.bp.blogspot.com/-8PyZINszJyU/UgQHOqnHl2I/AAAAAAAADzQ/eilcSG-5EPE/s320/PowerZoe.jpg)](http://4.bp.blogspot.com/-8PyZINszJyU/UgQHOqnHl2I/AAAAAAAADzQ/eilcSG-5EPE/s1600/PowerZoe.jpg)
  My dog trying to sleep
  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

Although there are many blog posts about configuring standby ("sleep")
in Windows, each one with its own insomnia joke, I thought I'd share my
methodology .  
<span style="font-size: large;">PowerCfg -energy:  The one tool to sort
it all</span>  
I only learnt about this command near the end of my testing, but it
still managed to save me a lot of work.  
Execute this command (as an administrator) when the computer is idling.
It will run for 60 seconds, profile the system and generate an HTML
report about energy-related problems. Some will be irrelevant for
sleeping (e.g. "Processor utilization is high") but some will save you
valuable time. Try reading the report before following my guide, because
you may find some instant problem solvers.  
<span style="font-size: large;">What is Sleep</span>  
Microsoft defines in this article 6 sleeping states - S0 to S5  
<http://msdn.microsoft.com/en-us/library/windows/hardware/ff564575%28v=vs.85%29.aspx>  
**S0** is a fully working computer.  
**S1**..**S3** are standby states, in which some parts of the computer
are turned off to conserve power but resuming to S0 is relatively quick
(2-30sec). These states differ by how many parts are shut down - in S1
only the processor clock and buses are shut down, and in S3 the entire
processor and some parts of the motherboard are shut down.  
**S4** is hibernation - the computer is shut down, but the operating
system context (memory, running services etc.) is saved to the
hibernation file. When the computer is turned on, the operating system
detects that it has been hibernated and loads its context from the
hibernation file instead of starting fresh  
**S5** is shutting the computer down completely.  
When people refer to sleeping, they usually refer to S3.  
You can see in the energy report which states are supported:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-OSB82_6I5a8/UgQFMVjJ2JI/AAAAAAAADyg/SwmTSI9ekJw/s320/PowerEnergyReport.png)](http://2.bp.blogspot.com/-OSB82_6I5a8/UgQFMVjJ2JI/AAAAAAAADyg/SwmTSI9ekJw/s1600/PowerEnergyReport.png)

</div>

<span style="font-size: large;">How Sleep Works</span>  
When sleep is enabled, after the computer idles for a set time (e.g. 15
minutes), it will stop working and turn off some of its components to
save power. The user can "wake" the computer to full power in order to
resume work.  
  
<span style="font-size: large;">GP Settings</span>  
There are several ways to configure Windows' sleep settings.  
Assuming you manage Windows 7+ workstations, the most convenient way is
to use the Administrative Templates found in  
    Administrative Templates \> System \> Power Management \> Sleep
Settings.  

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-zeBiccZ4JY0/UgQFBNKnmaI/AAAAAAAADyY/MIGxk4kZ1XY/s320/PowerSleepGP.png)](http://2.bp.blogspot.com/-zeBiccZ4JY0/UgQFBNKnmaI/AAAAAAAADyY/MIGxk4kZ1XY/s1600/PowerSleepGP.png)

</div>

Some things to note:  

-   Some interesting settings (such as "Turn off the display") are found
    in other folders inside "Power Management".
-   "Unattended sleep" is the computer returning to sleep after being
    woken up using an automated method (like a scheduled task, magic
    packet etc.), as opposed to being woken up from user interaction,
    like a mouse move.
-   Hybrid sleep a new-ish power saving option for laptops (or other
    battery-equipped computers). The computer turns off the screen
    immediately while creating a hibernation file. After creating the
    file, it goes to standby (instead of shutting down like normal S4).
    If the computer doesn't lose power, it will resume quickly from
    standby. If it does, it will resume from the hibernation file.
-   Disabling "Allow standby states (S1-S3) when sleeping" will prevent
    the computer from sleeping. UI options for sleep will disappear (as
    if the computer didn't have that capability) and sleeping through
    command line (see ahead) will cause the computer to hibernate
    instead.

<span style="font-size: large;">Why Won't it Sleep</span>  
The reasons for computers not sleeping as expected are divided into 3
main categories:  
<u>Windows Won't Try</u>  
Try putting the computer to sleep manually, like this:  
%windir%\\System32\\rundll32.exe powrprof.dll,SetSuspendState Standby  
If the computer still won't sleep, check if:   

-   Sleep is unavailable on the hardware level (really old hardware, not
    enabled on BIOS…)
-   Sleep is disabled by GP. Check the registry key:

HKLM\\Software\\Policies\\Microsoft\\Power\\PowerSettings\\abfc2519-3608-4c2a-94ea-171b0ed546ab:ACSettingIndex=1  
  
<u>Windows is Busy</u>  
If the computer will sleep when manually instructed but won't sleep by
itself, it might be busy doing something that mustn't be interrupted.  
For example, media players will usually ask Windows not to sleep when
they're playing.  
Current requests can be viewed using  
PowerCfg -requests  
And they look a little like this:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-tmiKuCAo8fU/UgQFV2JWGZI/AAAAAAAADyo/V1_5Cz6t5JY/s320/PowerRequests.png)](http://1.bp.blogspot.com/-tmiKuCAo8fU/UgQFV2JWGZI/AAAAAAAADyo/V1_5Cz6t5JY/s1600/PowerRequests.png)

</div>

The usual suspect list contains media players, IM software with voice
chat, AV software and indexing software (like google desktop).  
  
<u>Windows Keeps Getting Bothered</u>  
Windows allows different devices and software to wake it up from sleep.  
For example, scheduled tasks can wake Windows up to execute:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-s3K5kUChMfs/UgQFiKPJyrI/AAAAAAAADyw/PA9kRFWuCnw/s320/PowerTask.jpg)](http://3.bp.blogspot.com/-s3K5kUChMfs/UgQFiKPJyrI/AAAAAAAADyw/PA9kRFWuCnw/s1600/PowerTask.jpg)

</div>

Or network cards can wake up the computer, either by any incoming
activity or a special "magic packet":  

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-wERC8Eakcy8/UgQFvcvPY0I/AAAAAAAADy4/FAbAIkuzSx4/s320/PowerNIC.png)](http://3.bp.blogspot.com/-wERC8Eakcy8/UgQFvcvPY0I/AAAAAAAADy4/FAbAIkuzSx4/s1600/PowerNIC.png)

</div>

And of course, you can usually tap your keyboard to wake your computer
up:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-_6b1_Hy7VL8/UgQF1aaTXoI/AAAAAAAADzA/Tm0lFpyacrU/s320/PowerKeyboard.png)](http://2.bp.blogspot.com/-_6b1_Hy7VL8/UgQF1aaTXoI/AAAAAAAADzA/Tm0lFpyacrU/s1600/PowerKeyboard.png)

</div>

Some of those devices / features may be misbehaving and keep waking
windows up.  
You can try:  

-   Using this command to see which hardware devices can wake the
    computer:

powercfg.exe -devicequery wake\_armed  

-   Using this command to see what caused the computer to wake up the
    last time:

powercfg.exe /lastwake  

-   Disconnecting some devices and disabling some tasks to see if the
    computer suddenly goes to sleep

Now go get a good night's sleep.

</p>

