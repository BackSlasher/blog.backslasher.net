---
title: How Chef's use_inline_resources works
categories:
- FOSS
tags:
  - Chef
  - Linux
  - Ruby
---

I recently had an issue with [use_inline_resources](https://docs.chef.io/lwrp.html#use-inline-resources).  
This feature's documentation is lackluster, and I learnt about its magic thanks to some [scraps of information](https://github.com/chef/chef/issues/3748#issuecomment-127361292).  
I wanted to share some of my info about how it actually works.

## The basics
`use_inline_resources` is used to separate a LWRP's run context from the main run, making it run in an isolated "mini-run".  
Assume the following structure inside cookbook `slasher`:

* `resources/default.rb`:

        :::ruby
        # resource definition for slasher LWRP
        actions :swing
        default_action :swing

* `providers/default.rb`:

        :::ruby
        # provider for slasher LWRP
        use_inline_resources

        action :swing do
          execute 'echo swish'
        end

This causes the following effects:

* You cannot subscribe to / notify resources that are not part of this resource's context.  
  This will break:

        :::ruby
        # provider for slasher LWRP
        use_inline_resources

        action :swing do
          execute 'echo swish' do
            notifies :restart,'service[nginx]' # not defined in this LWRP!
          end
        end

* The external resource is automatically "updated" (meaning it triggers other resources using subscribe/notify) whenever one of the resources in the run changes.  
  This will work:

        :::ruby
        # External usage of slash
        service nginx

        slash do
          notifies :restart,'service[nginx]' # Will happen because the execute resource will "update"
        end

This behaviour is the encouraged way to implement LWRPs, because it helps encapsulation - they feel like "atomic" resources when used in recipes, and have no need to consider other resources when managing naming, notifications etc., especially other instances of the same resource. It'll probably be enabled by default in Chef13.

## The internals
This is the interesting part - how it's actually implemented.
If you'll look at the [Chef source](https://github.com/chef/chef/blob/12.4.1/lib/chef/provider/lwrp_base.rb) (not in `master`, where I guess everything changed because it's the default behaviour), under file `lib/chef/provider/lwrp_base.rb`, we'll see that the method `use_inline_resources` does some mixin magic:
```ruby
def use_inline_resources
    extend InlineResources::ClassMethods
    include InlineResources
end
```

The mixed-in module (in the same file) overrides the method `action` (used to define actions in LWRP) with the following code:
```ruby
def action(name, &block)
  define_method("action_#{name}") do
    recipe_eval_with_update_check(&block)
  end
end
```
As you can see, it calls `recipe_eval_with_update_check` (instead of `instance_eval` in the regular version), which will temporarily replace the run context with a new one (with an empty resource collection), run the resource's action, and then inspect the resources defined in this temporary context and see if any of them were updated. If so, it'll mark this resource (the LWRP) as updated too:  
(Comments are mine)
```ruby
def recipe_eval_with_update_check(&block)
  saved_run_context = @run_context                                # Save that for later
  temp_run_context = @run_context.dup                             # Create new run context
  @run_context = temp_run_context                                 # Set it as current
  @run_context.resource_collection = Chef::ResourceCollection.new # New and empty collection

  return_value = instance_eval(&block)                            # Compile LWRP
  Chef::Runner.new(@run_context).converge                         # Execute compiled LWRP
  return_value                                                    # Return result
ensure                                                            # Always happens, even if we had an error
  @run_context = saved_run_context                                # Restore old run context
  if temp_run_context.resource_collection.any? {|r| r.updated? }  # Search for modified resources
    new_resource.updated_by_last_action(true)                     # If found, update LWRP
  end
end
```

And that's how it's done!
