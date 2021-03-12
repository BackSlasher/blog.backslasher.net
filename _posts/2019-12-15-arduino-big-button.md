---
title: The BIG BUTTON with Arduino
categories:
- FOSS
tags:
  - arduino
  - linux
---

I've created a dramatic big button, that actually sends key presses to the computer.  
It's connected to the computer via USB, and programmable via the same connection, meaning we can change the key presses it sends as we like.

![](/assets/arduino-big-button/button.jpg)

## The button
I got a factory button from eBay. The listing is no longer available, but you can see it in the pictures.  
Eventually, it doesn't matter as long as the button has enough room for the Arduino to fit in.

## Arduino
I got an Arduino Leonardo knockoff on ebay ([link](https://www.ebay.com/itm/Arduino-Pro-Micro-USB-komp-ATmega-32U4-5V-3-3V-16MHz-Leonardo-Mini-Entwicklu/253050640080)).  
I liked it because:

1. It's small, meaning it can fit inside the button.
2. It can operate as a HID (Human Interface Device), meaning it can send key presses to the computer (no special drivers needed!)

Sadly, I didn't photograph the internal connections (I was so excited that everything works), but everything is pretty simple.  
All buttons connected to `GND` on one side, and a separate pin on the other. You can infer it from the code. They're set up using `pinMode(pin_num, INPUT_PULLUP);`.   
The contraption is powered via the same USB connection it's using to send keypresses.

## The code
I added it to GitHub because it's free. I call it [tributton.ino](https://github.com/BackSlasher/arduino-button/blob/master/tributton.ino).  
The "business logic" part looks like:
```c
void setButtons() {
  int buttonGreen = !digitalRead(buttonGreenPin);
  int buttonRed = digitalRead(buttonRedPin);
  int buttonBreak = digitalRead(buttonBreakPin);
  
  if(buttonBreak) {
    return;
  } else if (buttonGreen) {
    Keyboard.write(GREEN_KEY);
  } else if (buttonRed) {
    Keyboard.write(RED_KEY);
  }
}
```

Share your version with me please!
