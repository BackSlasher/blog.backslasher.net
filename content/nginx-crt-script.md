Title: Preparing Certificate files for Nginx
Date: 2015-07-05 15:00
Category: FOSS
Tags: nginx, security, ssl, scripts, ruby
Slug: nginx-crt-script

### The Story
When installing SSL certificates for nginx, assuming you're using certificate hierarchy (and not a self-signed ceritificate), you're required to concatenate all of the certificate files (`*.crt`) to a single file, starting from your site's certificate up to the root certificate.  
Today I got this bundle to prepare, courtesy of Comodo:
```text
AddTrustExternalCARoot.crt
best_site.crt
COMODORSAAddTrustCA.crt
COMODORSADomainValidationSecureServerCA.crt
```
Which certificate should follow my site's? Unclear, [even from their documentation](https://support.comodo.com/index.php?/Default/Knowledgebase/Article/View/620/0/which-is-root-which-is-intermediate).  
I made this ruby script, which uses some certificate metadata to recognize the relationship between the provided certificates.

### The Script
Provide the CRT file names as arguments, save the script's output as the new CRT. The proper order is printed to `STDERR`.
```ruby
require 'openssl'

# Load and parse files
crt_files=ARGV # Read all arguments as files
crts = crt_files.map{|f|
  cert = OpenSSL::X509::Certificate.new File.read f
  {
    name: f,
    parent: cert.extensions.find{|m|m.oid=='authorityKeyIdentifier'}.value.split("\n").find{|sf|sf[/^keyid/]}.gsub(/^keyid:/,''),
    son: cert.extensions.find{|m|m.oid=='subjectKeyIdentifier'}.value
  }
}

# Find the root, where parent is son
root = crts.find{|c|c[:parent]==c[:son]}
certs_sorted=[]
new_certs=[root]

# process new_certs until we're out
loop do
  certs_sorted|=new_certs
  new_new_certs = new_certs.map{|nc|
    crts.select{|c|c[:parent]==nc[:son]}
  }.flatten(1).uniq
  filtered_certs = new_new_certs - new_certs
  new_certs = filtered_certs
  break if new_certs.empty?
end

certs_sorted.reverse! # Reverse

STDERR.puts "Certificate order: #{certs_sorted.map{|c|c[:name]}.join(', ')}"
puts certs_sorted.map{|c| File.read(c[:name])}.join
```

### Interesting bits
I'm not sure if the method I'm using to construct the certificate tree is standard SSL stuff or unique to Comodo, but I noticed the certificates reference their parents in the `authorityKeyIdentifier` extension.  
Oddly enough, they don't reference the parent's serial number, but some other serial-like value that I find under `subjectKeyIdentifier` of the parent certificate.  
The loop isn't very interesting, but still full of neat ruby stuff like limited flattening, array subtraction and other stuff that "decent" languages would never allow.
