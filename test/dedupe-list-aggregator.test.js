var serviceLocator = require('service-locator').createServiceLocator()
  , createAggregator = require('..')
  , articleFixtures = require('./article-fixtures')
  , dbConnect = require('./lib/db-connection')
  , async = require('async')
  , saveMongodb = require('save-mongodb')
  , should = require('should')
  , _ = require('lodash')
  , doorman = require('doorman')
  , uberCache = require('uber-cache')
  , slugUniquer = 1

// Initialize the mongo database
before(function (done) {
  dbConnect.connect(function (err, db) {

    serviceLocator.register('persistence', function (name) {
      return saveMongodb(db.collection(name + Date.now()))
    })

    serviceLocator.persistence('article')

    serviceLocator
      .register('articleService', require('./mock-article-service')(serviceLocator.persistence('article')))
      .register('logger', require('./null-logger'))
      .register('cache', uberCache())

    var lists = {}
      ,  id = 0
    serviceLocator.register('listService',
      { read: function (id, cb) {
          cb(null, lists[id])
        }
      , create: function (list, cb) {
          var _id = '_' + id++
          lists[_id] = list
          cb(null, _.extend({ _id: _id }, list))
        }
      })

    done()

  })
})

after(dbConnect.disconnect)

function publishedArticleMaker(articles, custom) {
  return function (cb) {
    var model = _.extend({}, articleFixtures.validNewPublishedModel, custom)

    // Make slug unique to stop validation errors (slug and section unique)
    model.slug += slugUniquer
    slugUniquer++

    serviceLocator.articleService.create(model, function (err, result) {
      if (err) return cb(err)
      articles.push(_.extend({}, { articleId: result._id }, custom))
      cb(null)
    })
  }
}

function draftArticleMaker() {
  return function (cb) {
    serviceLocator.articleService.create(articleFixtures.validNewModel, function (err) {
      if (err) return cb(err)
      cb(null)
    })
  }
}

describe('Dedupe List Aggregator', function () {

  describe('aggregate()', function () {

    beforeEach(function (done) {
      serviceLocator.articleService.deleteMany({}, done)
    })

    it('should register article ids with a deduper if injected', function (done) {

      var articles = []
        , dedupe = doorman()
        , listId

      async.series(
        [ publishedArticleMaker(articles)
        , publishedArticleMaker(articles)
        , publishedArticleMaker(articles)
        , draftArticleMaker([])
        , publishedArticleMaker(articles)
        , publishedArticleMaker(articles)
        , function (cb) {
            serviceLocator.listService.create(
              { type: 'auto'
              , name: 'test list'
              , order: 'recent'
              , limit: 100
              }
              , function (err, res) {
                  listId = res._id
                  cb(null)
                })
          }
        ], function (err) {
          if (err) throw err

          var aggregate = createAggregator(serviceLocator.listService, serviceLocator.sectionService,
            serviceLocator.articleService, serviceLocator)

          aggregate(listId, dedupe, null, function (err, results) {
            should.not.exist(err)
            results.should.have.length(5)
            Object.keys(dedupe.list()).should.have.length(5)
            done()
          })

        })
    })

    it('should prevent articles that exist in the deduper from being output', function (done) {

      var articles = []
        , dedupe = doorman()
        , listId

      async.series(
        [ publishedArticleMaker(articles)
        , publishedArticleMaker(articles)
        , publishedArticleMaker(articles)
        , draftArticleMaker([])
        , publishedArticleMaker(articles)
        , publishedArticleMaker(articles)
        , function (cb) {
            serviceLocator.listService.create(
              { type: 'auto'
              , name: 'test list'
              , order: 'recent'
              , limit: 100
              }
              , function (err, res) {
                  listId = res._id
                  cb(null)
                })
          }
        ], function (err) {
          if (err) throw err

          var aggregate = createAggregator(serviceLocator.listService, serviceLocator.sectionService,
            serviceLocator.articleService, serviceLocator)

          dedupe(articles[1].articleId)

          aggregate(listId, dedupe, null, function (err, results) {
            should.not.exist(err)
            results.should.have.length(4)
            Object.keys(dedupe.list()).should.have.length(5)
            dedupe(articles[1].articleId).should.equal(false)
            done()
          })

        })
    })

    it('should not have duplicates if a deduper is injected', function (done) {
      var articles = []
        , listIds = []
        , dedupe = doorman()

      async.series(
        [ publishedArticleMaker(articles)
        , publishedArticleMaker(articles)
        , publishedArticleMaker(articles)
        , draftArticleMaker([])
        , publishedArticleMaker(articles)
        , publishedArticleMaker(articles)
        , function (cb) {
            serviceLocator.listService.create(
              { type: 'auto'
              , name: 'test list'
              , order: 'recent'
              , limit: 100
              }
              , function (err, res) {
                  listIds.push(res._id)
                  cb(null)
                })
          }
        , function (cb) {
            serviceLocator.listService.create(
              { type: 'auto'
              , name: 'test list'
              , order: 'recent'
              , limit: 100
              }
              , function (err, res) {
                  listIds.push(res._id)
                  cb(null)
                })
          }
        ], function (err) {
          if (err) throw err

          var aggregate = createAggregator(serviceLocator.listService, serviceLocator.sectionService,
            serviceLocator.articleService, serviceLocator)

          aggregate(listIds, dedupe, null, function (err, results) {
            should.not.exist(err)
            results.should.have.length(5)
            done()
          })

        })
    })

    it('should truncate the number of articles returned and only dedupe those returned', function (done) {

      var articles = []
        , dedupe = doorman()
        , listId

      async.series(
        [ publishedArticleMaker(articles)
        , publishedArticleMaker(articles)
        , publishedArticleMaker(articles)
        , draftArticleMaker([])
        , publishedArticleMaker(articles)
        , publishedArticleMaker(articles)
        , function (cb) {
            serviceLocator.listService.create(
              { type: 'auto'
              , name: 'test list'
              , order: 'recent'
              , limit: 100
              }
              , function (err, res) {
                  listId = res._id
                  cb(null)
                })
          }
        ], function (err) {
          if (err) throw err

          var aggregate = createAggregator(serviceLocator.listService, serviceLocator.sectionService,
            serviceLocator.articleService, serviceLocator)

          aggregate(listId, dedupe, 3, function (err, results) {
            should.not.exist(err)
            results.should.have.length(3)
            Object.keys(dedupe.list()).should.have.length(3)
            dedupe(articles[0].articleId).should.equal(false)
            dedupe(articles[1].articleId).should.equal(false)
            dedupe(articles[2].articleId).should.equal(false)
            done()
          })
        })
    })

  })

})
