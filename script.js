var Grabber = function(conf){
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

Grabber.prototype.bind = function() {
  var that = this

  this.triggerElement.addEventListener('mousedown',function() {
    document.querySelector('body').className = 'dragging'
    that.isGrabbing = true
  })

  this.triggerElement.addEventListener('mouseup',function() {
    that.isGrabbing = false
    document.querySelector('body').className = ''
  })

  this.triggerElement.addEventListener('mousemove', function(event) {


    if(that.position.old != that.position.current) {
      that.position.old = {x:that.position.current.x,y:that.position.current.y}
    }

    if(event.clientX) {
      that.position.current.x = event.clientX
      that.position.current.y = event.clientY
    }

    if(that.isGrabbing) {
        that.moveContainer()
    }
  })
}

Grabber.prototype.moveContainer = function() {

  var diff = (this.position.old.x - this.position.current.x)
  this.offsetLeft = parseInt(this.container.style.marginLeft) - diff * 0.8

  if(this.offsetLeft >= 0) this.offsetLeft = 0
  if(-this.offsetLeft >= this.lastCell.offsetLeft  && diff >= 0) this.offsetLeft = parseInt(this.container.style.marginLeft)

  this.container.style.marginLeft = this.offsetLeft + 'px'
}


var grabber = new Grabber({
  movingContainer: document.querySelector('#slider ul'),
  triggerElement: document.querySelector('#slider'),
  cell: document.querySelectorAll('#slider ul li')
})
