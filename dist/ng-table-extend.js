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
	    .value('NgTableNoDataDefaults', {
	      text: 'no-data'
	    })
	    .value('NgTableFixedHeaderDefaults', {})
	    .run(['$templateCache', function($templateCache) {
	      $templateCache.put('ng-table/sorterRow.html', __webpack_require__(7));
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
	      var tableElem = elem.parent('table');
	      var tableEmpty = elem.find('.table-empty');
	      return function postLink(scope) {
	        scope.text || (scope.text = NgTableNoDataDefaults.text);
	        scope.$watch('ngShow', function(newValue, oldValue) {
	          if (newValue === oldValue) return;
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
	          // remove <tr ng-table-col-group>
	          elem.remove();
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
	var directive = function($parse, $timeout, $window, $compile, NgTableFixedHeaderDefaults) {
	  return {
	    restrict: 'A',
	    priority: 1002,
	    link: function(scope, elem, attrs) {
	      // get options of ng-table-fixed-header
	      var options = $parse(attrs.tableFixedHeader)(scope);
	      options = angular.extend({}, NgTableFixedHeaderDefaults, options);
	
	      var tableId = elem.attr('id');
	      var ngTableScope = elem.controller('ngTable').$scope;
	      timeout = $timeout(function() {
	        var fixedTable = elem.fixedHeaderTable(options);
	        var fixedWrapper = fixedTable.closest('.fht-table-wrapper');
	        var fixedThead = fixedWrapper.children('.fht-thead');
	        var fixedTbody = fixedWrapper.children('.fht-tbody');
	
	        // clone thead & tfoot
	        cloneHeaderAndFooter();
	        tableId && fixedWrapper.attr('id', tableId + '-wrapper');
	
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
	          
	          setTimeout(function() {
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
	
	directive.$inject = ['$parse', '$timeout', '$window', '$compile', 'NgTableFixedHeaderDefaults'];
	module.exports = directive;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = "<tr class=\"ng-table-sort-header\">\r\n    <th title=\"{{$column.headerTitle(this)}}\"\r\n        ng-repeat=\"$column in $columns\"\r\n        ng-class=\"{\r\n                    'sortable': $column.sortable(this),\r\n                    'sort-asc': params.sorting()[$column.sortable(this)]=='asc',\r\n                    'sort-desc': params.sorting()[$column.sortable(this)]=='desc'\r\n                  }\"\r\n        ng-click=\"$ctrl.sortBy($column, $event)\"\r\n        ng-style=\"{width: $column.width}\"\r\n        ng-if=\"$column.show(this)\"\r\n        ng-init=\"template = $column.headerTemplateURL(this)\"\r\n        class=\"header {{$column.class(this)}}\">\r\n        <div ng-if=\"!template\" class=\"ng-table-header\" ng-class=\"{'sort-indicator': params.settings().sortingIndicator == 'div'}\">\r\n            <span ng-bind=\"$column.title(this)\" ng-class=\"{'sort-indicator': params.settings().sortingIndicator == 'span'}\"></span>\r\n        </div>\r\n        <div ng-if=\"template\" ng-include=\"template\"></div>\r\n    </th>\r\n</tr>";

/***/ }
/******/ ])
});
;
//# sourceMappingURL=ng-table-extend.js.map