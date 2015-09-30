Title: Putting your Windows to sleep
Date: 2013-08-09 13:01
Category: Microsoft
Tags: Group Policy, Mysteries Solved, Windows, Power Management, Ramblings, Registry, Performance
Slug: putting-your-windows-to-sleep
OldSlug: putting-your-windows-to-sleep

![](|filename|/images/putting-your-windows-to-sleep/PowerZoe.jpg)

Although there are many blog posts about configuring standby ("sleep")
in Windows, each one with its own insomnia joke, I thought I'd share my
methodology .  
### `PowerCfg -energy`:  The one tool to sort it all
I only learnt about this command near the end of my testing, but it
still managed to save me a lot of work.  
Execute this command (as an administrator) when the computer is idling.
It will run for 60 seconds, profile the system and generate an HTML
report about energy-related problems.  
Some will be irrelevant for sleeping (e.g. "Processor utilization is high") but some will save you
valuable time. Try reading the report before following my guide, because
you may find some instant problem solvers.

### What is Sleep 
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

![](|filename|/images/putting-your-windows-to-sleep/PowerEnergyReport.png)

### How Sleep Works
When sleep is enabled, after the computer idles for a set time (e.g. 15
minutes), it will stop working and turn off some of its components to
save power. The user can "wake" the computer to full power in order to
resume work.  
  
### GP Settings 
There are several ways to configure Windows' sleep settings.  
Assuming you manage Windows 7+ workstations, the most convenient way is
to use the Administrative Templates found in  
`Administrative Templates > System > Power Management > Sleep Settings`.

![](|filename|/images/putting-your-windows-to-sleep/PowerSleepGP.png)

Some things to note:  

-   Some interesting settings (such as "Turn off the display") are found
    in other folders inside "Power Management".
-   "Unattended sleep" is the computer returning to sleep after being
    woken up using an automated method (like a scheduled task, magic
    packet etc.), as opposed to being woken up from user interaction,
    like a mouse move.
-   Hybrid sleep is a new-ish power saving option for laptops (or other
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

### Why Won't it Sleep
The reasons for computers not sleeping as expected are divided into 3
main categories:  

- **Windows Won't Try**  
  Try putting the computer to sleep manually, like this:

        :::bat
        %windir%\System32\rundll32.exe powrprof.dll,SetSuspendState Standby  
  If the computer still won't sleep, check if:
  
    -   Sleep is unavailable on the hardware level (really old hardware, not
        enabled on BIOS…)
    -   Sleep is disabled by GP. Check the registry key:
	
            :::registry
            HKLM\Software\Policies\Microsoft\Power\PowerSettings\abfc2519-3608-4c2a-94ea-171b0ed546ab:ACSettingIndex=1
  
- Windows is Busy  
  If the computer will sleep when manually instructed but won't sleep by
  itself, it might be busy doing something that mustn't be interrupted.  
  For example, media players will usually ask Windows not to sleep when
  they're playing.  
  Current requests can be viewed using `PowerCfg -requests` and they look a little like this:  

    ![](|filename|/images/putting-your-windows-to-sleep/PowerRequests.png)

    The usual suspect list contains media players, IM software with voice
    chat, AV software and indexing software (like google desktop).  
  
- **Windows Keeps Getting Bothered**  
    Windows allows different devices and software to wake it up from sleep.  
    For example, scheduled tasks can wake Windows up to execute:  

    ![](|filename|/images/putting-your-windows-to-sleep/PowerTask.jpg)

    Or network cards can wake up the computer, either by any incoming
    activity or a special "magic packet":  

    ![](|filename|/images/putting-your-windows-to-sleep/PowerNIC.png)

    And of course, you can usually tap your keyboard to wake your computer up:

    ![](|filename|/images/putting-your-windows-to-sleep/PowerKeyboard.png)

    Some of those devices / features may be misbehaving and keep waking
    windows up.  
    You can try:  

    -   Using this command to see which hardware devices can wake the
    computer:
	
            :::bat
	        powercfg.exe -devicequery wake_armed

    -   Using this command to see what caused the computer to wake up the
    last time:

            :::bat
            powercfg.exe /lastwake

    -   Disconnecting some devices and disabling some tasks to see if the
    computer suddenly goes to sleep


Now go get a good night's sleep.
