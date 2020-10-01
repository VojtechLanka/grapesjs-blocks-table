# GrapesJS Blocks Table

## Options

|Option|Description|Default|
|-|-|-
|`containerId`|Container to witch will be binded jQuery Event handlers to control adding new table and handler for adding and removing rows and columns.|`document`|

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
      plugins: ['gjs-blocks-table'],
      pluginsOpts: { 'grapesjs-blocks-table' : { 'containerId' : '#gjs' } },
  });
</script>
```

## License

BSD 3-Clause
