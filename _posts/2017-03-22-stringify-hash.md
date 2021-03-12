---
title: Stringify Hash Keys in Ruby
categories:
- FOSS
tags:
  - Ruby
  - Scripts
---

## Why I didn't want sybols in my YAML

Apperantly, `Psych` (Ruby's default YAML lib) does not convert symbols to strings when creating YAML:
```ruby
require 'yaml'
puts 'a'.to_yaml
# --- a
# ...
puts :a.to_yaml
# --- :a
# ...
```
The Python YAML library keeps those colons, are they're not special chars in YAML:
```python
import yaml
print yaml.safe_load('--- :a\n...')
# :a
```

So if you're writing YAML hash that should have specific keys (e.g. "tasks") for Python consumption, you can't pass `:tasks` as a key.

In Ruby, sometimes you want to use recursive functions. However, sometimes you can't define functions and use them easily (e.g. inside ERB templates).  
This is a small example for a recursive lambda expression. I know it's not the fanciest, but it's easy to understand.
```
# This lambda is basically to stringify the hash's keys
string_keys = lambda do |hash|
  syms = hash.keys.select{|k| k.class == Symbol}
  syms.each do |k|
    hash[k.to_s] = hash.delete(k)
  end
end
rec_string_keys = lambda do |selff, hash|
  string_keys[hash]
  hash.values.select{|v| v.is_a? Hash}.each{|h| selff[selff,h]}
end
rec_string_keys[rec_string_keys, @config]
```
