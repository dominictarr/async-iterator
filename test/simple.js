
var test = require('tape')
var ArrayIterator = require('../examples/array-iterator')

test('read an array', function (t) {

  var ai = ArrayIterator(['one', 'two', 'three'])

  ai.next(function (err, k, v) {
    t.equal(k, 0)
    t.equal(v, 'one')
    ai.next(function (err, k, v) {
      t.equal(k, 1)
      t.equal(v, 'two')
      ai.next(function (err, k, v) {
        t.equal(k, 2)
        t.equal(v, 'three')

        ai.next(function (err, k, v) {
          t.ok(k == null)
          t.ok(v == null)
          t.end()
        })
      })
    })
  })
})

test('error when read in parallel', function (t) {

  t.plan(3)
  var ai = ArrayIterator(['one', 'two', 'three'])

  ai.next(function (err, k, v) {
    t.equal(k, 0)
    t.equal(v, 'one')
    t.end()
  })

  ai.next(function (err) {
    t.ok(err, 'must error if a increment is in progress')
  })

})

test('error when next() after end()', function (t) {

  t.plan(1)
  var ai = ArrayIterator(['one', 'two', 'three'])

  ai.end(function () { })

  ai.next(function (err) {
    t.ok(err, 'must error if a increment is in progress')
    t.end()
  })

})

test('queue end() until after next()', function (t) {

  var ai = ArrayIterator(['one', 'two', 'three'])
  var c = 0
  ai.next(function (err) {
    t.equal(c++, 0, 'next(cb) is called first')
  })

  ai.end(function () { 
    t.equal(c++, 1, 'then end(cb)')
  })

  ai.end(function () { 
    t.equal(c++, 2, 'all end(cb) are called eventually')
    t.end()
  })

})
