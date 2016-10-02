/* start JS framework */

window.js = window.js || {};

/**
 * calls the callback on document ready (even usable when document load already finishd)
 * @param readyCB
 */
js.onReady = function (readyCB) {
  if (typeof(readyCB) == 'function') {
    if (document.readyState=='complete' || document.readyState=='interactive') readyCB();
    else if (typeof(document.addEventListener) == 'function') document.addEventListener('DOMContentLoaded', readyCB);
  }
};


/**
 * returns if an element has a css class
 * @param HTMLNode el
 * @param String cls
 * @returns {boolean}
 */
js.hasClass = function(el, cls) {
  var classes=[];
  if (el.hasAttribute('class')) {
    classes=el.getAttribute('class').trim().split(' ');
  }
  return classes.indexOf(cls)>=0;
}


/**
 * Add css class to element
 * @param HTMLNode el
 * @param String cls
 */
js.addClass = function(el, cls) {
    var classes=[];
    if (el.hasAttribute('class')) {
        classes=el.getAttribute('class').trim().split(' ');
    }
    if (classes.indexOf(cls)<0) {
        classes.push(cls);
    }
    classes = classes.join(' ');
    el.setAttribute('class', classes);
};


/**
 * Remove css class from element
 * @param HTMLNode el
 * @param String cls
 */
js.removeClass = function(el, cls) {
    var classes=[];
    if (el.hasAttribute('class')) {
        classes=el.getAttribute('class').trim().split(' ');
    }
    if (classes.indexOf(cls)>=0) {
        delete(classes[classes.indexOf(cls)]);
    }
    classes = classes.join(' ');
    el.setAttribute('class', classes);

};


/**
 * Get a a cookie value
 * @param String name
 * @param String defaultValue
 * @returns {*|null}
 */
js.getCookie = function(name, defaultValue) {
    defaultValue = defaultValue || null;

    var r = new RegExp(name + '=([^;]+)');


    if (typeof(document.cookie) == 'string' && document.cookie.match(r)) {
        return JSON.parse(RegExp.$1);
    }

    return defaultValue;
}


/**
 * Set a cookie value
 * @param String name
 * @param String value
 * @param Int expire
 */
js.setCookie = function(name, value, expire) {
    expire = expire || null;

    var str = name + '=' + JSON.stringify(value).replace(/;/g, '#SEMIKOLON#') +';';

    if (expire) {
        if (expire instanceof Date) {
            str += 'expires=' + expire.toGMTString();
        } else {
            str += 'expires=' + expire;
        }
    }

    document.cookie = str;
}


/**
 * selects all text of an input element
 * @param HTMLNode el
 */
js.selectAllText = function(el) {
  if (window.selectAllTextTimeout) {
    window.clearTimeout(window.selectAllTextTimeout);
    window.selectAllTextTimeout=null;
  }
  window.selectAllTextTimeout=window.setTimeout(function() {
    el.focus();
    el.setSelectionRange(0, 9999);
    window.selectAllTextTimeout=null;
  }, 100);
}


/**
 * update content of a meta tag
 * @param String name
 * @param String value
 * @returns {boolean} success
 */
js.updateMetaTag = function(name, value) {
  name=name.replace(':', '\\:');

  if (typeof(document.head) != 'undefined' && typeof(document.head.querySelector) == 'function') {
    var el = document.head.querySelector('meta[name=' + name + '],meta[http-equiv=' + name + '],meta[property=' + name + ']');
    if (el) {
      el.setAttribute('content', value);
      return true;
    }
  }
  return false;
}


/**
 * does animated scroll. Animation is pure CSS3
 * @param number offset
 * @param float duration
 * @return Void
 */
js.animateScroll = function(offset, duration) {
  duration = duration || 0.4;

  var maxScroll = document.body.scrollHeight - document.body.clientHeight;
  if (offset > maxScroll) offset=maxScroll;


  // add the transition if not done
  if (!js.hasClass(document.body, 'js-animate-scroll')) {
    js.addClass(document.body, 'js-animate-scroll')
    if (typeof(document.body.style.transition) === 'string' && document.body.style.transition != '') document.body.style.transition += ',';
    else document.body.style.transition = '';
    document.body.style.transition += "transform " + parseFloat(duration) + 's';
  }

  var onEnd = function() {
    // event should be executed only once
    document.body.removeEventListener("webkitTransitionEnd", onEnd, false);
    document.body.removeEventListener("oTransitionEnd", onEnd, false);
    document.body.removeEventListener("transitionend", onEnd, false);

    // reset the overflow hidden, to make window scrollable
    document.body.style.overflow='';

    // temporary remove transition
    var tmp = document.body.style.transition;
    document.body.style.transition='';

    // remove the transform, add real scrolling
    document.body.style.transform = '';

    // do real scrolling
    window.scrollTo(0, offset);

    // re-enable the transition
    document.body.style.transition=tmp;
  };

  // bind listener on animation end
  document.body.addEventListener("webkitTransitionEnd", onEnd, false);
  document.body.addEventListener("oTransitionEnd", onEnd, false);
  document.body.addEventListener("transitionend", onEnd, false);



  // do the animation (previously hide the scrollbar as it will look odd)
  document.body.style.overflow='hidden';
  document.body.style.transform="translateY(" + parseInt(offset * -1) + "px)";

}
