/**
 * Created by chizhang on 2017/8/20.
 */
function skillInit() {

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
}
skillInit()