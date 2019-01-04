


import './TouchDragManager.css'
import _remove from 'lodash/remove'

import MobileDetect from 'mobile-detect'

export default class TouchDragManager {
  
  constructor() {

    // current touch drag
    this.active_drag = null;
    
    // possible drop targets and active target
    this.drop_targets = [];
    this.active_drop_target = null;

    // mobile detect
    let md = new MobileDetect(window.navigator.userAgent);
    this.isMobile = md.mobile();
    this.isTablet = md.tablet();
    this.isPhone = this.isMobile && !this.isTablet;
  }

  // register a new target
  registerDropTarget(target) {
    this.drop_targets.push(target);
  }

  // unregister a target
  unregisterDropTarget(element) {
    _remove(this.drop_targets, target => target.element == element);
  }

  // handle beginning of touch sequence
  onTouchStart(event, card, drag_source) {

    // clear any active drag
    this.clearActiveDrag();

    // compute the size and location for the drag image
    const extraWidth = !this.isTablet ? 180 : 100;
    const extraHeight = extraWidth * 1.3968;
    let cardRect = event.target.getBoundingClientRect();
    let previewRect =  { 
      left: Math.max(0, cardRect.x - (extraWidth/2)), 
      top: cardRect.y, 
      width: cardRect.width + extraWidth,
      height: cardRect.height + extraHeight
    };
    let overflowX = (previewRect.left + previewRect.width) - window.innerWidth;
    if (overflowX > 0)
      previewRect.left -= overflowX;
    let overflowY = (previewRect.top + previewRect.height) - window.innerHeight;
    if (overflowY > 0)
      previewRect.top -= overflowY;
    
    // create and position drag image
    let dragImg =  document.createElement("img");
    dragImg.style.position = "absolute";
    dragImg.classList.add("mtgcard-touch-drag-image");
    dragImg.setAttribute('src', event.target.getAttribute('src'));
    dragImg.setAttribute('draggable', 'false');
    dragImg.setAttribute('oncontextmenu', 'return false;');
    dragImg.style.left = previewRect.left + 'px';
    dragImg.style.top = previewRect.top + 'px';
    dragImg.style.width = previewRect.width + 'px';
    dragImg.style.height = previewRect.height + 'px';
    dragImg.style.zIndex = 2000;
    dragImg.style.opacity = 0;
    document.body.appendChild(dragImg);

    // compute cursor offset
    var touch = event.targetTouches[0];
    let offset = {
      x: touch.clientX - cardRect.left, 
      y: touch.clientY - cardRect.top
    };

    // set active touch
    this.active_drag = {
      card: card,
      drag_source: drag_source,
      drag_image: dragImg,
      cursorStart: {
        x: touch.clientX,
        y: touch.clientY
      },
      cursorOffset: offset,
    };

    // delay display of image
    let vm = this;
    setTimeout(() => {
      if (vm.active_drag && vm.active_drag.drag_image == dragImg)
        if (dragImg.style.opacity === "0")
          dragImg.style.opacity = 1;
    }, 300);
  }

  // handle touch move
  onTouchMove(event) {

    if (this.active_drag) {

      let dragThreshold = 20;
      let touch = event.targetTouches[0];

      // clear active drag if this is a horizontal swipe on the phone (scrolling)
      if (this.isPhone &&
          this.active_drag.cursorStart !== null &&
          Math.abs(this.active_drag.cursorStart.x - touch.clientX) > dragThreshold) {
        this.clearActiveDrag();
        return;
      }
     
      // move card for feedback if we've moved enough vertically
      if (this.active_drag.cursorStart === null ||
          Math.abs(this.active_drag.cursorStart.y - touch.clientY) > dragThreshold) {
        this.active_drag.cursorStart = null;
        let drag_image = this.active_drag.drag_image;
        drag_image.style.opacity = 0.6;
        drag_image.style.left = touch.pageX - this.active_drag.cursorOffset.x + 'px';
        drag_image.style.top = touch.pageY - this.active_drag.cursorOffset.y + 'px';
        let cardRect = event.target.getBoundingClientRect();
        drag_image.style.height = cardRect.height + 'px';
        drag_image.style.width = cardRect.width + 'px' ;
      } 

      // see if there is a drag target
      let target = this.findTouchTarget(touch);

      // handle target if we found one
      if (target) {

        // are we entering for the first time
        if (!this.active_drop_target) {

          if (target.handlers.onEnter)
            target.handlers.onEnter(this.active_drag, touch);
          this.active_drop_target = target;
         
        // are we just moving within the same target?
        } else if (this.active_drop_target.element == target.element) {

          // perform move (check for invalidation by drop source)
          if (target.handlers.onMove) {
            let isValidTarget = target.handlers.onMove(this.active_drag, touch);
            if (!isValidTarget)
              this.clearActiveDrag();
          }

        // otherwise we're leaving another target and entering this one
        } else {
          if (this.active_drop_target.handlers.onLeave)
            this.active_drop_target.handlers.onLeave(this.active_drag, touch);
          if (target.handlers.onEnter)
            target.handlers.onEnter(this.active_drag, touch);
          this.active_drop_target = target;

        }
      } else {

        // leave any active target
        if (this.active_drop_target) {
          if (this.active_drop_target.handlers.onLeave)
            this.active_drop_target.handlers.onLeave(this.active_drag, touch);
          this.active_drop_target = null;
        }
      }

      // prevent default
      event.preventDefault();
    }
  }

  // handle end of touch sequence
  onTouchEnd(event) {
    if (this.active_drag) {
      if (this.active_drop_target) {
        let touch = event.changedTouches[0];
        if (this.active_drop_target.handlers.onDrop)
          this.active_drop_target.handlers.onDrop(this.active_drag, touch);
        this.active_drop_target = null;
      }
      this.clearActiveDrag();
    }
  }

  findTouchTarget(touch) {
    return this.drop_targets.find((target) => {
      let element = target.element;
      let elementRect = element.getBoundingClientRect();
      if (touch.pageX > elementRect.left && touch.pageX < elementRect.right &&
          touch.pageY > elementRect.top && touch.pageY < elementRect.bottom) {
        return true;
      } else {
        return false;
      }
    });
  }

  clearActiveDrag() {
    if (this.active_drag) {
      document.body.removeChild(this.active_drag.drag_image);
      this.active_drag = null;
    }
  }
}

