var decorator = function($provide) {
	$provide.decorator('ngTableSorterRowDirective', ['$delegate', 'NgTableHelper', function($delegate, NgTableHelper){
  	var directive = $delegate[0];
  	directive.templateUrl = function(elem) {
  		// fixed-header will invoked again
  		var tableElem = angular.element(NgTableHelper.parentNgTable(elem[0]));
  		var mergeColumns = tableElem.hasClass('table-merge-columns');
      console.log('table', mergeColumns, tableElem);
  		var tmpl = mergeColumns ? 'ng-table/sorterMergedRow.html' : 'ng-table/sorterRow.html'
  		return tmpl;
  	}
  	return $delegate;
  }]);
};

decorator.$inject = ['$provide'];
module.exports = decorator;