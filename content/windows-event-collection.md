Title: Windows Event Collection
Date: 2013-04-09 12:48
Category: Microsoft
Tags: Kerberos, Group Policy, Security, Event Log, Active Directory
Slug: windows-event-collection
OldSlug: windows-event-collection

I've recently implemented an enterprise-wide solution of event
collection in our organization, using Windows' built-in mechanism called
the [Windows Event Collector.](http://msdn.microsoft.com/en-us/library/windows/desktop/bb427443%28v=vs.85%29.aspx)  
This mechanism allows you to collect events from computers running
Windows NT5+ (XP/Server 2003 and greater) into Windows NT6+
(Vista/Server 2008 and greater) machines. The only basic rules are that
the source machine should have Winrm2 installed and running on it, and
the `Event Collector Service` should be running on the collector machine.  
There are two methods available to complete this challenge - collector
initiated and source initiated:  

| Parameter | Collector Initiated | Source Initiated |
|-----------|---------------------|------------------|
| Socket direction (for firewall rules) | Collector --> Source | Collector --> Source |
| Initiating machine | Collector | Source |
| Authentication Type | Kerberos | Kerberos / Certificates |
| Permissions used to access event log | Configurable (`system`/user) | `system` |
| Bulk adding methods | None (machines are added one by one) | Active Directory Groups (and Group Policy) | 

### Similarities

In both of the methods, some persistent open socket is created between
the collector and the source machine using WinRM (so it's firewall
friendly - one configurable port, standard HTTP messages), through which
events are transferred (as opposed to other mechanisms, which have one
machine polling another every now and then, creating a new socket during
every poll).  
The events are passing encrypted through the channel (standard WinRM
encryption, either via the Kerberos authentication or using an SSL
certificate), which makes it ideal for sensitive events (like security
ones).  
There can be several subscriptions to and from every server, each one
with its own configuration, including method, authentication, client
list and other settings (like heartbeat rate).  

### Collector Initiated

When defining such a subscription, you instruct the collector to open a
WinRM session to the source machine(s) using a specified set of
credentials (or the computer account) and ask for a subscription. The
user doesn't have to be able to read all of the event logs, but can
rather be delegated access to a specific log that needs reading (the
`NETWORK SERVICE` has to be able to read that log as well, since that's
the identity WinRM is operating with). Monitoring the connection
programmatically from the collector is quite easy, because events
related are written to the
`Microsoft-Windows-EventCollector/Operational` log.  

#### Pros:
-   Easy to configure and test
-   Easy to centrally programmatically monitor (only read collector's
    log)
-   Collector doesn't necessarily gain access to all events in source
    machine, only ones allowed by permissions on source

### Source Initiated
Using this method requires one to dabble in Group Policy, because it
works by telling the source machine(s) "You should access server X and
offer it a subscription to your event logs at leisure".  
The only settings configured at the source level are the collector
endpoints (server name, authentication type, port etc) and the maximum
amount of events per second allowed to pass through subscriptions
(offering the most basic performance throttling on the source side). All
other configuration is performed on the collector machine.  
The Collector can be configured to allow certain sources in every
subscription. Such sources can be Kerberos-Authenticated, in which case
they can be filtered by Account or Active Directory group membership
(like allowing `Domain Computers` but rejecting `Domain Controllers`),
or Certificate-Authenticated, filtered by wildcard name-matching (e.g.
including all `*.domain.com` and rejecting `*dc*.domain.com`).   

#### Pros:
-   Can be configured on arrays of machines easily
-   Can be used to collect events from machines from outside the domain

### Basic Configuration
In any case, one can use either the GUI (Event Viewer from the
collector) or the CLI (`WecUtil.exe` on the collector) to create a
subscription and fine tune it, including (but not limited to) the rate
in which new events arrive, the allowed/denied computers, destination
log and event query (which events will get transferred). Current
information about the subscription can be viewed using both tools,
whether it's the `runtime status` in the GUI or `wecutil rs` in the
CLI. I will expand this post if I see fit. Event forwarding is not
trivial, but it allows a sysadmin to centralize events for all kinds of
reasons using tools included in the Windows OS and doing so in a
standard, performance-friendly and secure way.  
  
Have fun forwarding!
