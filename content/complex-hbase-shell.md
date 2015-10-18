Title: Writing Complex Scripts in HBase Shell
Date: 2015-10-18 12:00
Category: FOSS
Tags: HBase, Ruby, Java, Scripting
Slug: complex-hbase-shell

## The Story
HBase installations include a shell for running arbitrary commands.  
For instance, if you want to view all of your snapshots, you can do something like:
```text
[me@server ~]$ hbase shell
HBase Shell; enter 'help<RETURN>' for list of supported commands.
Type "exit<RETURN>" to leave the HBase Shell
Version 0.94.22, rb3b224ddca3530139c0685fd5c52e37368b428df, Fri Aug  1 20:11:17 UTC 2014

hbase(main):001:0> list_snapshots
SNAPSHOT                                             TABLE + CREATION TIME
 snapname                                            tablename (Sun Oct 18 04:31:03 +0000 2015)
 ...
35 row(s) in 0.9470 seconds
```
However, these functions are implemented in such a way that they print their output to STDOUT directly. If you wanted to create a complex script, like deleting all snapshots taken yesterday, you're out of luck:
```text
[me@server ~]$ hbase shell
HBase Shell; enter 'help<RETURN>' for list of supported commands.
Type "exit<RETURN>" to leave the HBase Shell
Version 0.94.22, rb3b224ddca3530139c0685fd5c52e37368b428df, Fri Aug  1 20:11:17 UTC 2014

hbase(main):001:0> a = list_snapshots
...
hbase(main):002:0> a.nil?
=> true
```
Until now, I accomplished things by wrapping them around in bash scripts, but this got annoying fast.  

## The Solution
I sat around to messing with the HBase source code, and found the way these functions are defined.  
I'm referencing `v0.94.22` because that's what I'm running, but the functions are similarly defined at the `master` branch too.  
This is the interesting bit of [list\_snapshots](https://github.com/apache/hbase/blob/0.94.22/src/main/ruby/shell/commands/list_snapshots.rb):
```ruby
list = admin.list_snapshot.select {|s| regex.match(s.getName)}
list.each do |snapshot|
  creation_time = Time.at(snapshot.getCreationTime() / 1000).to_s
  formatter.row([ snapshot.getName, snapshot.getTable + " (" + creation_time + ")" ])
end
```
Problem is, this `admin` variable isn't accessible from the main scope:
```text
hbase(main):010:0> admin
NameError: undefined local variable or method `admin' for #<Object:0x3faea1b0>
```
After much digging around, I found out that `admin` is accessible via `@shell.hbase_admin`, so I can do something like `@shell.hbase_admin.list_snapshot`.  
To remove a snapshot, we'll copy from [delete\_snapshot](https://github.com/apache/hbase/blob/0.94.22/src/main/ruby/shell/commands/delete_snapshot.rb), and now I have my cleanup script:
```ruby
snaps = @shell.hbase_admin.list_snapshot
snaps = snaps.select{|s| Time.now - (60*60*24) > Time.at(s.getCreationTime/1000)}
snaps.each{|s|@shell.hbase_admin.delete_snapshot(s)}
```
I can then run it using something like
```shell
/path/to/hbase shell ~/scripts/cleanup.rb
```
And all is well.
