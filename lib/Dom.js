/**
 * Created by chizhang on 2017/8/13.
 */
function DomUtil() {
    this.node = {}
}
DomUtil.withNode = function (node) {
    var domUtil = new DomUtil()
    domUtil.node = node
    return domUtil
}
DomUtil.prototype = {
    addClass: function (className) {
        if (!className) return this
        var classNames = className.split(/\s+/g)
        this.node.className += ' '
        this.node.className += classNames.join(' ')
        return this
    },
    removeClass: function (className) {
        if (!className) return this
        var self = this
        var classNames = className.split(/\s+/g)
        classNames.forEach(function (ele) {
            self.node.className = self.node.className.replace(ele, '')
        })
        return this
    },
    scrollPage: function (upCallback, downCallback) {
        var startTime = 0, endTime = 0
        this.node.addEventListener("mousewheel", function (e) {
            startTime = new Date().getTime()
            var delta = event.detail || (-event.wheelDelta)
            if ((endTime - startTime) < -1000) {
                endTime = new Date().getTime();
                if (delta > 2) {
                    downCallback(e)
                }
                if (delta < -2) {
                    upCallback(e)
                }


            } else {
                e.preventDefault()
            }

        }, false);

    },
    eventProxy: function (node, event, callback) {
        var self = this
        if (typeof event === 'string') {
            event = event.split(/\s+/g)
        }
        event.forEach(function (e) {
            self.node.addEventListener(e, function (event) {
                if (Array.from(node).indexOf(event.target) !== -1) {
                    callback(event.target, event)

                }
            })
        })
    },
    getComputedRect: function () {
        var style = getComputedStyle(this.node, null)
        return {height: style.height, width: style.width}
    }
}
