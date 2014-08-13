Title: Remotely changing DNS server list through registry
Date: 2013-06-21 09:51
Author: Nitzan Raz (noreply@blogger.com)
Tags: Kerberos, DNS, Mysteries Solved, Exchange, Registry, Active Directory
Slug: remotely-changing-dns-server-list

Recently I was called to help some some friends who had an unusual
problem:  
They demoted an old DC because they needed to raise the domain
functional level, and after doing so many of their servers stopped
working - they wouldn't allow remote logins, the Exchange services
wouldn't start, while showing this message when trying to connect:  
"There are currently no logon servers available to service the logon
request."  

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-jpoQ8zQJRkQ/UcQWEXNKGfI/AAAAAAAADks/zzhh6VuZeT4/s320/NoLogonServers.gif)](http://2.bp.blogspot.com/-jpoQ8zQJRkQ/UcQWEXNKGfI/AAAAAAAADks/zzhh6VuZeT4/s1600/NoLogonServers.gif)

</div>

  
We quickly realized the issue - these servers had a static list of DNS
servers configured. The list was out of date, and the only working
server was the one they demoted.  
Connection to AD requires a working DNS server, because the first step
in locating a DC is querying DNS for *\_ldap.\_tcp.DOMAIN*.   
We had some ideas that would normally work, but not this time:  

1.  **Repromote the old DC** - Functional level has already been raised,
    so we couldn't just run it through DCPromo again.
2.  **Crate a cache-only DNS server** - the server was expected to be
    rebooted and generally unavailable for the following week, so we
    couldn't rely on it to be available.
3.  **Create a new DC and steal the old DC's IP** - some application was
    running on the old DC and needed its IP.

Eventually we realized something interesting - although the server
couldn't authenticate to the DCs (because of the non-functional DNS),
connections **to the server**worked fine, because Kerberos ticket
validation happens locally. Therefore, we used *regedit*to remotely
connect to the servers and give them new DNS server addresses.  

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-YkQM2r-QGMY/UcQd7ZQWzOI/AAAAAAAADk8/MsiBm9KvbEw/s320/RemoteRegedit.png)](http://2.bp.blogspot.com/-YkQM2r-QGMY/UcQd7ZQWzOI/AAAAAAAADk8/MsiBm9KvbEw/s1600/RemoteRegedit.png)

</div>

The configuration for network adapters can be found under:  
"HKEY\_LOCAL\_MACHINE\\SYSTEM\\CurrentControlSet\\Services\\Tcpip\\Parameters\\Interfaces\\{DEVICEGUID}"  

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-rDinJnINCPw/UcQftTv2zHI/AAAAAAAADlM/lsJyjXDuDHQ/s320/TCPRegistry.png)](http://1.bp.blogspot.com/-rDinJnINCPw/UcQftTv2zHI/AAAAAAAADlM/lsJyjXDuDHQ/s1600/TCPRegistry.png)

</div>

If you have more than one NIC, just choose the key with the value
"NameServer" already configured. Replace "NameServer" with a
comma-separated list of your DNS servers, and reboot (using shutdown
-m).  
  
That's it!

</p>

