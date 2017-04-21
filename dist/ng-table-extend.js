(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"));
	else if(typeof define === 'function' && define.amd)
		define(["angular"], factory);
	else if(typeof exports === 'object')
		exports["ng-table-extend"] = factory(require("angular"));
	else
		root["ng-table-extend"] = factory(root["angular"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var angular = __webpack_require__(2);
	module.exports =
	  angular
	    .module('ngTable')
	    .directive('ngTableNoData', __webpack_require__(3))
	    .directive('ngTableColGroup', __webpack_require__(5))
	    .directive('ngTableFixedHeader', __webpack_require__(6))
	    .directive('ngTableSelectable', __webpack_require__(8))
	    .factory('NgTableHelper', __webpack_require__(10))
	    .value('NgTableNoDataDefaults', {
	      text: 'no-data'
	    })
	    .value('NgTableFixedHeaderDefaults', {})
	    .run(['$templateCache', function($templateCache) {
	      $templateCache.put('ng-table/sorterRow.html', __webpack_require__(7));
	      $templateCache.put('ng-table/checkAll.html', __webpack_require__(9));
	    }]);

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var directive = function(NgTableNoDataDefaults) {
	  return {
	    restrict: 'A',
	    scope: {
	      text: '@',
	      colspan: '=',
	      ngShow: '='
	    },
	    template: __webpack_require__(4),
	    compile: function(elem, attrs) {
	      elem.addClass('table-empty-container');
	      var tableElem = angular.element(elem.parents('table')[0]);
	      var tableEmpty = elem.find('.table-empty');
	      return function postLink(scope) {
	        scope.text || (scope.text = NgTableNoDataDefaults.text);
	        scope.$watch('ngShow', function(newValue, oldValue) {
	          // when table fixed header we should adjust no-data display height
	          var tableMarginTop = tableElem.css('marginTop');
	          tableElem[newValue ? 'addClass' : 'removeClass']('table-no-data');
	          tableEmpty.css('bottom', newValue ? tableMarginTop : 0);
	        });
	      }
	    }
	  };
	};
	directive.$inject = ['NgTableNoDataDefaults']
	module.exports = directive;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = "<td colspan=\"{{colspan}}\" style=\"position:relative;border: 0!important;\">\r\n  <div class=\"table-empty-inner\">\r\n    <div style=\"display:table;width:100%;height:100%;\">\r\n      <div style=\"display:table-cell;text-align: center; vertical-align: middle;\">\r\n        <span class=\"text-muted no-data\" style=\"font-size:140%;\">{{text}}</span>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</td>";

/***/ },
/* 5 */
/***/ function(module, exports) {

	var directive = function($parse, $timeout) {
	  return {
	    restrict: 'A',
	    compile: function(elem, attrs) {
	      var columnData = [];
	      // get extra attr from <td> element
	      angular.forEach(elem.children('td'), function(td) {
	        var td = angular.element(td);
	        columnData.push({
	          width: td.attr('data-width'),
	          colspan: td.attr('data-colspan'),
	          root: td.attr('data-root'),
	          parentTitle: td.attr('data-parent-title')
	        });
	      });
	
	      // remove <tr ng-table-col-group>
	      elem.remove();
	      
	      return function postLink(scope, elem, attrs) {
	        $timeout(function() {
	          // add extra attributes to $column
	          // and you can use this attribute in template
	          scope.$columns.forEach(function(col, index) {
	            col.width = columnData[index].width;
	            col.colspan = columnData[index].colspan || 0;
	            col.root = columnData[index].root || false;
	            col.parentTitle = columnData[index].parentTitle;           
	          });
	          
	        });
	      }
	    }
	  }
	};
	
	directive.$inject = ['$parse', '$timeout'];
	module.exports = directive;

/***/ },
/* 6 */
/***/ function(module, exports) {

	// TODO: when resize can't find setting width
	var directive = function($parse, $timeout, $window, $compile, NgTableFixedHeaderDefaults, NgTableHelper) {
	  return {
	    restrict: 'A',
	    priority: 1002,
	    link: function(scope, elem, attrs) {
	      console.log(NgTableHelper);
	      // get options of ng-table-fixed-header
	      var options = $parse(attrs.tableFixedHeader)(scope);
	      options = angular.extend({}, NgTableFixedHeaderDefaults, options);
	
	      var tableId = elem.attr('id');
	      var ngTableScope = elem.controller('ngTable').$scope;
	      $timeout(function() {
	        var fixedTable, fixedWrapper, fixedThead, fixedTbody;
	        init();
	        // add auto resize
	        angular.element($window).on('resize', NgTableHelper.debounce(function() {
	          fixedTable.fixedHeaderTable('destroy');
	          init();  
	        }, 250));
	
	        function init() {
	          fixedTable = elem.fixedHeaderTable(options);
	          fixedWrapper = fixedTable.closest('.fht-table-wrapper');
	          fixedThead = fixedWrapper.children('.fht-thead');
	          fixedTbody = fixedWrapper.children('.fht-tbody');
	
	          // clone thead & tfoot
	          cloneHeaderAndFooter();
	          tableId && fixedWrapper.attr('id', tableId + '-wrapper');
	        }
	
	        function cloneHeaderAndFooter() {
	          var thead = fixedThead.find('> table > thead'),    
	              theadOrg = fixedTbody.find('> table > thead'),
	              replacedThead = null,
	              clonedTheadOrg = null;
	
	          // convert fluid width to fixed width 
	          theadOrg.find('th.header').each(function(index) {
	            var th = angular.element(this);
	            var widthStyle = th[0].style.width;
	            if (/%$/.test(widthStyle)) {
	              th.css('width', th.outerWidth())
	            }           
	          });
	
	          // clone original thead
	          clonedTheadOrg = theadOrg.clone(true);
	          // re-compile cloned thead 
	          // original thead bind some events
	          $compile(clonedTheadOrg)(ngTableScope); 
	          // replace fixed thead with the compiled thead
	          thead.replaceWith(clonedTheadOrg);
	          
	          $timeout(function() {
	            replacedThead = fixedThead.find('> table > thead');
	            adjustReplacedTheadWidth(replacedThead, theadOrg);
	            fixedLastThWidth(replacedThead);
	            fixedLastThWidth(theadOrg); 
	          });
	        }
	
	        function adjustReplacedTheadWidth(thead, theadOrg) {
	          thead.find('th.header').each(function(index) {
	            var thsOrg = theadOrg.find('th.header');
	            var thOrg = thsOrg.eq(index);
	            var width = thOrg[0].style.width;
	            angular.element(this).css('width', width);
	          });
	        }
	
	        function fixedLastThWidth(thead) {
	          var lastTh = thead.find(' > tr:first-child > th').last();
	          var lastCell = lastTh.find('.fht-cell');
	          lastCell.remove();
	          lastTh.css({width: '100%'});
	        }
	      });
	    }
	  };
	};
	
	directive.$inject = ['$parse', '$timeout', '$window', '$compile', 'NgTableFixedHeaderDefaults', 'NgTableHelper'];
	module.exports = directive;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = "<tr class=\"ng-table-sort-header\">\r\n    <th title=\"{{$column.headerTitle(this)}}\"\r\n        ng-repeat=\"$column in $columns\"\r\n        ng-class=\"{\r\n                    'sortable': $column.sortable(this),\r\n                    'sort-asc': params.sorting()[$column.sortable(this)]=='asc',\r\n                    'sort-desc': params.sorting()[$column.sortable(this)]=='desc'\r\n                  }\"\r\n        ng-click=\"$ctrl.sortBy($column, $event)\"\r\n        ng-style=\"{width: $column.width}\"\r\n        ng-if=\"$column.show(this)\"\r\n        ng-init=\"template = $column.headerTemplateURL(this)\"\r\n        class=\"header {{$column.class(this)}}\">\r\n        <div ng-if=\"!template\" class=\"ng-table-header\" ng-class=\"{'sort-indicator': params.settings().sortingIndicator == 'div'}\">\r\n            <span ng-bind=\"$column.title(this)\" ng-class=\"{'sort-indicator': params.settings().sortingIndicator == 'span'}\"></span>\r\n        </div>\r\n        <div ng-if=\"template\" ng-include=\"template\"></div>\r\n    </th>\r\n</tr>";

/***/ },
/* 8 */
/***/ function(module, exports) {

	var directive = function($compile, $parse, $timeout, ngTableEventsChannel) {
	  return {
	    restrict: 'A',
	    require: 'ngModel',
	    compile: function(elem, attrs) {
	      var PROP_REGEXP = /\..*/;
	      var checkbox = angular.element(elem[0].querySelector('[checklist-model]'));
	      var match = checkbox.attr('checklist-value').match(PROP_REGEXP);
	      var selectedAsProp = match ? match[0].replace(/^./, '') : false;
	      return function postLink(scope, elem, attrs, ngModelCtrl) {
	        // FIXME: access to ng-table's scope
	        var table = angular.element(elem[0].querySelector('[ng-table]'));
	        var ngTableScope = table.controller('ngTable').$scope;
	        var tableFixedHeader = angular.isDefined(table.attr('ng-table-fixed-header'));
	        scope.$selectedAll = {
	          model: false // enum = {true, false, 'indeterminate'}
	        };
	
	        scope.$selectAll = function() {
	          ngTableScope.$data.forEach(function(row) {
	            row = selectedAsProp ? row[selectedAsProp] : row;
	            ngModelCtrl.$modelValue.indexOf(row) == -1 && ngModelCtrl.$modelValue.push(row);
	          });
	        };
	
	        scope.$unselectAll = function() {
	          ngTableScope.$data.forEach(function(row) {
	            row = selectedAsProp ? row[selectedAsProp] : row;
	            var index = ngModelCtrl.$modelValue.indexOf(row);
	            if (index > -1) {
	              ngModelCtrl.$modelValue.splice(index, 1);
	            }
	          });
	        };
	
	        scope.$watch('$selectedAll.model', function(newValue, oldValue) {
	          if (newValue === oldValue || typeof newValue !== 'boolean') return;
	          newValue ? scope.$selectAll() : scope.$unselectAll();
	        });
	
	        scope.$watchCollection(function() {
	          return ngModelCtrl.$modelValue
	        }, selectAllChange);
	
	        ngTableEventsChannel.onPagesChanged(function() {
	          selectAllChange();
	        }, scope);
	
	        function selectAllChange(values) {
	          if (ngTableScope.$data) {
	            var total = ngTableScope.$data.length;
	            var checked = 0;
	
	            ngTableScope.$data.forEach(function(row) {
	              row = selectedAsProp ? row[selectedAsProp] : row
	              ngModelCtrl.$modelValue.indexOf(row) > -1 && checked++;
	            });
	
	            var unchecked = total - checked;
	            // is table fixed header
	            var selectAll = tableFixedHeader ?
	              elem.closest('.fht-table-wrapper').find('.fht-thead .select-all') :
	              elem.find('.select-all');
	
	            selectAll.prop('indeterminate', (checked !== 0 && unchecked !== 0));
	
	            if (checked == total && total != 0) {
	              scope.$selectedAll.model = (checked <= ngModelCtrl.$modelValue.length) ? true : 'indeterminate';
	              selectAll.prop('checked', true);
	            } else if (checked == 0) {
	              scope.$selectedAll.model = (ngModelCtrl.$modelValue.length == 0) ? false : 'indeterminate';
	              selectAll.prop('checked', false);
	            }
	          }
	        }
	      }
	    }
	  }
	};
	
	directive.$inject = ['$compile', '$parse', '$timeout', 'ngTableEventsChannel'];
	module.exports = directive;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = "<input type=\"checkbox\" class=\"select-all\" value=\"\" ng-model=\"$selectedAll.model\" />";

/***/ },
/* 10 */
/***/ function(module, exports) {

	// @source jashkenas/underscore
	// @url https://github.com/jashkenas/underscore/blob/1.5.2/underscore.js#L693
	var factory = function ($timeout) {
	  return {
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
	};
	
	factory.$inject = ['$timeout'];
	module.exports = factory;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=ng-table-extend.js.map