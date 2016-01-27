Title: Chef Custom Resources - Missing Documentation
Date: 2016-01-25 16:00
Category: FOSS
Tags: Ruby, Chef, Scripts

The new Chef documentation for [Custom Resources](https://docs.chef.io/custom_resources.html) is pretty lackluster.  
This is probably because they're too busy making awesome stuff, but I still needed to learn some stuff the hard way.  
Thought I'd share them.  

### The basics
There is no longer a "state-only" resource and an implementing provider. Instead, there is a single "resource" that contains both state and behaviour.  
A lot of terminology has been modified, partially to differentiate the new "custom resource" from the old "lightweight resource-provider" (LWRP) class.  
`property` is now `attribute` and the syntax is slightly different, but this is documented.  
If you want to use the "custom resource" paradigm on clients lower than Chef 12.5, you could depend on the 'compat\_resource' cookbook and it'll work.

### Actions are in the resource's context
Actions are part of the resource (and not the provider), so `self` inside the action context refers to the resource.  
This means that this:
```ruby
# The LWRP way - Will not work in custom resources
# Resource
property :path

# Provider
action :bla do
  puts "Path is #{new_resource.path}"
end
```
One should use this:
```ruby
attribute :path
action :bla do
  puts "Path is #{path}"
end
```

### load_current_value
This is a new way for generating the "existing" resource (to see if you need to do anything).  
You define a code block, using something like this:
```ruby
load_current_value do
  # DETECTION LOGIC HERE
end
```
This code is promoted into a method:
```ruby
# lib/chef/resource.rb L1135
def self.load_current_value(&load_block)
  define_method(:load_current_value!, &load_block)
end
```
And called by Chef (more details below):
```ruby
# lib/chef/resource/action_class.rb L31
def load_current_resource
  if new_resource.respond_to?(:load_current_value!)
    # dup the resource and then reset desired-state properties.
    current_resource = new_resource.dup

    # We clear desired state in the copy, because it is supposed to be actual state.
    # We keep identity properties and non-desired-state, which are assumed to be
    # "control" values like `recurse: true`
    current_resource.class.properties.each do |name,property|
      if property.desired_state? && !property.identity? && !property.name_property?
        property.reset(current_resource)
      end
    end

    # Call the actual load_current_value! method. If it raises
    # CurrentValueDoesNotExist, set current_resource to `nil`.
    begin
      # If the user specifies load_current_value do |desired_resource|, we
      # pass in the desired resource as well as the current one.
      if current_resource.method(:load_current_value!).arity > 0
        current_resource.load_current_value!(new_resource)
      else
        current_resource.load_current_value!
      end
    rescue Chef::Exceptions::CurrentValueDoesNotExist
      current_resource = nil
    end
  end

  @current_resource = current_resource
end
```
This method:

1. Clones the resource
2. Resets all fields that aren't:
    * Non "desired state" (`desired_state:false`), meaning they describe the way to operate rather than a property of the resource
    * "Identity" properties (`identity: true`), meaning they help locate the resource
    * "Name" properties (`name_property: true`), meaning they default to the resource's name (like `path` in the `directory` resource) so it doesn't make sense to initialize them to another value
    
    Brackets contain the decorator used to mark an attribute that way.  
    All other fields are cleared so that the detection code can populate them with "current" values.  
    One could read `lib/chef/property.rb` to see some of the attribute decorators and their documentation.  
    
3. Executes the provided code block in the current resource's context (now defined as `load_current_value!`).  
    If this block accepts any arguments, pass it the resource provided by the user.  
    This block is run in the "current" resource's context.  
    If it throws a `CurrentValueDoesNotExist` exception (done by calling `current_value_does_not_exist!`), the discovery process is aborted and there is no "current" resource.

So in short:

* You're supplying a code block to discover the current state of the resource
* This block is executed in the context of the "current" resoruce
* It starts with the Identity/Name/Non-desired-state properties initialized to the value in the "desired" state of the resource
* It's up to this block to either populate the remaining fields with the current value, or call `current_value_does_not_exist!` if the resource has no current state (e.g. a package that isn't currently installed)

### current_value instead of current_resource
Because of the `resource -> value` terminology changes, the current state of the resource is now accessed by `current_value` instead of `current_resource` like in the past.  
This object can be `nil` (if there is no current state for the resource) or a copy of this resource, populated with values from the `load_current_value` block
