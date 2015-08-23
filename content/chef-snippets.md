Title: Chef Snippets
Date: 2015-08-23 14:00
Category: FOSS
Tags: Chef, Ruby, Vagrant
Slug: chef-snippets

I thought I'd upload some interesting Chef-related snippets I accumulated.

## Chef Shell
`chef-shell` is an easy way to gain the context of a Chef client.  
I mainly use it to debug recipes by executing little bits of them in the shell.

### As client
If you're running it on a standard Chef node (connected to a Chef server), you can simply use:
```bash
sudo chef-shell -z
```

### As solo in Vagrant
When using Chef solo in Vagrant, you can run Chef shell to simulate it by running something like
```bash
sudo chef-shell -s --config /tmp/vagrant-chef/solo.rb --json-attributes /tmp/vagrant-chef/dna.json
```
I got the arguments from running `vagrant provision` and during the provisioning running something like `ps aux | grep chef`.  
To load your cookbooks (which is not automatic) you can run:
```ruby
node.run_context.load(node.expand!)
```

## Chef in Ruby
Sometimes I want to use Chef logic in my Ruby scripts or I just want direct access to Chef's libraries.  
The easiest way to accomplish it is to use Chef's own Ruby instance, available under `/opt/chefdk/embedded/bin/ruby` (for ChefDK) or `/opt/chef/embedded/bin/ruby` (for Chef client). I sometimes use the `irb` binary instead.  
You can also use `chef exec` in newer editions of Chef.  
I have this boilerplate snippet to load the Chef config file:
```ruby
require 'chef'
if human_user then # Whether we're running as a Chef user or as a Chef client
  config_path = File.expand_path("~/.chef/knife.rb")
else
  config_path = '/etc/chef/client.rb'
  Chef::Config[:node_name]||=`hostname`.strip
end
Chef::Config.from_file(config_path)
```
Then you can run some Chef-dependant code, like:

#### Getting all nodes
```ruby
nodes = Chef::Node.list.keys.map{|n|Chef::Node.load n}
```

#### Translate node FQDN to AWS instance ID
```ruby
include Chef::DSL::DataQuery

search(:node,'ec2_instance_id:*').each do |n|
  puts "#{n['fqdn']},#{n['ec2']['instance_id']}"
end
```

#### Update a databag
```ruby
include Chef::DSL::DataQuery

mu=data_bag_item('song','of')
mu['ice']='fire'
mu.save
```

#### Query for group membership
Taken from the [knife-acl](https://github.com/chef/knife-acl) project
```ruby
def is_usag?(gname)
  gname.length == 32 && gname =~ /^[0-9a-f]+$/
end

client_name='best.machine.com'
rest = Chef::Search::Query.new.rest
groups=rest.get_rest('/groups').keys.reject{|k|is_usag?(k)}
current_groups=groups.select do |g|
  rest.get_rest("/groups/#{g}")['actors'].include?(client_name)
end
```
