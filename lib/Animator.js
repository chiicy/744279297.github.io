/**
 * simple animal
 */
function nowTime() {
    if (typeof performance !== 'undefined' && performance.now) {
        return performance.now()
    }
    return Date.now ? Date.now() : (new Date()).getTime()
    if (typeof global.requestAnimationFrame === 'undefined') {
        global.requestAnimationFrame = function (callback) {
            return setTimeout(function () {
                callback.call(this, nowTime())
            }, 1000 / 60)
        }
        global.cancelAnimationFrame = function (qId) {
            return clearTimeout(qId)
        }
    }
}

function Animator(node,duration, update, easing) {
    this.duration = duration
    this.update = update
    this.easing = easing
    this.node = node
}
Animator.prototype = {
    animate: function () {
        var startTime = 0,
            duration = this.duration,
            update = this.update,
            easing = this.easing,
            self = this
        return function (callback) {
            var qId = 0
            function step(timestamp) {
                startTime = startTime || timestamp
                var p = Math.min(1.0, (timestamp - startTime) / duration)
                update.call(self,self.node, easing ? easing(p) : p, p)
                if (p < 1.0) {
                    qId = requestAnimationFrame(step)
                } else {
                    callback()
                }
            }
            self.cancel = function () {
                cancelAnimationFrame(qId)
                update.call(self,self.node, 0, 0)
                callback("User canceled")
            }
            requestAnimationFrame(step)
        }

    }
}