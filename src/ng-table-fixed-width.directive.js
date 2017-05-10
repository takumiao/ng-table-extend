var directive = function(NgTableNoDataDefaults) {
  return {
    restrict: 'A',
    compile: function(elem, attrs) {
      var colGroup = '<colgroup><col ng-repeat="col in $columns" width="{{::col.width}}" cid="{{col.$$hashKey}}"></col></colgroup>';
      elem.addClass('table-fixed-width');
      elem.append(colGroup);
    }
  };
};
directive.$inject = ['NgTableNoDataDefaults']
module.exports = directive;