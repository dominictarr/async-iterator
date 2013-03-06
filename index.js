
function delay (fun) {
  return function () {
    var args = [].splice.call(arguments)
    var self = this
    process.nextTick(function () {
      fun.apply(self, args)
    })
    return this
  }
}

module.exports = function (get, dispose) {
  var i = 0, calling = false, queueEnd = []
  dispose = dispose || function (cb) {
    return cb()
  }
  var it
  return it = {
    ended: false,
    next: function (cb) {
      if(calling) return cb(new Error('iterator is currently incrementing'))
      if(it.ended)   return cb(new Error('iterator has ended'))
      var async = false
      function forceAsync(fun) {
        if(async) fun()
        else      process.nextTick(fun)
      }
      calling = true
      get.call(this, i ++, function (err, key, value) {
        forceAsync(function () {
          calling = false
          if(err || (key == null && value == null))
            it.ended = true

          cb(err, key, value)

          if(queueEnd.length)
            queueEnd.forEach(function (e) {
              it.end(e)
            })


        })
      })
      async = true
      return it
    },
    end: function (cb) {
      if(it.ended) return delay(cb).call(it)

      if(calling)
        return queueEnd.push(cb)
      it.ended = true
      var async = false
      dispose.call(it, function () {
        var args = [].slice.call(arguments)
        if(async) cb.apply(it, args)
        else      delay(cb).apply(it, args) 
      })
      async = true
      return it
    }
  }
}

