/**
 * Created by chizhang on 2017/8/13.
 */
function Container(id) {
    var self = this
    this.container = document.getElementById(id)
    this.items = this.container.querySelectorAll('.container')
    this.buttons = Array.from(this.container.querySelectorAll('.control ul li'))
    DomUtil.withNode(this.buttons[0]).addClass('hover')

    DomUtil.withNode(this.container).eventProxy(this.buttons, 'click', function (ele) {
        var index = self.buttons.indexOf(ele)
        self.setClickedIndex(index)
        self.scrollIndex(index)

    })
}
Container.prototype = {
    setClickedIndex: function (index) {
        this.clickedIndex = index
    },
    getClickedIndex: function () {
        return this.clickedIndex
    },
    getCurrentIndex: function () {
        return Array.from(this.items).indexOf(this.getCurrentItem())
    },
    getCurrentItem: function () {
        return this.container.querySelector('.current-container')
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
    scrollToNext: function () {
        var currentIndex = this.getCurrentIndex()
        var nextId = currentIndex + 1 >= this.items.length ? currentIndex : currentIndex + 1
        if (nextId !== currentIndex) {
            this.scrollStep(nextId)
            this.buttonMove(nextId)
        }

    },
    scrollToPrevious: function () {
        var currentIndex = this.getCurrentIndex()
        var preId = currentIndex <= 0 ? 0 : currentIndex - 1
        if (preId !== currentIndex) {
            this.scrollStep(preId)
            this.buttonMove(preId)
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

window.onload = function () {
    var pageScroll = new Task()
    var page = new Container('page')
    DomUtil.withNode(page.container).scrollPage(page.scrollToPrevious.bind(page), page.scrollToNext.bind(page))
    // var animals = Array.from(page.items).map(function () {
    //     return new Animator(2000,function (p) {
    //         console.log(p)
    //         if(p===1){
    //             page.scrollToNext()
    //         }
    //     }).animate()
    // })
    // pageScroll.add(...animals).run()()
}