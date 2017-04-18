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