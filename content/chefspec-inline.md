Title: Running Inline DSL in ChefSpec
Date: 2015-10-17
Category: FOSS
Tags: Chef, Testing, Ruby, Scripts, ChefSpec
Slug: chefspec-inline

## The Problem
I have a pet Chef cookbook in charge of managing SELinux policies in Linux machines ([Take a look](https://github.com/BackSlasher/chef-selinuxpolicy)).  
Until today I got along fine without testing, because the cookbook barely had any logic to be tested. The only test I had (contributed by someone) just made sure the cookbook isn't completely bonkers.  
I started working on a pretty complex feature (detecting when ports are assigned using a range) and it required testing. I'm familiar with 2 interesting options for testing cookbooks:

1. [Kitchen](https://docs.chef.io/kitchen.html): Uses Vagrant to create VMs and runs your recipes on it. Can optionally run tests on the machine to ensure it's provisioned OK
2. [ChefSpec](https://github.com/sethvargo/chefspec): Creates an in-memory Chef client that compiles the resource collection (see [this](https://docs.chef.io/chef_client.html#the-chef-client-title-run) for details about the Chef client run) and allows you to ensure that the resource collection looks as you expected.

Running kitchen tests takes a while and requires a machine capable of virtualization (so it can't be run inside a VM), so I thought I'd try creating a ChefSpec test.  
The recommended way of using ChefSpec is by supplying the runner with a list of recipes to run, like so:
```ruby
let(:chef_run) { ChefSpec::SoloRunner.converge('recipe::one','other::recipe') }
it 'does stuff' do
  expect(chef_run).to install_package('foo')
end
```

However, when testing LWRPs this becomes annoying, as you have to create "test recipes" for your LWRPs. These either go inside a different cookbook (and complicate your repo and testing) or stay in your main cookbook (and should be marked to not be run by end users), and it looks bad.

## The Solution
After a bit of hacking, I was able to monkey-patch the ChefSpec classes to accept Chef DSL instead, making the tests look a lot better.  
The patch looks like this:
```ruby
# This can go at the beginning of your spec file
module ChefSpec
  class SoloRunner
    def converge_dsl(*recipes,&block)
      cookbook_name = 'imaginary'
      recipe_name = 'temp'
      converge(*recipes){
        recipe = Chef::Recipe.new(cookbook_name, recipe_name, @run_context)
        recipe.instance_eval(&block)
      }
    end
  end
end
```
The main difference between my method and the "normal" one (`converge`), is that mine executes the block it's given inside a new recipe called `imaginary::temp` (hardly a name that will be used by anyone). This allows you to do something like this:
```ruby
let :chef_run do
  ChefSpec::SoloRunner.new.converge_dsl do
    package 'foo'
  end
end
it 'does stuff' do
  expect(chef_run).to install_package('foo')
end
```
While the difference looks minute, when testing LWRPs it looks a lot different.  
Here is some code from my actual tests:
### Without patch
```ruby
describe 'single port' do
  let :chef_run do
    runner = ChefSpec.SoloRunner.new(step_into: ['selinux_policy_port'])
    Chef::Config[:cookbook_path] << './test/cookbooks' # Allow Chef to find test cookbook
    runner.converge('selinux_policy_test::single_port')
  end
  it 'defines a single port' do
    #... irelevant stuff
    expect(chef_run).to run_execute('selinux-port-1080-addormodify')
  end
end
```
What is in `single_port` recipe? Where is it?  
Are we guranteed to run with the CWD set in the cookbook's directory?  
You have to admit it looks weird.
### With patch
```ruby
describe 'single port' do
  let :chef_run do
    runner = ChefSpec.SoloRunner.new(step_into: ['selinux_policy_port'])
    runner.converge_dsl('selinux_policy') do # recipe menitoned to force cookbook load
      selinux_policy_port 1080 do
        protocol 'tcp'
        secontext 'http_port_d'
      end
    end
  end
  it 'defines a single port' do
    #... irelevant stuff
    expect(chef_run).to run_execute('selinux-port-1080-addormodify')
  end
end
```
I think it looks a lot more elegant. The test is self-contained (except for "real" code used in the actual cookbook) and is easily understood (what it does and what it expects to happen).

## And even so...

**Update 19.02.16:** I am using this method successfully in my cookbooks, e.g. [selinux_policy](https://github.com/BackSlasher/chef-selinuxpolicy/blob/master/spec/boolean_spec.rb)

Even though I think it's great, I'm currently not using it.  
My reasons for it:

* I'm so new to testing cookbooks that I think I should currently stick to the accepted working methods.
* Keeping the test recipes in a separate test cookbook allows it to be shared between ChefSpec and the Chef Kitchen. I currently think it helps maintainability.

I might decide to use this method eventually, and I still think it looks really neat, so it deserves a blog post.
