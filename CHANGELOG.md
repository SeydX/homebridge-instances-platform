# Changelog


## 1.4.6 - 2019-04-26
- [REMOVED] Accessories amount display
- [NEW] Check plugin updates with telegram support
- Bugfixes

**NOTE:** Due to some major bugfixes, you need to remove the Accessory from HomeKit! After update, set ```"clearCache": true``` in your config.json and restart homebridge. This will remove the accessory from HomeKit and your cache. After this, set ```"clearCache": false``` in config.json and restart homebridge again. This will add the Accessory (Switch) to HomeKit again

## 1.4.5 - 2019-04-24
- [NEW] Filter instances for notifier
- Bugfixes


## v1.4.3 - 2019-04-23
- [NEW] Amount of published accessories (only for homebridge instances in insecure mode (-I) and pin 031-45-154)
- Bugfixes


## 1.4.1 - 2019-04-22
- [NEW] Added spamInterval to notifier
- [NEW] Added Filter to notifier
- Bugfixes


## 1.4.0 - 2019-04-22
- [NEW] Listener for homebridge services with telegram notification if an error occures
- Bugfixes


## 1.3.5 - 2019-04-22
- Bugfixes


## 1.3.4 - 2019-04-21
- [NEW] Available Disk Space for Main Switch


## 1.3.3 - 2019-04-21
- Bugfixes


## 1.3.2 - 2019-04-21
- Bugfixes


## 1.3.0 - 2019-04-21
- [NEW] Updatable Plugins
- [NEW] Switch for update all plugins
- Improved uptime
- Bugfixes
- Code cleanup

## 1.2.2 - 2019-04-19
- [NEW] Device Uptime
- Bugfixes

## 1.2.0 - 2019-04-16
- Rewritten code for better performance!
- [NEW] RAM Usage Characteristic
- [NEW] Temperature Characteristic
- Bugfixes


## 1.1.2 - 2019-04-16
- CPU usage improvements
- Bugfixes

## 1.1.0 - 2019-04-16
- [CHANGED] Accessory type from "OTHER" to "SWITCH"
- [NEW] CPU Usage of all "homebridge" instances for Main Switch
- [NEW] Main Switch with "restart all services" functionality
- Bugfixes

**NOTE:** Due to the reason of accessory type changement, you need to clear the cache. Just type "clearCache: true" in config.json and restart Homebridge. After than, change the line to "clearCache: false" and the plugin will add the new Accessory to HomeKit again with the improvements listed above!

## 1.0.1 - 2019-04-16
- [NEW] CPU Usage
- Bugfix

## 1.0.0 - 2019-04-15
- Init. release
