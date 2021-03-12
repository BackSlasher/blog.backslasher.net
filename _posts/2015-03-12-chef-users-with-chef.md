---
title: Managing chef users with Chef
categories:
- FOSS
tags:
  - Security
  - Linux
  - Chef
  - Ruby
---

I needed to create seperate Chef accounts for some utility program running in my Chef server.  
I was finally able to deprecate it today, but I saved those snippets because they're neat. These snippets use `chef-server-ctl`, which is a utility software included in Chef server's installation

## The bits

### Interesting points
* I'm using `ruby_block` resources to execute my code, because:
    * It runs at the convergence phase and not at the compilation phase
    * The code runs on a forked process so it can't crash my Chef client
    * The code behaves as a standard "resource"
* I use `not_if` and `only_if` as much as possible, because:
    * They're camulative (all `only_if` conditions must pass and all `not_if` conditions must fail for the resource to run)
    * Running the "if" blocks doesn't count as running the resource, helping the resource feel idempotent ("nothing is modified unless it needs to")


### Ensure a user exists
The password is generated on the spot and not saved anywhere, because I was counting on certificate-based access.  
The private key is ignored because I have another block to reset it.
```ruby
username='blablason'
ruby_block "create-chef-user" do
  # This is not a chef server
  not_if {shell_out("which chef-server-ctl").exitstatus!=0}
  # User does not exist
  not_if {shell_out("chef-server-ctl user-list").stdout.split("\n").any?{|l|l==username}}

  block do
    pass=(0...20).map { (65 + rand(26)).chr }.join
    shell_out("chef-server-ctl user-create #{username} #{username} #{username} no@one.com #{pass}") # Ignoring output key because we'll recreate that later
  end
end

```
### Ensure a file contains the private key
The private key is used to calculate the public key, which is compared against the user's actual public key (fetched from `chef-server-ctl`).  
Should the keys mismatch, a new key is generated and written to the file, and the public side is written to the Chef server using `chef-server-ctl` and a nifty perl replacement script.  
I avoid matching changing the public key to match the current private key, although this can be done without much code modification.
```ruby
username='blablason'
key_path='/home/blablason/key.pem'

ruby_block "reset-chef-key" do
  # This is not a chef server
  not_if {shell_out("which chef-server-ctl").exitstatus!=0}
  # Key matches
  not_if do
    # If file doesn't exist, return false (code needs to be run)
    unless ::File.exist? key_path then
      puts 'missing file'
      false
    else
      # Calculate current user's key
      puts 'mismatching keys'
      require 'openssl'
      real_pub=Chef::JSONCompat.from_json(shell_out!("chef-server-ctl user-show #{username} -F json").stdout)['public_key'].strip
      priv_key=OpenSSL::PKey::RSA.new(::File.read(key_path))
      calc_pub=priv_key.public_key.to_s.strip
      real_pub==calc_pub
    end
  end

  block do
    # Generate key
    require 'openssl'
    new_key=OpenSSL::PKey::RSA.new(2048)
    new_pub_s=new_key.public_key.to_s
    ::File.write(key_path,new_key.to_s) # XXX might be vulnerable
    # Fabricate replacement shell
    perl_exec=shell_out!("which perl").stdout.strip
    require 'tempfile'
    rep_shell= Dir::Tmpname.make_tmpname '/tmp/shell', nil
    f=::File.new(rep_shell,'w',0700)
    f.write("#!#{perl_exec} -i
      $pubkey='#{new_pub_s.inspect}';
        while (<>) {
         s/^\\s+\"public_key\":.*,/\"public_key\":$pubkey,/;
         print;
        }
    ")
    f.close
    shell_out!("EDITOR=#{rep_shell} chef-server-ctl user-edit #{username}")
    ::File.delete rep_shell
  end
  # Use "notifies" here to let stuff know that the key has been changed
end
```

### Ensure a user belongs to an organization
This is not idempotent because I couldn't find a way to easily determine whether a user belongs to an organization.  
However, I'm perfectly fine with this silently failing
```ruby
username='blablason'
org_name='ORG'
execute 'assign-chef-org' do
  # This is not a chef server
  only_if 'which chef-server-ctl'

  command "chef-server-ctl org-user-add #{org_name} #{username}"
end
```

## Things I would have done differently
Were I to refactor this, I'd modify it to work against the Chef API directly rather than running `chef-server-ctl`.  
This would have looked neater, and would have allowed me to run from machines that aren't Chef servers.
