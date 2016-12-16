var Grabnslide = function(conf){
  this.isGrabbing = false;
  this.container = conf.movingContainer || null
  this.triggerElement = conf.triggerElement || null
  this.cell = conf.cell || null

  this.container.style.marginLeft = 0
  this.easing = 0.7
  this.interval = null

  this.position = {
      old: {x:0,y:0},
      current: {x:0,y:0}
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

  this.getFirstCell()
  this.getLastCell()
  this.moveContainer()
}

// -----------------------------------
// FUNCTION TO CALC AND MOVE CONTAINER
// -----------------------------------

Grabnslide.prototype.saveValues = function(event) {

      if(this.position.old != this.position.current) {
        this.position.old = {x:this.position.current.x,y:this.position.current.y}
      }

      if(event.clientX) {
        this.position.current.x = event.clientX
        this.position.current.y = event.clientY
      }

}

Grabnslide.prototype.moveContainer = function() {
  var that = this

  requestAnimationFrame(function() {
    that.moveContainer()
  })


  // VELOCITY HERE

  if(this.offsetLeft >= 0) this.offsetLeft -= this.easing
  if(this.offsetLeft <= 0) this.offsetLeft += this.easing

  var base = parseInt(this.container.style.marginLeft)
  var marginLeft = base + (-this.offsetLeft)

  this.setContainerMargin(marginLeft)
}

Grabnslide.prototype.setContainerMargin = function(marginLeft) {
  if(marginLeft >= 0) marginLeft = 0
  if(-marginLeft >= this.lastCell.offsetLeft) marginLeft = parseInt(this.container.style.marginLeft)
  this.container.style.marginLeft = marginLeft + 'px'
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
