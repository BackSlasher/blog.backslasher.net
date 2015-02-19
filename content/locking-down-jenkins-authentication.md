Title: Locking Down Jenkins' Authentication
Date: 2015-02-17 12:00
Category: FOSS
Tags: Linux, Java, Security, Jenkins
Slug: locking-down-jenkins-authentication

### Update 19.02.15
After posting my script in the Jenkins mailing list, I was told about a simpler way for implmenting my authorization strategy. I'm leaving this post because the things I learnt from developing the plugin are still valuable and may help someone someday.

### The REAL solution

We'll be using the "Matrix-based security" strategy, and give the group "authenticated" administrative permissions.

#### Via GUI
Go to "Configure Global Security" under "Manage Jenkins" and do like this:  
![](|filename|images/locking-down-jenkins-authentication/matrix-auth.png)  

#### Via CLI
This is what I actually use:
```groovy
def instance = Jenkins.getInstance()

def strategy = new hudson.security.GlobalMatrixAuthorizationStrategy()
strategy.add(Jenkins.ADMINISTER,'authenticated')
instance.setAuthorizationStrategy(strategy)

instance.save()
```

### The Story
I was tasked with automating and securing our Jenkins CI server.  
I found the [Jenkins cookbook](https://github.com/opscode-cookbooks/jenkins) very helpful, and used a little groovy (less-anal Java) script found in the repo's `README.md` to set the following security policy:

* Authentication is done via BitBucket (using the [bitbucket plugin](https://wiki.jenkins-ci.org/display/JENKINS/Bitbucket+OAuth+Plugin))
* Logged in users are allowed to do everything (since [groups aren't supported](https://github.com/jenkinsci/bitbucket-oauth-plugin/blob/155e11cf43372d0148429509035effa9e147ae54/src/main/java/org/jenkinsci/plugins/BitbucketSecurityRealm.java#L175) yet by the BitBucket plugin)

The script looks like this:
```groovy
import jenkins.model.*
import hudson.security.*
import org.jenkinsci.plugins.*

def instance = Jenkins.getInstance()

def githubRealm = new BitbucketSecurityRealm(
  'API_KEY',
  'API_SECRET'
)
instance.setSecurityRealm(githubRealm)

def strategy = new FullControlOnceLoggedInAuthorizationStrategy()
instance.setAuthorizationStrategy(strategy)

instance.save()
```

However, I was not happy

### The Problem
As I could have seen from the explanation attached to "Logged-in users can do anything":
```text
In this mode, every logged-in user gets full control of Jenkins. The only user who won't have full control is anonymous user, who only gets read access.

This mode is useful to force users to log in before taking actions, so that you can keep record of who has done what. This setting can be also used in public-facing Jenkins, where you only allow trusted users to have user accounts.
```
So as we quickly found out, anonymous users can view our build specs and download our code. This is fine when developing FOSS, but bad when developing regular software.  
![](|filename|/images/locking-down-jenkins-authentication/anon-dl.png)

Browsing the [source code](https://github.com/kohsuke/hudson/blob/master/core/src/main/java/hudson/security/FullControlOnceLoggedInAuthorizationStrategy.java#L58) for Jenkins, I found the problem.  
Under the constructor for `FullControlOnceLoggedInAuthorizationStrategy`, there is a line giving anonymous users "read":
```java
THE_ACL.add(ACL.ANONYMOUS,Permission.READ,true);
```
Said authorization strategy offers no configuration, so I can't tell it not to give anonymous any priviileges at all.

### Failed Attempts
#### Different Strategy
Other authorization strategies proved useless:  
![](|filename|/images/locking-down-jenkins-authentication/auths.png)  

* **Anyone can do anything**: Just no.
* **Legacy mode**: Requires groups, so not applicable.
* **Matrix-based security**: Requires me specifying every teammate, so while it might work, it's annoying.  
  I also attempted to specify `EVERYONE` (and `Everyone` and `everyone`) hoping it'll mean "Everyone who's logged in", but that didn't work.
* **Project-based Matrix Authorization Strategy**: Same as previous, even more work.

#### Generalizing
I tried using the script console to set the authorization strategy to the `AuthorizationStrategy` class, so I can customize it later.  
Unfortunately, it's an abstract class, so it can't be done.

#### Groovy Customizing
I used a groovy script to generate my own strategy class, copying the original `FullControlOnceLoggedInAuthorizationStrategy` class and removing the annoying line:
```diff
  static {
    THE_ACL.add(ACL.EVERYONE, Jenkins.ADMINISTER,true);
    THE_ACL.add(ACL.ANONYMOUS, Jenkins.ADMINISTER,false);
-   THE_ACL.add(ACL.ANONYMOUS,Permission.READ,true);
  }
```
And then instanciating and setting as my authorization strategy.
This worked beautifully, until I restarted the service. Since the class only existed in memory, Jenkins couldn't re-instantiate its auth strategy, and refused to do anything until I manually fixed it using the config file (`$JENKINS_HOME/config.xml`)

### The Solution
Eventually, I wrote a Jenkins Plugin that mimicked the original strategy without said line.
The process is composed of these stages, which I found non-trivial (as a mere Java junior), so I wanted to detail them:

1. Use a VM so you don't mess anything up. I used Ubuntu 14.10 via Vagrant, but everything goes.
2. Install JDK and Maven on said VM. For you Ubuntu guys, it's easy: `sudo apt-get install openjdk-7-jdk maven`
3. *Optional:* Install Jenkins on the VM. Makes testing much easier.
4. Take a peek at [the tutorial](https://wiki.jenkins-ci.org/display/JENKINS/Plugin+tutorial). Namely, edit your ` ~/.m2/settings.xml` file
5. Create a placeholder using `mvn -U org.jenkins-ci.tools:maven-hpi-plugin:create` in the project's parent directory (the command will create the project directory for you).  
  There are some questions to be answered, the tutorial explains them and if you don't like the result you can wipe and start over.
6. Build the plugin (`mvn` in the project directory) after creation, to make Maven download all of its dependencies now. This might take a while.
7. Modify the filesystem. These are some pointers that I discovered:  
    1. Place all of your code in the `src/main/java` directory (and inside according to your package hierarchy.
    2. Modify the `src/main/resources/index.jelly` to describe your project
    3. Create a file under `src/main/resources/<package hierarchy>/<class name>/help.html` to provide help for your plugin. Not sure if that's needed for all plugins, but it was automatically used for my authorization strategy.
    4. Create a file under `src/main/resources/org/jenkinsci/plugins/<class name, only alphanumeric>/Messages.properties` to contain messages for your plugin, like:
	
	        :::ini
			BestPlugin.DisplayName=Best plugin everrrrrrrrrr

         You can later internationalize this file (I haven't). The properties are accessed by doing this in your actual file:

            :::java
			import org.jenkinsci.plugins.CLASSNAMEALPHANUMERIC.Messages;
			String prop=Messages.BestPlugin_DisplayName();
			
8. Compile, test, cry. This is my noobish helper script:

        :::bash
        mvn clean && mvn && sudo cp target/PLUGINNAME.hpi /var/lib/jenkins/plugins/PLUGINNAME.hpi  && sudo service jenkins restart

9. [Publish the plugin](https://wiki.jenkins-ci.org/display/JENKINS/Hosting+Plugins) to the community, if you want to.

### TL;DR
![](|filename|images/locking-down-jenkins-authentication/myauth.png)  
My <s>plugin works</s> (removed), and all anonymous users are recirected to a BitBucket login page
![](|filename|images/locking-down-jenkins-authentication/bblogin.png)

I set it from the (almost) identical groovy script:
```groovy
import jenkins.model.*
import hudson.security.*
import org.jenkinsci.plugins.*

def instance = Jenkins.getInstance()

def githubRealm = new BitbucketSecurityRealm(
  'API_KEY',
  'API_SECRET'
)
instance.setSecurityRealm(githubRealm)

def strategy = new net.backslasher.jenkins.LockdownFullControlOnceLoggedInAuthorizationStrategy()
instance.setAuthorizationStrategy(strategy)

instance.save()
```
By the way, I'm not afraid of idempotence issues, since the objects modified by this code have no state (so while not ideal, I don't care about them being recreated over and over).  

<s>I'm planning to release a stable version, add a README file, upload to the Jenkins wiki etc soon.  
PRs are welcome.</s> Removed
