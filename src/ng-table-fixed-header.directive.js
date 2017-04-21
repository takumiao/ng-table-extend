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