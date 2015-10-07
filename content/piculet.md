Title: Managing AWS Security Groups with Piculet
Date: 2015-10-07 09:00
Category: FOSS
Tags: AWS, Security, Firewall, Piculet, Ruby
Slug: piculet

## The Problem
One of the first things I noticed when starting to work with AWS is that security groups are very hard to maintain:

* Name and description are immutable - One can't modify the name/description of a Security Group after it's created
* Groups contain magical constants - There is no place for labeling IP ranges or port numbers
* The rules can only refer to other security groups in the same VPC (or classic region, if outside VPC) or bare IPs, meaning that cross-VPC rules must contain a list of IPs that can change (since EC2 machines can change their IPs)

Since I didn't finish migrating our environment to documented and organized CloudFormation stacks (and I might never get around to it), I needed a way to manage security groups that doesn't cause me to change paradigms, meaning it won't force me to deploy tunneling solutions or push the servers into stacks.

Luckily I found [Piculet](https://github.com/winebarrel/piculet).

## What does it do
Piculet allowed me to define all of my Security Groups in a specific region using its DSL (it even has an export function for your existing groups).  
By using `piculet --apply` one can make the actual security groups look like the DSL file (or its compiled form), meaning that Piculet will create/delete security groups and add/remove rules to match your file.  
![](|filename|/images/piculet/apply.png)  
This is already great as you can:

* add comments to document your rules

        :::ruby
        # LB healthcheck
        permission :tcp, 8644..8644 do
          groups("default")
        end

* use ruby constructs to simpify your rules

        :::ruby
        [
          2003, # carbon incoming
          4567, # grafana UI
        ].each do |port|
          permission :tcp, port..port do
            groups("default")
          end
        end

* keep the files under source control to see who changed what, when and why  
  ![](|filename|/images/piculet/git.png)

## What I'm doing with it
Using piculet as is was fine for a while, but aside from modifying the gem itself I modified the way we're using it.

### Helper methods for IPs
I have some cross-VPC rules (like servers in Singapore talking to servers in Ireland), so I can't use security group references. If I used IPs, my rules would look like this
```ruby
# Ireland rule
permission :tcp, 5678..5678 do
  ip_ranges(
    "1.2.3.4/0", # serverA.singapore.slash.com
    "5.6.7.8/0", # serverB.singapore.slash.com
  )
end
```
This isn't ideal because I have to update the list whenever an IP changes (or I add a new server).
I ended up creating a helper file that monkey-patches the Piculet classes to include my helper methods such as `aws_role` (finds IP addresses of instances by a tag named "role") or `aws_vpc` (IP addresses of all instances in a specific VPC).  
This is most of my helper file. I might release it properly if it's interesting.
```ruby
module Slasher
  module Firewall
      # Create instance hash
      def self.set_instances
      extract_tag=lambda do |i,n|
        mt = i.tags.find{|t|t.key==n}
        if mt.nil?
          return ''
        else
          return mt.value
        end
      end

      require 'aws-sdk-core'
      c=Aws::EC2::Client.new(region:'us-east-1');
      regions = c.describe_regions.regions.map{|x|x.region_name};
      instances = regions.collect{|r|Aws::EC2::Client.new(region:r).describe_instances.reservations.map{|re|re.instances}}.flatten.select{|i|i.state.code==16}
      instances.select!{|i|extract_tag[i,'piculet_ignore'].empty?}
      @@instance_hash=instances.map do |i|
        ({
          name: extract_tag[i,'Name'],
          ip:   "#{i.public_ip_address}/32",
          role: extract_tag[i,'Role'],
          roles: extract_tag[i,'Role'].split(',').map(&:strip),
          vpc_id: i.vpc_id,
          region: i.placement.availability_zone.gsub(/.$/,''),
        })
      end
    end
    set_instances # Actually run

    def instance_hash
      @@instance_hash
    end

    # DNS resolution
    def host_name(name)
      require 'resolv'
      ip=Resolv.getaddress name
      "#{ip}/32"
    end

    # By name tag
    def aws_name(name)
      instance_hash.select{|n|n[:name]==name}.map{|n|n[:ip]}
    end

    # By role tag
    def aws_role(role)
      instance_hash.select{|n|n[:roles].include?(role)}.map{|n|n[:ip]}
    end

    # All in classic EC2 in region
    def aws_classic(region)
      instance_hash.select{|i| i[:region]==region && i[:vpc_id].nil?}.map{|n|n[:ip]}
    end

    # All in specific VPC
    def aws_vpc(vpc_id)
      instance_hash.select{|i|i[:vpc_id]==vpc_id}.map{|n|n[:ip]}
    end

    # IPs of health checkers in Route53
    def route53_ips
      ["54.228.16.0/26", "54.232.40.64/26", "54.241.32.64/26", "54.243.31.192/26", "54.245.168.0/26", "54.248.220.0/26", "54.251.31.128/26", "54.252.79.128/26", "54.183.255.128/26", "54.244.52.192/26", "54.250.253.192/26", "54.252.254.192/26", "54.255.254.192/26", "107.23.255.0/26", "176.34.159.192/26", "177.71.207.128/26"]
    end

    # Every IP we can think of
    def all_ips
      instance_hash.map{|n|n[:ip]} + route53_ips
    end

  end
end

class Piculet::DSL::EC2::SecurityGroup::Permissions::Permission
  include Slasher::Firewall
end
```
Now I can use it in my rules, like so:
```ruby
# App healthcheck
permission :tcp, 8644..8644 do
  ip_ranges(
    *route53_ips,
  )
end

# Backroom API
permission :tcp, 8081..8081 do
  ip_ranges(
    *aws_role('backroom'), # From around the world
    host_name('important.client.com'),
  )
end
```

### Apply all regions
I have this helper script to apply each file to its matching region.
```bash
#!/bin/bash
cat regions | parallel -j 0 bundle exec piculet $@ -a -f {} -r {} --exclude '/^packer\s[\w\-]+$/' --exclude_tag piculet_ignore
```
Interesting things:

* The `regions` file contains all of the regions you want to apply. This is handy because you can stop handling a region without removing its file, have unrelated files around, etc.
* `--exclude` is being used to ignore temporary security groups created by packer.
* `--exlcude_tag` only exists in my fork of the gem (currently) and allows me to ignore security groups belonging to CloudFormation stacks.
* `parallel` is used to run all regions at the same time and keep the output tidy. If you don't care about output tidiness, you can use `xargs -P 0 -I {}` instead

### Automatically updating rules
Since our rules are in a git repository, I have a server that keeps an updated copy of said repo and applies it every once in a while. This allows me to keep a CI/CD feel (infrastructure as code) and allow "regular" users to modify the FW rules using pull requests on the repo.
