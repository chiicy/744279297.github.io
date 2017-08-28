function Page(node, skip) {
    if (typeof node === 'string') {
        this.page = document.querySelector(node)
    } else {
        this.page = node
    }
    if (skip !== undefined) this.skip = skip
    var self = this

}
Page.prototype = {

    translateUp: function (e) {
        DomUtil.withNode(this.page).addClass('pre-container').removeClass('current-container')
        return true
    },
    translateDown: function (e) {
        DomUtil.withNode(this.page).addClass('next-container').removeClass('current-container')
        return true
    },
    translateCurrent: function () {
        DomUtil.withNode(this.page).addClass('current-container').removeClass('next-container pre-container')
        this.startAnimate()
        return true
    },
    setAnimate: function (animations) {
        this.animations = animations
        return this
    },
    startAnimate: function () {
        console.log('ani')
        if (this.animations) this.animations.run()()
        return this
    },
    stopanimate: function () {
        this.animations.block()
        return this
    },
    reStartAnimate: function () {
        this.animations.blockEnd()
        return this
    }
}

function Container(id, items) {
    var self = this
    this.container = document.getElementById(id)
    this.items = items
    this.currentIndex = 0
    this.buttons = Array.from(this.container.querySelectorAll('.control ul li'))
    DomUtil.withNode(this.container).scrollPage(this.scrollToPrevious.bind(this), this.scrollToNext.bind(this))

}
Container.prototype = {
    setClickedIndex: function (index) {
        this.clickedIndex = index
    },
    getClickedIndex: function () {
        return this.clickedIndex
    },
    getCurrentIndex: function () {
        return this.currentIndex
    },
    getNextItem: function () {
        return this.items[this.currentIndex + 1]
    },
    getPreItem: function () {
        return this.items[this.currentIndex - 1]
    },
    getCurrentItem: function () {
        return this.items[this.currentIndex]
    },
    scrollStep: function (index) {
        var ever = this.getCurrentIndex()

        var everdom = DomUtil.withNode(this.getCurrentItem()).removeClass('current-container')
        var nowDom = DomUtil.withNode(this.items[index]).addClass('current-container')
        var now = this.getCurrentIndex()
        if (now > ever) {
            everdom.addClass('pre-container')
            nowDom.removeClass('next-container')
        } else {
            everdom.addClass('next-container')
            nowDom.removeClass('pre-container')
        }
    },
    scrollIndex: function (index) {
        var self = this
        var steps = index - this.getCurrentIndex()
        if (steps > 0) {
            while (steps > 0) {
                self.scrollToNext()
                steps--
            }
        } else {
            while (steps < 0) {
                self.scrollToPrevious()
                steps++
            }
        }
    },
    scrollToNext: function (e) {
        var currentIndex = this.getCurrentIndex()
        if (currentIndex < this.items.length - 1) {
            if (this.getNextItem().skip) return
            this.getCurrentItem().translateUp(e)
            && this.getNextItem().translateCurrent(e)
            && (this.currentIndex = this.currentIndex + 1)
        }
    },
    scrollToPrevious: function (e) {
        var currentIndex = this.getCurrentIndex()
        if (currentIndex >= 1) {
            if (this.getPreItem().skip) return
            this.getCurrentItem().translateDown(e)
            && this.getPreItem().translateCurrent(e)
            && (this.currentIndex = this.currentIndex - 1)
        }


    },
    buttonMove: function (index) {
        if (index === this.getClickedIndex()) {
            this.buttons.forEach(function (button) {
                DomUtil.withNode(button).removeClass('hover')
            })
            DomUtil.withNode(this.buttons[index]).addClass('hoverNoText')
        } else {
            this.buttons.forEach(function (button) {
                DomUtil.withNode(button).removeClass('hover')
            })
            DomUtil.withNode(this.buttons[index]).addClass('hover')
        }
    }
}

function Card(node, tag, currentW, currentY) {
    this.node = node
    this.currentAppear = true
    this.willAppear = true
    this.tag = tag
    this.currentX = currentW
    this.currentY = currentY
    this.willX = currentW
    this.willY = currentY
    this.removed = false
}
Card.prototype = {
    move: function (back) {
        var self = this
        if (self.willX === self.currentX && self.willY === self.currentY)return
        new Animator(this.node, 500, function (node, p) {
            if (back) p = p - 1
            node.style.transform = 'translateX('
                + p * 450 * (self.willX - self.currentX)
                + 'px)'
                + 'translateY('
                + p * 350 * (self.willY - self.currentY)
                + 'px)'
        }).animate()(function () {
            self.currentX = self.willX
            self.currentY = self.willY
            self.removed = true
        })

    },
    disappear: function () {
        var self = this
        new Animator(this.node, 500, function (node, p) {
            node.querySelector('.card').style.width = (1 - p) * 100 + '%'
            node.querySelector('.card').style.height = (1 - p) * 100 + '%'
            node.style.opacity = 1 - p
            node.style.fontSize = (16 * (1 - p)) + 'px'
        }).animate()(function () {
            self.currentAppear = false
        })
    },
    appear: function () {
        var self = this
        new Animator(this.node, 500, function (node, p) {
            node.querySelector('.card').style.width = p * 100 + '%'
            node.querySelector('.card').style.height = p * 100 + '%'
            node.style.opacity = p
            node.style.fontSize = (16 * p) + 'px'
        }).animate()(function () {
            self.currentAppear = true
        })
    },
    resort: function () {
        this.move()
        if (this.willAppear && this.currentAppear) return
        if (!this.currentAppear && this.willAppear) this.appear()
        if (this.currentAppear && !this.willAppear) this.disappear()
    },
    back: function () {
        if (!this.currentAppear && this.willAppear) this.appear()
        this.move(true)
    }
}

function Tag(node) {
    this.node = node
    this.node.style.fontSize = (40 - 20) * Math.random() + 20 + 'px'
    this.height = this.node.offsetTop
}
Tag.prototype = {
    animation: function () {
        this.node.style.opacity = 1
        var self = this
        new Animator(this.node, 500, function (node, p) {
            if (node.style.opacity !== 1) {
                node.style.opacity = 1
            }

            node.style.transform = 'translateY(' + (-self.height * (1 - p)) + 'px)'
        }).animate()()

    },
    returnStart: function () {
        this.node.style.opacity = 0
        this.node.style.transform = 'translateY(' + (-this.height) + 'px)'
    }
}
