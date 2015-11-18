Title: Enhancing Packer Templates with eRuby
Date: 2015-11-18 12:00
Category: FOSS
Tags: Ruby, Packer, Scripts
Slug: packer-erb

## The Problem
[Packer](https://www.packer.io/) is a great tool for creating machine images, and I'm using it to create EC2 AMIs.  
My issue with it is that Packer is using JSON for input, and JSON is very inflexible. For instance, you can't:

* Write comments (there was [an issue](https://github.com/mitchellh/packer/issues/283) open for two years about this)
* Comment blocks out for testing (part of "write comments" but different usage)
* Create identical blocks with subtle changes

## The Solution
After reading the comment-related issue in Packer's GitHub page, I decided to use some wrapper. I considered writing a DSL wrapper for Ruby, but settled for using eRuby templates as a quick win.  
The basic usage is writing an `erb` file instead of a `json` one, and passing it to Packer like this:
```shell
packer build <(erb cherry.json.erb)
```
The redirection causes Bash to first execute `erb` with our template, and provide the output as a file (actually a pipe), to `packer`, who sees it as regular JSON.  
A slight variation is using Packer's STDIN, like this:
```shell
erb cherry.json.erb | packer build -
```
I dislike the idea of passing things via STDIN to binaries I'm not familiar with (since they might want some input and accidentally read it from the file), but that's just me.

### Basic usage
The file inside can look almost identical to the JSON one but with Ruby snippets inside, like:

* Comments:

        :::ERB
        <%# Upload cloud-init preconfig %>
        {"type":"file","source":"cloud-init/userdata.yaml","destination":"/etc/cloud/cloud.cfg.d/50_slasher.cfg"},

* Reducing magic constants:

        :::ERB
        <% ssh_timeout_minutes = 5 %>
        ssh -o ConnectTimeout <%=ssh_timeout_minutes*60%> server get_stuff.sh

* JSON-proofing strings (quick and dirty version):

        ::ERB
        {"type":"shell", "inline": <%='sed \'s/^pidfile.*$/pidfile \/tmp\/redis.pid\' -i /etc/redis.conf'.inspect%>


### More Ruby
You can use heavier Ruby code to do more awesome stuff.  
For instance, this is me creating both PV and HVM versions of my AMI:
```ERB
<%
require 'json'
build_config = [
  {type: 'pv', instance_type: 't1.micro', source_ami: 'ami-c2a818aa'},
  {type: 'hvm', instance_type: 't2.micro', source_ami: 'ami-42718735'}
]
builders = build_config.map do |item|
  {
    "name"=>"aws #{item[:type]}",
    'type' => 'amazon-ebs',
    'region' => 'us-east-1',
    'source_ami' => item[:source_ami],
    'instance_type' => item[:instance_type],
    'ami_description' => "packer #{item[:instance_type]}",
  }
%>
"builders": <%= JSON.pretty_generate(builders) %>
```

And here's choosing the right CentOS 6 AMI:
```ERB
<%
def source_ami(region,platform,is_hvm)
  unless is_hvm then
    # PV  https://aws.amazon.com/marketplace/ordering/ref=dtl_psb_continue?ie=UTF8&productId=f4325b48-37b0-405a-9847-236c64622e3e&region=us-east-1
    case region
      when 'eu-central-1' then nil # No such image
      when 'sa-east-1' then 'ami-7d02a260'
      when 'ap-northeast-1' then 'ami-81294380'
      when 'eu-west-1' then 'ami-42718735'
      when 'us-east-1' then 'ami-8997afe0'
      when 'us-west-1' then 'ami-1a013c5f'
      when 'us-west-2' then 'ami-b6bdde86'
      when 'ap-southeast-2' then 'ami-e7138ddd'
      when 'ap-southeast-1' then 'ami-a08fd9f2'
      else raise 'Cannot choose AMI'
    end
  else
    # HVM https://aws.amazon.com/marketplace/ordering?productId=74e73035-3435-48d6-88e0-89cc02ad83ee&ref_=dtl_psb_continue&region=us-east-1
    case region
      when 'eu-central-1' then 'ami-46c4f65b'
      when 'sa-east-1' then 'ami-9b952086'
      when 'ap-northeast-1' then 'ami-13614b12'
      when 'eu-west-1' then 'ami-30ff5c47'
      when 'us-east-1' then 'ami-c2a818aa'
      when 'us-west-1' then 'ami-57cfc412'
      when 'us-west-2' then 'ami-81d092b1'
      when 'ap-southeast-2' then 'ami-b3523089'
      when 'ap-southeast-1' then 'ami-b4a582e6'
      else raise 'Cannot choose AMI'
    end
  end
end
%>
...
"builders": [
  ...
  "region": <%=source_ami(region,true)%>
  ...
]
```

### Arguments
One can imagine arguments would be useful (e.g. "regions to build the AMI in").  
However, the `erb` binary doesn't accept arguments, so I had to pass those as environment variables. Less elegant but works OK:
```shell
packer build <(REGIONS=us-east-1,us-west-2 erb cherry.json.erb)
```
And inside the template:
```ERB
<%
regions=ENV['REGIONS'].to_s.split(',').map(&:strip)
regions=['us-east-1'] if regions.empty?
%>
```

### Going full Ruby
I haven't done it, but if your template is really complicated you can use a real Ruby file that prints the Packer template.  
Taking the exmaple template from the [Packer docs](https://www.packer.io/docs/templates/introduction.html), it'll look something like this:
```ruby
require 'json'
region=ARGV[0] || 'us-east-1'
#...
#...
builder = {
  type: 'amazon-ebs',
  access_key: '...',
  secret_key: (File.read('./passwd').strip), # interpolate files
  region: region # arguments
  source_ami: get_ami(region), # functions
  instance_type: 't1.micro',
  ssh_username: 'ubuntu',
  ami_name: 'packer {{timestamp}}', # Packer's variables still work
}
res = {
  builders: [builder],
  provisioners: {
    type: 'shell',
    script: 'setup_things.sh',
  }
}

# Print result
puts JSON.pretty_generate(res)
```

Have fun templating!
