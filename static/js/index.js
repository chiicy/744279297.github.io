/**
 * Created by chizhang on 2017/8/13.
 */

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
    var animations = []
    var allTasks = [new Animator(
        document.querySelector('.project .toolbar'),
        1000,
        function (node, p) {
            node.style.height = (300 - 220 * p) + 'px'
        }
    ).animate(),
        new Animator(
            document.querySelector('.project .toolbar .title h2'),
            1000,
            function (node, p) {
                node.style.marginTop = (150 - 150 * p) + 'px'
                node.style.width = (100 - 85 * p) + '%'
            }
        ).animate(),
        new Animator(
            document.querySelector('.project .toolbar .toggle-wrap .toggle'),
            1000,
            function (node, p) {
                node.style.marginTop = (240 - 200 * p) + 'px'
            }
        ).animate(),
        new Animator(
            document.querySelector('.card-list'),
            1000,
            function (node, p) {
                node.style.opacity = p
            }
        ).animate()]

    var animationTasks = Task.all(allTasks)

    animationTasks.add(animations)
    page.setAnimate(animationTasks)
    return page
}
window.onload = function () {

    var height = getComputedStyle(document.querySelector('.load')).height
    //   fullPage(Array.from(document.querySelector('.container')),height)
    var loadPage = new Page('.load')
    var introducePage = introductionInit(new Page('.introduction'))
    var projectPage = projectInit(new Page('.project'))
    var skillPage = new Page('.skill')

    var container = new Container('page', [loadPage, introducePage, projectPage, skillPage])

    var pageScroll = new Task()
    // DomUtil.withNode(container.container).scrollPage(container.scrollToPrevious.bind(container), container.scrollToNext.bind(container))
    //  introductionInit()
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