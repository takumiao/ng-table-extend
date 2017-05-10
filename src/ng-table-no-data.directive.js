var directive = function(NgTableNoDataDefaults, NgTableHelper) {
  return {
    restrict: 'A',
    scope: {
      text: '@',
      colspan: '=',
      ngShow: '='
    },
    template: require('html!./templates/no-data.tpl.html'),
    compile: function(elem, attrs) {
      elem.addClass('table-empty-container');
      var tableElem = angular.element(NgTableHelper.parentNgTable(elem[0]));
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
directive.$inject = ['NgTableNoDataDefaults', 'NgTableHelper']
module.exports = directive;