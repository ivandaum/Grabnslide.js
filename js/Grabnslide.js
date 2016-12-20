var Grabnslide = function(conf){
  this.isGrabbing = false;
  this.container = conf.container || null
  this.triggerElement = conf.triggerElement || this.container
  this.cell = conf.cell || null

  this.container.style.marginLeft = 0
  this.easing = 10
  this.duration = 200

  this.position = {
      old: {x:0,y:0},
      current: {x:0,y:0}
  }

  this.Easing = {

      // By Dorian Lods
      // https://github.com/mairod/easing-equations/

      linear:               function (t) { return t },
      easeInQuad:           function (t) { return t*t },
      easeOutQuad:          function (t) { return t*(2-t) },
      easeInOutQuad:        function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
      easeInCubic:          function (t) { return t*t*t },
      easeOutCubic:         function (t) { return (--t)*t*t+1 },
      easeInOutCubic:       function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
      easeInQuart:          function (t) { return t*t*t*t },
      easeOutQuart:         function (t) { return 1-(--t)*t*t*t },
      easeInOutQuart:       function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
      easeInQuint:          function (t) { return t*t*t*t*t },
      easeOutQuint:         function (t) { return 1+(--t)*t*t*t*t },
      easeInOutQuint:       function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
  }

  this.offsetLeft = 0

  this.bind()
}

// ---------------
// EVENT LISTENERS
// ---------------

Grabnslide.prototype.bind = function() {
  var that = this

  this.triggerElement.addEventListener('mousedown',function() {
    that.userStartGrabbing()
  })

  this.triggerElement.addEventListener('mouseup',function() {
    that.userStopGrabbing()
  })

  this.triggerElement.addEventListener('mousemove', function(event) {
    that.saveValues(event)

    if(that.isGrabbing) {
      that.offsetLeft = (that.position.old.x - that.position.current.x)
    }
  })

  document.addEventListener('mouseleave',function() {
    that.userStopGrabbing()
  })

  this.triggerElement.addEventListener('mouseleave',function() {
    that.userStopGrabbing()
  })

  this.getFirstCell()
  this.getLastCell()
  this.moveContainer()
}

// ------------
// CALC METHODS
// ------------

Grabnslide.prototype.saveValues = function(event) {

      if(this.position.old != this.position.current) {
        this.position.old = {x:this.position.current.x,y:this.position.current.y}
      } else {
          this.userStopGrabbing()
      }

      if(event.clientX) {
        this.position.current.x = event.clientX
        this.position.current.y = event.clientY
      }

}

// -----------------------------------
// FUNCTION TO MOVE CONTAINER
// -----------------------------------

Grabnslide.prototype.moveContainer = function() {
  var that = this

  requestAnimationFrame(function() {
    that.moveContainer()
  })

  // VELOCITY HERE

  if(this.isGrabbing == false && this.offsetLeft != 0) {
    this.offsetToZero()
  }
  var marginLeft  = this.isMarginInLimit()

  this.setContainerMargin(marginLeft)
}

Grabnslide.prototype.setContainerMargin = function(marginLeft) {
  this.container.style.marginLeft = marginLeft + 'px'
}

Grabnslide.prototype.isMarginInLimit = function() {
  var base = parseInt(this.container.style.marginLeft)
  var marginLeft = base - this.offsetLeft

  if(marginLeft > 0 && !this.isGrabbing) {
    marginLeft -= marginLeft / this.easing
  }
  if(-marginLeft >= this.lastCell.offsetLeft && !this.isGrabbing) {
    marginLeft -= (this.lastCell.offsetLeft + marginLeft) / this.easing
  }
  return marginLeft

}

Grabnslide.prototype.offsetToZero = function() {

  var absOffsetLeft = Math.abs(Math.round(this.offsetLeft))

  if(absOffsetLeft == 0) {
    this.offsetLeft = absOffsetLeft
    return true
  }

  this.offsetLeft -= this.offsetLeft / this.easing
}

// -------------------
// GETTERS AND SETTERS
// -------------------

Grabnslide.prototype.getFirstCell = function() {
    this.firstCell = this.cell[0]
    return this.firstCell
}

Grabnslide.prototype.getLastCell = function() {
    this.lastCell = this.cell[this.cell.length - 1]
    return this.lastCell
}

// ----------------------------------
// FUNCTIONS RELATIVE TO USER ACTIONS
// ----------------------------------

Grabnslide.prototype.userStartGrabbing = function() {
  document.querySelector('body').className = 'dragging'
  this.isGrabbing = true
}

Grabnslide.prototype.userStopGrabbing = function() {
  document.querySelector('body').className = ''
  this.isGrabbing = false
}
