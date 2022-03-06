import $ from "jquery";

export default (editor, opts = {}) => {
    const cmd = editor.Commands;


    $(function() {
      $(opts.containerId ? opts.containerId : document).on('click','li.table-toolbar-submenu-run-command', function() {
        editor.runCommand(this.dataset.command);
      });
  
      $(opts.containerId ? opts.containerId : document).on('click','input#table-button-create-new', function() {
        updateAttributesAndCloseModal(this.dataset.componentId)
      });
    })

    function getAllComponents (model, result = []) {
      result.push(model);
      model.components().each(mod => getAllComponents(mod, result))
      return result;
    }
    
    function updateAttributesAndCloseModal (componentId) {
      let nRows = document.getElementById('nRows').value;
      let nColumns = document.getElementById('nColumns').value;
      if (nRows || nColumns) {
        let tableModel = getAllComponents(editor.getWrapper()).find(model => model.cid == componentId);
        let modelAttributes = tableModel.getAttributes();
        if (nRows) {
          modelAttributes['data-n_rows'] = nRows;
        }
        if (nColumns) {
          modelAttributes['data-n_columns'] = nColumns;
        }
        tableModel.setAttributes(modelAttributes);
      }
      editor.Modal.close();
    }

    editor.on('component:add', (model) => {
      if (model.attributes.type === 'customTable' && model.components().length == 0) {
        editor.runCommand('open-table-settings-modal', { model: model });
      }
    })
  
    const getCellToolbar = () => {
      let toolbar = [
        { attributes: { class: "column-actions columns-operations", title: 'Columns operations' }, command: "table-show-columns-operations" },
        { attributes: { class: "row-actions rows-operations", title: 'Rows operations' }, command: "table-show-rows-operations" },
        { attributes: { class: "fa fa-arrow-up", title: 'Select parent component' }, command: 'table-select' }
      ]
      if (editor.getSelected().getAttributes()['colspan'] > 1 || editor.getSelected().getAttributes()['rowspan'] > 1) {
        toolbar.push({ attributes: { class: "fa fa fa-th-large", title: 'Unmerge cells' }, command: "table-unmerge-cells" })
      }
      return toolbar;
    }
  
    editor.on('component:selected', component => {
      if (component.get('type') == 'cell') {
        component.set('toolbar', getCellToolbar()); // set a toolbars
      }
    });
  
    cmd.add('table-show-columns-operations', editor => {
      updateTableToolbarSubmenu('columns', 'rows');
    });
  
    cmd.add('table-show-rows-operations', editor => {
      updateTableToolbarSubmenu('rows', 'columns');
    });
  
    cmd.add('table-select', editor => {
      editor.runCommand('core:component-exit');
      editor.runCommand('core:component-exit');
    });
  
    cmd.add('table-insert-row-above', editor => {
      let selected = editor.getSelected();
      if (selected.is('cell')) {
        let rowComponent = selected.parent();
        rowComponent.parent().components().add({
          type: 'row',
          components: [...Array(rowComponent.components().length).keys()].map(i => ({ type: 'cell' }))
        }, {
          at: rowComponent.collection.indexOf(rowComponent)
        });
        editor.selectRemove(selected);
        setTimeout(function() { editor.select(selected); }, 50);
      }
    });
  
    cmd.add('table-insert-row-below', editor => {
      let selected = editor.getSelected();
      if (selected.is('cell')) {
        let rowComponent = selected.parent();
        rowComponent.parent().components().add({
          type: 'row',
          components: [...Array(rowComponent.components().length).keys()].map(i => ({ type: 'cell' }))
        }, {
          at: rowComponent.collection.indexOf(rowComponent) + 1
        });
        editor.selectRemove(selected);
        setTimeout(function() { editor.select(selected); }, 50);
      }
    });
  
    cmd.add('table-insert-column-left', editor => {
      let selected = editor.getSelected();
      if (selected.is('cell')) {
        let columnIndex = selected.collection.indexOf(selected);
        selected.parent().parent().components().forEach(component => {
          component.components().add({ type: 'cell' }, {at: columnIndex});
        });
        editor.selectRemove(selected);
        setTimeout(function() { editor.select(selected); }, 50);
      }
    });
  
    cmd.add('table-insert-column-right', editor => {
      let selected = editor.getSelected();
      if (selected.is('cell')) {
        let columnIndex = selected.collection.indexOf(selected);
        selected.parent().parent().components().forEach(component => {
          component.components().add({ type: 'cell' }, {at: columnIndex + 1});
        });
        editor.selectRemove(selected);
        setTimeout(function() { editor.select(selected); }, 50);
      }
    });
  
    cmd.add('table-delete-row', editor => {
      let selected = editor.getSelected();
      if (selected.is('cell')) {
        let table = selected.parent().parent();
        editor.selectRemove(selected);
        selected.parent().remove();
        if (table.components().length  === 0) {
          table.parent().remove(table);
        }
      }
    });
  
    cmd.add('table-delete-column', editor => {
      let selected = editor.getSelected();
      if (selected.is('cell')) {
        let table = selected.parent().parent();
        let columnIndex = selected.collection.indexOf(selected);
  
        editor.selectRemove(selected);
        table.components().forEach(component => {
          component.components().at(columnIndex).remove();
        });
  
        if (table.components().every(component => component.components().length === 0)) {
          table.parent().remove(table);
        }
      }
    });
  
    cmd.add('table-merge-cells-right', editor => {
      let selected = editor.getSelected();
      if (selected.is('cell')) {
        let currentColspan = selected.getAttributes()['colspan'] ? selected.getAttributes()['colspan'] : 1;
        let columnIndex = selected.collection.indexOf(selected);
        let rowIndex = selected.parent().collection.indexOf(selected.parent());
        let table = selected.parent().parent();
        let mergedRowsIndexEnd = selected.getAttributes()['rowspan'] > 0 ? selected.getAttributes()['rowspan'] : 1;
  
        for (let index = 0; index < mergedRowsIndexEnd; index++) {
          let componentToRemove = table.components().at(rowIndex + index).components().at(index === 0 ? columnIndex + 1 : columnIndex )
          componentToRemove.components().forEach(component => {
            selected.append(component.toHTML());
          });
          componentToRemove.remove();
        }
  
        selected.addAttributes({ 'colspan': ++currentColspan });
        editor.selectRemove(selected);
        setTimeout(function() { editor.select(selected); }, 50);
        if (columnIndex + 1 == selected.parent().components().length) {
          $('#button-merge-cells-right').hide();
        }
      }
    });
  
    cmd.add('table-merge-cells-down', editor => {
      let selected = editor.getSelected();
      if (selected.is('cell')) {
        let currentColspan = selected.getAttributes()['colspan'] ? selected.getAttributes()['colspan'] : 1;
        let currentRowspan = selected.getAttributes()['rowspan'] ? selected.getAttributes()['rowspan'] : 1;
        let columnIndex = selected.collection.indexOf(selected);
        let rowIndex = selected.parent().collection.indexOf(selected.parent()) + currentRowspan - 1;
        let table = selected.parent().parent();
  
        for (let index = 0; index < currentColspan; index++) {
          let componentToRemove = table.components().at(rowIndex + 1).components().at(columnIndex)
          componentToRemove.components().forEach(component => {
            selected.append(component.toHTML());
          });
          componentToRemove.remove()
        }
  
        selected.addAttributes({ 'rowspan': ++currentRowspan });
        editor.selectRemove(selected);
        setTimeout(function() { editor.select(selected); }, 50);
        if (rowIndex + 2 == table.components().length) {
          $('#button-merge-cells-down').hide();
        }
      }
    });
  
    cmd.add('table-unmerge-cells', editor => {
      let selected = editor.getSelected();
      if (selected.is('cell')) {
        let currentColspan = selected.getAttributes()['colspan'] ? selected.getAttributes()['colspan'] : 1;
        let currentRowspan = selected.getAttributes()['rowspan'] ? selected.getAttributes()['rowspan'] : 1;
        let columnIndex = selected.collection.indexOf(selected);
        let rowIndex = selected.parent().collection.indexOf(selected.parent());
        let table = selected.parent().parent();
  
        for (let i = 0; i < currentRowspan; i++) {
          for (let x = 0; x < currentColspan; x++) {
            if (i === 0 && currentColspan === 1) {
              continue
            }
            if (i === 0 && x === 0 && currentColspan > 1) {
              x = 1;
            }
            table.components().at(rowIndex + i).components().add({ type: 'cell' }, { at: (i === 0 ? columnIndex + 1 : columnIndex) });
          }
        }
  
        selected.setAttributes({ 'colspan': 1 });
        selected.setAttributes({ 'rowspan': 1 });
  
        editor.selectRemove(selected);
        setTimeout(function() { editor.select(selected); }, 50);
        $('#button-merge-cells-down').show();
        $('#button-merge-cells-right').show();
      }
    });
  
    cmd.add('open-table-settings-modal', {
      run(editor, sender, opts = {}) {
        let modelAttributes = opts.model.getAttributes()
        editor.Modal.open({
          title: 'Create new Table',
          content: `
            <div class="new-table-form">
              <label>Number of columns</label>
              <input type="number" class="form-control" value="`+ modelAttributes['data-n_columns'] + `" name="nColumns" id="nColumns" min="1">
              <br>
              <label>Number of rows</label>
              <input type="number" class="form-control" value="`+ modelAttributes['data-n_rows'] +`" name="nRows" id="nRows" min="1">
            <div>
            <input id="table-button-create-new" type="button" class="button nice white" value="Create Table" data-component-id="`+ opts.model.cid +`">
          `,
        }).onceClose(() => {
          if (opts.model.changed && !opts.model.changed.attributes) {
            opts.model.remove();
          }
          this.stopCommand()
        });
      },
      stop(editor) {
        editor.Modal.close();
      },
    });
  
    
    
    function updateTableToolbarSubmenu (submenuToShow, submenuToHide) {
      let selected = editor.getSelected();
      let currentMenu = $('ul#toolbar-submenu-'+submenuToShow);
      if(currentMenu.length > 0){
        $('.toolbar-submenu').slideUp('slow');
        $('ul#toolbar-submenu-'+submenuToShow).slideDown('slow');
      } else {
        if (selected && selected.is('cell')) {
          let rowComponent = selected.parent();
          if ($('.' + submenuToHide + '-operations .toolbar-submenu').length > 0){
            $('.' + submenuToHide + '-operations .toolbar-submenu').slideUp('slow');
          }
          if ($('.' + submenuToShow + '-operations .toolbar-submenu').length > 0){
            if ($('.' + submenuToShow + '-operations .toolbar-submenu').css('display') != 'none') {
              $('.' + submenuToShow + '-operations .toolbar-submenu').slideUp('slow');
              return;
            }
            $('.' + submenuToShow + '-operations .toolbar-submenu').slideDown('slow');
          } else {
            let htmlString = '';
            if (submenuToShow === 'rows') {
              htmlString = `
              <ul id="toolbar-submenu-rows" class="toolbar-submenu ` + ($('.gjs-toolbar').position().left > 150 ? 'toolbar-submenu-right' : '') + `" style="display: none;">
                <li class="table-toolbar-submenu-run-command" data-command="table-insert-row-above"><i class="fa fa-chevron-up" aria-hidden="true"></i> Insert row above</li>
                <li class="table-toolbar-submenu-run-command" data-command="table-insert-row-below" ><i class="fa fa-chevron-down" aria-hidden="true"></i> Insert row below</li>
                <li class="table-toolbar-submenu-run-command" data-command="table-delete-row" ><i class="fa fa-trash" aria-hidden="true"></i> Delete Row</li>
                <li id="button-merge-cells-right" class="table-toolbar-submenu-run-command" data-command="table-merge-cells-right" ` + (selected.collection.indexOf(selected) + 1 == selected.parent().components().length ? 'style="display: none;"' : '') + `><i class="fa fa-arrows-h" aria-hidden="true"></i> Merge cell right</li>
              </ul>
              `;
            } else {
              let rowspan = selected.getAttributes()['rowspan'] ? selected.getAttributes()['rowspan'] : 0;
              
              htmlString = `
              <ul id="toolbar-submenu-columns" class="toolbar-submenu ` + ($('.gjs-toolbar').position().left > 150 ? 'toolbar-submenu-right' : '') + `" style="display: none;">
                <li class="table-toolbar-submenu-run-command" data-command="table-insert-column-left" ><i class="fa fa-chevron-left" aria-hidden="true"></i> Insert column left</li>
                <li class="table-toolbar-submenu-run-command" data-command="table-insert-column-right" ><i class="fa fa-chevron-right" aria-hidden="true"></i> Insert column right</li>
                <li class="table-toolbar-submenu-run-command" data-command="table-delete-column" ><i class="fa fa-trash" aria-hidden="true"></i> Delete column</li>
                <li id="button-merge-cells-down" class="table-toolbar-submenu-run-command" data-command="table-merge-cells-down" ` + (rowComponent.collection.indexOf(rowComponent) + rowspan == rowComponent.parent().components().length ? 'style="display: none;"' : '') + `><i class="fa fa-arrows-v" aria-hidden="true"></i> Merge cell down</li>
              </ul>
              `;
            }
            $('.toolbar-submenu').slideUp('slow');
            $('.' + submenuToShow + '-operations').parent().append(htmlString);
            $('ul#toolbar-submenu-'+submenuToShow).slideDown('slow');
          }
        }
      }
    }
};