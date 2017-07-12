class Grabnslide {
   constructor(conf) {
     this.isGrabbing = false;
     this.container = conf.container || null;
     this.triggerElement = conf.triggerElement || this.container;
     this.cell = conf.cell || null;
     this.phoneEvent = false;

     this.container.style.marginLeft = 0;
     this.easing = 10;
     this.position = {
         old: {x:0,y:0},
         current: {x:0,y:0}
     }
     
     this.cellsWidth = 0;

     this.tools = {

       // http://jaketrent.com/post/addremove-classes-raw-javascript
       hasClass: function(el, className) {
         if (el.classList)
           return el.classList.contains(className);
         else
           return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
       },
       addClass:function(el, className) {
         if (el.classList)
           el.classList.add(className);
         else if (!hasClass(el, className)) el.className += " " + className;
       },
       removeClass:function(el, className) {
         if (el.classList)
           el.classList.remove(className);
         else if (hasClass(el, className)) {
           let reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
           el.className=el.className.replace(reg, ' ');
         }
       }
     }

     this.offsetLeft = 0;

     if(conf.cell && conf.cell.length >= 1) {
       this.getFirstCell();
       this.getLastCell();
     }
     this.bind();

     return this;
   }


   // ---------------
   // EVENT LISTENERS
   // ---------------
   bind() {
     var _this = this;

     this.triggerElement.addEventListener('mousedown',function() {
       _this.userStartGrabbing();
     })

     this.triggerElement.addEventListener('mouseup',function() {
       _this.userStopGrabbing();
     })

     this.triggerElement.addEventListener('mousemove', function(event) {
       _this.userMoves(event);
     })

     document.addEventListener('mouseleave',function() {
       _this.userStopGrabbing();
     })
     this.triggerElement.addEventListener('mouseleave',function() {
       _this.userStopGrabbing();
     })

     // PHONE EVENTS

     this.triggerElement.addEventListener('touchstart',function(event) {
       _this.userStartGrabbing();
       _this.phoneEvent = true;

       // Force value save to prevent instant big offset
       _this.saveValues(event.changedTouches[0]);
     })

     this.triggerElement.addEventListener('touchmove', function(event) {
       _this.phoneEvent = true;

       _this.userMoves(event.changedTouches[0]);
     })

     document.addEventListener('touchleave',function() {
       _this.phoneEvent = true;

       _this.userStopGrabbing();
     })

     document.addEventListener('touchend',function() {
       _this.phoneEvent = true

       _this.userStopGrabbing();
     })

     document.addEventListener('touchcancel',function() {
       _this.phoneEvent = true

       _this.userStopGrabbing();
     })

     this.moveContainer();
   }

   // ------------
   // CALC METHODS
   // ------------

   saveValues(event) {
     if(this.position.old != this.position.current) {
       this.position.old = {x:this.position.current.x,y:this.position.current.y};
     } else {
         this.userStopGrabbing();
     }

     if(event.clientX) {
       this.position.current.x = event.clientX;
       this.position.current.y = event.clientY;
     }
   }

    // -----------------------------------
    // FUNCTION TO MOVE CONTAINER
    // -----------------------------------

   moveContainer() {
     var _this = this;

     if(this.cell && this.cell.length >= 1) {
         this.cellsWidth = 0;

         for(let i = 0;i<this.cell.length;i++) {
           this.cellsWidth += this.cell[i].offsetWidth;
         }
     }

     requestAnimationFrame(function() {
       _this.moveContainer();
     })

     if(this.isGrabbing == false && this.offsetLeft != 0) {
       this.offsetToZero();
     }
     let marginLeft = this.isMarginInLimit();

     this.setContainerMargin(marginLeft);
   }

   setContainerMargin(marginLeft) {
     this.container.style.marginLeft = marginLeft + 'px';
   }

   isMarginInLimit() {

     // accelerating on phone
     let hasOffset = this.phoneEvent == true ? 1.5 : 1;

     let base = parseInt(this.container.style.marginLeft);
     let marginLeft = base - (this.offsetLeft * hasOffset);

     let limitMargin = this.container.offsetWidth - this.container.parentElement.offsetWidth;
     if(this.cell) {
       limitMargin = this.cellsWidth - this.lastCell.offsetWidth;
     }

     if(marginLeft > 0 && !this.isGrabbing) {
       marginLeft -= marginLeft / this.easing;
     }
     else if(-marginLeft >= limitMargin && !this.isGrabbing && this.cellsWidth != 0) {
       marginLeft -= (limitMargin + marginLeft) / this.easing;
     }
     else if(-marginLeft >= limitMargin && !this.isGrabbing && this.cellsWidth == 0) {
       marginLeft -= (limitMargin + marginLeft) / this.easing;
     }


     return marginLeft;

   }

   offsetToZero() {

     let absOffsetLeft = Math.abs(Math.round(this.offsetLeft));

     if(absOffsetLeft == 0) {
       this.offsetLeft = absOffsetLeft;
       return true;
     }

     this.offsetLeft -= this.offsetLeft / this.easing;
   }


   // -------------------
   // GETTERS AND SETTERS
   // -------------------

   getFirstCell() {
       this.firstCell = this.cell[0];
       return this.firstCell;
   }

   getLastCell() {
       this.lastCell = this.cell[this.cell.length - 1];
       return this.lastCell;
   }

   // ----------------------------------
   // FUNCTIONS RELATIVE TO USER ACTIONS
   // ----------------------------------

   userMoves(event) {
     this.saveValues(event);

     if(this.isGrabbing) {
       this.offsetLeft = (this.position.old.x - this.position.current.x);
     }
   }

   userStartGrabbing() {
     this.tools.addClass(document.querySelector('body'),'dragging');
     this.isGrabbing = true;
   }

   userStopGrabbing() {
     this.tools.removeClass(document.querySelector('body'),'dragging');
     this.isGrabbing = false;
   }
}
