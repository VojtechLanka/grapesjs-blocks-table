export default (comps, { modal, ...config }) => {
  const tblResizable = config.tblResizable;

  comps.addType('customTable', {
    isComponent: element => element.tagName === 'TABLE',
    model: {
      defaults: {
        tagName: 'table',
        droppable: true,
        resizable: tblResizable,
        attributes: {
          'data-n_columns': 5,
          'data-n_rows': 3,
        },
        //classes: ['custom-table-component'],
      },
      init() {
        this.listenTo(this, 'change:attributes', this.updateModelComponents);
      },
      updateModelComponents () {
        if (this.changed.attributes && (this.changed.attributes['data-n_columns'] || this.changed.attributes['data-n_rows'])) {
          let cells = [];
          for (let index = 0; index < this.getAttributes()['data-n_columns']; index++) {
            cells.push({ type: 'cell' });
          }
          for (let index = 0; index < this.getAttributes()['data-n_rows']; index++) {
            this.components().add({ type: 'row', components: cells }, { at: -1 });
          }
        }
      },
    },
  });
};
