---
title: Investigating Repeatedly Locked Out Users
categories:
- Microsoft
tags:
  - Kerberos
  - Security
  - Mysteries Solved
  - Scripts
  - PowerShell
  - Event Log
  - Active Directory
---

I often get asked by some other IT guy "why does user XXXXX keep on
getting locked out?"  

![](/assets/investigating-repeatedly-locked-out-users/AccountLockedOut.png)

Let me clue you in on something - users (almost) always get locked out for the
same reason: They try the wrong password too many times.The reasons for
THAT, however, are quite diverse and include:  

-   People typing in the wrong password
-   Computers trying to renew TGTs with an old password (after a
    different one has been set/reset from somewhere else)
-   Some external system (SAP, VMWare SSO...) is using AD as its user
    store, and is being presented with the wrong credentials from its
    own client (a web browser, for instance)

I also recently learned that turning on `Smart card is required for interactive logon` actually scrambles the user's password as well, so
people being enforced to use smart cards are often locked out without
doing anything other than being logged in (with the now old password).  
Finding the root cause is not trivial, but I've created a small
procedure to help the helpdesk  / IT team solve such mysteries:

### 1. Start working immediately after a lockout
Unless you have some fancy enterprise event logging solution (like
SCOM's ACS or Symantec's SIM), you better act quick. Events in DCs don't
last for long, because they have limited log size and are constantly
generating new events. Considering the fact that it's easier to find
fresh events anyway, it's usually a good idea to determine when the
lockout happens (all the time, every 48 hours...), unlock the account
and start looking at logs immediately after it's locked again. Assuming
you have a functional PDC, it'll hold the latest user data, so you can
check on the user using:

~~~~powershell
Get-ADUser -Server (Get-ADDomainController -Service PrimaryDC -Discover | Select -exp
hostname) USERNAME -prop LockedOut | select name,LockedOut
~~~~

### 2. Search DC security logs for audit logon failures with that user
If you have enterprise event collection, use it.  
If you don't (or prefer the hardcore version), you have 3 ways to
filter:  

1. Filter every one of your DCs' logs with the following criteria:  

    - Logged (time): The smallest time range you can afford. I usually take 15 minutes
    - Event Logs: `Security`
    - Event Sources: `Microsoft Windows security auditing.` (this dot is actually there)
    - Task Category: `Logon, Kerberos Service Ticket Operations, Kerberos Authentication Service`
    - Keywords: `Audit Failure`

    ![](/assets/investigating-repeatedly-locked-out-users/AccountLockedOutFilter.png)

    And manually search (`Ctrl+F`) for the user name in the resulting event list

2. Filter every DC's security log with the following xml criteria:  

        :::xml
        <QueryList>
          <Query Id="0" Path="Security">
            <Select Path="Security">
        Event[
         System[
          Provider[@Name='Microsoft-Windows-Security-Auditing'] and
          ( Task = 12544 or Task = 14337 or Task = 14339 ) and
          (band(Keywords,4503599627370496)) and
          TimeCreated[timediff(@SystemTime) >= 3600000]
         ] and
         EventData[
          (Data='USERNAMEHERE')
         ]
        ]
            </Select>
          </Query>
        </QueryList>

3. Execute this script, which extracts the event from all of your
DCs, and inspect the results:

        :::powershell
        $timeBack = [timespan]'0:15:0'
        $userName = 'USERNAME'
        $msg = Get-ADDomainController -fi * | select -exp hostname | %{
        Get-WinEvent -ComputerName $_ -LogName 'Security' -FilterXPath "
        Event[
         System[
          Provider[@Name='Microsoft-Windows-Security-Auditing'] and
          ( Task = 12544 or Task = 14337 or Task = 14339 ) and
          (band(Keywords,4503599627370496)) and
          TimeCreated[timediff(@SystemTime) <= $($timeBack.TotalMilliseconds)]
         ] and
         EventData[
          (Data='$userName')
         ]
        ]" } | %{([xml]$_.toXml())}
        $msg

### 3. Analyze the failure message
After finding the message, we need to read it to decide why the computer
is locking out the user.  
It usually involves locating the following parts of the message:  

- Machine / workstation name
- Authentication failure reason: We need to know if this computer is the real culprit (providing wrong passwords) or only a harmless victim (trying to authenticate the account when it's already locked).  
    These can help:
    - [Keberos error codes](http://technet.microsoft.com/en-us/library/bb463166.aspx)
	- [NTLM error codes](http://blogs.technet.com/b/askpfeplat/archive/2013/01/28/quick-reference-troubleshooting-netlogon-error-codes.aspx)
- Logon Type - It helps to know what type of logon was attempted.  
    For example, it could be physical logon (a good old keyboard-mouse user session) or a service logon (a service with such credentials trying to start). [Here is a pretty good list](http://technet.microsoft.com/en-us/library/cc787567%28v=ws.10%29.aspx) 

With these details, we should have a good idea about the computer
responsible for the lockout

### 4. Handle offending computer
Since there are many root causes and many responses, I'll just give a
couple of ideas here, categorised by the logon type:  

- 2(`Interactive`)  
  7(`Unlock`)  
  10(`RemoteInteractive`)  
    - **A user left a session (Console/RDP) running with the wrong password**  
	  Either restart the computer, log the user off or unlock the session with fresh credentials
    - **Someone is typing the wrong password (by mistake)**  
	  Manually inform the user that [his password is incorrect](http://cdn.memegenerator.net/instances/400x/37280439.jpg) (physically / via helpdesk)
    - **Brute force is being attempted**  
      Security response team?
- 3(`Network`)  
  8(`NetworkClearText`)  
  **Non-session authentication (basic / network etc.) failing on a domain member**  
  Some server application is being provided the wrong credentials from a client (e.g. IIS using basic authentication, Windows File Server using NTLM…)  
  Open the domain member's local security log and look for authentication failures to determine the failing computer. Note the `Caller process name` field.  
  Some applications (like SAP) may record their attempts in their own log and not in Windows' event log
- 4(`Batch`)  
  5(`Service`)  
  **A service / scheduled task is using the wrong credentials to launch**  
  Find the wrong configuration and fix it. You may use the local computer's security event log
- ANY  
  **Failed authentication from a non-domain member (e.g. thin client)**  
  There isn't a lot you can do with these, because they're not domain members. Either handle them (e.g. reset the device) or block them from accessing the DC using some firewall. 

**Remember**: There are other possibilities, these are just some pointers.

Lockout pictures are from:  

-   <http://blogs.technet.com/b/askds/archive/2008/02/15/read-only-domain-controllers-and-account-lockouts.aspx>
-   <http://www.petri.co.il/add_unlock_user_option_to_dsa.htm>
-   <http://blog.strictly-software.com/2012/01/remote-desktop-access-denied-error.html>
-   <http://www.top-password.com/blog/troubleshooting-locked-out-windows-user-account/>
