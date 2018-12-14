
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