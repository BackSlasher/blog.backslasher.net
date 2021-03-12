---
title: Chef "Share This" script
categories:
- FOSS
tags:
  - Chef
  - Ruby
  - Scripts
---

I wrote this little script to upload the current cookbook to the Chef Supermarket.  
It should be run from within the cookbook's directory.

```bash
#!/bin/bash
knife cookbook site share -o ../ $(basename $(realpath .)) -c ~/.chef/knife-supermarket.rb
```

Where my supermarket config is as simple as:
```ruby
node_name 'SUPERMARKET_USERNAME'
client_key 'CLIENTKEY_LOCATION'
```

### Interesting points:

* I'm using a specific Knife config file (that references the Supermarket credentials file)
* The entire `-o ../ $(basename $(realpath .))` bit tells Knife our "cookbook library" is `..` (the parent directory) and the "cookbook name" is our current directory's name.  
    Assuming we're running the script in `~/projects/cookbooks/backslasher-python`, it'll be similar to `-o ~/projects/cookbooks/ backslasher-python`
