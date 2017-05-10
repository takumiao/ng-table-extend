// TODO: when resize can't find setting width
var directive = function($parse, $timeout, $window, $compile, NgTableFixedHeaderDefaults, NgTableHelper) {
  return {
    restrict: 'A',
    priority: 1002,
    link: function(scope, elem, attrs) {
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
              colGroup = fixedTbody.find('> table > colgroup'),
              cols = colGroup.children(),
              replacedThead = null,
              clonedTheadOrg = null;

          // convert fluid width to fixed width 
          colGroup.children().each(function(index) {
            var col = this;
            var widthStyle = col.getAttribute('width');

            if (index == colGroup.children().length - 1) {
              // set last col 100%
              col.setAttribute('width', '100%');
            } else if (/%$/.test(widthStyle)) {
              var cid = col.getAttribute('cid');
              var th = theadOrg[0].querySelector('th[cid="'+cid+'"]')
              col.setAttribute('width', th.offsetWidth);
            }
          });

          // clone original thead
          clonedTheadOrg = theadOrg.clone(true);
          // re-compile cloned thead 
          // original thead bind some events
          $compile(clonedTheadOrg)(ngTableScope); 
          // replace fixed thead with the compiled thead
          thead.replaceWith(clonedTheadOrg);
          // fixed with user <colgroup>
          if (colGroup.length) {
            fixedThead.find('> table').append(colGroup.clone())
          }

          $timeout(function() {
            replacedThead = fixedThead.find('> table > thead');
            adjustReplacedTheadWidth(replacedThead, theadOrg);
            //fixedLastThWidth(replacedThead);
            //fixedLastThWidth(theadOrg); 
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