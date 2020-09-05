require('dotenv').config();

const mongodbUri = require('mongodb-uri');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/securedata';
const databaseName = mongodbUri.parse(mongoUri).database;
const baseURL = 'http://localhost';
const portAPI = process.env.PORTAPI || 8000;
const portGraphql = process.env.PORTGraphql || 3000;

module.exports = {
    portAPI,
    portGraphql,
    hostAPI: `${baseURL}:${portAPI}/`,
    hostGraphql: `${baseURL}:${portGraphql}/`,
    database_name: databaseName,
    database: mongoUri,
    stdOutLogsEnvironments:
        process.env.STDOUT_ENVIRONMENTS
            ? process.env.STDOUT_ENVIRONMENTS.split(',')
            : ['development', 'test'],
    logstash: {
        host: process.env.ELASTIC_HOST || 'localhost',
        port: process.env.ELASTIC_PORT || 9200,
        indexPattern: process.env.ELASTIC_INDEX_PATTERN || '[securedata-]YYYY.MM.DD',
    },
};