function beat(animations, selector) {
    var T = 200, t = 200
    while (t > 30) {
        animations.push(new Animator(document.querySelector(selector), t, function (node, p) {
            var s = this.duration * 10 / T;
            var ty = -s * p * (2 - p);
            node.style.transform = 'translateY('
                + ty + 'px';
        }).animate())
        animations.push(new Animator(document.querySelector(selector), t, function (node, p) {
            var s = this.duration * 10 / T;
            var ty = s * (p * p - 1);
            node.style.transform = 'translateY('
                + ty + 'px';
        }).animate());

        t *= 0.5
    }
}
function introductionInit(page) {
    var animations = []

    animations.push(new Animator(
        document.querySelector('.profile-name'),
        500,
        function (node, p) {
            node.style.opacity = p
            node.style.transform = 'translateY(' + (1 - p) * 10 + 'px'
        }).animate())
    animations.push(new Animator(
        document.querySelector('.profile-introduction'),
        500,
        function (node, p) {
            node.style.opacity = p
            node.style.transform = 'translateY(' + (1 - p) * 10 + 'px'
        }
    ).animate())
    animations.push(new Animator(
        document.querySelector('.profile-purpose'),
        500,
        function (node, p) {
            node.style.opacity = p
            node.style.transform = 'translateY(' + (1 - p) * 10 + 'px'
        }
    ).animate())
    animations.push(new Animator(
        document.querySelector('.h-list'),
        500,
        function (node, p) {
            node.style.opacity = p
            node.style.transform = 'translateY(' + (1 - p) * 10 + 'px'
        }
    ).animate())


    beat(animations, '.github')
    beat(animations, '.weibo')
    beat(animations, '.zhihu')
    var animationTasks = new Task()

    animationTasks.add(animations)
    page.setAnimate(animationTasks)
    return page
}
function projectInit(page) {
    var allTasks = [new Animator(
        document.querySelector('.project .toolbar'),
        500,
        function (node, p) {
            node.style.height = (300 - 220 * p) + 'px'
        }
    ).animate(),
        new Animator(
            document.querySelector('.project .toolbar .title h2'),
            500,
            function (node, p) {
                node.style.marginTop = (150 - 150 * p) + 'px'
                node.style.width = (100 - 85 * p) + '%'
            }
        ).animate(),
        new Animator(
            document.querySelector('.project .toolbar .toggle-wrap .toggle'),
            500,
            function (node, p) {
                node.style.marginTop = (240 - 200 * p) + 'px'
            }
        ).animate()]

    var a = 0

    function Project(animations) {
        this.toolbar = true
        this.toolbarAnimations = animations
        var cardList = document.querySelector('.card-list-wrap')
        var a = 0
        var self = this
        cardList.addEventListener('mousewheel', function (e) {
            var delta = event.detail || (-event.wheelDelta)
            a -= delta
            if (a >= -290 && a <= 0 && !self.toolbar) {
                e.stopPropagation()
                cardList.style.transform = 'translateY(' + a + 'px)'
            } else {
                if (a < -290) a = -290
                if (a > 0) a = 0
            }

        })

        var cards = this.page.querySelectorAll('.card-wrap')
        cards = Array.from(cards).map((card, index) => {
            var returnCard
            if (DomUtil.withNode(card).haveClass('company')) {
                returnCard = new Card(card, 'company', index % 2, parseInt(index / 2))
            } else if (DomUtil.withNode(card).haveClass('my')) {
                returnCard = new Card(card, 'my', index % 2, parseInt(index / 2))
            }
            return returnCard
        })

        var clicked = '全部'
        this.page.querySelector('.toggle').addEventListener('click', function (e) {
            if (clicked === e.target.innerText) {
                return
            }
            clicked = e.target.innerText
            switch (e.target.innerText) {
                case '全部':
                    cards.forEach((card, index) => {
                        card.willX = index % 2
                        card.willY = parseInt(index / 2)
                        card.willAppear = true
                        card.back()
                    })
                    break
                case '公司项目':
                    var m = 0, c = 0
                    cards.forEach((card, index) => {
                        if (card.tag === 'company') {
                            card.willX = c % 2
                            card.willY = parseInt(c / 2)
                            card.willAppear = true
                            c++
                        } else {
                            card.willX = m % 2
                            card.willY = parseInt(m / 2)
                            console.log('ss')
                            card.willAppear = false
                            m++
                        }
                        card.resort()
                    })
                    break
                case '个人作品':
                    var m = 0, c = 0
                    cards.forEach((card, index) => {
                        if (card.tag === 'company') {
                            card.willX = c % 2
                            card.willY = parseInt(c / 2)
                            card.willAppear = false
                            c++
                        } else {
                            card.willX = m % 2
                            card.willY = parseInt(m / 2)
                            card.willAppear = true
                            m++
                        }
                        card.resort()
                    })
                    break
            }

        })
    }

    Project.prototype = page
    page = new Project(allTasks)
    page.translateUp = function (e) {
        if (this.toolbar) {
            Task.all(this.toolbarAnimations)
            this.toolbar = false
        } else {
            DomUtil.withNode(this.page).addClass('next-container').removeClass('current-container')
            return true
        }

    }


    return page
}
function skillInit(page) {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/twilight");
    editor.getSession().setMode("ace/mode/javascript");
    editor.renderer.setShowGutter(false)
    editor.setFontSize('15px')
    editor.renderer.lineHeight = 25

    var JavaScriptText = document.getElementById('JavaScriptCode').innerText
    var ReactText = document.getElementById('ReactCode').innerText
    var CssText = document.getElementById('CssCode').innerText
    var GoText = document.getElementById('GoCode').innerText
    var JavaText = document.getElementById('JavaCode').innerText
    var AndroidText = document.getElementById('AndroidCode').innerText
    var id
    DomUtil.withNode(document)
        .eventProxy(document.querySelectorAll('.skill .toolbar .toggle-wrap .toggle label')
            , 'click', function (node) {
                clearInterval(id)
                var language = node.innerText + 'Code'
                var text = document.getElementById(language).innerText
                var t = ''
                var i = 0
                id = setInterval(function () {
                    editor.setValue(t += text.charAt(i))
                    editor.clearSelection()
                    i++
                    if (i === text.length) {
                        clearInterval(id)
                    }
                }, 10)
            })

    var t = ''
    var i = 0
    var id = setInterval(function () {
        editor.setValue(t += JavaScriptText.charAt(i))
        editor.clearSelection()
        i++
        if (i === JavaScriptText.length) {
            clearInterval(id)
        }
    }, 10)
    return page
}
window.onload = function () {
    var loadPage = new Page('.load')
    var introducePage = introductionInit(new Page('.introduction'))
    var projectPage = projectInit(new Page('.project'))
    var skillPage = skillInit(new Page('.skill'))

    var container = new Container('page', [loadPage, introducePage, projectPage, skillPage])

    var pageScroll = new Task()

}