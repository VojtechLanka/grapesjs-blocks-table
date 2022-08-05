# GrapesJS Blocks Table

Plugin for GrapesJS that adds table block.

## Options

|Option|Description|Default|
|-|-|-
|`containerId`|Container to wich will be binded jQuery Event handlers to control adding new table and handler for adding and removing rows and columns.|`document`|
|`tblResizable`|Should the table have resize handles|`true`|
|`cellsResizable`|Should cells within the table have resize handles|`true`|
|`componentCell`|Id of component that should be used for cells|`customCell`|
|`componentCellHeader`|Id of component that should be used for header cells|`customHeaderCell`|
|`componentRow`|Id of component that should be used for header rows|`customRow`|

## Usage

```html
<link rel="stylesheet" href="path/to/grapes.min.css">
<script src="path/to/grapes.min.js"></script>
<script src="path/to/grapesjs-blocks-table.min.js"></script>

<div id="gjs"></div>

<script type="text/javascript">
  var editor = grapesjs.init({
      container : '#gjs',
      ...
      plugins: ['grapesjs-blocks-table'],
      pluginsOpts: { 'grapesjs-blocks-table' : { 'containerId' : '#gjs' } },
  });
</script>
```

After dragging the table block to editor modal with initial table settings will open. Further manipulation (adding, removing, merging) of rows and columns is done through custom toolbar. You can also double click cell to automatically add text component.

## License

BSD 3-Clause