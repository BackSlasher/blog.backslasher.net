Title: Init file for HBase Thrift Server
Date: 2015-04-29 12:00
Category: FOSS
Tags: Bash, HBase, Linux, SysVInit
Slug: thrift-init

As part of our HBase setup, we run [Thrift servers](http://wiki.apache.org/hadoop/Hbase/ThriftApi). This is pretty simple, except for the init files.  
Since we're running Thrift standalone (and not as part of a full HBase server), I couldn't find a perfect fit from googling.  
I eventually settled for [this puppet template](https://github.com/chrisglass/puppet-hadoop-modules/blob/master/modules/adobe-hbase/templates/service/hbase-thrift.erb), but it had a big deficiency - no support for `status`.

### A tiny bit about init
[SysVInit](http://en.wikipedia.org/wiki/Init) is the old-school way of managing services in Linux (and Unix).  
Every service has an "init script", located in `/etc/init.d/SERVICENAME`, which is in charge of controlling the sevice.  
It is called by using `service SERVICENAME ACTION`, where every script is free to define its own actions, but the standard ones are `start`,`stop`,`restart`,`status`.

### Why `status` matters
Using `status` is the best way of checking whether a service is alive.  
It could be a sysadmin checking for issues, Nagios making sure the service is OK, or a configuration management tool checking whether it should start the service.  
Just for fun, here is how Chef uses it. I quote from the holy repo of [Chef](https://github.com/chef/chef), file `lib/chef/provider/service/simple.rb`, verse 130:
```ruby
if shell_out("#{default_init_command} status").exitstatus == 0
  @current_resource.running true
  Chef::Log.debug("#{@new_resource} is running")
end
```
So as long as `service SERVICENAME status` exits successfully (exit code 0), Chef thinks the service is running.

### Implementing `status`
Since I'm using CentOS 6.5, my common service functions file (`/etc/init.d/functions`) is old, so it's not creating new pids (`--pidfile` only checks for an existing file, not creating a new one) and it can't rename the process (I've heard of a magical `--name` parameter, but can't find it in my file).  
Because of that, I can't find the process after starting it, so I can't make sure it's still alive.
After digging around in the HBase code, I found out that HBase keeps PID files.  
`bin/hbase-daemon.sh`:
```bash
(start)
  mkdir -p "$HBASE_PID_DIR"
  if [ -f $pid ]; then
    if kill -0 `cat $pid` > /dev/null 2>&1; then
    echo $command running as process `cat $pid`.  Stop it first.
    exit 1
  fi
fi
```
All I needed was to use this pidfile in my init script. I accomplished this by replicating the pidfile-building logic in my init script.  
It looks something like:
```bash
HBASE_PID_DIR=/var/run/
HBASE_IDENT_STRING="$HOSTNAME"
command=thrift
pid=$HBASE_PID_DIR/hbase-$HBASE_IDENT_STRING-$command.pid
```

Now I can implement the status check like so:
```bash
status)
  status -p $pid java
  RETVAL=$?
;;
```
Note that the process name is `java`. This is imperfect because the thrift process might die and another java process might take its place, but I don't find it too much of a risk for now. I might modify it later.

### The Result
[The full file](https://gist.github.com/BackSlasher/7510adb69c73dbee7894) is stored as a gist, but be warned - it's a Chef template!  
You can probably manually fill it out though.
