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