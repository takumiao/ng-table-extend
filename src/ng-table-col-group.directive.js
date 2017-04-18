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