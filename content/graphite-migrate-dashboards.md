Title: Migrating Graphite's Dashboards
Date: 2015-08-10 12:00
Category: FOSS
Tags: Graphite, Ruby, Scripts
Slug: graphite-migrate-dashboards

I just made a small script to migrate dashboards between two graphite servers.  
Couldn't find a similar one anywhere, so I thought I'd upload it.  
Note it's using [http](https://github.com/httprb/http) for its HTTP calls. It looks real nice.
```ruby
old_server='http://old.server.com:1234'
new_server='http://better.server.com:123'
creds=['top','secret']

require 'http'
require 'json'
h=HTTP.basic_auth(user: creds[0], pass: creds[1])

board_names=JSON.parse(h.post("#{old_server}/dashboard/find/", form: {query:''}).to_s)['dashboards'].map{|n|n['name']}

board_names.each do |b|
    dat=h.get("#{old_server}/dashboard/load/#{b}").to_s
    state_str=JSON.parse(dat)['state'].to_json # :(
    h.post("#{new_server}/dashboard/save/#{b}", form: {state: state_str})
    [b,dat]
end
```
