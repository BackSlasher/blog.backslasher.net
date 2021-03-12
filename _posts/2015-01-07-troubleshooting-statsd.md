---
title: Troubleshooting StatsD
categories:
- FOSS
tags:
  - Troubleshooting
  - Networking
  - Linux
  - StatsD
---

### About StatsD
[StatsD](https://github.com/etsy/statsd/) is a tool developed by Etsy and Flickr (complicated story).  
Its main use is providing a middleman for [Graphite](http://graphite.wikidot.com/), which is a real-time graphing tool, mainly used for performance metrics.  
Thanks to StatsD, I can use TCP sockets between servers (guaranteeing packet delivery), while processes generating the data-points are using a localhost UDP socket (minimal overhead without losing packets), freeing them to do some real work.  
Sometimes, things don't work.

### Basic Troubleshooting
I don't claim to be an expert on StatsD, but I didn't find a good post about troubleshooting, so I thought I'll list some of my methods.
I assume the problem we're investigating is the most common and elusive of all: **Data sent to StatsD isn't showing up on Graphite**

#### Send some Spam
Try sending some data to both StatsD and Graphite and see what sticks:
```bash
GRAPHITE_SERVER=
GRAPHITE_CARBON_PORT=
GRAPHITE_WEBUI_PORT=
STATSD_SERVER=
STATSD_PORT=
TEST_STRING=test.back.slash

# Send to Graphite
echo "test.back.slash 4 `date +%s`" | nc -C ${GRAPHITE_SERVER} ${GRAPHITE_CARBON_PORT}

# Test
curl "http://${GRAPHITE_SERVER}:${GRAPHITE_WEBUI_PORT}/render/?target=${TEST_STRING}&from=-60sec&format=json"

# Send to StatsD
echo 'test.back.slash:1|c' | nc -C -w1 -u ${STATSD_SERVER} ${STATSD_PORT}

# Test
curl "http://${GRAPHITE_SERVER}:${GRAPHITE_WEBUI_PORT}/render/?target=stats.gauges.${TEST_STRING}&from=-60sec&format=json"
```

#### Redirect to Console
First, modify your StatsD configuration file to add the console backend (something like  `backends: ["./backends/graphite", "./backends/console"]`).  
Then start StatsD (like `node /usr/local/statsd/stats.js /your/config.js`), and watch the output. Check if your data is there.

#### Debug
Modify the StatsD configuration file to contain `debug: true`, and see if you get some interesting output in `stderr`.

#### Dump
This might seem like a last-ditch effort, but you can always use `tcpdump` to record interesting traffic.  
I use something like:
```bash
sudo tcpdump -i any -w statsd-ts.dump "(port $GRAPHITE_CARBON_PORT) or (port $STATSD_PORT)"
```
Using this dump you can try and see if something's fishy.  
Since both StatsD and Graphite use packets that contain readable text, I use this combo to parse all textual data in ruby.  
It's not perfect, but it works.
```ruby
`tshark -r #{filename} -T fields -e data.data`.split("\n").join(':').split(":").map{|m|m.hex.chr}.join.split("\n")[1..-2].map{|x|arr=x.split(' ');{'stat'=>arr[0],'val'=>arr[1],'time'=>arr[2].to_i}}
```
