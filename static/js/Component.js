/**
 * Created by chizhang on 2017/8/16.
 */
function Page(node) {
    if (typeof node === 'string') {
        this.page = document.getElementById('id')
    } else {
        this.page = node
    }
    var self = this

}
Page.prototype = {
    translateUp: function () {

    },
    translageDown: function () {

    },
    setAnimate: function (animations) {
        var animationTask = new Task()
        animationTask.add(animations)
        this.animations = animationTask
        this.animations.run()()
    },
    Stopanimate: function () {
        this.animations.block()
    },
    reStartAnimate: function () {
        this.animations.blockEnd()
    }
}
