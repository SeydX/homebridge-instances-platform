'use strict';

const { exec } = require('child_process');
const fs = require('fs');

const LogUtil = require('../lib/LogUtil.js');
const HomeKitTypes = require('./HomeKit.js');

var Service, Characteristic;

const timeout = ms => new Promise(res => setTimeout(res, ms));

class BridgeAccessory {
  constructor (platform, accessory) {

    // HB
    Service = platform.api.hap.Service;
    Characteristic = platform.api.hap.Characteristic;    
    HomeKitTypes.registerWith(platform.api.hap);

    this.platform = platform;
    this.log = platform.log;
    this.logger = new LogUtil(null, platform.log);
    this.api = platform.api;
    this.config = platform.config;
    this.accessories = platform.accessories;
    this._services = new Map();
    
    this.accessory = accessory;
    this.mainService = this.accessory.getService(Service.Switch, this.accessory.displayName);
    
    this.getService();
    
    this.handleAccessory(false);

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  // Services
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
  
  async handleAccessory(add){
  
    try {
      
      this._activeServices = new Map();
      
      let services = await this.handleServices();
      
      for(const service of services){
 
        if(service){
        
          let InstanceService;
      
          this._services.set(service.name, service);
          this._activeServices.set(service.name, service);
  
          if(this.accessory.getServiceByUUIDAndSubType(Service.Instances, service.subname)){
        
            InstanceService = this.accessory.getServiceByUUIDAndSubType(Service.Instances, service.subname);
            
            if(!this.accessory.context[service.name])
              this.accessory.context[service.name] = {};
            
            this.mainService.addLinkedService(InstanceService);
            
            if(!add)
              this.getService(InstanceService);
    
          } else {
    
            this.logger.info(this.accessory.displayName + ': Adding new Service: ' + service.name);

            let instance = new Service.Instances(service.name, service.subname);
            InstanceService = this.accessory.addService(instance);
        
            if(!this.accessory.context[service.name])
              this.accessory.context[service.name] = {};
            
            this.mainService.addLinkedService(InstanceService);

            this.getService(InstanceService);
          
          }
  
        }

      }
      
      this.accessory.services.map( service => { if(service.subtype) this._services.set(service.displayName, service); });
      
      await this.handleDisabledServices();

    } catch(err){

      this.logger.error(this.accessory.displayName + ': An error occured while fetching services!');
      this.logger.error(err);

    } finally {
    
      setTimeout(this.handleAccessory.bind(this, true), 30000);  
    
    }

  
  }
  
  handleServices(){
  
    return new Promise((resolve, reject) => {
      exec('systemctl list-unit-files | grep enabled | grep ' + this.accessory.context.startParam, (error, stdout, stderr) => {
        if (stderr) return reject(stderr);
        
        if(error && error.code > 0) return reject('Error with CMD: ' + error.cmd);
      
        let lines = stdout.toString().split('\n');
      
        lines = lines.map( service => {
      
          let originService = service.split('.service')[0];
      
          service = service.split('.service')[0];
          service = service.replace(/-/g, ' ');        
          service = service.split(' ');

          service = service.map((word)=>{
            const firstletter = word.charAt(0).toUpperCase();
            word = firstletter.concat(word.slice(1,word.length));

            return word;
          });

          service = service.join(' ');
          service = service.slice(this.accessory.context.startParam.length);
    
          let Services = {
            name: service,
            subname: originService
          };
        
          if(service) return Services;
      
        });
      
        let services = lines.filter(function (el) {
          return el != null;
        });
      
        resolve(services);
      });
    });
  
  }
  
  handleDisabledServices(){
  
    return new Promise((resolve) => {
  
      for(const service of this.accessory.services){
  
        if(service.subtype && service.subtype !== this.accessory.displayName){
  
          if(!this._activeServices.has(service.displayName)){

            this.logger.warn(this.accessory.displayName + ': Removing Service: ' + service.displayName);  
            this._services.delete(service.displayName);
            this.accessory.removeService(service);  
  
          }
  
        } 
  
      }
  
      resolve(true);

    });
  
  }

  getService(service) {
    
    if(service){

      service.getCharacteristic(Characteristic.On)
        .on('set', this.setServiceState.bind(this, service));
        
      service.getCharacteristic(Characteristic.CPUUsage)
        .setProps({
          format: Characteristic.Formats.FLOAT,
          unit: Characteristic.Units.PERCENTAGE,
          minValue: 0,
          maxValue: 100,
          minStep: 0.01
        });
        
      service.getCharacteristic(Characteristic.RAMUsage)
        .setProps({
          format: Characteristic.Formats.FLOAT,
          unit: Characteristic.Units.PERCENTAGE,
          minValue: 0,
          maxValue: 100,
          minStep: 0.01
        });
    
    } else {
      
      this.mainService.getCharacteristic(Characteristic.On)
        .on('set', this.setMainSwitchState.bind(this))
        .updateValue(false);
        
      if(!this.mainService.testCharacteristic(Characteristic.CPUUsage))
        this.mainService.addCharacteristic(Characteristic.CPUUsage);
        
      this.mainService.getCharacteristic(Characteristic.CPUUsage)
        .setProps({
          format: Characteristic.Formats.FLOAT,
          unit: Characteristic.Units.PERCENTAGE,
          minValue: 0,
          maxValue: 100,
          minStep: 0.01
        });
        
      if(!this.mainService.testCharacteristic(Characteristic.RAMUsage))
        this.mainService.addCharacteristic(Characteristic.RAMUsage);
        
      this.mainService.getCharacteristic(Characteristic.RAMUsage)
        .setProps({
          format: Characteristic.Formats.FLOAT,
          unit: Characteristic.Units.PERCENTAGE,
          minValue: 0,
          maxValue: 100,
          minStep: 0.01
        });
        
      if(this.accessory.context.temperature.active)
        if(!this.mainService.testCharacteristic(Characteristic.CurrentTemperature))
          this.mainService.addCharacteristic(Characteristic.CurrentTemperature);
        
      this.getAllInformation();
      
    }

  }
  
  async getAllInformation(){
  
    let overallCpu = 0;
    let overallRam = 0;
    let parsedServices = [];
    
    try {
    
      await timeout(2000);

      parsedServices = await this.handleInformations();
    
      for(const service of this.accessory.services){
    
        let state = false;
        let cpu = 0;
        let ram = 0;
        let time = '-';
    
        if(service.subtype && service.subtype !== this.accessory.displayName){

          overallCpu += parseFloat(service.getCharacteristic(Characteristic.CPUUsage).value);
          overallRam += parseFloat(service.getCharacteristic(Characteristic.RAMUsage).value);
        
          for(const parsedService of parsedServices){
        
            if(parsedService.service === service.subtype){

              state = true;
              cpu = parseFloat(parsedService.cpu);
              ram = parseFloat(parsedService.memory);
              time = parsedService.time;
        
            }
        
          }
        
          service.getCharacteristic(Characteristic.On)
            .updateValue(state);
     
          service.getCharacteristic(Characteristic.ServiceStatus)
            .updateValue(state?'active':'inactive');
            
          service.getCharacteristic(Characteristic.CPUUsage)
            .updateValue(cpu);
        
          service.getCharacteristic(Characteristic.RAMUsage)
            .updateValue(ram);
        
          service.getCharacteristic(Characteristic.RunningTime)
            .updateValue(time);
    
        }
    
      }
    
      overallCpu = Math.round(overallCpu * 100) / 100;
      overallRam = Math.round(overallRam * 100) / 100;
    
      this.mainService.getCharacteristic(Characteristic.CPUUsage)
        .updateValue(overallCpu);
      
      this.mainService.getCharacteristic(Characteristic.RAMUsage)
        .updateValue(overallRam);
        
      if(this.accessory.context.temperature.active){
  
        let data = fs.readFileSync(this.accessory.context.temperature.file, 'utf-8');
        let temp = parseFloat(data) / this.accessory.context.temperature.multiplier;
      
        this.mainService.getCharacteristic(Characteristic.CurrentTemperature)
          .updateValue(temp);
      
      }
    
    } catch(err) {
    
      console.log('ERROR');
      console.log(err);
    
    } finally {
    
      setTimeout(this.getAllInformation.bind(this), 5000);
    
    }
  
  }
  
  handleInformations(){

    return new Promise((resolve, reject) => {
  
      exec('ps -eo pid:1,pmem:1,pcpu:1,etime:1,unit:1,state:1 --no-header | grep homebridge', (error, stdout, stderr) => {
        if (stderr) return reject(stderr);
        
        if(error && error.code > 0) return reject('Error with CMD: ' + error.cmd);
     
        let lines = stdout.toString().split('\n');
      
        lines = lines.map( service => {
      
          let serviceObject;
      
          if(service){
    
            service = service.replace(/\s+/g, ',');
        
            let time = service.split(',')[3];
        
            if(time.indexOf('-') > 0){
        
              let day = time.split('-')[0];
        
              let clock = time.split('-')[1];
              let hour = clock.split(':')[0];
              let min = clock.split(':')[1];
              //let sec = clock.split(':')[2]
        
              time = (day !== '00' ? day + 'd ' : '') + (hour !== '00' ? hour + 'h ' : '') + (min !== '00' ? min + 'm ' : '');
        
            } else {
        
              let hour, min, sec;
              
              if(time.split(':')[2]){
             
                hour = time.split(':')[0];
                min = time.split(':')[1];
                sec = time.split(':')[2];
              
              } else {
          
                hour = '00';
                min = time.split(':')[0];
                sec = time.split(':')[1];
              
              }
        
              time = (hour !== '00' ? hour + 'h ' : '') + (min !== '00' ? min + 'm ' : (hour === '00' && min === '00' ? sec + 's' : '') );
        
            }
        
            serviceObject = {
              pid: service.split(',')[0],
              memory: service.split(',')[1],
              cpu: service.split(',')[2],
              time: time,
              service: service.split(',')[4].replace('.service',''),
              state: service.split(',')[5]
            };
    
          }
        
          if(service && serviceObject && serviceObject.memory !== '0.0' && serviceObject.cpu !== '0.0' && serviceObject.time !== '00:00') return serviceObject;
      
        });
      
        let services = lines.filter(function (el) {
          return el != null;
        });
      
        resolve(services);
      
      });

    });

  }
  
  async setServiceState(service, state, callback){
  
    try {

      this.logger.info(service.displayName + ': ' + (state ? 'Start' : 'Stop'));

      await this.handleSetCommand(service, state);

    } catch(err){

      this.logger.error(service.displayName + ': An error occured while setting new state!');
      this.logger.error(err);

    } finally {

      callback();

    }
  
  }
  
  async setMainSwitchState(state, callback){

    const self = this;

    try {

      if(state){
      
        this.logger.info(this.accessory.displayName + ': Restarting all services!');
      
        this.accessory.services.map( async service => {
    
          if(service.subtype && service.subtype !== this.accessory.displayName){
  
            await this.handleSetCommand(service, null, true);
  
          }
         
        });

      }

    } catch(err){

      this.logger.error(this.accessory.displayName + ': An error occured while restarting all services!');
      this.logger.error(err);

    } finally {

      setTimeout(function(){ self.mainService.getCharacteristic(Characteristic.On).updateValue(false); }, 500);
    
      callback();
  
    }
  
  }
  
}
  
module.exports = BridgeAccessory;
