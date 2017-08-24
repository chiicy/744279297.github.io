function setObserBehavior(subjects) {
    if (!Array.isArray(subjects)) {
        if (subjects.length) subjects = Array.from(subjects)
        else subjects = [subjects]
    }
    subjects.forEach(function (subject) {
        subject.watchBy = function (target, type) {
            subject.addEventListener(type, function (evt) {
                evt.sender = subject
                evt.receiver = target
                target.notice && target.notice(type, evt)
            })
        }
    })
}