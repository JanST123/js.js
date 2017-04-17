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
};


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

  return true;
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
  classes = classes.join(' ').trim();
  el.setAttribute('class', classes);

  return true;
};


var storageBackend='cookie';
js.storage = {
  "getBackend": function() {
    return storageBackend;
  },

  "setBackend": function(backend) {
    if (['cookie', 'localstorage'].indexOf(backend) < 0) throw 'js.storage Backend must be cookie or localstorage';

    storageBackend = backend;

    if (backend == 'localstorage' && !("localStorage" in window)) {
      // fallback to cookie
      storageBackend = 'cookie';
    }

  },

  "get": function(key, defaultValue) {
    defaultValue = typeof(defaultValue) === 'undefined' ? null : defaultValue;

    if (storageBackend == 'cookie') {
      var r = new RegExp(key + '=([^;]+)');
      if (typeof(document.cookie) == 'string' && document.cookie.match(r)) {
        return JSON.parse(RegExp.$1);
      }

    } else if (storageBackend == 'localstorage') {
      if (js.storage.has(key)) {
        return JSON.parse(localStorage.getItem(key));
      }
    }

    return defaultValue;
  },

  "set": function(key, value, expire) {
    expire = expire || null;
    if (storageBackend == 'cookie') {
      var str = key + '=' + JSON.stringify(value).replace(/;/g, '#SEMIKOLON#') +';';

      if (expire) {
        if (expire instanceof Date) {
          str += 'expires=' + expire.toGMTString();
        } else {
          str += 'expires=' + expire;
        }
      }

      document.cookie = str;

    } else if (storageBackend == 'localstorage') {
      //@TODO: save expire
      localStorage.setItem(key, JSON.stringify(value));
    }
  },

  "has": function(key) {
    if (storageBackend == 'cookie') {
      var r = new RegExp(name + '=([^;]+)');
      if (typeof(document.cookie) == 'string' && document.cookie.match(r)) {
        return true;
      }

    } else if (storageBackend == 'localstorage') {
      return null !== localStorage.getItem(key);
    }
    return false;
  },

  "delete": function (key) {
    if (storageBackend == 'cookie') {
      document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    } else if (storageBackend == 'localstorage') {
      localStorage.removeItem(key);
    }
  }
};


/**
 * Get a a cookie value
 * @param String name
 * @param String defaultValue
 * @returns {*|null}
 * @deprecated use js.storage
 */
js.getCookie = function(name, defaultValue) {
  var s = js.storage.getBackend();
  js.storage.setBackend('cookie');
  var ret = js.storage.get(name, defaultValue);
  js.storage.setBackend(s);
  return ret;
};


/**
 * Set a cookie value
 * @param String name
 * @param String value
 * @param Date expire
 * @deprecated use js.storage
 */
js.setCookie = function(name, value, expire) {
  var s = js.storage.getBackend();
  js.storage.setBackend('cookie');
  js.storage.set(name, value, expire);
  js.storage.setBackend(s);
};

/**
 * adds a new element to the DOM
 * @param HTMLNode target
 * @param String tagName
 * @param String classes
 * @param String position (append, prepend, after, before)
 * @return HTMLNode (the new element)
 **/
js.addEl = function(target, tagname, classes, position) {
  position = position || 'append';
  if (['append', 'prepend', 'after', 'before'].indexOf(position) < 0) throw 'js.addEl: invalid position!';
  classes = classes || null;

  var element = document.createElement(tagname);

  switch(position){
    case 'before':  target.parentNode.insertBefore(element, target); break;
    case 'after':   target.parentNode.insertBefore(element, target.nextSibling); break;
    case 'prepend': target.insertBefore( element, target.firstChild ); break;
    case 'append':  target.appendChild( element ); break;
  }

  if (classes !== null) {
    js.addClass(element, classes);
  }

  return element;
};

/**
 * find parent element
 *
 * @param HTMLnode element
 * @param string parentElementSelector
 * @return HTMLnode or false if not found
 **/
js.parentUntil = function(element,parentElementSelector){
  if (element instanceof HTMLElement) {
    var x=element;
    while (x = x.parentNode) {
      if (typeof(x.matches) === 'function' && x.matches(parentElementSelector)) {
        return x;
      } else if (typeof(x.msMatchesSelector) === 'function' && x.msMatchesSelector(parentElementSelector)) {
        return x;
      }
    }
  }

  return false;
};


/**
 * checks if childElement is descendend of parentElement
 * @param HTMLElement childElement
 * @param HTMLElement parentElement
 * @return Boolean isDescendent
 */
js.isDescendant = function(childElement, parentElement) {
  if (childElement instanceof HTMLElement) {
    var x=childElement;
    while (x = x.parentNode) {
      if (x === parentElement) {
        return true;
      }
    }
  }

  return false;
};


/**
 * adds ready html to the DOM
 * @param HTMLNode target
 * @param String html
 * @param String position (append, prepend, after, before)
 * @return HTMLNode (the new element)
 **/
js.addHtml = function(target, html, position) {
  position = position || 'append';
  if (['append', 'prepend', 'after', 'before'].indexOf(position) < 0) throw 'js.addEl: invalid position!';

  var template = document.createElement('div');
  template.innerHTML = html.trim();
  var element = template.firstChild;

  switch(position){
    case 'before':  target.parentNode.insertBefore(element, target); break;
    case 'after':   target.parentNode.insertBefore(element, target.nextSibling); break;
    case 'prepend': target.insertBefore( element, target.firstChild ); break;
    case 'append':  target.appendChild( element ); break;
  }

  return element;
};


/**
 * removes element from DOM
 * @param HTMLNode element
 * @return Boolean success
 **/
js.removeEl = function(element) {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
    return true;
  }

  return false;
};


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
};


/**
 * update content of a meta tag or adds the meta tag if not exists
 * @param String name
 * @param String value (set to null to remove)
 * @returns {boolean} success
 */
js.updateMetaTag = function(name, value) {
  name=name.replace(':', '\\:');

  if (typeof(document.head) != 'undefined' && typeof(document.head.querySelector) == 'function') {
    var el = document.head.querySelector('meta[name=' + name + '],meta[http-equiv=' + name + '],meta[property=' + name + ']');

    if (!el && value !== null) {
      el = js.addEl(document.head, 'meta'); // add the element
      el.setAttribute('name', name);
    }

    if (el) {
      if (value === null) js.removeEl(el);
      else el.setAttribute('content', value);

      return true;
    }
  }
  return false;
};


/**
 * update the <title> tag
 * @param String value
 * @returns {boolean} success
 **/
js.updateTitle = function(value) {
  if (typeof(document.head) != 'undefined' && typeof(document.head.querySelector) == 'function') {
    var el = document.head.getElementsByTagName('title');
    if (el.length) el = el[0]; else el = null;

    if (!el && value !== null) {
      el = js.addEl(document.head, 'title'); // add the element
    }

    if (el) {
      if (value === null) js.removeEl(el);
      else el.textContent = value;

      return true;
    }
  }
  return false;
};

/**
 * get content of the title tag
 * @returns {String}
 **/
js.getTitle = function() {
  if (typeof(document.head) != 'undefined' && typeof(document.head.querySelector) == 'function') {
    var el = document.head.getElementsByTagName('title');
    if (el.length) el = el[0]; else el = null;

    if (el) {
      return el.textContent;
    }
  }
  return '';
};


/**
 * update content of a link tag or adds the link tag if not exists
 * @param String name
 * @param String value (set to null to remove)
 * @returns {boolean} success
 */
js.updateLinkTag = function(rel, href) {
  name=name.replace(':', '\\:');

  if (typeof(document.head) != 'undefined' && typeof(document.head.querySelector) == 'function') {
    var el = document.head.querySelector('link[rel=' + rel + ']');

    if (!el && href !== null) {
      el = js.addEl(document.head, 'link'); // add the element
      el.setAttribute('rel', rel);
    }

    if (el) {
      if (href === null) js.removeEl(el);
      else el.setAttribute('href', href);

      return true;
    }
  }
  return false;
};


/**
 * does animated vertical scroll to given offset.
 * @param number offset
 * @param number duration in ms
 * @return Void
 */
js.animateScroll = function(offset, duration) {
  duration = duration || 400;
  if (offset == window.scrollY) return; // nothing to do

  offset = Math.floor(offset);
  var currAnimationId = 0,
      currentScrollpos = window.scrollY,
      oldScrollpos = -1,
      lastFrameTime = +new Date() - 1;
  var direction = offset > currentScrollpos ? 1 : -1;
  var timeManipulation = direction == 1 ? (offset - currentScrollpos) : (currentScrollpos - offset) ;


  var animation = function(){
    if(window.scrollY != oldScrollpos){
      // we still have to scroll
      oldScrollpos = window.scrollY;

      var newScrollpos = +window.scrollY + (((new Date() - lastFrameTime) / duration * timeManipulation ) * direction);
      newScrollpos = (direction == 1 ? Math.ceil(newScrollpos) : Math.floor(newScrollpos));

      if( (newScrollpos >= offset && direction == 1) || (newScrollpos <= offset && direction == -1) ) {
        // we scrolled too far... fix the scrollpos and cancel animation
        newScrollpos = offset;
        cancelAnimationFrame( currAnimationId );

      } else {
        // request next animation frame
        lastFrameTime = +new Date();
        currAnimationId = requestAnimationFrame( animation );
      }

      // do the scrolling
      window.scrollTo(0, newScrollpos);

    } else {
      cancelAnimationFrame( currAnimationId );
    }
  };

  currAnimationId = requestAnimationFrame( animation );

};


/**
 * dereferences an object, e.g. clones an object so that it exists in an own memory address
 * @param Object src
 * @returns Object cloned
 */
js.dereference = function(src) {
  var ret={};
  for (var x in src) {
    if (src.hasOwnProperty(x)) ret[x] = src[x];
  }
  return ret;
};


/**
 * creates a serialized string of an array/object for use in url
 * @param Object obj
 * @param String str (is used for recursive calling itself from this function)
 * @param Array dimensions (is used for recursive calling itself from this function)
 * @return String
 **/
js.ajaxParam = function(obj, str, dimensions) {
  str = str || '';
  dimensions = dimensions || [];

  for (var x in obj) {
    if (obj.hasOwnProperty(x)) {
      if (x=='length') continue;

      if (typeof(obj[x])=='object' && obj[x]!==null) {
        // object handling
        dimensions.push(x);
        str=js.ajaxParam(js.dereference(obj[x]), str, dimensions);
        dimensions.pop();
      } else {
        if (str!=='') str+='&';
        var dimensionStr='';
        for (var i=0; i<dimensions.length; ++i) {
          if (dimensionStr==='') dimensionStr+=dimensions[i];
          else dimensionStr+='[' + dimensions[i] + ']';
        }
        if (dimensionStr!=='') dimensionStr+='[' + x + ']';
        else dimensionStr+=x;

        if (obj[x] === null) {
          str+=dimensionStr + '=';
        } else {
          str+=dimensionStr + '=' + encodeURIComponent(obj[x]);
        }
      }
    }
  }

  return str;
};


/**
 * returns if device is touch device
 * @returns {boolean} isTouch
 */
js.isTouchDevice = function() {
  if (('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0)) {
    return true;
  }
  return false;
};


/**
 * merges two objects together in one, object keys in obj2 will override this of obj1
 * @param Object obj1
 * @param Object obj2
 */
js.objectMerge = function(obj1, obj2) {
  var newObj=js.dereference(obj1);

  for (var x in obj2) {
    if (obj2.hasOwnProperty(x)) {
      if (newObj.hasOwnProperty(x) && typeof(newObj[x]) === 'object' && newObj[x] !== null  && typeof(obj2[x]) === 'object' && obj2[x] !== null) {
        newObj[x] = js.objectMerge(obj1[x], obj2[x]);
      } else {
        newObj[x] = obj2[x];
      }
    }
  }

  return newObj;
};


var ajaxDefaultSettings={};
/**
 * add some default settings for each ajax request
 * @param settings
 */
js.ajaxSetup = function(settings) {
  ajaxDefaultSettings = settings;
};


/**
 * perform ajax requests (jquery like interface)
 * @param String url
 * @param Object settings
 *    accepts         (default: depends on DataType) Type: String - The content type sent in the request header that tells the server what kind of response it will accept in return.
 *    beforeSend                                     Type: Function(XHR xhr, Object settings) - Callback which is called before request is sent. Used to modify request settings
 *    complete                                       Type: Function(XHR xhr, String textStatus ) - Callback which is called after request finished (after success and error callbacks are executed and regardless if success or error response)
 *    contentType     (default: 'application/x-www-form-urlencoded; charset=UTF-8') Type: String - When sending data to the server, use this content type. Default is "application/x-www-form-urlencoded; charset=UTF-8", which is fine for most cases.
 *    context                                        Type: Object - This object will be the context of all Ajax-related callbacks.
 *    data                                           Type: Object or String or Array - Data to be sent to the server. It is converted to a query string, if not already a string. It's appended to the url for GET-requests
 *    dataFilter                                     Type: Function( String data, String dataType ) - A function to be used to handle the raw response data of XMLHttpRequest. This is a pre-filtering function to sanitize the response. You should return the sanitized data. The function accepts two arguments: The raw data returned from the server and the 'dataType' parameter.
 *    dataType        (default: text)                Type: String - The type of data that you're expecting back from the server. Possible: json, text
 *    error                                          Type: Function( XHR xhr, String textStatus, String errorThrown ) -  A function to be called if the request fails. The function receives three arguments: The XHR object, a string describing the type of error that occurred and an optional exception object, if one occurred. Possible values for the second argument (besides null) are "timeout", "error", "abort", and "parsererror".
 *    headers         (default: {})                  Type: Object - An object of additional header key/value pairs to send along with requests using the XMLHttpRequest transport. The header X-Requested-With: XMLHttpRequest is always added, but its default XMLHttpRequest value can be changed here. Values in the headers setting can also be overwritten from within the beforeSend function.
 *    method          (default: 'GET')               Type: String - The HTTP method to use for the request (e.g. "POST", "GET", "PUT").
 *    password                                       Type: String -  A password to be used with XMLHttpRequest in response to an HTTP access authentication request.
 *    progressCallback                               Type: Function - A function called on each progress update. Accepts 1 Parameter: event (contains progress info)
 *    statusCode      (default: {})                  Type: Object - An object of numeric HTTP codes and functions to be called when the response has the corresponding code.
 *    success                                        Type: Function( Anything data, String textStatus, XHR xhr ) - A function to be called if the request succeeds. The function gets passed three arguments: The data returned from the server, formatted according to the dataType parameter or the dataFilter callback function, if specified; a string describing the status; and the jqXHR (in jQuery 1.4.x, XMLHttpRequest) object.
 *    timeout                                        Type: Number - Set a timeout (in milliseconds) for the request. This will override any global timeout set with $.ajaxSetup(). The timeout period starts at the point the $.ajax call is made; if several other requests are in progress and the browser has no connections available, it is possible for a request to time out before it can be sent. In jQuery 1.4.x and below, the XMLHttpRequest object will be in an invalid state if the request times out; accessing any object members may throw an exception. In Firefox 3.0+ only, script and JSONP requests cannot be cancelled by a timeout; the script will run even if it arrives after the timeout period.
 *    username                                       Type: String -  A username to be used with XMLHttpRequest in response to an HTTP access authentication request.
 *    xhrFields                                      Type: Object - An object of fieldName-fieldValue pairs to set on the native XHR object. For example, you can use it to set withCredentials to true for cross-domain requests if needed.
 *
 *
 * @return XMLHttpRequest
 **/
js.ajax = function(url, settings) {
  var xhr=new XMLHttpRequest(),
    headers=[
      [ 'X-Requested-With', 'xmlhttprequest' ] // we always append this header
    ];



  // default settings
  settings = settings || {};
  settings = js.objectMerge(ajaxDefaultSettings, settings);

  settings.method=settings.method || 'GET';
  settings.user=settings.user || null;
  settings.password=settings.password || null;
  settings.context=settings.context || settings;


  // accept header
  if (typeof(settings.accepts) == 'string') {
    headers.push(['Accept', settings.accepts]);
  } else {
    if (typeof(settings.dataType)=='string' && settings.dataType=='json') {
      headers.push(['Accept', 'application/json']);
    } else {
      headers.push(['Accept', '*/*']);
    }
  }

  // content-type header
  if (typeof(settings.contentType)=='string') {
    headers.push(['Content-Type', settings.contentType]);
  } else {
    headers.push(['Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8']);
  }

  // other headers
  if (typeof(settings.headers)==='object' && settings.headers!==null) {
    for (var x in settings.headers) {
      if (settings.headers.hasOwnProperty(x)) {
        if (x=='length') continue;
  
        if (typeof(settings.headers[x])=='object' && typeof(settings.headers[x].length)!='undefined') {
          headers.push(settings.headers[x]);
        } else {
          var tmp=settings.headers[x].split(':');
          if (tmp.length==2) {
            tmp[1]=tmp[1].trim();
            headers.push(tmp);
          }
        }
      }
    }
  }

  // xhr fields
  if (typeof(settings.xhrFields)=='object' && settings.xhrFields!==null) {
    for (var x in settings.xhrFields) {
      if (settings.xhrFields.hasOwnProperty(x)) {
        if (x=='length') continue;

        xhr[x]=settings.xhrFields[x];
      }
    }
  }




  var params=null;
  if (typeof(settings.data)=='object' && settings.data!==null) {
    params=js.ajaxParam(settings.data);
  } else if (typeof(settings.data)=='string') {
    params=settings.data;
  }

  if (settings.method=='GET') {
    // extend url with params for GET request
    if (params) {
      var urlParts = url.split('?');
      if (urlParts.length > 1) urlParts[1] += '&';
      else urlParts[1]='';
      urlParts[1]  += params;
      url = urlParts[0] + '?' + urlParts[1];
    }
  }



  // open request
  xhr.open(settings.method, url, true, settings.user, settings.password);

  // add headers
  for (var i=0; i<headers.length; ++i) {
    xhr.setRequestHeader(headers[i][0], headers[i][1]);
  }

  // call before callback
  if (typeof(settings.beforeSend)=='function') {
    settings.beforeSend.call(settings.context, xhr, settings);
  }

  // timeout
  if (typeof(settings.timeout)=='number') {
    xhr.timeout=settings.timeout;
  }

  // event listeners
  xhr.addEventListener("load", function() {
    if(this.readyState == 4){
      // call generic complete callback
      if (typeof(settings.complete)=='function') {
        if (false === settings.complete.call(settings.context, this, this.response)) {
          return;
        }
      }

      if ( this.status >= 400 ) {
        // request failed
        if (typeof(settings.error) == 'function') {
          settings.error.call(settings.context, this, this.response);
        }
      } else if (this.status == 200) {
        // request succeeded
        // parse data dependent on datatype
        var data=this.response;
        if (typeof(settings.dataType)=='string' && settings.dataType=='json') {
          try {
            data=JSON.parse(this.response);
          } catch(e) {
            if (typeof(settings.error) == 'function') {
              settings.error.call(settings.context, this, this.response);
            }
          }
        }

        // apply datafilter
        if (typeof(settings.dataFilter)=='function') {
          settings.dataFilter.call(settings.context, data, settings.dataType);
        }

        if (typeof(settings.success)=='function') {
          settings.success.call(settings.context, data, this.response, this);
        }
      }

      // call statuscode callback
      if (typeof(settings.statusCode)=='object' && settings.statusCode!==null && typeof(settings.statusCode[this.status])=='function') {
        settings.statusCode[this.status].call(settings.context, this, this.response);
      }


    }
  });
  // listen for ajax errors too
  xhr.addEventListener("error", function() {
    if (typeof(settings.error)=='function') {
      settings.error.call(settings.context, xhr, 'error');
    }
  });
  
  // listen for progress change
  if (typeof(settings.progressCallback) == 'function') {
    xhr.addEventListener('progress', settings.progressCallback);
  }

  // perform request
  if (settings.method=='POST') {
    xhr.send(params);
  } else {
    xhr.send();
  }

  return xhr;

};


/**
 * performs a GET request (shorthand method)
 * @param String url
 * @param Object/String params
 * @param Function successCallback
 * @param Function errorCallback
 * @param String dataType (possible: json/null)
 * @return XMLHttpRequest
 **/
js.get = function(url, params, successCallback, errorCallback, dataType) {
  if (typeof(errorCallback)=='string') {
    // also make jquery param order possible (no errorCallback)
    dataType=errorCallback;
    errorCallback=null;
  }

  params=params || {};
  dataType = dataType || 'text';

  return js.ajax(url, {
    data: params,
    dataType: dataType,
    error: errorCallback,
    success: successCallback,
    method: 'GET',
  });
};


/**
 * performs a POST request (shorthand method)
 * @param String url
 * @param Object/String/HTMLForm params
 * @param Function successCallback
 * @param Function errorCallback
 * @param String dataType (possible: json/text)
 * @return XMLHttpRequest
 **/
js.post=function(url, params, successCallback, errorCallback, dataType) {
  if (typeof(errorCallback) == 'string') {
    // also make jquery param order possible (no errorCallback)
    dataType = errorCallback;
    errorCallback = null;
  }

  params = params || {};
  dataType = dataType || 'text';

  return js.ajax(url, {
    data: params,
    dataType: dataType,
    error: errorCallback,
    success: successCallback,
    method: 'POST',
  });
};




/**
 * Get style computed style property of an Element
 * @param HTMLNode el
 * @param StringstyleProp
 * @returns {Mixed}
 */
js.getStyleProperty = function(el,styleProp) {
  var y = null;
  if (typeof(window.getComputedStyle) == 'function') y = window.getComputedStyle(el).getPropertyValue(styleProp);
  else if (el.currentStyle) y = el.currentStyle[styleProp];

  return y;
};


/**
 * escape special regex characters
 * @param String text
 * @return String quotedText
 **/
js.pregQuote = function(text) {
  if (typeof(text) === 'string') {
    return text.replace(/([\.\\\+\*\?\[\^\]\$\(\)\{\}\=\!\|\:\-])/g, '\\$1');
  }
  return text;
};


/**
 * Encode a set of form elements as string for ajax request
 * @param HTMLNode form element
 * @return String
 **/
js.serializeFormValues=function(formEl, asObject) {
  asObject = asObject || false;
  var formData={};
  var fields=formEl.querySelectorAll('input,select,textarea');

  function setFieldValue(field, value) {
    if (typeof(field.name)=='string' && field.name.match(/(.*)\[(.*)\]$/)) {
      if (RegExp.$2==='') {
        if (typeof(formData[RegExp.$1]) != 'object') formData[RegExp.$1]=[];
        formData[RegExp.$1].push(value);
      } else {
        if (typeof(formData[RegExp.$1]) != 'object') formData[RegExp.$1]={};
        formData[RegExp.$1][RegExp.$2]=calue;
      }
    } else {
      formData[field.name]=value;
    }
  }

  for (var x=0; x<fields.length; ++x) {
    if (typeof(fields[x].type)!='undefined' && (fields[x].type=='checkbox' || fields[x].type=='radio')) {
      if (fields[x].checked) {
        setFieldValue(fields[x], fields[x].value);
      }
    } else if(fields[x].tagName=='SELECT') {
      setFieldValue(fields[x], fields[x].options[fields[x].selectedIndex].value);
    } else {
      setFieldValue(fields[x], fields[x].value);
    }
  }
  
  if (asObject) return formData;
  
  return js.ajaxParam(formData);
};


/**
 * trigger an event on an element
 * @param HTMLNode el
 * @param String eventName
 * @param Object customData
 * @return Void
 */
js.triggerEvent = function(el, eventName, customData) {
  customData = customData || null;

  var event=null;
  if (customData) {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventName, true, true, customData);
    
  } else {
    event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
  }

  // Dispatch the event.
  el.dispatchEvent(event);
};


/**
 * handles events and ensures the events can be removed later by identifieng them by name and element
 * @param HTMLNode el (the element to add or remove an event to/from)
 * @return Functions add, remove
 */
js.eventListener = function(el) {
  el = el || null;

  var longTouchTimer=null,
      longTouchX=null,
      longTouchY=null,
      longTouchTriggered=false;
  function startLongTouch(callback) {
    return function(e) {
      // prevent select on longtouch on android
      this.onselectstart = function() {
        return false;
      };

      // prevent text selecting on iOS devices.
      // implement a css class for the body, containing this rules:
      // -moz-user-select: none;
      // -webkit-user-select: none;
      // -ms-user-select: none;
      // user-select: none;
      // -o-user-select: none;
      // -webkit-touch-callout: none;
      js.addClass(document.body, 'prevent-selection-for-longtouch');


      longTouchTriggered=false;
      if (typeof(e.touches[0]) === 'object' && typeof(e.touches[0].clientX) === 'number') {
        longTouchX = e.touches[0].clientX;
        longTouchY = e.touches[0].clientY;
      }

      var el=this;
      longTouchTimer = window.setTimeout(function() {
        longTouchTriggered=true;
        if (typeof(navigator.vibrate) == 'function') navigator.vibrate(50);
        callback.call(el, e);
      }, 500);
    };
  }
  function endLongTouch(e) {
    js.removeClass(document.body, 'prevent-selection-for-longtouch');

    if (longTouchTriggered) {
      e.preventDefault();
      longTouchTriggered=false;
    }
    if (longTouchTimer) {
      window.clearTimeout(longTouchTimer);
      longTouchTimer=null;
    }
  }
  function endLongTouchOnMove(e) {
    if (longTouchTimer && typeof(e.touches[0]) === 'object' && typeof(e.touches[0].clientX) === 'number') {
      if (longTouchX !== null && longTouchY !== null) {
        if (Math.abs(longTouchX - e.touches[0].clientX) > 20 || Math.abs(longTouchY - e.touches[0].clientY)) {
          window.clearTimeout(longTouchTimer);
          longTouchTimer=null;

        }
      }
    }
  }

  return {
    'add': function(eventName, type, callback, capture) {
      capture = capture || false;

      if (typeof(type) == 'string') type = [ type ];
      for (var i=0; i<type.length; ++i) {

        switch(type[i]) {
          case 'longtouch':
            var startCb=startLongTouch(callback);
            el.addEventListener('touchstart', startCb, capture);
            js.boundEvents.push([el, eventName + '-longtouchstart', 'touchstart', startCb, capture]);

            el.addEventListener('touchend', endLongTouch, capture);
            js.boundEvents.push([el, eventName + '-longtouchend', 'touchend', endLongTouch, capture]);

            el.addEventListener('touchmove', endLongTouchOnMove, capture);
            js.boundEvents.push([el, eventName + '-longtouchmove', 'touchmove', endLongTouchOnMove, capture]);
            break;

          default:
            // normal js event
            el.addEventListener(type[i], callback, capture);
            js.boundEvents.push([el, eventName, type[i], callback, capture]);
        }
      }
    },
    'remove': function(eventName, type, callback, capture) {
      capture = capture || false;

      if (typeof(type) == 'string') type = [ type ];

      var found=false,
          tmp=[];
      for (var i=0; i<js.boundEvents.length; ++i) {
        if (js.boundEvents[i][0] === el && js.boundEvents[i][1] == eventName) {
          el.removeEventListener(js.boundEvents[i][2], js.boundEvents[i][3], js.boundEvents[i][4]);
          delete js.boundEvents[i];
          found=true;
        } else {
          tmp.push(js.boundEvents[i]);
        }
      }
      js.boundEvents = tmp;

      if (!found) {
        for (var i=0; i<type.length; ++i) {
          el.removeEventListener(type[i], callback, capture);
        }
      }
    },
    'trigger': function(eventName, eventData) {
      eventData = eventData || {};

      for (var i=0; i<js.boundEvents.length; ++i) {
        if ((el === null || js.boundEvents[i][0] === el) && js.boundEvents[i][1] == eventName) {
          eventData.type = js.boundEvents[i][2];
          js.boundEvents[i][3].call(js.boundEvents[i][0] , eventData);
        }
      }
    },
    'pause': function(eventName) {
      var boundEvents=js.dereference(js.boundEvents);

      for (var i=0; i<js.boundEvents.length; ++i) {
        if (boundEvents[i][0] === el && boundEvents[i][1] == eventName) {
          // add to paused events
          js.pausedEvents.push(boundEvents[i]);

          // unbind event
          js.eventListener(el).remove(boundEvents[i][1], boundEvents[i][2], boundEvents[i][3], boundEvents[i][4]);
        }
      }
    },
    'resume': function(eventName) {
      var removeIndexes=[];
      for (var i=0; i<js.pausedEvents.length; ++i) {
        if (js.pausedEvents[i][0] === el && js.pausedEvents[i][1] == eventName) {
          // rebind event
          js.eventListener(el).add(js.pausedEvents[i][1], js.pausedEvents[i][2], js.pausedEvents[i][3], js.pausedEvents[i][4]);

          // remove from paused events
          removeIndexes.push(i);
        }
      }
      for (var j=0; j<removeIndexes.length; ++j) {
        js.pausedEvents.splice(removeIndexes[j], 1);
      }
    },
    'pauseAll': function(excludePrefix) {
      excludePrefix = excludePrefix || null;

      var unbindEvents=[];

      for (var i=0; i<js.boundEvents.length; ++i) {
        if (js.boundEvents[i][1].indexOf(excludePrefix) === -1) {
          // add to paused events
          js.pausedEvents.push(js.boundEvents[i]);

          unbindEvents.push(js.boundEvents[i]);
        }
      }

      for (var j=0; j<unbindEvents.length; ++j) {
        // unbind event
        js.eventListener(unbindEvents[j][0]).remove(unbindEvents[j][1], unbindEvents[j][2], unbindEvents[j][3], unbindEvents[j][4]);
      }
    },
    'resumeAll': function() {
      var removeIndexes=[];
      for (var i=0; i<js.pausedEvents.length; ++i) {
        // rebind event
        js.eventListener(js.pausedEvents[i][0]).add(js.pausedEvents[i][1], js.pausedEvents[i][2], js.pausedEvents[i][3], js.pausedEvents[i][4]);

        // remove from paused events
        removeIndexes.push(i);
      }
      for (var j=0; j<removeIndexes.length; ++j) {
        js.pausedEvents.splice(removeIndexes[j], 1);
      }
    }
  };
};
js.boundEvents=[];
js.pausedEvents=[];

