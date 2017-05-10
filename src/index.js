var angular = require('angular');
module.exports =
  angular
    .module('ngTable')
    .directive('ngTableFixedWidth', require('./ng-table-fixed-width.directive'))
    .directive('ngTableNoData', require('./ng-table-no-data.directive'))
    .directive('ngTableColGroup', require('./ng-table-col-group.directive'))
    .directive('ngTableFixedHeader', require('./ng-table-fixed-header.directive'))
    .directive('ngTableSelectable', require('./ng-table-selectable.directive'))
    .directive('ngTableMergeColumns', require('./ng-table-merge-columns.directive'))   
    .factory('NgTableHelper', require('./helper.factory'))
    .value('NgTableNoDataDefaults', {
      text: 'no-data'
    })
    .config(require('./ng-table-sorter-row.decorator'))
    .value('NgTableFixedHeaderDefaults', {})
    .run(['$templateCache', function($templateCache) {
      $templateCache.put('ng-table/sorterRow.html', require('html!./templates/sorter-row.tpl.html'));
      $templateCache.put('ng-table/checkAll.html', require('html!./templates/check-all.tpl.html'));
      $templateCache.put('ng-table/sorterMergedRow.html', require('html!./templates/sorter-Merged-row.tpl.html'));
    }]);