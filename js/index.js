var startObj = {},
    endObj = {}

function changeFontSize() {
    var w = document.documentElement.clientWidth || document.body.clientWidth
    var fontSize = w / 750 * 100 + 'px'
    document.documentElement.fontSize = fontSize
}
changeFontSize()

$('body').on('touchmove', function (event) {
    event.preventDefault()
}, {passive: false})

$('.container').on("touchstart", touchStart).on("touchmove", touchMove).on("touchend", touchEnd)

function touchStart(event) {
    $('.tip').text('开始触摸')
    var {X: startX, Y: startY} = getTouchPoint(event)
    startObj.x = startX
    startObj.y = startY
    this.prePoint = startObj
    this.count = 0
}

function touchMove(event) {
    this.count ++   
    if (this.count > 10) {
        var {X: moveX, Y: moveY} = getTouchPoint(event)
        var deg = computeDeg(this.prePoint, {
            x: moveX,
            y: moveY
        })
        this.speed = computedSpeed(this.prePoint.x, moveX, deg)
        this.prePoint.x = moveX
        this.prePoint.y = moveY
        this.count = 0
    }
    $('.tip').text('滑动中')
}

function touchEnd(event) {
    var {X: endX, Y: endY} = getTouchPoint(event)
    endObj.x = endX
    endObj.y = endY
    // debugger
    var deg = computeDeg(startObj, endObj)
    var rotatePrams = rotateDirection(startObj, endObj)
    deg *= this.speed || (this.speed = 0)
    $('.cube')[0].style.transform = `rotate3d(${rotatePrams}, ${deg}deg)`
    event.stopPropagation()
    $('.tip').text('离开屏幕' + `spend ${this.speed}`+ `rotate3d(${rotatePrams}, ${deg}deg)`)
}

// Computing path degree
function computeDeg(startOrigin, endOrigin) {
    var x = startOrigin.x - endOrigin.x
    var y = startOrigin.y - endOrigin.y
    while (x == y) {x += 0.01}
    var tan = x / y
    var deg = parseInt(180 / Math.PI * Math.atan(tan))
    return Math.abs(deg)
}

function rotateDirection(startOrigin, endOrigin) {
    var x = startOrigin.x - endOrigin.x
    var y = startOrigin.y - endOrigin.y
    if (y > 0) {
        if (x > 0) {
            y = -1
        } else {
            y = 1
        }
        x = 1
    } else if (y < 0) {
        if (x < 0) {
            y = 1
        } else {
            y = -1
        }
        x = -1
    } else {}
    return `${x}, ${y}, 0`
}

function computedSpeed (startX, endX, deg) {
    var speed = Math.abs((endX - startX) / Math.sin(deg))
    speed = Math.ceil(speed / 10)
    return speed
}

function getTouchPoint (event) {
    var X = parseInt(event.originalEvent.changedTouches[0].clientX)
    var Y = parseInt(event.originalEvent.changedTouches[0].clientY)
    return {X, Y}
}