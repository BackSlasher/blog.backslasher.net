---
title: Some Jenkins helpers for Chef
categories:
- FOSS
tags:
  - Jenkins
  - Chef
  - HTTP
---

I've decided to share some code I use in Chef to pull some data and files from Jenkins

### JenkinsQuery
This is a helper class, in charge of getting build-related data

```ruby
# slasher_development/libraries/jenkins_query.rb

module SlasherDevelopment
  class JenkinsQuery
    def initialize(server,user,password,job)
      @scheme='https' # Modify if needed
      @server=server
      @user=user
      @password=password
      @job=job
    end

    def get_json
      require 'uri'
      uri = URI("#{@scheme}://#{@server}/job/#{URI.escape(@job)}/api/json?depth=1")
      resp=nil
      Net::HTTP.start(uri.host, uri.port,
         :use_ssl => uri.scheme == 'https') do |http|
         request = Net::HTTP::Get.new uri.request_uri
         request.basic_auth @user, @password
         response = http.request request # Net::HTTPResponse object
         resp = response.body
       end
       require 'json'
       dat = JSON.parse(resp)
       dat
    end

    def last_successful_build_revision(repository_url)
      dat=get_json
      lastbuild=dat['lastSuccessfulBuild']
      if dat.nil?
          return nil
      else
          return lastbuild['changeSet']['revisions'].select{|x|x['module']==repository_url}.first['revision'].to_s
      end
    end
  end
end
```
The constructor is job-specific, meaning an instance handles a single job.  
`get_json` gets the job's metadata file. It contains several useful details (hit it yourself and find out).  
`last_successful_build_revision` is a helper method for extracting a very specific detail - the source repository's revision that was used in the last successful build.  
It takes the repository url, since Jenkins assumes a single build can have multiple sources (rare but true).  
I use it for checking out a subversion repo to match an artifact's version (more on that later).  
This method can be generalized if needed.

### JenkinsFile
This is a resource used to fetch an artifact from Jenkins
```ruby
# slasher_development/resources/jenkins_file.rb

actions :create, :delete
default_action :create

attribute :path, :kind_of => String, :name_attribute => true
attribute :mode, :kind_of => String
attribute :owner, :kind_of => String
attribute :group, :kind_of => String

attribute :artifact, :kind_of => String, :required => true
attribute :job, :kind_of => String, :required => true
attribute :build, :kind_of => String, :default => 'lastSuccessfulBuild'
```
```ruby
# slasher_development/providers/jenkins_file.rb

use_inline_resources

source_credentials = data_bag_item('secret_stuff','jenkins')

action :create do
  jenkins_server, jenkins_user, jenkins_password = source_credentials.values_at('server','user','password')
  remote_file @new_resource.path do
    mode  new_resource.mode
    group new_resource.group
    owner new_resource.owner
    source "http://#{jenkins_user}:#{jenkins_password}@#{jenkins_server}/job/#{new_resource.job}/#{new_resource.build}/artifact/#{new_resource.artifact}"
  end
end

action :delete do
  f=file @new_resource.path do
    action :delete
  end
end
```
As you can see, this is a very simple use of `remote_file`. The interesting thing here is the composition of the URL.  
Also note that Jenkins doesn't use "401 Unauthorized" to tell clients they need to login, it just flat-out rejects them. To handle this, you need to use [Preemptive Authentication](http://hc.apache.org/httpclient-3.x/authentication.html#Preemptive_Authentication), meaning that the client sends the credentials on the first request. Chef's `remote_file` does so, but `wget` doesn't.  
The default value for "build" causes it to retrieve the artifact from the last successful build.

### JenkinsVersionedSvn
This is a resource used to check out an SVN repo in a specific version that matches the one used in the last successful build of a Jenkins job.
```ruby
# slasher_development/resources/jenkins_versioned_svn.rb

actions :checkout
default_action :checkout

attribute :path, :kind_of => String, :name_attribute => true
attribute :repository, :kind_of => String
attribute :user, :kind_of => String
attribute :jenkins_job, :kind_of => String
```
```ruby
# slasher_development/providers/jenkins_versioned_svn.rb

use_inline_resources

source_credentials = data_bag_item('secret_stuff','jenkins')

action :checkout do
  jenkins_server, jenkins_user, jenkins_password = source_credentials.values_at('server','user','password')
  svn_user, svn_pass = data_bag_item('secret_deployment', 'svn').values_at('user','pass')

  j=DyDevelopment::JenkinsQuery.new(jenkins_server, jenkins_user, jenkins_password, @new_resource.jenkins_job)
  my_revision=j.last_successful_build_revision(@new_resource.repository)
  if my_revision then
    s = dy_subversion @new_resource.path do
      repository new_resource.repository
      revision my_revision
      svn_username svn_user
      svn_password svn_pass
      user new_resource.user
    end
    new_resource.updated_by_last_action(s.updated_by_last_action?)
  else
    Chef::Log.warn("#{@new_resource.jenkins_job} has no last successful build. Will not deploy")
  end
end
```
Again, this resource can be generalized to support more build types.
