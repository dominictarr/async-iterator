
module.exports = function (get, dispose) {
  var i = 0, calling = false, ended = false
  dispose = dispose || function (cb) {
    return cb()
  }

  return {
    next: function (cb) {
      if(calling) return cb(new Error('iterator is currently incrementing'))
      if(ended)   return cb(new Error('iterator has ended'))
      var async = false
      function forceAsync(fun) {
        if(async) fun()
        else process.nextTick(fun)
      }
      calling = true
      get.call(this, i ++, function (err, key, value) {
        forceAsync(function () {
          calling = false
          if(err) ended = true
          if(key == null && value == null)
            ended = true
          cb(err, key, value)
        })
      })
      async = true
      return this
    },
    end: function (cb) {
      if(calling) return cb(new Error('iterator is currently incrementing'))
      ended = true
      dispose.call(this, cb)
      return this
    }
  }
}

