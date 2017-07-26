Title: Filtering in Shell
Date: 2016-02-29 13:00
Category: FOSS
Tags: Scripts, Bash, Shell
Slug: shell-filter

Today I told someone that a feature I'm missing in Bash is filtering.  
Then I thought about how much I miss it, so I went ahead and "implemented" it.

### Filtering in other lanaugaes
Basically, I'm referring to taking a collection/stream of items, running some code on every one, and only passing on the ones that make the code evaluate to a "truthy" value.

In PowerShell:
```powershell
Some-Command | where-object {SOME_CODE_HERE} | Other-Command
```
In Ruby:
```ruby
some_command().select{SOME_CODE_HERE}.each{|i|other_command(i)}
```

In Python:
```python
collection = some_command()
collection = filter(SOME_CODE_HERE,collection)
for item in collection: other_command(item)
```

### Basic Implementation
I thought about writing a script file but settled for a function. It can be extracted and moved to a file, should it matter to anyone.

```bash
filter() {
  while read __line; do
    ! (echo "$__line" | eval $@) || echo "$__line"
  done
}
```

All of the parameters passed are evaluated in a subshell that has the function's STDIN.  
My only issue was that I wanted to avoid designating a specific replacement string for the "current item" (like `$_` in PowerShell / Perl), so I use `$(head -n1)`  
For example, this is how I can pull a list of Chef nodes and only show the ones responding to SSH:  
```bash
knife node list | filter 'ssh $(head -n1) -o ConnectTimeout=1 -o StrictHostKeyChecking=no hostname </dev/null &>/dev/null'
```
Assuming I have a test I want to run on each server in a script (e.g. does it have a problematic kernel version), I can do it like so:
```bash
#!/bin/bash
# script in /tmp/bla.sh
ssh $(head -n1) "uname -a | grep ' 2.6'" &>/dev/null
```
```bash
knife node list | filter /tmp/bla.sh
```

Also possible is actually using the internal variable:
```bash
cat /tmp/servers.txt | filter ssh '$__line' hostname '&>/dev/null'
```

### Parallel implementation
Using the wonderful `parallel` utility, I can get parallel filtering
```
filter_parallel() {
  parallel "! (echo '{}' | ($@)) || echo '{}'"
}
```
Works about the same, except that because the command is evaluated in a sub-process rather than a sub-shell, no bash functions / variables are available

I had a bet here whether this is useful to anyone. If you find that you've been missing this as well, please leave me a comment!
