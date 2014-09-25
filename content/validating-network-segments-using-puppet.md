Title: Validating network segments using Puppet
Date: 2014-09-25 13:10
Category: FOSS
Tags: Puppet, Networking, Regex
Slug: validating-network-segments-using-puppet

## The Problem
When configuring KeepaliveD using Puppet, sometimes an interface name has to be used. Imagine a server with 2 interfaces (`eth0`,`eth1`), where one is facing the internal network and one is facing the internet.  
My puppet configuration for an internet-facing virtual interface can be something like:
```puppet
keepalived::vrrp::instance { 'external_interface':
    interface         => 'eth1',
    state             => 'MASTER',
    virtual_router_id => '50',
    priority          => '100',
    virtual_ipaddress => [ '10.0.0.50', '10.0.0.51', '10.0.0.52' ],
}
```
However, by doing so, I'm assuming that eth1 is the external network interface. When configuring the server manually, I use `ifconfig` to manually check for misconfigurations (e.g. `eth0` is the internet-facing interface). I'd like to do the same on Puppet.

## The Solution
Until I have the courage to automatically rename my network devices, I configured Puppet to fail the catalog compilation (thus avoid misconfiguring KeepaliveD) whenever an adapter doesn't have the address I expect it to be (meaning it's misconfigured). I use this:
```puppet
define segment_verify(
    $iface_name=$title,
    $required_network=undef,
    $segment_regex=undef
){

    # resolve network
    if $segment_regex {
        if $required_network { fail( 'Cannot define both required_network and segment_regex' ) }
        else { $regex = $segment_regex }
    } else {
        case $required_network {
            private: { $regex = '^10\.0\.0\.' }
            public:  { $regex = '^192\.44\.283\.$' }
            default: { fail( "Unkown required_network '${required_network}'" ) }
        }
    }

    $ip = inline_template("<%=@ipaddress_${iface_name}%>")
    if !$ip { fail("Could not find IP of interface $iface_name") }
    else {
        $match = inline_template("<%=if /${regex}/.match('${ip}') then 'yes' else 'no' end %>")
        if $match != 'yes' { fail( "Interface ${iface_name} with IP ${ip} doesn't match '${regex}'" ) }
    }
}
```
As you can see, this code is hardly elegant. I can't use CIDR notations ("10.0.0.0/24") and I use ruby templates for the regex. However, it works.  
This form of work is imposed on me because Puppet's DSL is designed to be declarative rather than procedural, so many "procedural" bits are broken. In my case, there is no possibility to convert a provided string (`^10\.0\.0\.`) to a regular expression, so I have to accomplish that using templates. Same oddity for getting `ipaddress_ETHNAME`.

I guess I could use a local resource rather than a function, but this method does its trick - it allows me to specify a network adapter and a regex its IP should match to, and fail the catalog if it's not so. For instance:
```puppet
segment_verify{ 'eth0':
	required_network => 'private',
}

segment_verify { 'eth1_ends_with_100',
	iface_name    => 'eth1',
	segment_regex => '\.100$'
}
```
