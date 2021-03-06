'use strict'
var sql = require('seriate')
var config = require('./config')
var dbSchema = require('./db-schema')
var languageDb = config.browseServerOptions.databaseConnection.languageDb
var configDb = {
  'host': config.browseServerOptions.databaseConnection.host,
  'user': config.browseServerOptions.databaseConnection.user,
  'password': config.browseServerOptions.databaseConnection.password,
  'database': config.browseServerOptions.databaseConnection.database
}
var logger = require('./logger.js')

var DbManager = (function () {
  function getMeasureInfoFromDb (measureCod) {
    return dbSchema.getAllMeasureInfoByCod(measureCod, languageDb)
  }

  function getStateInfoFromDb (stateCod) {
    if (typeof stateCod !== 'undefined' && stateCod !== null) {
      var code = Number(stateCod)
      return dbSchema.getStateByCod(code, languageDb)
    } else {
      logger.error('Error in dbManager with status code invalid: '.bold.red, stateCod)
    }
  }

  /* function getMeasureMultplierFromDb (measureCode) {
    return dbSchema.getMultiplierByCod(measureCode)
  } */

  function getAttributeInfoFromDb (attributeCod, attributeValue) {
    try {
      var namePrefix1 = config.browseServerOptions.mainObjectStructure.variableType1.namePrefix
      var namePrefix2 = config.browseServerOptions.mainObjectStructure.variableType2.namePrefix
      if (attributeCod.indexOf(namePrefix1) < 0 && attributeCod.indexOf(namePrefix2) < 0) {
        return null
      }
      if (attributeCod.indexOf(namePrefix1) > -1) { // ex measure13
        var attrCode = attributeCod.replace(namePrefix1, '')
        return getMeasureInfoFromDb(attrCode)
      } else if (attributeCod === namePrefix2) { // state value
        return getStateInfoFromDb(attributeValue)
      }
    } catch (error) {
      logger.error('Error in SQL Query', error)
    } finally {
      // sql.closeConnection()
    }
  }
  var closeConnection = function () {
    logger.info('Closing SQL Connection...')
    sql.closeConnection()
  }
  // Costructor
  var DbManager = function () {
    reset()
  }

  var init = function () {
    sql.setDefault(configDb)
    logger.info('SQL Server connection initialized!!!!'.bold.cyan)
  }

  var reset = function () {}

  DbManager.prototype = {
    // constructor
    constructor: DbManager,
    // getMeasureInfoFromDb: getMeasureInfoFromDb,
    // getStateInfoFromDb: getStateInfoFromDb,
    getAttributeInfoFromDb: getAttributeInfoFromDb,
    // getMeasureMultplierFromDb: getMeasureMultplierFromDb,
    closeConnection: closeConnection,
    reset: reset,
    init: init
  }
  return DbManager
})()
module.exports = new DbManager()
