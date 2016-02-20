Title: Backslasher-Python: a simple Chef Python cookbook
Date: 2016-02-20 12:00
Category: FOSS
Tags: Ruby, Python, Chef
Slug: backslasher-python

### What's wrong with the current Python cookbook
Until now, we were using the [Python cookbook](https://github.com/poise/python). This worked well for a while, until I noticed these things:

1. This cookbook is being deprecated, and replaced by [poise-python](https://github.com/poise/poise-python), meaning some day the Python cookbook will be a wrapper around poise-python.
2. Even today, when the poise-python cookbook is used in a Chef-run, it's taking over the Python cookbook's resources

### What's wrong with the Poise-Python cookbook
This new cookbook is way too magical for me.  
I'm not in the habit of criticising other people's work, and I'm sure CodeRanger knows what he's doing, but I find the following facts disturbing:

1. All of the cookbook logic is stored inside `lib/`, and processed using [halite](https://github.com/poise/halite)  
    This means the division of recipes/resources/helpers is unclear and you have to "hunt" for the file containing the resource you want to troubleshoot.
2. The resources use inheritance for state and logic  
    After you found the proper file for your resource, you might need to search other files for methods that are part of the flow you're troubleshooting.
3. Some of the inheritance extends to other cookbooks, like [poise-languages](https://github.com/poise/poise-languages) and [poise](https://github.com/poise/poise).  
    This is even more annoying because you now have multiple libraries/artifact to troubleshoot (so more lines in your Berksfile, more repos to clone etc), and it's unclear which logic arives from where.  
4. Some of the methods used are "magical"  
    By "magical" I mean methods that aren't defined in the normal way:

        :::ruby
        def methodname(params)
          # Logic here
        end

    Instead, they are created by using [define\_method](http://apidock.com/ruby/Module/define_method) or [method\_missing](http://ruby-doc.org/core-2.1.0/BasicObject.html#method-i-method_missing), and can't be easily found in the files.

5. Some resources automatically backreference other resources.  
    I'm talking about this usage pattern:

        :::ruby
        python_runtime '2'

        python_virtualenv '/opt/myapp/.env' # Uses the `python_runtime` defined above automatically

    This is done by looking at the resource collection and looking for the last item matching some definition (as far as I could understand).  
    While this might seem neat, in order for this method to work you have to reorder your code to match the "proper" way. For instance, you can't separate the runtime and the venv to diffent recipes, because then some other runtime (even from a different cookbook) might be declared and be the one discovered by the virtualenv resource.

All of these facts, in addition to missing documentation, add up to make the cookbook code really difficult to understand or troubleshoot.  
On one hand, the reosurces included in this cookbook should be pretty simple. For instance, the package resource should install a python package (a single command), only if it's not already installed (another command).  
On the other hand, I wrestled with thie Poise-Python cookbook for 3 days and still couldn't get it to do what the original Python cookbook did. It might be because I have a unique use case (custom-compiled Python), but it's still furstrating.

### Enter [backslasher-python](https://github.com/BackSlasher/chef-backslasher-pytho://github.com/BackSlasher/chef-backslasher-python)
Eventually, I chose to re-implement the Python cookbook by myself.  
I made sure to choose a different namespace for the resources (`backslasher_python_*`), so it won't interfere with the existing usage of the Python cookbook (external cookbooks etc).  
The new cookbook is written as plainly as possible. Its only vice is using the new custom resource syntax.

For instance, this is the entire `backslasher_python_virtualenv` definition (34 lines of code):
```ruby
property :path, String, name_attribute: true
property :interpreter, String
property :owner, String, regex: Chef::Config[:user_valid_regex]
property :group, String, regex: Chef::Config[:group_valid_regex]
property :options, String # Additional options for venv initialization

default_action :create

def exists?
  ::File.exist?(path) && ::File.directory?(path) \
    && ::File.exists?("#{path}/bin/activate")
end

action :create do
  nr = self # me as new_resource
  directory path do
    user nr.owner if nr.owner
    group nr.group if nr.group
  end
  execute "virtualenv #{"--python="+interpreter if interpreter} #{options} #{path}" do
    user nr.owner if nr.owner
    group nr.group if nr.group
    environment ({ 'HOME' => ::Dir.home(nr.owner) }) if nr.owner

    not_if {nr.exists?}
  end
end

action :delete do
  directory path do
    action :delete
    recursive true
  end
end
```
This code is not dependent on any external code (except for the Chef core logic), and is pretty easy to read.  
Compare it to the [Poise-Python implementation](https://github.com/poise/poise-python/blob/master/lib/poise_python/resources/python_virtualenv.rb).


Personally, I've successfully replaced the Python cookbook with my Backslasher-Python cookbook in all of my internal uses and consider it a success. I'm curious to see what will happen in public cookbooks.
