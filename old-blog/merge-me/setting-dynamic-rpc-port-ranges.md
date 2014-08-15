Title: Setting Dynamic RPC Port Ranges
Date: 2012-12-04 20:51
Tags: Group Policy, Firewall, Registry
Slug: setting-dynamic-rpc-port-ranges
OldSlug: setting-dynamic-rpc-port-ranges

Hi.  
We recently had to manually set the dynamic RPC port range in our
servers, mainly because Exchange 2010 sets the port range so wide that
the firewall guys (rightfully) refused to create a rule with that
range.  
<span style="font-size: large;">Warning - at your own risk!</span>  
When I found out about those settings, I stupidly tried applying these
to my entire environment, which crippled my Hyper-V cluster, for
example. So my conclusion - don't apply it to everything without testing
first!  
<span style="font-size: large;">RP-Wut?</span>  
For those of you not familiar with it, RPC ([Remote Procedure
Call](http://technet.microsoft.com/en-us/library/cc738291%28WS.10%29.aspx))
is an important part of Windows that is widely used with Microsoft and
non-Microsoft software. A feature of RPC is called dynamic RPC port
allocation, allowing server software to be allocated incoming ports
dynamically, thus avoiding port conflicts. This feature has a range of
ports to select from, and that is the "dynamic RPC port range".  
The default ranges in Windows are:  

<table style="border: 1px solid;">
<tbody>
<tr>
<th>
Windows 2003

</th>
<td>
1025-5000

</td>
</tr>
<tr>
<th>
Windows 2008+

</th>
<td>
49152-65535

</td>
</tr>
<tr>
<th>
Windows + Exchange 2010

</th>
<td>
6005-59530

</td>
</tr>
</tbody>
</table>
As you can see, passing Exchange's default port range through a firewall
is definitely not a good idea.  
  
According to [KB154596](http://support.microsoft.com/kb/154596), the 2
ways of doing so is either by using RPCCfg.exe on the server (yukk) or
by modifying the Registry.  
The quick version is:  

-   **HKLM\\Software\\Microsoft\\Rpc\\Internet (Key)**: The key that
    will contain all of the following values:
-   **Ports (REG\_MULTI\_SZ)**: A list of ports Windows is allowed to
    use for dynamic port allocation. Can be a single port (1234) or a
    range (5555-5560). Numbers should be between 0 and 65535.  
   **Note:** If you mess this part up (by entering an invalid value),
    the entire configuration becomes invalid.  
-   **PortsInternetAvailable (REG\_SZ)**: Set to 'Y' (not case
    sensitive) to make Windows use the "Ports" list as a whitelist (only
    use those ports), and 'N' to use "Ports" as a blacklist (use all
    other ports). I see no sense in setting this to 'N', but...
-   **UseInternetPorts (REG\_SZ)**: Set to 'Y'. I don't realize what
    setting 'N' would do, but I assume it won't serve our cause.

You can utilize Group Policy Preferences to deploy these settings to
several servers in one hit.  
Set these values on your machine, restart it, and you're set! Only
several remarks:   

1.  **These settings apply to the RPC *server***  
   Ports for outgoing connections from the machine will still be
    determined by the RPC server (therefore, the other machine).  
2.  **Apply ALL settings, and do it right!**  
   Make sure you're using correct values (and not some stupid mistake
    like an extra dash in the "Ports" key), because invalid
    configuration will stop the RPC server from handing any outgoing
    ports, which will severely impact many remote-related OS features
    like DCOM, remote event viewer etc.  
   For the same reason, if you're using Group Poilcy or some script to
    deploy these settings, make sure ALL of the keys are created,
    because I had an issue of missing keys that crippled both my
    clusters and my remote-management apps. It turns out that Group
    Policy Preferences doesn't create the key with the proper
    permissions, so you have to change the key permissions through
    "Policies \> Windows Settings \> Security Settings \> Registry".  
3.  **Leave enough ports**  
   Don't give RPC a range of 10 ports to play with, because you'll run
    out pretty fast. A lot of client applications use more than one
    connection, and you'll be surprised how many use RPC. I recommend
    giving *at least* 1000 ports  

  
<span style="font-size: large;">Netsh set dynamicport</span>  
I recently found out that the Netsh command "set dynamicport" mentioned
in <http://support.microsoft.com/kb/929851> does not modify the RPC
server at all, but rather changes the windows firewall exceptions.
Therefor, it's useless when using an external firewall (like we do).  
Source:
<http://social.technet.microsoft.com/Forums/en-US/winserverDS/thread/7c2aa64e-84a0-4cc3-b6e8-690bb150a735/>  
<span style="font-size: large;">Validating Configuration</span>  
I think that the best way to validate the changes is to use a sniffer to
record traffic and use remote WMI (that uses RPC) through PowerShell

1.  Prepare a test machine and a second one, and make sure the second
    machine can access the test machine in the configured ports and 135
    (the RPC port mapper)
2.  Install Network Monitor (or another sniffer) on one of the machines
    and record RPC traffic
3.  Execute the following PowerShell command from the second machine:

    ~~~~ {.brush:ps}
    gwmi win32_operatingsystem -comp TEST
    ~~~~

4.  Make sure the call executes successfully (no errors) and the
    recorded traffic is in the port range we configured earlier

  
Happy Registry-editing-without-burning-your-servers!

</p>

