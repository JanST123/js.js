[![npm version](https://badge.fury.io/js/janst123_js.js.svg)](https://badge.fury.io/js/janst123_js.js)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=plastic)](https://raw.githubusercontent.com/JanST123/js.js/master/LICENSE.md)

# js.js
This is a collection of often needed Pure-JS helper functions. No need to load a big framework like jQuery etc.
Feel free to extract single functions or use the whole collection.

All functions are tested on modern Browsers (Edge, IE >= 10, Firefox, Chrome, Chrome on Android, Chromium, Safari, Safari Mobile)

See it in action on
* https://gebrauchtpreis.net


## Usage
### with npm

    npm install --save janst123_js.js

    var js=require('js.js');
    
### without npm
Embed the file dist/js.js.min and there is a global variable "js" set.
    


## Some of the Features
* onReady Callback
  * Usable at every time in the application
* Ajax
  * GET
  * POST
  * JSON
  * jQuery Like Interface
  * Form serialization
* DOM Manipulation
  * Append Element
  * Prepend Element
  * Place Alement after
  * Place Element before
* CSS Classes
  * hasClass
  * addClass
  * removeClass
* Animations
  * Animated Scrolling (CSS3)
* Event-Handling
  * Trigger Browser-Events on Elements
  * Add and safely-remove event-handlers to/from elements
  * Trigger Event Handlers
  * Handle Long-Touch Event
* Cookies
  * Set Cookie
  * Get Cookie
* LocalStorage
  * Get Value
  * Set Value
* Other Helpers
  * Quote RegExp special chars
  * Update Meta Tags
  * Update Link Tags
  * Select All Text in Input
  * Derefecence Object
