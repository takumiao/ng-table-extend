var angular = require('angular');
module.exports =
  angular
    .module('ngTable')
    .directive('ngTableNoData', require('./ng-table-no-data.directive'))
    .directive('ngTableColGroup', require('./ng-table-col-group.directive'))
    .directive('ngTableFixedHeader', require('./ng-table-fixed-header.directive'))
    .directive('ngTableSelectable', require('./ng-table-selectable.directive'))
    .factory('NgTableHelper', require('./helper.factory'))
    .value('NgTableNoDataDefaults', {
      text: 'no-data'
    })
    .value('NgTableFixedHeaderDefaults', {})
    .run(['$templateCache', function($templateCache) {
      $templateCache.put('ng-table/sorterRow.html', require('html!./templates/sorter-row.tpl.html'));
      $templateCache.put('ng-table/checkAll.html', require('html!./templates/check-all.tpl.html'));
    }]);