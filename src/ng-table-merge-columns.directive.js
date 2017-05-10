var directive = function($timeout, $compile) {
	return {
		restrict: 'A',
		controller: function($element) {
			var vm = this;
			var ngTableDynamicController = $element.controller('ngTableDynamic');

			vm.treeifyColumns = treeifyColumns;
			vm.mergeColumns = mergeColumns;
			vm.flattenColumns = flattenColumns;
			vm.buildDynamicColumns = buildDynamicColumns;
			vm.colspan = colspan;

			function treeifyColumns(columns) {
				var _columns = [];
				var lookup = {};

				columns.forEach(function(col) {
					lookup[col.title()] = col;
					col.columns = [];
				});

				columns.forEach(function(col) {
					if (col.root == true) {
						_columns.push(col);
					} else {
						parent = lookup[col.parentTitle];
						parent && parent.columns.push(col);
					}
				});

				return _columns;
			}

			function mergeColumns(columns) {
				var _columns = [];
				pushTheSameLevelCol(columns, 0);
				return _columns;

				function pushTheSameLevelCol(columns, level) {
					_columns[level] = _columns[level] || [];
					columns.forEach(function(cell) {
						_columns[level].push(cell);
						if (cell.columns && cell.columns.length > 0) {
							pushTheSameLevelCol(cell.columns, level + 1);
						}
					})
				}
			}

			function flattenColumns(nestedColumns) {
				var _columns = [];
				nestedColumns.forEach(function(col) {
					if (col.columns && col.columns.length) {
						Array.prototype.push.apply(_columns, flattenColumns(col.columns));
					} else {
						_columns.push(col);
					}
				});
				return _columns;	
			}

			function buildDynamicColumns(nestedColumns) {
				nestedColumns.forEach(function(col) {
					if (col.columns && col.columns.length) {
						col.columns = ngTableDynamicController.buildColumns(col.columns);
						buildDynamicColumns(col.columns);
					}
				});
			}

			function colspan(columns) {
				var n = 0;
				columns.forEach(function(cell) {
					if (cell.columns && cell.columns.length > 0) {
						n += colspan(cell.columns); //遍历下级columns
					} else {
						++n;
					}
				});
				return n;
			}
		},
		compile: function(elem, attrs) {
			elem.addClass('table-merge-columns');
			return function postLink(scope, elem, attrs, ctrl) {
				scope.$colspan = ctrl.colspan
				scope.$mergedColumns = [];

				$timeout(function() {
					if (attrs.ngTable) {
						var columns = ctrl.treeifyColumns(scope.$columns);
						scope.$mergedColumns = ctrl.mergeColumns(columns);
						scope.$columns = ctrl.flattenColumns(columns);
					} else if (attrs.ngTableDynamic) {
						ctrl.buildDynamicColumns(scope.$columns);
						scope.$mergedColumns = ctrl.mergeColumns(scope.$columns);
						scope.$columns = ctrl.flattenColumns(scope.$columns);
					}

					console.log(scope.$mergedColumns);
					console.log(scope.$columns);
				});
			}
		}
	}
};

directive.$inject = ['$timeout', '$compile'];

module.exports = directive;