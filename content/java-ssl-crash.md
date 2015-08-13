Title: Troubleshooting story - Java HTTP client crashes on connections
Date: 2015-08-12 16:44
Category: FOSS
Tags: Ramblings, Java, SSL, HTTP, CentOS, Linux
Slug: java-ssl-crash

## Google Bait
This post isn't about the solution, but rather about the methodology. Anyway, to help people experiencing the same issue find this post:

* CentOS 6.6 (fresh from `chef/centos-6.6` Vagrant Box)
* Java 1.7.0 (`java-1.7.0-openjdk`)
* DOES NOT happen with Java 1.8.0 (`java-1.8.0-openjdk`)
* Happens because of interaction with `nss` (was version `3.16.1`, resolved when upgrading to `3.19.1`).

## The story
One of our boxes ships with Elasticsearch, and we also include a plugin called [BigDesk](http://bigdesk.org/) which provides monitoring.
To do so, we run the following command (with Chef):
```bash
/usr/share/elasticsearch/bin/plugin -install lukas-vlcek/bigdesk/2.5.0
```
Recently, it started failing on our Vagrant development VMs. When trying with `--verbose`, I got this:
```text
Trying http://download.elasticsearch.org/lukas-vlcek/bigdesk/bigdesk-2.5.0.zip...
Failed: IOException[Can't get http://download.elasticsearch.org/lukas-vlcek/bigdesk/bigdesk-2.5.0.zip to /usr/share/elasticsearch/plugins/bigdesk.zip]; nested: FileNotFoundException[http://download.elasticsearch.org/lukas-vlcek/bigdesk/bigdesk-2.5.0.zip]; nested: FileNotFoundException[http://download.elasticsearch.org/lukas-vlcek/bigdesk/bigdesk-2.5.0.zip]; 
Trying http://search.maven.org/remotecontent?filepath=lukas-vlcek/bigdesk/2.5.0/bigdesk-2.5.0.zip...
Failed: SSLException[java.security.ProviderException: java.security.KeyException]; nested: ProviderException[java.security.KeyException]; nested: KeyException; 
Trying https://oss.sonatype.org/service/local/repositories/releases/content/lukas-vlcek/bigdesk/2.5.0/bigdesk-2.5.0.zip...
Failed: SSLException[java.security.ProviderException: java.security.KeyException]; nested: ProviderException[java.security.KeyException]; nested: KeyException; 
Trying https://github.com/lukas-vlcek/bigdesk/archive/2.5.0.zip...
Failed: SSLException[java.security.ProviderException: java.security.KeyException]; nested: ProviderException[java.security.KeyException]; nested: KeyException; 
Trying https://github.com/lukas-vlcek/bigdesk/archive/master.zip...
Failed: SSLException[java.security.ProviderException: java.security.KeyException]; nested: ProviderException[java.security.KeyException]; nested: KeyException; 
Failed to install lukas-vlcek/bigdesk/2.5.0, reason: failed to download out of all possible locations..., use --verbose to get detailed information
```
As we can see, there is probably something wrong with the SSL handshake. cURLing to these URLs worked, so this is a client-specific issue.  

## Basic troubleshooting
I made this snippet to test the HTTP handshake and get the real error:
```java
import java.net.HttpURLConnection;
import java.net.URL;

public class Bla{
  public static void main(String[] args) throws Exception {
    System.out.print("Hello\n");
    String url="https://github.com/lukas-vlcek/bigdesk/archive/2.5.0.zip";
    try{
      HttpURLConnection httpConnection = (HttpURLConnection) new URL(url).openConnection();
      httpConnection.connect();
    }
    catch (Exception e){
      e.printStackTrace();
      System.out.print("Error\n");
    }
    System.out.print("About to loop\n");
    while(true){Thread.currentThread().sleep(1000);} //Crudest debug ever
  }
}
```

When running it, I got something like this:
```text
Hello
javax.net.ssl.SSLException: java.security.ProviderException: java.security.KeyException
        at sun.security.ssl.Alerts.getSSLException(Alerts.java:208)
        at sun.security.ssl.SSLSocketImpl.fatal(SSLSocketImpl.java:1916)
        at sun.security.ssl.SSLSocketImpl.fatal(SSLSocketImpl.java:1874)
        at sun.security.ssl.SSLSocketImpl.handleException(SSLSocketImpl.java:1857)
        at sun.security.ssl.SSLSocketImpl.startHandshake(SSLSocketImpl.java:1378)
        at sun.security.ssl.SSLSocketImpl.startHandshake(SSLSocketImpl.java:1355)
        at sun.net.www.protocol.https.HttpsClient.afterConnect(HttpsClient.java:559)
        at sun.net.www.protocol.https.AbstractDelegateHttpsURLConnection.connect(AbstractDelegateHttpsURLConnection.java:185)
        at sun.net.www.protocol.https.HttpsURLConnectionImpl.connect(HttpsURLConnectionImpl.java:153)
        at Bla.main(Bla.java:10)
Caused by: java.security.ProviderException: java.security.KeyException
        at sun.security.ec.ECKeyPairGenerator.generateKeyPair(ECKeyPairGenerator.java:146)
        at java.security.KeyPairGenerator$Delegate.generateKeyPair(KeyPairGenerator.java:704)
        at sun.security.ssl.ECDHCrypt.<init>(ECDHCrypt.java:78)
        at sun.security.ssl.ClientHandshaker.serverKeyExchange(ClientHandshaker.java:714)
        at sun.security.ssl.ClientHandshaker.processMessage(ClientHandshaker.java:278)
        at sun.security.ssl.Handshaker.processLoop(Handshaker.java:913)
        at sun.security.ssl.Handshaker.process_record(Handshaker.java:849)
        at sun.security.ssl.SSLSocketImpl.readRecord(SSLSocketImpl.java:1035)
        at sun.security.ssl.SSLSocketImpl.performInitialHandshake(SSLSocketImpl.java:1344)
        at sun.security.ssl.SSLSocketImpl.startHandshake(SSLSocketImpl.java:1371)
        ... 5 more
Caused by: java.security.KeyException
        at sun.security.ec.ECKeyPairGenerator.generateECKeyPair(Native Method)
        at sun.security.ec.ECKeyPairGenerator.generateKeyPair(ECKeyPairGenerator.java:126)
        ... 14 more
Error
About to loop
```
This, however, worked:
```bash
/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.51-1.b16.el6_7.x86_64/jre/bin/java Bla
```
Meaning this problem was java-1.7.0 specific.  
Upgrading everything (`sudo yum upgrade -y`) also solved it, but upgrading `java-1.7.0-openjdk` didn't, so it must be some external library.  
Running with SSL debugging, like `java -Djavax.net.debug=all Bla`, printed a lot of output, where the interesting part is:
```text
...
main, handling exception: java.security.ProviderException: java.security.KeyException
%% Invalidated:  [Session-1, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA]
main, SEND TLSv1 ALERT:  fatal, description = internal_error
...
```
So it's definitely some weird error (not something like untrusted CA or key expiration).

## Sysadmin Trickery
Thanks to putting my small snippet in an infinite loop, I could browse its `/proc` directory and dig around.  
I was really interested in which libraries it was using, since it wasn't cURL (which worked).  
I executed something like:
```bash
 cat /proc/$(pgrep -f Bla)/maps  | perl -a -ne 'print $F[5],$/' | sort | uniq
```
And got all of the memory-mapped files, which include loaded libraries. It looked like this:
```text

[heap]
/lib64/ld-2.12.so
/lib64/libc-2.12.so
/lib64/libdbus-1.so.3.4.0
/lib64/libdl-2.12.so
/lib64/libgcc_s-4.4.7-20120601.so.1
/lib64/libglib-2.0.so.0.2800.8
/lib64/libgmodule-2.0.so.0.2800.8
/lib64/libgobject-2.0.so.0.2800.8
/lib64/libgthread-2.0.so.0.2800.8
/lib64/libm-2.12.so
/lib64/libnspr4.so
/lib64/libnss_dns-2.12.so
/lib64/libnss_files-2.12.so
/lib64/libplc4.so
/lib64/libplds4.so
/lib64/libpthread-2.12.so
/lib64/libresolv-2.12.so
/lib64/librt-2.12.so
/lib64/libz.so.1.2.3
[stack]
/tmp/hsperfdata_vagrant/26329
/usr/lib64/libgconf-2.so.4.1.5
/usr/lib64/libnss3.so
/usr/lib64/libnssutil3.so
/usr/lib64/libORBit-2.so.0.1.0
/usr/lib64/libsmime3.so
/usr/lib64/libssl3.so
/usr/lib64/libstdc++.so.6.0.13
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/bin/java
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/lib/amd64/jli/libjli.so
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/lib/amd64/libjava.so
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/lib/amd64/libnet.so
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/lib/amd64/libsunec.so
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/lib/amd64/libverify.so
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/lib/amd64/libzip.so
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/lib/amd64/server/libjvm.so
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/lib/ext/gnome-java-bridge.jar
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/lib/ext/pulse-java.jar
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/lib/ext/sunec.jar
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/lib/ext/sunjce_provider.jar
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/lib/ext/sunpkcs11.jar
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/lib/jce.jar
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/lib/jsse.jar
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/lib/resources.jar
/usr/lib/jvm/java-1.7.0-openjdk-1.7.0.85.x86_64/jre/lib/rt.jar
/usr/lib/locale/locale-archive
[vdso]
[vsyscall]
```
The interesting bit is obviously `/usr/lib64/libssl3.so`, so I wanted to see where it's coming from:
```bash
yum provides /usr/lib64/libssl3.so
```
Which got me `nss`.  
Upgrading `nss` (`sudo yum upgrade nss`) solved the problem.

## Post-op tests
I was curious about why Java 1.8.0 works, and used the same looping trick to inspect its loaded libraries. Turns out it wasn't loading nss but rather using some internal SSL implementation.  
This was confirmed by [some comment](https://bugzilla.redhat.com/show_bug.cgi?id=1167153#c26) on the RedHat bugtracker.

## My solution
Since this problem only occurs in our Vagrant VMs (because the production machines are kept up to date, and the Vagrant ones are created from the same template over and over), I chose to use some Chef hackery:
```ruby
package 'nss' do
  version '3.19.1-3.el6_6'
  only_if {
    vagrant?(node) # Checking if current node is a Vagrant VM
  }
end
```
Now everything is working.
