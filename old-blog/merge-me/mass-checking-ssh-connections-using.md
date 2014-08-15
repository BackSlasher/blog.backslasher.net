Title: Mass-Checking SSH Connections using Parallel
Date: 2014-04-13 12:23
Tags: Scripts, SSH, One-Liner, Bash
Slug: mass-checking-ssh-connections-using
OldSlug: mass-checking-ssh-connections-using

<p>
Today I wanted to make sure I have SSH access to about 100 servers.  
Obviously, I wasn't going to verify the list by hand, so I put all of
the servers' names in a file, and wrote this little script:  

~~~~ {.prettyprint}
for NAME in $(cat ~/Desktop/server-names)do        echo -n "$NAME "        ssh -o "StrictHostKeyChecking no" -o "BatchMode yes" $NAME "echo a" &>/dev/null        if [ $? -eq 0 ]; then                echo "OK"        else                echo "BAD"        fidone
~~~~

Note the SSH executes the command "echo a", because otherwise it'll run
interactively. Also, note the options "StrictHostKeyChecking no",
meaning it will accept new host fingerprints without asking, and
"BatchMode yes", meaning it will not prompt for a password (only try my
SSH key).  
This script will print a list of results such as:  
  
server1 OK  
server2 BAD  
server3 OK  
server4 OK  
  
Which you can save in a file, and then view all of the bad servers using
something like:  

~~~~ {.prettyprint}
cat ssh-test-results | grep "BAD$" | awk '{print $1}'
~~~~

Problem was, I didn't like the script checking only one server at a
time, so I parallelized it:  

~~~~ {.prettyprint}
parallel 'echo -n "{} ";ssh -o StrictHostKeyChecking=no -o BatchMode=yes {} "echo a" &>/dev/null;if [ $? -eq 0 ]; then echo "OK";else echo "BAD";fi;' <server-names-file
~~~~

The result is the same (not sorted according to the original but I
didn't care about it), only much quicker.

</p>

