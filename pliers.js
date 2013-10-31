module.exports = tasks

function tasks(pliers) {
  pliers.filesets('tests', [ 'test/**/*.test.js' ])

  pliers('test', function (done) {
    pliers.exec('./node_modules/.bin/_mocha -r should test', done)
  })

  pliers('lint', function (done) {
    pliers.exec('./node_modules/jshint/bin/jshint .', done)
  })
}
