<p align="center">
    <img src="https://i.imgur.com/w7nyvOl.png" height="200">
</p>


# Instances!Platform v1.4

[![npm](https://img.shields.io/npm/v/homebridge-instances-platform.svg?style=flat-square)](https://www.npmjs.com/package/homebridge-instances-platform)
[![npm](https://img.shields.io/npm/dt/homebridge-instances-platform.svg?style=flat-square)](https://www.npmjs.com/package/homebridge-instances-platform)
[![GitHub last commit](https://img.shields.io/github/last-commit/SeydX/homebridge-instances-platform.svg?style=flat-square)](https://github.com/SeydX/homebridge-instances-platform)
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg?style=flat-square&maxAge=2592000)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NP4T3KASWQLD8)

**Creating and maintaining Homebridge plugins consume a lot of time and effort, if you would like to share your appreciation, feel free to "Star" or donate.**

<img src="https://raw.githubusercontent.com/SeydX/homebridge-instances-platform/master/images/69E0F798-BCB6-4F15-B279-7C44AE311FC6.gif" align="right" alt="HomeKit Overview" width="270px" height="541px">

This is a dynamic platform plugin for [Homebridge](https://github.com/nfarina/homebridge) to control your **homebridge instance(s)**. It is capable to dynamically add or remove services, depending on if service is enabled or disabled! It is also possible to add a listener to your journalctl. The listener will listen on errors and will send a notification (via telegram) if a service crashes.

This plugin supports following functions:

**Main Switch:**
- **Temperature:** Shows current CPU temperature
- **Uptime:** Shows uptime of the computer
- **CPU Usage:** Shows summarized CPU usage of all detected services
- **RAM Usage:** Shows summarized CPU usage of all detected services
- **Disk Space:** Shows available disk space
- **Updatable Plugins:** Shows amount of updatable plugins and extra switch to update all plugins
- ~~**Accessories:** Shows amount of published accessories (only for homebridge instances in insecure mode (-I) and Pin 031-45-154~~ (removed)

**Services:**
- **Service Power Switch:** Start/Stop Homebridge Instance
- **Service Status:** Shows current state of the homebridge instance (active/inactive)
- **Service Uptime:** Shows current uptime of the homebridge instance
- **Service CPU Usage:** Shows CPU usage of all running services
- **Service RAM Usage:** Show RAM usage of all running services

## Installation instructions

After [Homebridge](https://github.com/nfarina/homebridge) has been installed:

-  ```(sudo) npm i -g homebridge-instances-platform@latest```


## Basic configuration

 ```
{
 "bridge": {
   ...
},
 "accessories": [
   ...
],
  "platforms": [
    {
      "platform": "InstancesPlatform",
      "startParam": "home",
      "clearCache": false,
      "sudo": false,
      "temperature": {
        "active": true
      },
      "notifier":{
        "active": true,
        "token": "TELEGRAMTOKEN",
        "chatID": "TELEGRAMCHATID",
        "filter": ["Main process exited", "Error", "error", "ERROR"],
        "filterInstances": ["homebridge-alexa"],
        "spamInterval": 1,
        "updatesPolling": 12
      },
      "exclude": ["homebridge-alexa"]
    }
  ]
}
 ```
 See [Example Config](https://github.com/SeydX/homebridge-instances-platform/blob/master/example-config.json) for more details.

 
 ## Options

| **Attributes** | **Required** | **Usage** |
|------------|----------|-------|
| platform | **Yes** | Must be **InstancesPlatform** |
| startParam | **No** | The word with which all .service files start _(Default: "home")_ |
| clearCache | **No** | If true, the accessory will be removed from HomeKit _(Default: false)_ |
| sudo | **No** | If you have problems starting/stopping an instance, set this true _(Default: false)_|
| polling | **No** | Polling interval in seconds _(Default: 5s)_ |
| temperature.active | **No** | Temperature Characteristic for CPU Temperature _(Default: false)_  |
| temperature.file | **No** | Custom file path to CPU Temperature (eg for Orange PI) |
| temperature.multiplier | **No** | Custom multiplier (eg for Orange PI) |
| notifier.active | **No** | Telegram notification _(Default: false)_  |
| notifier.token | **No** | Telegram Bot Token |
| notifier.chatID | **No** | Telegram Chat ID |
| notifier.filter | **No** | An array/string of matches to filter _(Default: ['Main process exited'])_ |
| notifier.filterInstances | **No** | An array/string of matches to filter instances _(Default: false)_ |
| notifier.spamInterval | **No** | Timer in minutes to block telegram spam _(Default: 1 min)_ |
| notifier.updatesPolling | **No** | Polling interval in hours for check plugin updates _(Default: 12h)_ |
| exclude | **No** | An array of services to exclude from discovery |


## Supported clients

This plugin has been verified to work with the following apps on iOS 12.2 and iOS 12.3 Beta:

* iOS 12.2 / iOS 12.3 Beta
* Apple Home _(partial)_
* All 3rd party apps like Elgato Eve etc. _(recommended)_
* Homebridge v0.4.48
* Debian


## Contributing

You can contribute to this homebridge plugin in following ways:

- [Report issues](https://github.com/SeydX/homebridge-instances-platform/issues) and help verify fixes as they are checked in.
- Review the [source code changes](https://github.com/SeydX/homebridge-instances-platform/pulls).
- Contribute bug fixes.
- Contribute changes to extend the capabilities

Pull requests are accepted.


## Troubleshooting

### Upgrading from v1.4.5 to 1.4.6 or higher

Due to some major bugfixes, you need to remove the Accessory from HomeKit! After update, set "clearCache": true in your config.json and restart homebridge. This will remove the accessory from HomeKit and your cache. After this, set "clearCache": false in config.json and restart homebridge again. This will add the Accessory (Switch) to HomeKit again
