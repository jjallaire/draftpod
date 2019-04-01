
import Vue from 'vue'

export function scrollIntoView(el, options) {
  Vue.nextTick(() => {
    el.scrollIntoView({
      behavior: "smooth",
      block: "start",
      ...options
    });
  });
}

export function focus(el) {
  Vue.nextTick(() => {
    el.focus();
  });
}


export function textareaCopySelection(textarea, select) {

  // on iOS we need to do a special dance to make it selectable
  let isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);
  if (isiOSDevice) {

    let editable = textarea.contentEditable;

    textarea.contentEditable = true;

    var selection = window.getSelection();
    selection.removeAllRanges();

    if (select) {
      let range = document.createRange();
      range.selectNodeContents(textarea);
      selection.addRange(range);
      textarea.setSelectionRange(0, 999999);
    } else {
      textarea.setSelectionRange(0,0);
    }

    textarea.contentEditable = editable;

  // in most environments we can just call select()
  } else {
    if (select)
      textarea.select();
    else
      window.getSelection().removeAllRanges();
  }

  // blur
  textarea.blur();

}