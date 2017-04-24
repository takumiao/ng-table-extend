ng-table-extend
================

Extension of `ng-table` directive

## Dependencies

- angular (1.2+)
- [ng-table (3.0.1+)](https://github.com/esvit/ng-table)

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

<br/><br/>
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


<br/><br/>
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


<br/><br/>
## Fixed Header

### Dependencies
- jquery (1.7+)
- [fixed-header-table](https://github.com/markmalek/Fixed-Header-Table)


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

- need an extra `<td>` to adjust table's width
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


<br/><br/>
## Selectable

### Dependencies
- [checklist-model](https://github.com/vitalets/checklist-model)
- [checklist-selection](https://gist.github.com/takumiao/3ed235b2b2486e5080ee679d39ce4ed2)


### Example

[http://jsfiddle.net/TakuMiao/yy4fz69h/](http://jsfiddle.net/TakuMiao/yy4fz69h/)

### Markup

- add `checklist-selection` and `ng-table-selectable` directive to wrapper element of table
- add `ng-model` to store selected data
- if you want a checkbox to select/unselect all, add `header="'ng-table/checkAll.html'"` attribute to a `<td>` in `ng-table-col-group` (you can also custom the template)

```html
<div checklist-selection
  ng-table-selectable 
  ng-model="vm.selectedUsers"
  class="panel panel-default table-with-pagination">
  <table ng-table="vm.tableParams"  
    ng-table-fixed-header
    class="table table-condensed table-bordered table-fixed-width table-no-border-around table-striped">
    <tr ng-table-col-group>
      <td data-width="40" header="'ng-table/checkAll.html'"></td>
      <td data-title="'Name'" data-width="160"></td>
      <td data-title="'Age'" data-sortable="'age'" data-width="60"></td>
      <td data-title="'Address'"></td>
    </tr>
    <tr ng-repeat="row in $data"
      style="cursor: pointer;"
      ng-click="$toggleChecked(row)"
      ng-class="{checked: $isChecked(row)}">
      <td class="text-center">
        <label>
          <input type="checkbox"
            checklist-model="$checklistModel"
            checklist-value="row"
            stop-propagation>
        </label>
      </td>
      <td>{{::row.name}}</td>
      <td>{{::row.age}}</td>
      <td>{{::row.address}}</td>
    </tr>
  </table>
</div>
```