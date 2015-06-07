Title: Managing EC2 reservations with Scripts
Date: 2015-06-07 16:00
Category: FOSS
Tags: AWS, EC2, Scripts, Ruby
Slug: ec2-reservations

## The Story
Since we tend to hold our AWS EC2 VMs for a long time, we usually reserve them.  
Reservations are like pre-buying instances - you pay AWS ahead of time for (let's say) a year, and get a discounted price.  
The insterestng thing about EC2 reservations is that they aren't tied to a specific instance.  
**Pro:** You can terminate one instance and create another one of the same type, and still enjoy the discounted price of the reservation.  
**Con:** There is no way to tell whether a specific instance is reserved or not. This means that when resizing/moving a reserved instance, locating and modifying the reservation is up to you.  

To combat this issue, I made the following changes:

1. All instances have a tag named "Reserve", which contains "True" or "False" (depending on whether you want to reserve that instance, because it's going to stay with you for a while).
2. I run a script once in a while, which checks whether our reservations match our actual instances. I buy/modify our reservations accordingly.
3. I'm planning to automate the purchase of reservations using another script. Since this involves spending money, I'm more hesitant to automate it.

## The script
This script outputs a csv/yaml report of instances and reservations, grouped by regions, availability zones, instance types, VPC and OS type (we only have Windows and Linux instances).
```ruby
#!/usr/bin/env ruby

# Monkeypatching
class Array
  def to_h
    Hash[self]
  end
end

class String
  def to_bool
    return true if self == true || self =~ (/(true|t|yes|y|1)$/i)
    return false if self == false || self.empty? || self =~ (/(false|f|no|n|0)$/i)
    raise ArgumentError.new("invalid value for Boolean: \"#{self}\"")
  end
end

require 'optparse'
options = {format:'csv'}
OptionParser.new do |opts|
  opts.banner = "Usage: find-reservations.rb [options]"
  opts.on("-fFORMAT", "--format=FORMAT","Format (csv/yaml)") do |n|
    options[:format] = n
  end
end.parse!

require 'aws-sdk-core'
instances=[]
reservations=[]

cp=Aws::EC2::Client.new region: 'us-east-1'
# Go over all regions
cp.describe_regions.regions.map{|m|m.region_name}.each{|r|
  c=Aws::EC2::Client.new region: r
  reservations+=c.describe_reserved_instances.to_hash[:reserved_instances].select{|r|r[:state]=~/active|payment-pending/}
  instances+=c.describe_instances.to_hash[:reservations].map{|n|n[:instances]}.flatten.select{|i|i[:state][:code]==16}
}

# Only add instances with "Reserve=True"
instances=instances.select{|i|i[:tags].any?{|t|t[:key]=='Reserve' && t[:value].to_bool}}

res_group=reservations.group_by{|n|[
  n[:availability_zone], #region
  n[:instance_type], #instance type
  n[:product_description].include?('Amazon VPC'), # is_vpc
  n[:product_description][/Linux/i].nil? #is_windows
]}.map{|k,v|[k,[
  v.map{|r|r[:instance_count]}.inject(0,:+), # current instances
  v.map{|r|r[:end]}.sort.first]] # next expiration
}.to_h
ins_group=instances.group_by{|n|[
  n[:placement][:availability_zone],
  n[:instance_type],
  !n[:vpc_id].nil?,
  !n[:platform].to_s[/windows/i].nil?
]}.map{|k,v|[k,v.count]}.to_h

aggr=(ins_group.keys|res_group.keys).map{|k|
  is=(ins_group[k] || 0);
  rs=(res_group[k] || [0])[0];
  [k,{:instances=>is,:reservations=>rs,:surplus=>(rs-is),
  :next_expiration=>(res_group[k]||['?','?'])[1]
  }]}

tbl=aggr.map{|k,v|
  {region:k[0],size:k[1],is_vpc:k[2],is_windows:k[3]}.merge(v)
}

# Sort table
tbl.sort_by!{|r|r.values.collect{|v|v.to_s}}

# Export
case options[:format].downcase
  when 'yaml'
    require 'yaml'
    puts tbl.to_yaml
  when 'csv'
    require 'csv'
    puts (tbl.first.keys.to_csv)
    tbl.each{|r|puts r.values.to_csv}
  else
    raise 'bad format'
end
```

The output looks like this:
```text
eu-west-1c,c3.large,false,false,3,3,0,2015-06-23 12:47:31 UTC
us-east-1a,c3.2xlarge,false,false,1,1,0,2015-11-04 15:41:34 UTC
us-east-1a,c3.2xlarge,true,false,3,1,-2,2015-09-30 13:10:08 UTC
us-east-1b,c3.large,true,false,10,10,0,2016-01-27 14:03:56 UTC
us-east-1b,m3.large,true,false,5,0,-5,?
us-west-2a,c3.2xlarge,true,false,3,2,-1,2016-01-26 14:07:23 UTC
```

## Interesting things
* I monkey patched `Array#to_h` (which is present in ruby 2), and `String#to_bool`.
* Note the way I'm collecting data from all regions. I first create a client on `us-east-1` only to collect the regions using `describe_regions.regions.map{|m|m.region_name}`, and for each region I'm creating a new client and collecting the data from that region.
* When sorting the table, I can't sort by the actual values (e.g. `tbl.sort_by!{|r|r.values}`), because I have boolean values and booleans can't be compared (try running `false>true` and see what happens), so I used the string equivalent of all values (`tbl.sort_by!{|r|r.values.collect{|v|v.to_s}}`)
