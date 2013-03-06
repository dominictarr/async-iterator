var Iterator = require('../')

var next = process.nextTick

var ArrayIterator = module.exports = function (array) {
  var self
  return Iterator(function (i, cb) {
    if(array.length <= i) return cb()
    cb(null,  i, array[i])
  })
}

if(!module.parent) {
  var ai = ArrayIterator ([1, 2, 3])

  ;(function next() {
    ai.next(function (err, key, value) {
      if(key || value) console.log(key, value), next()
      else             console.log('END')
    })
  })()

}
