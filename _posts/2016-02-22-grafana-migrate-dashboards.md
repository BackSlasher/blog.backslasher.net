---
title: Migrating Grafana's Dashboards
categories:
- FOSS
tags:
  - Grafana
  - Ruby
  - Scripts
---

Similar to my [Graphite dashboard migration script](|filename|/graphite-migrate-dashboards.md), I made a Grafana one.  
I'm targeting Grafana v2+.  
Note it's using [http](https://github.com/httprb/http) for its HTTP calls.
```ruby
old_server='http://OLDY'
new_server='http://NEWY'
creds=['user','pass']

require 'http'
require 'json'
h=HTTP.basic_auth(user: creds[0], pass: creds[1])

board_names=JSON.parse(h.get("#{old_server}/api/search").to_s).map{|i|i['uri'].gsub(/^db\//,'')}

board_names.map do |b|
    dat=JSON.parse(h.get("#{old_server}/api/dashboards/db/#{b}").to_s)
    dat['dashboard'].delete('id')
    resp = h.post("#{new_server}/api/dashboards/db", body: {dashboard: dat['dashboard'], overwrite: true}.to_json, headers: {'Content-Type'=>'application/json'} )
    [b,resp.body.to_s]
end
```
