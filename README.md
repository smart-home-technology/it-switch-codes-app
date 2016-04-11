## Intertechno SMS Switch Message Generator

![SMS Switch](https://smart-home-technology.github.io/it-switch-codes-app/img/SMSSwitch_Icon.png) ![Smart Home Technology GmbH](https://smart-home-technology.github.io/it-switch-codes-app/img/SmartHomeTechnologyGmbH.png)

### See the [live app](https://smart-home-technology.github.io/it-switch-codes-app).

Using this little webapp here you can freely generate all the SMS messages as they are being used in the [Intertechno SMS Switch](https://smart-home-technology.ch/en/products/consumer/sms-switch). Messages that can be generated are as follows:

 - On/Off/Dim commands for receivers
 - Turn on/off feedback and save feedback numbers
 - Set timers that run autonomously on gateway

Essentially it provides an encoding javascript module - which you could use on its own (see [js/IntertechnoSwitchMessenger.js](https://github.com/smart-home-technology/it-switch-codes-app/blob/master/js/IntertechnoSwitchMessenger.js)) - or together with the web-frontend. The former might be interesting to use in combination with an app of your own.

As an interesting sidenote: the generated commands can also be used in conjuction with the [Intertechno BT Switch](https://smart-home-technology.ch/en/products/consumer/bt-switch) but this gateway relies on a different and less easily-accessible communication interface (bluetooth that is).

This source code is happily provided by [Smart Home Technology GmbH](https://smart-home-technology.ch).



***
_MIT License_

Copyright (c) 2016 Smart Home Technology GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.