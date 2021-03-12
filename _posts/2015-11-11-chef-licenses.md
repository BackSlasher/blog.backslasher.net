---
title: Listing Chef Cookbook Licenses
categories:
- FOSS
tags:
  - Chef
  - Ruby
  - Licensing
---

As part of a compliance check for our company, I was required to print the name/version of all FOSS proejcts I'm using.  
Most of it was digging around `Gemfile`s and `setup.py`s, which isn't that interesting. The neat part was this snippet to extract license information from cookbooks installed on Chef server:
```ruby
require 'chef'
config_path=File.expand_path("~/.chef/knife.rb")
Chef::Config.from_file(config_path)
rest = Chef::REST.new(Chef::Config[:chef_server_url])
cbs = rest.get_rest("/cookbooks?num_versions=1") # Get all cookbooks, latest version
cbs.reject!{|k,v|k[/^slasher-/]} # Remove my cookbooks
vers = cbs.map{|k,v| # Extract details
  url=v['versions'].first['url']
  deet = rest.get_rest(url)
  lic = deet.metadata.license
  {name: k,license:lic}
}
# Extract to CSV
require 'csv'
csv_string = CSV.generate do |csv|
  keys=[:name,:license]
  csv << keys
  vers.each{|r| csv<<r.values_at(*keys)}
end
puts csv_string
```
Execute it using `chef exec ruby`  
The result looks something like this:
```text
name,license
rvm,Apache 2.0
yum-mysql-community,Apache 2.0
deploy_wrapper,none
tomcat,Apache 2.0
elasticsearch,Apache 2.0
...
graphite,Apache 2.0
curl,Apache 2.0
```

The interesting bit is extracting the cookbook list and information using `Chef::REST`. This is how `knife cookbook list` does it.
