Title: Running Xbox360 controllers on Ubuntu
Date: 2015-09-06 10:00
Category: FOSS
Tags: xbox, ubuntu, steam
Slug: xbox360-controller-ubuntu

![](|filename|/images/xbox360-controller-ubuntu/ubuntu360.png)

I wanted to write a few lines on how I configured my controller on Ubuntu to work with Steam games, since I discovered some neat stuff.

### What I've got
* [Xbox 360 wireless standard controller](http://www.xbox.com/en-US/xbox-360/accessories/controllers/wireless-controller-with-play-and-charge-kit), with cable (the one you use with the Xbox 360 console)
* [Xbox 360 Gaming Reciever](http://www.amazon.com/Xbox-Wireless-Gaming-Receiver-Windows/dp/B000HZFCT2)
* Ubuntu 14.04.3 LTS
* Steam, as installed from the Ubuntu repo

If your inventory differs, you might have other issues.

## The play and charge is a lie
The cable can't transfer any data, and is useless for connecting the gamepad to the computer.  
```text
Controller:        Microsoft Xbox 360 Play&Charge Kit
Vendor/Product:    045e:028f
USB Path:          003:029
Controller Type:   Xbox360 Play&Charge

-- [ ERROR ] ------------------------------------------------------
The Xbox360 Play&Charge cable is for recharging only, it does not transmit data, thus xboxdrv can't support it. You have to get a wireless receiver:

* http://www.xbox.com/en-ca/hardware/x/xbox360wirelessgamingreceiver/
-------
```
Above is `xboxdrv` reproaching me for trying to work with the cable.

## xpad
(not the [Ubuntu package](https://apps.ubuntu.com/cat/applications/xpad/) that emulates sticky notes).  
A  kernel module in charge of interfacing with gamepads, now bundled with Ubuntu. [See more here](https://help.ubuntu.com/community/Xbox360Controller).  
This module handles regular Xbox 360 controllers (see "What I've got" above) well enough, but some games didn't recognize the controller.  
It also does nothing to indicate the controller was recognized - the controller keeps blinking (like it's searching for an owner), and no message in `dmesg` or any log (`/var/log/{syslog,kern.log,dmesg}`).  
The reason is that the driver registers 4 controllers (`/dev/input/js{0,1,2,3}`) when the reciever is plugged in, so nothing happens when it's detecting a new actual controller.

## xboxdrv
An alternative userspace driver avaialble from the Ubuntu repos.  
To run it, you first have to unload the xpad module using `sudo rmmod xpad` or by supplying `-d` to xboxdrv. It can also be [blacklisted](http://askubuntu.com/q/110341).  
It has to be run as root (because it handles raw input devices), and gives much more visibilty to the controller's state (for instance, it sets the controller's status LED to indicate that the controller is connected).  
Some games only detected my input when running `xboxdrv` with `--mimic-xpad`, even though they wouldn't work with the real `xpad`. Weird.
It has a lot of interesting arguments (really) and the manpage is really worth a read (`man xboxdrv`). I think the secret to success is trying different kinds of configurations.

## Steam Games and Gamepads
When using Steam's [Big Picture](http://store.steampowered.com/bigpicture) (accessible by pressing the big Xbox logo while browsing steam), games with the gamepad icon are supposed to support gamepads (duh).  
![](|filename|/images/xbox360-controller-ubuntu/meatboy.png)

I'm going to list a few games I managed to get working with the controller, so you'll know that if you can't get these working, you have some configuration issue.  
Please let me know if you have any insights / additions!
### Works with xpad
Since these work with the default setup, I didn't test them on xboxdrv.

* [VVVVVV](http://store.steampowered.com/app/70300)
* [Super Meat Boy](http://store.steampowered.com/app/40800) - so much better with a gamepad!
* [Mercenary Kings](http://store.steampowered.com/app/218820)
* [Outland](http://store.steampowered.com/app/305050)

### Works with xboxdrv
* [The Binding of Isaac](http://store.steampowered.com/app/113200) - required `--mimic-xpad`
* [Cook, Serve, Delicious!](http://store.steampowered.com/app/247020) - required `--mimic-xpad`

## Image Attribution
First image taken from here: [https://scognito.wordpress.com/2009/11/18/streaming-movies-and-music-from-ubuntu-to-xbox360/](https://scognito.wordpress.com/2009/11/18/streaming-movies-and-music-from-ubuntu-to-xbox360/)
