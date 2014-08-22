Title: Solving Event Log Subscription Error "0x138C"
Date: 2013-04-09 13:06
Category: Microsoft
Tags: Security, WinRM, Registry, Event Log
Slug: solving-event-log-subscription-error
OldSlug: solving-event-log-subscription-error

Today I saw some collector-initiated event log subscriptions that
displayed a weird error, something like  
~~~text
Windows Event Forward plugin can't read any event from the query since the query returns no active channel. Please check channels in the query and make sure they exist and you have access to them.
~~~
The reason for this message is that WinRM can't read the event log.  
If you haven't read my [long post about Event
Forwarding](windows-event-collection.html),
you should.  
The main point is that the WinRM service doesn't perform any
impersonation while reading the events. Instead, it reads the logs using
it's own security context and then verifies the client's permissions (if
there are any).  
Default Windows permissions grant `Network Service` or similar
principals (e.g. `SERVICE`) read access to all of the event logs, but
I've encountered software that modifies those permissions. Although it's
icky, you can view your current event log permissions using the command
line:  
~~~bat
wevtutil gl LOGNAME
~~~
Look for `channelAccess`. You can repair them if necessary (carefully).
You can also manually modify them [using registry](http://blog.oneboredadmin.com/2011/01/event-log-permissions-with-scripts.html).
Remember that you have to reboot the machine for those permissions to
apply.
