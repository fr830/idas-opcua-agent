"use strict";
var sql = require("seriate");
var config = require('./config');
const dbSchema = require("./db-schema");
const languageDb = config.databaseConnection.languageDb;
const configDb = {
    "host": config.databaseConnection.host,
    "user": config.databaseConnection.user,
    "password": config.databaseConnection.password,
    "database": config.databaseConnection.database
};

var DbManager = (function () {

    function getMeasureInfoFromDb(measureCod) {
        return dbSchema.getMeasureByCod(measureCod, languageDb);
    }

    function getStateInfoFromDb(stateCod) {
        return dbSchema.getStateByCod(stateCod, languageDb);
    }

    function getAttributeInfoFromDb(attributeCod, attributeValue) {
        var namePrefix1 = config.browseServerOptions.mainObjectStructure.variableType1.namePrefix;
        var namePrefix2 = config.browseServerOptions.mainObjectStructure.variableType2.namePrefix;
        if (attributeCod.indexOf(namePrefix1) < 0 && attributeCod.indexOf(namePrefix2) < 0) {
            return null;
        }
        if (attributeCod.indexOf(namePrefix1) > -1) { // ex measure13
            var attrCode = attributeCod.replace(namePrefix1, '');
            return getMeasureInfoFromDb(attrCode);
        } else if (attributeCod.indexOf(namePrefix2) > -1) { //state value
            return getStateInfoFromDb(attributeValue);
        }
    }

    //Costructor
    var DbManager = function () {
        reset();
    }

    var init = function () {
        sql.setDefault(configDb);
        console.log("SQL Server connection initialized!!!!".bold.cyan);
    }

    var reset = function () {}

    DbManager.prototype = {
        //constructor
        constructor: DbManager,
        getMeasureInfoFromDb: getMeasureInfoFromDb,
        getStateInfoFromDb: getStateInfoFromDb,
        getAttributeInfoFromDb: getAttributeInfoFromDb,
        reset: reset,
        init: init
    }
    return DbManager;
})();
module.exports = new DbManager();