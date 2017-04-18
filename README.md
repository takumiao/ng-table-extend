ng-table-extend
================

Extension of `ng-table` directive

## Installation & Dependencies

- angular (1.2+)
- [ng-table (3.1.0+)](https://github.com/esvit/ng-table)

```html
<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
  ...
  <link rel="stylesheet" href="./node_modules/ng-table/bundles/ng-table.min.css"/>
  <link rel="stylesheet" href="ng-table-extend.css" />
</head>
<body>
  ...
  <script type="text/javascript" src="./node_modules/angular/angular.min.js"></script>
  <script type="text/javascript" src="./node_modules/ng-table/bundles/ng-table.min.js"></script>
  <script type="text/javascript" src="ng-table-extend.js"></script>
</body>
</html>
```

## Fixed Width

### Example

[https://jsfiddle.net/TakuMiao/z09momk5/](https://jsfiddle.net/TakuMiao/z09momk5/)


### Markup
```html
<!-- ng-table directive -->
<table ng-table="vm.tableParams" 
	class="table table-condensed table-bordered table-striped ng-table-fixed-width" 
	template-pagination="''">
  <!-- add ng-table-col-group to <tr> element -->
  <tr ng-table-col-group>
    <td data-title="'Name'" data-width="160px"></td> <!-- add width attribute -->
    <td data-title="'Age'" data-width="45px"></td>
    <td data-title="'Address'"></td>
  </tr>
  <tr ng-repeat="row in $data">
    <td>{{::row.name}}</td>
    <td>{{::row.age}}</td>
    <td>{{::row.address}}</td>
  </tr>
</table>

<!-- ng-table-dynamic directive -->
<table ng-table-dynamic="vm.tableDynamicParams with vm.cols" 
  class="table table-condensed table-bordered table-striped ng-table-fixed-width" template-pagination="''">
  <tr ng-repeat="row in $data">
    <td ng-repeat="col in $columns">
      {{row[col.field]}}
    </td>
  </tr>
</table>
```

### Javascript
```js
var vm = this;
var data = [{firstName: 'Alek', lastName: 'Mann', age: 50} /*,*/];
vm.cols = [
  { field: 'name', title: 'Name', show: true, width: '160px' }, // add width attribute
  { field: 'age', title: 'Age', show: true, width: '45px' },
  { field: 'address', title: 'Address', show: true }
];

vm.tableParams = new NgTableParams({}, {
  dataset: data
});

vm.tableDynamicParams = new NgTableParams({}, {
  dataset: data
});
```


## No Data

### Example

[https://jsfiddle.net/TakuMiao/js0fforg/](https://jsfiddle.net/TakuMiao/js0fforg/)

### Markup
```html
<table ng-table="vm.tableParams" class="table other-class">
  ...
  <!-- add ng-table-no-data directive to <tr> element -->
  <tr ng-table-no-data ng-show="!$data.length" colspan="3" text="no data"></tr>
</table>
```

### ng-table-no-data options

- `colspan` *(Number)* - the length of table columns
- `text` *(String='no-data')* - the text when table data is empty


## Fixed Header
- jquery (1.7+)
- fixed-header-table

```html
<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
  <link rel="stylesheet" href="./node_modules/fixed-header-table/css/defaultTheme.css">
  <!-- other style -->
</head>
<body>
  ...
  <script type="text/javascript" src="./node_modules/jquery/dist/jquery.min.js"></script>
  <script type="text/javascript" src="./node_modules/fixed-header-table/jquery.fixedheadertable.min.js"></script>
  <!-- other script -->
</body>
</html>
```

### Example

[https://jsfiddle.net/TakuMiao/h6yp7n2L/](https://jsfiddle.net/TakuMiao/h6yp7n2L/)

### Markup

- need an extra `<td>` to adjust table\'s width
- add `ng-table-with-pagination` class to wrapper element if you hava pagination 

```html
<div class="panel panel-default ng-table-with-pagination" style="height: 260px;">
  <!-- add ng-table-fixed-header directive to <table> element -->
  <table ng-table="vm.tableParams" 
    ng-table-fixed-header
    class="table table-condensed table-bordered table-striped table-fixed-width table-no-border-around">
    <tr ng-table-col-group>
      <td data-title="'FirstName'" data-width="100px"></td>
      <td data-title="'LastName'" data-width="100px"></td>
      <td data-title="'Age'" sortable="'age'" data-width="100px"></td>
      <td></td> <!-- append extra <td> -->
    </tr>
    <tr ng-repeat="row in $data">
      <td>{{::row.firstName}}</td>
      <td>{{::row.lastName}}</td>
      <td class="text-center">{{::row.age}}</td>
      <td></td> <!-- append extra <td> -->
    </tr>
  </table>
</div>


```