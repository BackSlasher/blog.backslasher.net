Title: Managing Jenkins API Tokens
Date: 2015-12-31 00:00
Category: FOSS
Tags: Jenkins, Security, Scripts, Groovy
Slug: jenkins-token

## The problem

[Api Tokens](https://wiki.jenkins-ci.org/display/JENKINS/Authenticating+scripted+clients) are like user passwords, except they are always managed by Jenkins (even if you're using an external authentication scheme), and can only be used for "API" actions (e.g. using `curl`).  
The storage scheme of these tokens is a little weird - the stored value is hashed and then compared to the user-submitted input (usually the process goes the other way around):

    :::groovy
    // https://github.com/jenkinsci/jenkins/blob/master/core/src/main/java/jenkins/security/ApiTokenProperty.java#L111
    public boolean matchesPassword(String password) {
        return  getApiTokenInsecure().equals(password);
    }

<!-- -->

    :::groovy
    // https://github.com/jenkinsci/jenkins/blob/master/core/src/main/java/jenkins/security/ApiTokenProperty.java#L99
    @Nonnull
    @Restricted(NoExternalUse.class)
    /*package*/ String getApiTokenInsecure() {
        String p = apiToken.getPlainText();
        if (p.equals(Util.getDigestOf(Jenkins.getInstance().getSecretKey()+":"+user.getId()))) {
            // if the current token is the initial value created by pre SECURITY-49 Jenkins, we can't use that.
            // force using the newer value
            apiToken = Secret.fromString(p=API_KEY_SEED.mac(user.getId()));
        }
        return Util.getDigestOf(p);
    }


The implication of this is that in order to modify the API token, it's not enough to know the token, but rather the "seed" used to calculate it. One could say that the UI/API doesn't offer a way to set the token directly anyway (only to [generate a random one](https://github.com/jenkinsci/jenkins/blob/master/core/src/main/java/jenkins/security/ApiTokenProperty.java#L148)), but I still don't see the logic behind this.  
Because of the storage scheme, the normal "ensure password is XYZ" action one would expect is split into 2 actions:

* Calculate the token from the current seed and compare it to our required token, and if there's a mismatch, get angry (provided the required token)
* Compare the seed to our required seed, and modify it if it mismatches (provided the required seed)

I don't want my clients to depend on the hashing method done by Jenkins, so I have to present them with the token.  
I also want to be able to reset the token if it diverges (rather than throw a tantrum), so I have to keep the seed.
So sadly I have to keep both.  

## The solution
I created this Groovy script to do both tasks (modify the seed if needed, and ensure it matches the token):

    :::groovy
    def username = '???'
    def token = '???'
    def seed = '???' // Leave null if unkown

    import hudson.model.User;
    import jenkins.security.ApiTokenProperty;
    import hudson.util.Secret;

    // Get the actual token
    u = User.get(username)
    tokprop =  u.getProperty(ApiTokenProperty.class)
    actual_token = tok.getApiTokenInsecure()

    // Get pissed if not equal
    if (token != actual_token)
      if (seed) { // Try to modify seed
        tokprop.apiToken = Secret.fromString(seed)
        // Check that seed will yield required token
        if (token == tokprop.getApiTokenInsecure())
          u.save()
        else
          throw new Exception(sprintf('Token mismatch, seed wont cause token to become required token\\ncurrent key:%s\\nresulting key:%s',[actual_token, tokprop.getApiTokenInsecure()]))
      }
      else
        // Can't set a better token, just complain
        throw new Exception(sprintf('Mismatching tokens. Actual token:%s', [actual_token]))

I actually implemented this as a LWRP in Chef using the `jenkins_script` resource found in the [Jenkins cookbook](https://github.com/chef-cookbooks/jenkins). If the implementation is interesting, leave me a comment and I might add it.

**Update 20.02.16**: Here is my current implementation
### Chef implementation
resources/jenkins\_key:
```ruby
actions :set
default_action :set

attribute :user, kind_of: String, name_attribute: true
attribute :key, kind_of: String, required: true # We can't set this, only verify it matches
                                               # This is because the actual key is being realtime-hashed from some string
attribute :raw_key, kind_of: String, default: nil # Used to allow setting the new key
```
providers/jenkins\_key:
```ruby
use_inline_resources

action :set do

  jenkins_script 'ensure_key' do
    command <<-EOH
    def username = '#{new_resource.user}'
    def wanted_key = '#{new_resource.key}'
    def raw_key = '#{new_resource.raw_key.to_s}'

    import hudson.model.User;
    import jenkins.security.ApiTokenProperty;
    import hudson.util.Secret;

    // Get the actual key
    u = User.get(username)
    tok =  u.getProperty(ApiTokenProperty.class)
    actual_key = tok.getApiTokenInsecure()

    // Get pissed if not equal
    if (wanted_key != actual_key)
      if (raw_key) {
        old_key = tok.getApiTokenInsecure()
        tok.apiToken = Secret.fromString(raw_key)
        // Check that raw key will yield required key
        if (wanted_key == tok.getApiTokenInsecure())
          u.save()
        else
          throw new Exception(sprintf('Key mismatch, raw_key wont cause wanted_key to become actualy key\\ncurrent key:%s\\nresulting key:%s',[actual_key, tok.getApiTokenInsecure()]))
      }
      else
        // Can't set a better key, just complain
        throw new Exception(sprintf('Mismatching keys. Actual key:%s', [actual_key]))
    EOH
  end
end
```
