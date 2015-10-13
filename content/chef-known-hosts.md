Title: Generating known_hosts file using Chef
Date: 2015-10-13 15:00
Category: FOSS
Tags: Ruby, Scripts, Chef, SSH
Slug: chef-known-hosts

## The Story
This post relates to my [previous post](|filename|/merge-known-hosts.md). I was trying to create a script to amend my `known_hosts` file (where SSH keeps fingerprints of all of the servers it connected to in the past, to prevent MitM attacks) with SSH keys collected by Chef. This benefits me in two major ways:

1. Reduces the chance for [MITM attacks](https://en.wikipedia.org/wiki/Man-in-the-middle_attack):  
    When connecting to a server for the first time, you usually blindly accept its fingerprint, because you have nothing to compare it to. I saw it being referred to as "the web gap".  
    When using my script, you get the fingerprint from the Chef server (which you already trust).
2. Eases replacing nodes / IPs:  
    My original pain point was that a colleague rebuilt a server, and named the new server the same as the old one.  
    While this is a reasonable thing to do, the new server had a different key from the old server, so SSH thought I was experiencing a MITM attack. I obviously discovered this only while doing something like this, to ensure the iptables service was running on all servers (we had a [SYN flood](https://en.wikipedia.org/wiki/SYN_flood) scare):

        :::bash
        knife search 'tags:public' -i | parallel ssh {} sudo pkill -USR1 chef-client

    The SSH errors messed up my little script and I had to iterate somewhat manually.

## The Script
```ruby
# Init Chef stuff
require 'chef'
config_path= ARGV[0] || File.expand_path("~/.chef/knife.rb")
Chef::Config.from_file(config_path)
Chef::Config[:node_name]||=`hostname`.strip
include Chef::DSL::DataQuery

nodes = search(:node, 'keys_ssh:*') # find nodes with SSH keys
key_rows = nodes.map{ |n|
  names = [n['fqdn']]
  names << (n['ec2'] ? n['ec2']['public_ipv4'] : n['ipaddress']) # Public IP if machine is EC2
  key_data = n['keys']['ssh']
  keys = {}
  keys[key_data['host_ecdsa_type']]=key_data['host_ecdsa_public'] if key_data['host_ecdsa_type'] and key_data['host_ecdsa_public']
  keys['ssh-rsa'] = key_data['host_rsa_public'] if key_data['host_rsa_public']
  keys.map{ |key_type,key_value|
    '%s %s %s' % [names.join(','), key_type, key_value ]
  }
}.flatten
puts key_rows.join("\n")
```

Script should be executed using Chef's embedded ruby. The two easy ways I know of:

1. `chef exec ruby SCRIPTPATH`
2. Adding a shebang to the script reading something like `#!/opt/chefdk/embedded/bin/ruby`

### Interesting points
* The first block accepts a non-default location for a Chef client config file. This is to allow it to operate on actual Chef clients (nodes), but to default to Chef human users.
* When running on EC2 machines, the "regular" IP address listed in `n['ipaddress']` (the one registered on the NIC) is the internal one, and therefor not the one I'm using when connecting to the machine.  
  This is why I'm using that little selection about what I'm pushing to `names`.
* The `ecdsa` ([Elliptic Curve Digital Signature Algorithm](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm)) key is registered in a strange way

## The two scripts combined
When actually updating my `known_hosts`, I'm running this command:
```bash
scripts/merge-known-hosts.py <(chef exec ruby scripts/chef-ssh-keys.rb) ~/.ssh/known_hosts -o ~/.ssh/known_hosts
```
