// @source jashkenas/underscore
// @url https://github.com/jashkenas/underscore/blob/1.5.2/underscore.js#L693
var factory = function ($timeout) {
  return {
    parentNgTable: parentNgTable,
    debounce: debounce,
    throttle: throttle
  }

  // @source jashkenas/underscore
  // @url https://github.com/jashkenas/underscore/blob/1.5.2/underscore.js#L693
  function debounce (func, wait, immediate) {
    var timeout = null;
    return function () {
      var context = this;
      var args = arguments;
      var callNow = immediate && !timeout;
      if (timeout) {
        $timeout.cancel(timeout);
      }
      timeout = $timeout(function later () {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      }, wait, false);
      if (callNow) {
        func.apply(context, args);
      }
      return timeout;
    };
  };

  // @source jashkenas/underscore
  // @url https://github.com/jashkenas/underscore/blob/1.5.2/underscore.js#L661
  function throttle (func, wait, options) {
    var timeout = null;
    if (!options) options = {};
    return function () {
      var context = this;
      var args = arguments;
      if (!timeout) {
        if (options.leading !== false) {
          func.apply(context, args);
        }
        timeout = $timeout(function later () {
          timeout = null;
          if (options.trailing !== false) {
            func.apply(context, args);
          }
        }, wait, false);
      }
    };
  };

  function parentNgTable (element) {
    console.log(element);
    if (element === null) {
      return element;
    } else {
      var parentNode = element.parentNode;
      if (parentNode && parentNode.tagName === 'TABLE' &&
        parentNode.className.indexOf('ng-table')
      ) {
        return parentNode;
      } else {
        return parentNgTable(parentNode);
      }
    }
  }

};

factory.$inject = ['$timeout'];
module.exports = factory;