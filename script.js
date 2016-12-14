var Grabnslide = function(conf){
  this.isGrabbing = false;
  this.container = conf.movingContainer || null
  this.triggerElement = conf.triggerElement || null
  this.cell = conf.cell || null

  this.firstCell = this.cell[0]
  this.lastCell = this.cell[this.cell.length - 1]

  this.container.style.marginLeft = 0
  this.position = {
      old: {x:0,y:0},
      current: {x:0,y:0}
  }

  this.offsetLeft = 0
  this.bind()
}

Grabnslide.prototype.userStartGrabbing = function() {
  document.querySelector('body').className = 'dragging'
  this.isGrabbing = true
}

Grabnslide.prototype.userStopGrabbing = function() {
  this.isGrabbing = false
  document.querySelector('body').className = ''
}

Grabnslide.prototype.bind = function() {
  var that = this

  this.triggerElement.addEventListener('mousedown',function() {
    that.userStartGrabbing()
  })

  this.triggerElement.addEventListener('mouseup',function() {
    that.userStopGrabbing()
  })

  this.triggerElement.addEventListener('mousemove', function(event) {
    that.saveAndMoveContainer(event)
  })

  document.addEventListener('mouseleave',function() {
    that.userStopGrabbing()
  })
}

Grabnslide.prototype.saveAndMoveContainer = function(event) {

      if(this.position.old != this.position.current) {
        this.position.old = {x:this.position.current.x,y:this.position.current.y}
      }

      if(event.clientX) {
        this.position.current.x = event.clientX
        this.position.current.y = event.clientY
      }
      if(this.isGrabbing) {
          this.moveContainer()
      }
}

Grabnslide.prototype.moveContainer = function() {

  var diff = (this.position.old.x - this.position.current.x)
  this.offsetLeft = parseInt(this.container.style.marginLeft) - diff * 0.8

  if(this.offsetLeft >= 0) this.offsetLeft = 0
  if(-this.offsetLeft >= this.lastCell.offsetLeft  && diff >= 0) this.offsetLeft = parseInt(this.container.style.marginLeft)

  this.container.style.marginLeft = this.offsetLeft + 'px'
}


var Grabnslide = new Grabnslide({
  movingContainer: document.querySelector('#slider ul'),
  triggerElement: document.querySelector('#slider'),
  cell: document.querySelectorAll('#slider ul li')
})
