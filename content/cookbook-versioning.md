Title: Cookbook Versioning Script
Date: 2016-02-29 12:00
Category: FOSS
Tags: Scripts, Ruby, Bash, Chef
Slug: cookbook-versioning

## The Problem
I've always disliked releasing cookbook versions manually. The process requires a lot of bureaucratic steps which are easy to forget and require no thought at all.  
Before I had this script, I sometimes avoided modifying the cookbook's version when I only applied "a little fix", losing the ability to roll back to previous versions (for instance).  
I also had little success in having anybody else follow my tedious procedure, which led to the "only I can touch master" approach that turned me into a serious bottleneck in cookbook releases.

## The Solution
Nowdays I have a Jenkins job which is in charge of taking a "topical" branch and merging it "properly" to the cookbook's master branch.  
The job contains these steps:

### 1. Valdate git-etiquette
I need to make sure that this branch is following my guidelines for PRs:

1. It has to be a descendant of master  
    This is done to ensure that the resulting merge will be a fast-forward merge (FF), keeping my git history uncomplicated, saving me from unexpected merge conflicts, and avoiding merge-only issues (`master` works fine, `topical` works fine, their merge somehow doesn't. It happens).

2. It needs to be merge-commit free:  
    I really like my commit trees linear. I also expect merge-candidates to be short-lived topical branches, so it makes sense to expect a straightforward chain of commits from them

```bash
#!/bin/bash
set -e

# `git merge-base --is-ancestor` on git>1.8
A=$(git rev-parse --short HEAD) #current commit
B="master" # target_branch

if [[ $(git merge-base $A $B) == $(git rev-parse --verify $A) ]]; then
  echo "Will not merge ${B} into itself" >&2
  exit 1
fi

if [[ $(git merge-base $B $A) != $(git rev-parse --verify $B) ]]; then
  echo "Will not perform a non-FF merge" >&2
  exit 2
fi

if [ -n "$(git log --merges $A..$B)" ]; then
  echo "Will not introduce merge commits" >&2
  exit 2
fi

# All OK
exit 0
```

### 2. Test Cookbook
In real life, this is done by a different Jenkins job, since "testing a cookbook" is an action I use a lot in my workflows.
The simplest way of doing it, however, can be something like this:

```bash
berks install # Fetch dependencies
berks verify  # Check syntax etc
foodcritic .  # Linting
```

These steps require the ChefDK installed, obviously

### 3. Choose a new version number
I use the [semantic versioning](http://semver.org/) standard versioning, which basically means that:

* If I break backwards-compatibility, it's a major version (X.x.x)
* Else-if I add new features, it's a minor version (x.X.x)
* Else it's a build number (x.x.X)

To determine the increment required, I've decided to look through git commit messages and detect strings indicating big changes.  
My reasoning is that when a developer adds a significant change (e.g. a breaking change), they can include the string `MAJOR_BUMP` in their commit message and forget about it.  
This script will see that the new commits include such messages and increment the major version.  
It might look a bit hackish, but it works

```ruby
#!/usr/bin/env ruby
# monkey patching
class << File
  def write(filename,content)
    f = File.new(filename,"w")
    f.write(content)
    f.close
  end
end 

target_branch='master'
has_minor=`git log #{target_branch}.. --grep=BUMP_MINOR`.length > 0
has_major=`git log #{target_branch}.. --grep=BUMP_MAJOR`.length > 0
bump_type=if has_major then 'major'
          elsif has_minor then 'minor'
          else 'build'
          end

# Get next version
split_options=['major','minor','build']
split_index=split_options.index(bump_type)
raise 'unknown bump modifier' if split_index.nil?
metadata_file='./metadata.rb'
metadata=File.read(metadata_file)
version_line=metadata.split("\n").select{|s|s[/^\s*version\W/]}.last
version_regex=/("|')([\d\.]+)("|')/
version=version_line[version_regex,2]
v_arr=version.split('.')
v_arr[split_index]=(v_arr[split_index].to_i+1).to_s
(split_index+1..v_arr.length-1).each{|a|v_arr[a]=0} # Zero other cells
new_version=v_arr.join('.')

# Export new_version somehow to the other scripts
File.write('NEW_VERSION',new_version)
```

### 4. Modify the version identifier
Now that we have a version, we need to update the `metadata.rb` file with the new version number

```ruby
#!/usr/bin/env ruby
# monkey patching
class << File
  def write(filename,content)
    f = File.new(filename,"w")
    f.write(content)
    f.close
  end
end

new_version=ENV['NEW_VERSION']

# Read file
metadata_file='./metadata.rb'
metadata=File.read(metadata_file)

# Find version line
version_regex=/("|')([\d\.]+)("|')/
version_line=metadata.split("\n").select{|s|s[/^\s*version\W/]}.last

# Generate new one
new_version_line=version_line.gsub(version_regex,"'#{new_version}'")
new_metadata=metadata.gsub(/\n#{Regexp.escape(version_line)}\n/,"\n#{new_version_line}\n")

# Write back to file
File.write(metadata_file,new_metadata)
```

### 5. Create changelog
This is by far the most tedious step to do manually, and also the hardest (IMO) to automate. I insist on maintaining a changelog for cookbooks, because:

1. The git history isn't always available (e.g. in the cookbook's "compiled" form)
2. Compiled artifacts shouldn't rely on version-control-specific details, such as commits.

I support the changelog formats created by both `berks cookbook` and `knife cookbook create`.  
The gist of the script is:

1. Extract commit message in a specific format from every commit to be merged
2. Combine them into a markdown-like list
3. Add the list at the right place in the `CHANGELOG` file - before the topmost version

```ruby
#!/usr/bin/env ruby
# monkey patching
class << File
  def write(filename,content)
    f = File.new(filename,"w")
    f.write(content)
    f.close
  end
end

target_branch='master'
new_version=ENV['NEW_VERSION']

# Collect messages
messages=`git log #{target_branch}.. --format='%w(0,0,4)- [%h] (%an) %s%n%n%b'`

# Combine to markdown
new_changes="# #{new_version}\n#{messages}"

# Modify file
changes_file='./CHANGELOG.md'
changes_content=File.read(changes_file)
# Handle multiple formats
if changes_content[/^#/] # Berks format
  changes_content.sub!(/#/,"#{new_changes}\n#")
elsif changes_content[/^.* CHANGELOG\n=*\n/] # Knife format
  changes_content.sub!(/\n[\d\.]+\n-*\n/,"##{new_changes}\n\\0") # Added pound
else
  raise "Unknown format in #{changes_file}"
end
File.write(changes_file,changes_content)
```

### 6. Create the version commit
The modifications to the files need to be commited as the "version bump" commit. This commit will also be the tip for the new version.  

```bash
git commit metadata.rb CHANGELOG.md -m "Upgraded to version $NEW_VERSION"
```

### 7. Tag and push
The new version should be pushed to `master` and tagged as `vNEW_VERSION`. In my case, this is done in a Jenkins-specific action, but it can be scripted like this:
```bash
git tag "v${NEW_VERSION}"
git push --tags
git push origin HEAD:master
```

### 8. Upload to production
This is the simple version:
```bash
berks upload
```
And this is the one I actually use, which helps me generate a nice message about which cookbooks were modified:
```bash
BERKS_OUT=$(berks upload | grep '^Uploaded')
echo "Uploaded: "
echo "$BERKS_OUT"
```

## Update 25.11.16
I joined all of these to a standalone script I use for my own cookbooks:
```
#!/usr/bin/env ruby

# Arguments
require 'optparse'
options = {target_branch: 'master'}
OptionParser.new do |opts|
  opts.on('-M', "Major bump") do |m|
    options[:major_bump]=true
  end
  opts.on('-m', "Minor bump") do |m|
    options[:minor_bump]=true
  end
  opts.on("-d","--directory D", String, "Working directory") do |d|
    options[:directory] = d
  end
  opts.on('-t','--target TAR', String, "Commit containing current version") do |t|
    options[:target_branch]=t
  end
end.parse!

target_branch = options[:target_branch]

# monkey patching
class << File
  def write(filename,content)
    f = File.new(filename,"w")
    f.write(content)
    f.close
  end
end

# cd to target directory
Dir.chdir(options[:directory]) if options[:directory]

# New version
split_index = if options[:major_bump] then 0
              elsif options[:minor_bump] then 1
              else 2
              end
metadata_file='./metadata.rb'
metadata=File.read(metadata_file)
version_line=metadata.split("\n").select{|s|s[/^\s*version\W/]}.last
version_regex=/("|')([\d\.]+)("|')/
version=version_line[version_regex,2]
v_arr=version.split('.')
v_arr[split_index]=(v_arr[split_index].to_i+1).to_s
(split_index+1..v_arr.length-1).each{|a|v_arr[a]=0} # Zero other cells
new_version=v_arr.join('.')

#### Changelog

# Collect messages
messages=`git log #{target_branch}.. --format='%w(0,0,4)- [%h] (%an) %s'`

# Combine to markdown
new_changes="# #{new_version}\n#{messages}"

# Modify file
changes_file='./CHANGELOG.md'
changes_content=File.read(changes_file)
# Handle multiple formats
if changes_content[/^#/] # Berks format
  changes_content.sub!(/#/,"#{new_changes}\n#")
elsif changes_content[/^.* CHANGELOG\n=*\n/] # Knife format
  changes_content.sub!(/\n[\d\.]+\n-*\n/,"##{new_changes}\n\\0") # Added pound
else
  raise "Unknown format in #{changes_file}"
end
File.write(changes_file,changes_content)

#### Metadata file

# Read file
metadata_file='./metadata.rb'
metadata=File.read(metadata_file)

# Find version line
version_regex=/("|')([\d\.]+)("|')/
version_line=metadata.split("\n").select{|s|s[/^\s*version\W/]}.last

# Generate new one
new_version_line=version_line.gsub(version_regex,"'#{new_version}'")
new_metadata=metadata.gsub(/\n#{Regexp.escape(version_line)}\n/,"\n#{new_version_line}\n")

# Write back to file
File.write(metadata_file,new_metadata)

# TODO git tag
# TODO merge master
# TODO push
```
