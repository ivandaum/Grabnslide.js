var Grabnslide = function(conf){
  this.isGrabbing = false;
  this.container = conf.container || null
  this.triggerElement = conf.triggerElement || this.container
  this.cell = conf.cell || null


  this.phoneEvent = false

  this.container.style.marginLeft = 0
  this.easing = 10
  this.position = {
      old: {x:0,y:0},
      current: {x:0,y:0}
  }
  this.cellsWidth = 0
  this.tools = {
    // http://jaketrent.com/post/addremove-classes-raw-javascript

    hasClass: function(el, className) {
      if (el.classList)
        return el.classList.contains(className)
      else
        return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    },
    addClass:function(el, className) {
      if (el.classList)
        el.classList.add(className)
      else if (!hasClass(el, className)) el.className += " " + className
    },
    removeClass:function(el, className) {
      if (el.classList)
        el.classList.remove(className)
      else if (hasClass(el, className)) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
        el.className=el.className.replace(reg, ' ')
      }
    }
  }
  this.offsetLeft = 0

  if(conf.cell && conf.cell.length >= 1) {
    this.getFirstCell()
    this.getLastCell()
  }
  this.bind()

  return this
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
    that.userMoves(event)
  })

  document.addEventListener('mouseleave',function() {
    that.userStopGrabbing()
  })
  this.triggerElement.addEventListener('mouseleave',function() {
    that.userStopGrabbing()
  })

  // PHONE EVENTS

  this.triggerElement.addEventListener('touchstart',function(event) {
    that.userStartGrabbing()
    that.phoneEvent = true
    // Force value save to prevent instant big offset
    var customEvent = event.changedTouches[0]
    that.saveValues(customEvent)
  })

  this.triggerElement.addEventListener('touchmove', function(event) {
    that.phoneEvent = true

    var customEvent = event.changedTouches[0]
    that.userMoves(customEvent)
  })

  document.addEventListener('touchleave',function() {
    that.phoneEvent = true

    that.userStopGrabbing()
  })

  document.addEventListener('touchend',function() {
    that.phoneEvent = true

    that.userStopGrabbing()
  })

  document.addEventListener('touchcancel',function() {
    that.phoneEvent = true

    that.userStopGrabbing()
  })

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



  if(this.cell && this.cell.length >= 1) {
      this.cellsWidth = 0

      for(var i =0;i<this.cell.length;i++) {
        this.cellsWidth += this.cell[i].offsetWidth
      }
  }

  requestAnimationFrame(function() {
    that.moveContainer()
  })

  if(this.isGrabbing == false && this.offsetLeft != 0) {
    this.offsetToZero()
  }
  var marginLeft = this.isMarginInLimit()

  this.setContainerMargin(marginLeft)
}

Grabnslide.prototype.setContainerMargin = function(marginLeft) {
  this.container.style.marginLeft = marginLeft + 'px'
}

Grabnslide.prototype.isMarginInLimit = function() {

  // accelerating on phone
  var hasOffset = this.phoneEvent == true ? 1.5 : 1

  var base = parseInt(this.container.style.marginLeft)
  var marginLeft = base - (this.offsetLeft * hasOffset)

  if(this.cell) {
    var limitMargin = this.cellsWidth - this.lastCell.offsetWidth
  } else {
      var limitMargin = this.container.offsetWidth - this.container.parentElement.offsetWidth
  }


  if(marginLeft > 0 && !this.isGrabbing) {
    marginLeft -= marginLeft / this.easing
  }
   else if(-marginLeft >= limitMargin && !this.isGrabbing && this.cellsWidth != 0) {
    marginLeft -= (limitMargin + marginLeft) / this.easing
  }
  else if(-marginLeft >= limitMargin && !this.isGrabbing && this.cellsWidth == 0) {
    marginLeft -= (limitMargin + marginLeft) / this.easing
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

Grabnslide.prototype.userMoves = function(event) {
  this.saveValues(event)

  if(this.isGrabbing) {
    this.offsetLeft = (this.position.old.x - this.position.current.x)
  }
}

Grabnslide.prototype.userStartGrabbing = function() {
  this.tools.addClass(document.querySelector('body'),'dragging')
  this.isGrabbing = true
}

Grabnslide.prototype.userStopGrabbing = function() {
  this.tools.removeClass(document.querySelector('body'),'dragging')
  this.isGrabbing = false
}
