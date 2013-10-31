var MongoClient = require('mongodb').MongoClient
  , dbConnection

module.exports.connect = function(done) {
  MongoClient.connect('mongodb://127.0.0.1/cf-list-aggregator-tests', function (error, db) {

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
