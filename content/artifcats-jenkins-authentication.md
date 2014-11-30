Title: Downloading Artifacts from Jenkins with Authentication
Date: 2014-11-27 15:12
Category: FOSS
Tags: Jenkins, Linux, Security, HTTP

### Some Background

Jenkins is a platform for build automation, and as such allows you to store the results of the build (the binaries, commonly known as "artifacts") for later.  
![](|filename|/images/artifacts-jenkins-authentication/jenkins-ui1.png)  
<!-- PELICAN_END_SUMMARY -->
I saw other people on the internet manually downloading their results via the web UI:  
![](|filename|/images/artifacts-jenkins-authentication/jenkins-ui2.png)  
However, I wanted to pull the artifacts from my automation platform (currently Chef), and ran into an authentication predicament.

### The Problem
Normally, when using HTTP basic authentication, there's a "challenge-response" mechanism, looking something like this:  
![](|filename|/images/artifacts-jenkins-authentication/http-auth.png)  

However, Jenkins [doesn't challenge clients for credentials](https://wiki.jenkins-ci.org/display/JENKINS/Authenticating+scripted+clients) (response 401), and instead fails immediatly (response 403).  
This is called ["Preemptive authentication"](http://hc.apache.org/httpclient-3.x/authentication.html#Preemptive_Authentication), and is considered a bad habit because the client hands out credentials when it's not definitely required. Therefore, most clients require special configuration to handle this.  
For instance, when using `wget`, one can use:
```bash
wget --auth-no-challenge --http-user=USER --http-password=BESTPASS http://server/jenkins
```
However, when using any tool where the URL is implicit, such as [PIP](https://pip.pypa.io/en/latest/reference/pip_install.html) or Chef's [remote_file](https://docs.getchef.com/resource_remote_file.html), I can only provide credentials by specifying them in the URL (e.g. `http://back:slasher@private.com/repo`), so I don't have any way of modifying the authentication method.

The result - I can't download artifacts directly from Jenkins, messing up my deployment cookbooks.  
I thought about storing the results in a secondary server to act as a repo, but I really liked having Jenkins automatic maintenance (only keeping the last successful build's artifact) and the simplicity of downloading from Jenkins directly, because less steps in building-downloading-installing means less places to fail.

### The Solution
I ended up using Apache on the Jenkins server as a credentials-requiring-proxy, meaning that:

1. Apache will require credentials using the good-old "challenge-response" method
2. Apache will forward the request, including the now-provided crednetials, to Jenkins
3. Jenkins will do it's thing, providing the latest build's artifacts

The setup was as pretty standard reverse proxy, except for the authentication part - I needed Apache to require credetials, but accept any non-empty set.  
I used [mod_authn_anon](http://httpd.apache.org/docs/2.2/mod/mod_authn_anon.html) to require authentication with `*` as the value, causing it to accept any user/password provided.  
The result looks like this:
~~~apache
<VirtualHost *:1234>
<Location />
    # Allow any user, but require one
    Anonymous *
    AuthType basic
    AuthName 'Jenkins Proxy'
    AuthBasicProvider anon
    Require valid-user
</Location>
ProxyPass / http://localhost:1111/
</VirtualHost>
~~~
Where `http://localhost:1111/` is Jenkins' normal web UI.  
Since I only use "end" URLs (as in not following redirections from the server), I didn't need to add a [ProxyPassReverse](http://httpd.apache.org/docs/2.2/mod/mod_proxy.html#proxypassreverse) directive like `ProxyPassReverse / http://localhost:1111/`, which causes Apache to rewrite HTTP headers to match the proxy rather than the original server.

I won't post the entire apache configuration, because it's pretty trivial. However, the modules I needed are:

* mod_proxy
* mod_proxy_http
* mod_auth_basic
* mod_authn_anon

Now everything works and I'm happy.

### Attribution
* HTTP Authentication diagram from [Oracle](https://docs.oracle.com/cd/E19226-01/820-7627/bncbo/index.html)
* Wget configuration for Jenkins - [Ed Bragg](http://www.braggfamily.com/2013/03/download-artifacts-from-jenkins-with.html)
