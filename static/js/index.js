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
function initLoad(page) {
    page.prototype.translateUp = null
    page.prototype.translateCurrent = null
    page.prototype.translateDown = null
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


    function Project(animations) {
        this.toolbar = true
        this.toolbarAnimations = animations
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
    var projectPage = new Project(allTasks)
    Project.prototype.translateUp = function (e) {
        if (this.toolbar) {
            Task.all(this.toolbarAnimations).add(function () {
                var cardList = document.querySelector('.card-list-wrap')
                var a = 0
                var self = this
                cardList.addEventListener('mousewheel', function (e) {
                    var delta = event.detail || (-event.wheelDelta)
                    a -= delta
                    if (a >= -590 && a <= 0 && !self.toolbar) {
                        e.stopPropagation()
                        cardList.style.transform = 'translateY(' + a + 'px)'
                    } else {
                        if (a < -590) a = -590
                        if (a > 0) a = 0
                    }

                })
            }).run()()
            this.toolbar = false
        } else {
            DomUtil.withNode(this.page).addClass('next-container').removeClass('current-container')
            return true
        }

    }

    return projectPage
}
function skillInit(page) {
    function SkillPage() {
        this.editor = ace.edit("editor");
        this.tagsShow = false
        this.editor.setTheme("ace/theme/twilight");
        this.editor.getSession().setMode("ace/mode/javascript");
        this.editor.renderer.setShowGutter(false)
        this.editor.setFontSize('15px')
        this.editor.renderer.lineHeight = 25
        this.editor.$blockScrolling = Infinity
        var self = this
        DomUtil.withNode(document)
            .eventProxy(document.querySelectorAll('.skill .toolbar .toggle-wrap .toggle-skill label')
                , 'click', function (node) {
                    console.log('a')
                    clearInterval(self.intervalId)
                    var language = node.innerText + 'Code'
                    var text = document.getElementById(language).innerText
                    var t = ''
                    var i = 0
                    self.intervalId = setInterval(function () {
                        self.editor.setValue(t += text.charAt(i))
                        self.editor.clearSelection()
                        i++
                        if (i === text.length) {
                            clearInterval(self.intervalId)
                        }
                    }, 10)
                })
        DomUtil.withNode(document)
            .eventProxy(document.querySelectorAll('.skill .toolbar .toggle-wrap .toggle-tag label')
                , 'click', function (node) {
                    var domWrap = DomUtil.withNode(document.querySelector('.tags'))
                    if (node.getAttribute('for') === 'front') {
                        domWrap.removeClass('tags-all tags-back').addClass('tags-front')
                    } else if (node.getAttribute('for') === 'back') {
                        domWrap.removeClass('tags-all tags-front').addClass('tags-back')
                    } else {
                        domWrap.removeClass('tags-front tags-back').addClass('tags-all')
                    }
                })
    }

    SkillPage.prototype = page
    function animationNow(self) {
        var language = document.querySelector('.skill .toolbar .toggle-wrap .toggle input:checked+label').innerText
        var text = document.getElementById(language + 'Code').innerText
        var t = ''
        var i = 0
        self.editor.setValue('')
        self.intervalId = setInterval(function () {
            self.editor.setValue(t += text.charAt(i))
            self.editor.clearSelection()
            i++
            if (i === text.length) {
                clearInterval(self.intervalId)
            }
        }, 10)
    }

    var tags = Array.from(document.querySelectorAll('.tags a')).reverse().map(function (tag) {
        return new Tag(tag)
    })
    var tagsAnimation = tags.map(function (tag) {
        var height = 100 * Math.random()
        return function (next) {
            setTimeout(function () {
                tag.animation(height)
                next()
            }, 300)
        }
    })
    SkillPage.prototype.translateCurrent = function () {
        animationNow(this)
        DomUtil.withNode(this.page).addClass('current-container').removeClass('next-container pre-container')
        this.startAnimate()
        return true
    }
    var upAnimation = new Task().add(
        function (next) {
            document.querySelector('.skill .toolbar .toggle').style.display = 'none'
            next()
        })
        .add(new Animator(document.querySelector('.mac-wrap'), 500, function (node, p) {
            node.style.opacity = 1 - p
        }).animate())
        .add(function (next) {
            document.querySelector('.tags-wrap').style.transform = 'translateY(-100%)'
            document.querySelector('.tags-wrap').style.opacity = 1
            next()
        })
        .add(tagsAnimation)
        .add(function () {
            DomUtil.withNode(document.querySelector('.tags')).addClass('tags-all')
        })
    var downAnimation = new Task()
        .add(function (next) {
            document.querySelector('.skill .toolbar .toggle').style.display = ''
            next()
        })
        .add(new Animator(document.querySelector('.tags-wrap'), 500, function (node, p) {
            node.style.opacity = 1 - p
        }).animate())
        .add(new Animator(document.querySelector('.mac-wrap'), 500, function (node, p) {
            node.style.opacity = p
        }).animate())
        .add(function () {
            upAnimation.cancel()
            tags.forEach(function (tag) {
                tag.returnStart()
            })
            DomUtil.withNode(document.querySelector('.tags')).removeClass('tags-all')
        })

    SkillPage.prototype.translateUp = function () {
        clearInterval(this.intervalId)
        this.editor.setValue('')
        if (!this.tagsShow) {
            if (upAnimation.canceled) upAnimation.open()
            upAnimation.run()()
            this.tagsShow = true
            return false
        }
        DomUtil.withNode(this.page).addClass('pre-container').removeClass('current-container')
        return true
    }
    SkillPage.prototype.translateDown = function () {
        clearInterval(this.intervalId)
        this.editor.setValue('')
        if (this.tagsShow) {
            downAnimation.run()()
            animationNow(this)
            this.tagsShow = false
            return false
        }
        DomUtil.withNode(this.page).addClass('next-container').removeClass('current-container')
        return true
    }
    var skillPage = new SkillPage()
    return skillPage
}
function workInit(page) {
    page.setAnimate(new Task().add(function (next) {
        DomUtil.withNode(document.querySelector('.work .work-content')).removeClass('work-content-animation').addClass('work-content-animation')
    }))
    return page
}
window.onload = function () {
    var loadPage = new Page('.load',true)
    var introducePage = introductionInit(new Page('.introduction'))
    var projectPage = projectInit(new Page('.project'))
    var skillPage = skillInit(new Page('.skill'))
    var workPage = workInit(new Page('.work'))
    var container = new Container('page', [loadPage,introducePage, projectPage, skillPage, workPage])
    container.scrollToNext()
}