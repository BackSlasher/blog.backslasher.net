Title: Network Monitor capture filter limitations
Date: 2013-08-30 09:11
Category: Microsoft
Tags: TCP, Mysteries Solved, Firewall, Network Monitor
Slug: network-monitor-capture-filter-limitations
OldSlug: network-monitor-capture-filter

I recently had to deal with some network traffic issues, so naturally I turned to NetMon.  
My problem was with some TCP packets not reaching their destination.  
Since TCP has packet acknowledgements (meaning the receiving end says "packet received" or the packet is sent again), the issue was detectable as "retransmits" on the sending side.  
While some retransmits are acceptable, I had an unreasonable amount of these.  

![](|filename|/images/network-monitor-capture-filter/NetMonRetransmit.png)  
This is a `SynRetransmit` (and not `TCPRetransmit`) because it's easier to recreate, but the idea is the same.

Filtering for retransmits can be done using "Property.TCPRetransmit" or
"Property.TCPSynRetransmit" (depending on what you're looking for):  
![](|filename|/images/network-monitor-capture-filter/NetMonFilter.png)  

As any NetMon novice knows, there are two filters you can use during a
capture:

- **Capture Filter**, affecting the packets being collected and parsed into NetMon
- **Display Filter**, controlling which collected packets are presented on screen


After learning the difference, it's common sense that as much filtering as possible should be done using the capture filter, to save NetMon the job of collecting and parsing unneeded packets. So I spent 30 minutes trying to understand why filtering for `TCPRetransmit`s using the capture filter yielded no packets whatsoever.  
Eventually, after reading up on `TCPRetransmit`s and the way NetMon parses them (file `tcp.npl`, around row 239), I realised:  

![](|filename|/images/network-monitor-capture-filter/NetMonTCPDefinition.png)

The retransmits have no special identifying property - NetMon just looks for previous packets in the conversation that have the same sequence number, so if it doesn't capture the original packet, it has nothing to compare the sequence number to, so it won't find the retransmits as well.  
###To sum up:
You can't detect retransmits using the capture filter. You should use the capture filter to narrow the packet options using other properties (like `IPv4.Address`) and filter for retransmits only using the display filter.
