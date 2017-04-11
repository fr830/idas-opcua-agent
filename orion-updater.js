'use strict'
var iotAgentLib = require('iotagent-node-lib')
var config = require('./config')
const utilsLocal = require('./utils.js')
var logger = require('./logger.js')

var OrionUpdater = (function () {
    // Costructor
  var productNumberManager = null

  var OrionUpdater = function () {}
  var init = function (productNumberManager_) {
    productNumberManager = productNumberManager_
  }

  var updateMonitored = function (context, mapping, dataValue, variableValue, dbInfo) {
    logger.debug('Context ' + context.id + ' attribute ' + mapping.ocb_id, ' value has changed to ' + variableValue + ''.bold.yellow)
    iotAgentLib.getDevice(context.id, function (err, device) {
      if (err) {
        logger.error('could not find the OCB context ' + context.id + ''.red.bold)
        logger.error(JSON.stringify(err).red.bold)
      } else {
        var findType = function (name) {
                    // TODO we only search the 'active' namespace: does it make sense? probably yes
          for (var i = 0; i < device.active.length; i++) {
            if (device.active[i].name === name) {
              return device.active[i].type
            }
          }
          return null
        }
                /* WARNING attributes must be an ARRAY */
        var attribute = {
          name: mapping.ocb_id,
          type: mapping.type || findType(mapping.ocb_id),
          value: typeof variableValue === 'undefined' || variableValue == null ? null : variableValue,
          metadatas: [{
            name: 'sourceTimestamp',
            type: 'typestamp',
            value: dataValue.sourceTimestamp
          },
          {
            name: 'serverTimestamp',
            type: 'typestamp',
            value: new Date()
          },
          {
            name: 'description',
            type: 'string',
            value: dbInfo != null && typeof dbInfo !== 'undefined' && dbInfo.Descr
                                ? utilsLocal.removeParenthesisfromAttr(dbInfo.Descr) : null // TODO from database
          }
          ]
        }
                // MEASURE specific METADATAS
        if (mapping.ocb_id.indexOf(config.browseServerOptions.mainObjectStructure.variableType1.namePrefix) > -1) { // MEASURE
          var measCode = {
            name: 'measCode',
            type: 'string',
            value: mapping.ocb_id.replace(config.browseServerOptions.mainObjectStructure.variableType1.namePrefix, '')
          }
          var serialNumberObj = {
            name: 'serialNumber',
            type: 'string',
            value: productNumberManager.getSerialNumber()
          }
          var _12NCObj = {
            name: '12NC',
            type: 'string',
            value: productNumberManager.get12NC()
          }
          attribute.metadatas.add(measCode)
          attribute.metadatas.add(serialNumberObj)
          attribute.metadatas.add(_12NCObj)
          if (dbInfo && dbInfo.MeasUnit) {
            var measUnit = {
              name: 'measUnit',
              type: 'string',
              value: utilsLocal.removeParenthesisfromAttr(dbInfo.MeasUnit)
            }
            var multiplier = {
              name: 'multiplier',
              type: 'string',
              value: typeof dbInfo.Multiplier === 'undefined' ? null : dbInfo.Multiplier
            }
            attribute.metadatas.add(measUnit)
            attribute.metadatas.add(multiplier)
          }
        }
        logger.debug('ATTRIBUTE'.bold.cyan, JSON.stringify(attribute))
        logger.debug('METADATAS'.bold.cyan, JSON.stringify(attribute.metadatas))
                /* WARNING attributes must be an ARRAY */
        iotAgentLib.update(device.name, device.type, '', [attribute], device, function (err) {
          if (err) {
            logger.info('Error updating '.bold.red + mapping.ocb_id + ' on ' + device.name + ' with attribute ' + JSON.stringify(attribute),
                            JSON.stringify(err).bold.red)
            // logger.debug('ko->' + device.id + '_' + mapping.ocb_id, attribute.value, 'result')
          } else {
            logger.info('Succesfully updated '.bold.cyan + mapping.ocb_id.bold.yellow + ' on ' + device.name.bold.yellow)
            logger.debug('ok->' + device.id + '_' + mapping.ocb_id, attribute.value, 'result')
            logger.debug('ok->' + device.id + '_' + mapping.ocb_id, JSON.stringify(attribute.metadatas), 'result')
          }
        })
      }
    })
  }
  OrionUpdater.prototype = {
        // constructor
    constructor: OrionUpdater,
    init: init,
    updateMonitored: updateMonitored
  }
  return OrionUpdater
})()
module.exports = new OrionUpdater()
