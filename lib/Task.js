function Task() {
    this.tasks = {'*': []}
    this.end = false
    this.blocked = false
    this.canceled = false
    var self = this
    this.finallyf = function () {
        this.end = true
    }
}
Task.all = function (tasks) {
    var newTask = new Task()
    newTask.block()
    var i = 0
    tasks.forEach(function (task) {
        task(function () {
            i++
            if (i === tasks.length) {
                newTask.blockEnd()
            }
        })
    })
    return newTask
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
        this.finallyf = function () {
            this.end = true
            callback()
        }
        return this
    },
    run: function (router) {
        this.end = false
        var self = this
        return function (...args) {
            var tasks
            var run
            var final = self.finallyf
            if (!router) {
                tasks = self.tasks['*']
            } else {
                tasks = self.tasks['*'].concat(self.tasks[router])
            }
            self.next = run = tasks.map(task => task.bind(self, ...args)).reduceRight((acc, task) => task.bind(self, function () {
                if (!self.canceled) {
                    if (!self.blocked) {
                        acc()
                    } else {
                        self.next = acc
                    }
                }

            }), final)
            if (!self.canceled && !self.blocked) {
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
        if (this.next) this.next()
    }
}
