<p align="center">
    <img src="https://i.imgur.com/w7nyvOl.png" height="200">
</p>


# Instances!Platform v1

[![npm](https://img.shields.io/npm/v/homebridge-instances-platform.svg?style=flat-square)](https://www.npmjs.com/package/homebridge-instances-platform)
[![npm](https://img.shields.io/npm/dt/homebridge-instances-platform.svg?style=flat-square)](https://www.npmjs.com/package/homebridge-instances-platform)
[![GitHub last commit](https://img.shields.io/github/last-commit/SeydX/homebridge-instances-platform.svg?style=flat-square)](https://github.com/SeydX/homebridge-instances-platform)
[![Donate](https://img.shields.io/badge/Donate-PayPal-blue.svg?style=flat-square&maxAge=2592000)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NP4T3KASWQLD8)

**Creating and maintaining Homebridge plugins consume a lot of time and effort, if you would like to share your appreciation, feel free to "Star" or donate.**

<img src="https://i.ibb.co/GsDdYCh/C7-B78-A3-F-3589-44-F2-9-A49-15-A9760-FF20-D.gif" align="right" alt="HomeKit Overview" width="270px" height="541px">

This is a plugin for [Homebridge](https://github.com/nfarina/homebridge) to control your **multiple homebridge instances**. 

This plugin supports following functions:

- **Power Switch** Start/Stop Homebridge Instance
- **Service Status** shows current state of the homebridge instance (active/inactive)
- **Running Time** shows current running time of the homebridge instance
- **CPU Usage** shows CPU usage of all running services
- **RAM Usage** show RAM usage of all running services
- **Temperature** shows current CPU temperature
- **Dynamic** this plugin adds/removes dynamically new enabled/disabled services

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
      }
    }
  ]
}
 ```
 See [Example Config](https://github.com/SeydX/homebridge-instances-platform/blob/master/example-config.json) for more details.

 
 ## Options

| **Attributes** | **Required** | **Usage** |
|------------|----------|-------|
| platform | **Yes** | Must be **InstancesPlatform** |
| startParam | **No** | The word with which all .service files start _(Default: "homebridge-")_ |
| clearCache | **No** | If true, the accessory will be removed from HomeKit _(Default: false)_ |
| sudo | **No** | If you have problems starting/stopping an instance, set this true _(Default: false)_|
| polling | **No** | Polling interval in seconds _(Default: 5s)_ |
| temperature.active | **No** | Temperature Characteristic for CPU Temperature _(Default: false)_  |
| temperature.file | **No** | Custom file path to CPU Temperature (eg for Orange PI) |
| temperature.multiplier | **No** | Custom multiplier (eg for Orange PI) |


## Supported clients

This plugin has been verified to work with the following apps on iOS 12.2 and iOS 12.3 Beta:

* iOS 12.2 / iOS 12.3 Beta
* Apple Home _(partial)_
* All 3rd party apps like Elgato Eve etc. _(recommended)_
* Homebridge v0.4.48
* Debian


## TODO
- [ ] Journalctl


## Contributing

You can contribute to this homebridge plugin in following ways:

- [Report issues](https://github.com/SeydX/homebridge-instances-platform/issues) and help verify fixes as they are checked in.
- Review the [source code changes](https://github.com/SeydX/homebridge-instances-platform/pulls).
- Contribute bug fixes.
- Contribute changes to extend the capabilities

Pull requests are accepted.
