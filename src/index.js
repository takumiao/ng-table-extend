var angular = require('angular');
module.exports =
  angular
    .module('ngTable')
    .directive('ngTableNoData', require('./ng-table-no-data.directive'))
    .directive('ngTableColGroup', require('./ng-table-col-group.directive'))
    .directive('ngTableFixedHeader', require('./ng-table-fixed-header.directive'))
    .value('NgTableNoDataDefaults', {
      text: 'no-data'
    })
    .value('NgTableFixedHeaderDefaults', {})
    .run(['$templateCache', function($templateCache) {
      $templateCache.put('ng-table/sorterRow.html', require('html!./templates/sorter-row.tpl.html'));
    }]);