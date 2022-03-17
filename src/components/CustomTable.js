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
          'data-hasHeader': false,
        },
      },

      init() {
        this.listenTo(this, 'change:attributes', this.updateModelComponents);
      },
      updateModelComponents () {
        //need to be able to tell if component has already been initiated or not.
        if(this.getAttributes()['data-isCreated'] === 'true') {
          this.processUpdate()
        } else {
          if (this.changed.attributes && (this.changed.attributes['data-n_columns'] || this.changed.attributes['data-n_rows'])) {
            let calcWidth =  Number(this.getAttributes()['data-n_columns'])*46
            let setWidth = calcWidth < 900? calcWidth:900;
            let calcHeight = Number(this.getAttributes()['data-n_rows'])*22
            
            this.setStyle({width:  setWidth + "px", height: calcHeight + "px"})

            let header = this.getAttributes()['data-hasHeader'];
            let cells = [];
            let headers = [];
            for (let index = 0; index < this.getAttributes()['data-n_columns']; index++) {
              cells.push({ type: 'cell' });
            }
            for (let index = 0; index < this.getAttributes()['data-n_rows']; index++) {
              this.components().add({ type: 'row', components: cells }, { at: -1 });
            }
            if(header) {
              for (let index = 0; index < this.getAttributes()['data-n_columns']; index++) {
                headers.push({ type: 'th' });
              }
              this.components().add({ type: 'row', components: headers }, { at: 0 });
            }
          }
        }
      },
      processUpdate(){
          if (this.changed.attributes) {
            if(this.checkHeaderExists() != this.changed.attributes['data-hasHeader']) {
              if(this.changed.attributes['data-hasHeader']) {
                let headers = [];
                for (let index = 0; index < this.getAttributes()['data-n_columns']; index++) {
                  headers.push({ type: 'th' });
                }
                this.components().add({ type: 'row', components: headers }, { at: 0 });
              } else {
                this.components().at(0).remove()
              }
            }
          }
      },
      checkHeaderExists(){
        return this.components().at(0).components().at(0).is('th')
      },
    },
  });
};
