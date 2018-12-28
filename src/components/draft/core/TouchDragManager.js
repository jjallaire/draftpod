

import './TouchDragManager.css'


export default class TouchDragManager {
  
  constructor() {
    this.active_drag = null;
  }

  onTouchStart(event, card, drag_source) {

    // clear any active touch
    this.clearActiveTouch();

     // compute the size and location for the drag image
     const extraWidth = 100;
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
     // TODO: move this class to a side-by-side css file
     dragImg.classList.add("mtgcard-touch-drag-image");
     dragImg.setAttribute('src', event.target.getAttribute('src'));
     dragImg.setAttribute('draggable', 'false');
     dragImg.setAttribute('oncontextmenu', 'return false;');
     dragImg.style.left = previewRect.left + 'px';
     dragImg.style.top = previewRect.top + 'px';
     dragImg.style.width = previewRect.width + 'px';
     dragImg.style.height = previewRect.height + 'px';
     dragImg.style.zIndex = 2000;
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
      offset: offset,
    };
  }

  onTouchMove(event) {
    if (this.active_drag) {
      let touch = event.targetTouches[0];
      let drag_image = this.active_drag.drag_image;
      drag_image.style.opacity = 0.6;
      drag_image.style.left = touch.pageX - this.active_drag.offset.x + 'px';
      drag_image.style.top = touch.pageY - this.active_drag.offset.y + 'px';
      
      let cardRect = event.target.getBoundingClientRect();
      drag_image.style.height = cardRect.height + 'px';
      drag_image.style.width = cardRect.width + 'px' ;
      event.preventDefault();
    }
  }

  onTouchEnd() {
    this.clearActiveTouch();
  }


  clearActiveTouch() {
    if (this.active_drag) {
      document.body.removeChild(this.active_drag.drag_image);
      this.active_drag = null;
    }
  }
}

