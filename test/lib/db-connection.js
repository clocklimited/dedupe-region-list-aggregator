var MongoClient = require('mongodb').MongoClient
  , dbConnection
  , mongoHost = process.env.NODE_MONGO_HOST || '127.0.0.1'
  , mongoPort = process.env.NODE_MONGO_PORT || 27017

module.exports.connect = function(done) {
  var mongoConnectionString = 'mongodb://' + mongoHost + ':' + mongoPort + '/cf-dedupe-list-aggregator-tests'
  MongoClient.connect(mongoConnectionString, function (error, db) {

    dbConnection = db

    // Start with an empty database
    db.dropDatabase(function() {
      return done(null, dbConnection)
    })
  })
}

module.exports.disconnect = function (done) {
  dbConnection.dropDatabase()
  dbConnection.close()
  done()
}
