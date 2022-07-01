import $ from "jquery";
import * as tblHelper from "../tableHelper"

export default (editor, opts = {}) => {
  const cmd = editor.Commands;
  const cellType = "tbl-cell"
  
  $(function() {
    $(opts.containerId ? opts.containerId : document).on('click','li.table-toolbar-submenu-run-command', function() {
      editor.runCommand(this.dataset.command);
    });

    $(opts.containerId ? opts.containerId : document).on('click','input#table-button-create-new', function() {
      tblHelper.updateAttributesAndCloseModal(this.dataset.componentId)
    });
  })

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

  const getTableToolbar = (component) => {
    const tb = component.get('toolbar');
    let settingExists = tb.find(o=> o.command === 'open-traits-settings');
    if(!settingExists) {
      tb.push({ command: 'open-traits-settings', attributes: {class: 'fa fa-cog', title: 'Settings'} });
    }
    return tb;
  }

  editor.on('component:selected', component => {
    if (component.get('type') == cellType || component.get('type') == 'th') {
      component.set('toolbar', getCellToolbar()); // set a toolbars
    }

    if(component.get('type') == 'customTable'){
      component.set('toolbar', getTableToolbar(component));
    }
  });

  cmd.add('table-show-columns-operations', () => {
    tblHelper.updateTableToolbarSubmenu('columns', 'rows');
  });

  cmd.add('table-show-rows-operations', () => {
    tblHelper.updateTableToolbarSubmenu('rows', 'columns');
  });

  cmd.add('table-toggle-header', ()=> {
    let selected = editor.getSelected();
    if (selected.is('th')) {
      let table = selected.parent().parent();
      tblHelper.toggleHeaderRow(table, true)
    }
  });

  cmd.add('table-select', editor => {
    editor.runCommand('core:component-exit');
    editor.runCommand('core:component-exit');
  });

  cmd.add('table-insert-row-above', editor => {
    let selected = editor.getSelected();
    if (selected.is(cellType)) {
      let rowComponent = selected.parent();
      let table = selected.parent().parent();
      tblHelper.insertRow(table, rowComponent.collection.indexOf(rowComponent), true)
      tblHelper.refreshEditorSelected()
    }
  });

  cmd.add('table-insert-row-below', editor => {
    let selected = editor.getSelected();
    if (selected.is(cellType) || selected.is('th')) {
      let rowComponent = selected.parent();
      let table = selected.parent().parent();
      tblHelper.insertRow(table, rowComponent.collection.indexOf(rowComponent) + 1, true)
      tblHelper.refreshEditorSelected()
    }
  });

  cmd.add('table-insert-column-left', editor => {
    let selected = editor.getSelected();
    if (selected.is(cellType) || selected.is('th')) {
      let table = selected.parent().parent();
      let columnIndex = selected.collection.indexOf(selected);
      tblHelper.insertColumn(table, columnIndex, true)
      tblHelper.refreshEditorSelected()
    }
  });

  cmd.add('table-insert-column-right', editor => {
    let selected = editor.getSelected();
    if (selected.is(cellType) || selected.is('th')) {
      let table = selected.parent().parent();
      let columnIndex = selected.collection.indexOf(selected);

      tblHelper.insertColumn(table, columnIndex + 1, true)
      tblHelper.refreshEditorSelected()
    }
  });

  cmd.add('table-delete-row', editor => {
    let selected = editor.getSelected();
    if (selected.is(cellType) || selected.is('th')) {
      let table = selected.parent().parent();
      editor.selectRemove(selected);
      let rowComponent = selected.parent();
      let rowIndex = rowComponent.collection.indexOf(rowComponent)

      tblHelper.removeRow(table, rowIndex, true)

      if (table.components().length  === 0) {
        table.parent().remove(table);
      }
    }
  });

  cmd.add('table-delete-column', editor => {
    let selected = editor.getSelected();
    if (selected.is(cellType) || selected.is('th')) {
      let table = selected.parent().parent();
      let columnIndex = selected.collection.indexOf(selected);

      editor.selectRemove(selected);
      tblHelper.removeColumn(table, columnIndex, true)

      if (table.components().every(component => component.components().length === 0)) {
        table.parent().remove(table);
      }
    }
  });

  cmd.add('table-merge-cells-right', editor => {
    let selected = editor.getSelected();
    if (selected.is(cellType) || selected.is('th')) {
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
      tblHelper.refreshEditorSelected()
      if (columnIndex + 1 == selected.parent().components().length) {
        $('#button-merge-cells-right').hide();
      }
    }
  });

  cmd.add('table-merge-cells-down', editor => {
    let selected = editor.getSelected();
    if (selected.is(cellType)) {
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
      tblHelper.refreshEditorSelected()
      if (rowIndex + 2 == table.components().length) {
        $('#button-merge-cells-down').hide();
      }
    }
  });

  cmd.add('table-unmerge-cells', editor => {
    let selected = editor.getSelected();
    if (selected.is(cellType) || selected.is('th')) {
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
          table.components().at(rowIndex + i).components().add({ type: cellType }, { at: (i === 0 ? columnIndex + 1 : columnIndex) });
        }
      }

      selected.setAttributes({ 'colspan': 1 });
      selected.setAttributes({ 'rowspan': 1 });

      tblHelper.refreshEditorSelected()
      $('#button-merge-cells-down').show();
      $('#button-merge-cells-right').show();
    }
  });

  cmd.add('open-traits-settings', {
    run(editor, sender, opts = {}) {
      editor.Panels.getButton('views', 'open-tm').set('active', true);
    }
  });

  cmd.add('open-table-settings-modal', {
    run(editor, sender, opts = {}) {
      editor.Modal.open({
        title: 'Create new Table',
        content: `
          <div class="new-table-form">
            <label for="nColumns">Number of columns</label>
            <input type="number" class="form-control" value="`+ opts.model.props()['nColumns'] + `" name="nColumns" id="nColumns" min="1">
            <br>
            <label for="nRows">Number of rows</label>
            <input type="number" class="form-control" value="`+ opts.model.props()['nRows'] +`" name="nRows" id="nRows" min="1">
          <div>
          <input id="table-button-create-new" type="button" value="Create Table" data-component-id="`+ opts.model.cid +`">
        `,
      }).onceClose(() => {
        if (!opts.model.components() || opts.model.components().length === 0) {
          opts.model.remove();
        }
        this.stopCommand()
      });
    },
    stop(editor) {
      editor.Modal.close();
    },
  });
};