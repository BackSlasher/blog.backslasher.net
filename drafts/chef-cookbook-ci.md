Title: Continious Integration Workflow for Chef Cookbooks
Date: 2015-04-30 12:00
Category: FOSS
Tags: Chef, Development, CI
Slug: chef-cookbook-ci

## The Story
Since I manage the Chef setup in my workplace, I also carry the dubious titles "Earl of putting things in production" and "Keeper of guilt when cookbooks misbehave". To help me with my job, I needed a workflow for controlling the development of cookbooks.  
All workflows I found were either too simplistic or too complicated. I made my own and I think it's good enough to share.

## The Basics
I had some guidelines when setting this workflow:

* No manual commits to master  
  This is a good rule for all code repositories that aren't dreadfully simple, but still - every modification to master should be done via PR, so there's a chance for everybody to review and comment about the change.

* Only FF-Merges to master  
  Since my branches are few and simple, I'd rather keep my history neat by forcing all branches to be direct decendants of master, causing all merges to be FF ones.

* No manual uploading to Chef  
  To avoid any situation where non-`master` code is uploded to Chef, or a new version is created and not uploaded, this process should be automatic.

* Version releases should be scripted  
    Releasing a version is a beurocratic process and easy to mess up, so a script should handle it.

* Testing everywhere
    Tests should be run whenever there's a chance.

 One should:  
    * Choose a new version number (according to [Semantic Versioning](http://semver.org/))
    * Modify the `metadata.rb` file to update the version number
    * Update `CHANGELOG.md` with changes in this version (complicated)
    * Commit said modifications as a "version commit"
    * Tag the "version commit" with the new version number
    * Merge to master
    * Push to upstream
    * Upload to Chef server  

    These tasks are both boring and critical, so a script should handle it.

## Workflow

Assuming a user wants to add some feature to a cookbook, they go through the following stages

0. Prepare testing environment  
    I sometimes like to manually test my cookbooks when developing them.
    For this, I use a vagrant VM "on the side"
      Utilise the `Berksfile` to download all packages from the Chef server / supermarket, except cookbooks you're going to modify, like so:  
    
            :::ruby
            source "http://my.berkshelf.server:12345"  # Custom cookbooks
            source "https://supermarket.getchef.com"   # Public cookbooks

            cookbook 'common-stuff'                    # Cookbook used but not developed
            cookbook 'best-cookbook',                  # Cookbook being developed
              path: '~/cookbooks-garage/best-cookbook' # Read from filesystem

    Note that you must specify all "entry" cookbooks in the `Berksfile`, as it cannot infer from the `Vagrantfile` like it usually does from `metadata.rb`

1. Topical branch  
  The user clones the repository (or pulls master if it's already cloned) and creates a topical branch (`git checkout -b best-feature`)
2. Code away  
  The user writes and commits code as needed
3. Test
  

## Attribution
* I was highly influenced by [this post by Safari Books Online](https://blog.safaribooksonline.com/2013/06/26/continuous-integration-for-chef-with-vagrant-jenkins-and-gitlab/), but I like my result better.
