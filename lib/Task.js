/**
 * Created by chizhang on 2017/8/13.
 */
function Task() {
    this.tasks = {'*': []}
}
Task.prototype = {
    add: function (router, ...next) {
        if (router instanceof Array) {
            this.tasks['*'] = this.tasks['*'].concat(router)
        }
        if (typeof router === 'function') {
            this.tasks['*'].push(router)
            if (next) {
                this.tasks['*'].push(...next)
            }
        } else {
            this.tasks[router] = this.tasks[router] || []
            this.tasks[router].push(next)
        }
        return this
    },
    finally: function (callback) {
        this.finallyf = callback
        return this
    },
    run: function (router) {
        var self = this
        return function (...args) {
            var tasks
            var run
            var final = self.finallyf || function () {
                }
            if (!router) {
                tasks = self.tasks['*']
            } else {
                tasks = self.tasks['*'].concat(self.tasks[router])
            }
            run = tasks.map(task => task.bind(self, ...args)).reduceRight((acc, task) => task.bind(self, function () {
                if (!self.canceled) {
                    if (!self.blocked) {
                        acc()
                    } else {
                        self.next = acc
                    }
                }

            }), final)
            if (!self.canceled) {
                run()
            }
        }
    },
    cancel: function () {
        this.canceled = true
    },
    open: function () {
        this.canceled = false
    },
    block: function () {
        this.blocked = true
    },
    blockEnd: function () {
        this.blocked = false
        this.next()
    }
}

// var task = new Task()
// task.add(function (next) {
//     setTimeout(function () {
//         console.log('first')
//         next()
//     }, 100)
// }).add(function (next) {
//     setTimeout(function () {
//         console.log('second')
//         next()
//     }, 500)
// }).add(function (next) {
//     setTimeout(function () {
//         console.log('three')
//         next()
//     }, 500)
// }).add(function (next) {
//     console.log('11')
// }).run()()
// setTimeout(function () {
//     task.cancel()
// }, 500)
// setTimeout(function () {
//     task.run()()
// }, 3000)
// setTimeout(function () {
//     task.open()
//     task.run()()
// }, 6000)
// setTimeout(function () {
//     console.log('blocked')
//     task.block()
// }, 6200)
// setTimeout(function () {
//     console.log('blockend')
//     task.blockEnd()
// }, 10000)