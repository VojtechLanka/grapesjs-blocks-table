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
        // toolbar: [
        
        //   {
        //     attributes: {class: 'fa fa-cog', title: 'Settings'},
        //     command: 'open-table-settings-modal',
        //   }
        // ],
        
        //classes: ['custom-table-component'],
      },
      
      // initToolbar() {
        
      //   typeOpt.prototype.initToolbar.apply(this, arguments);
      //   const tb = this.get('toolbar');
      //   tb.push({
      //     command: 'open-table-settings-modal',
      //     attributes: {class: 'fa fa-cog', title: 'Settings'},
      //   });
      //   this.set('toolbar', tb);
      // },
      init() {
        this.listenTo(this, 'change:attributes', this.updateModelComponents);
      },
      updateModelComponents () {
        //need to be able to tell if component has already been initiated or not.
        if(this.getAttributes()['data-isCreated'] === 'true')
        {
          this.processUpdate()
        }
        else 
        {
          console.log("this is a creation")
          if (this.changed.attributes && (this.changed.attributes['data-n_columns'] || this.changed.attributes['data-n_rows'])) 
          {
            let header = this.getAttributes()['data-hasHeader'];
            let cells = [];
            let headers = [];
            for (let index = 0; index < this.getAttributes()['data-n_columns']; index++) {
              cells.push({ type: 'cell' });
            }
            for (let index = 0; index < this.getAttributes()['data-n_rows']; index++) {
              this.components().add({ type: 'row', components: cells }, { at: -1 });
            }
            if(header)
            {
              for (let index = 0; index < this.getAttributes()['data-n_columns']; index++) {
                headers.push({ type: 'th' });
              }
              this.components().add({ type: 'row', components: headers }, { at: 0 });
            }
          }
        }
      },
      processUpdate(){
          console.log(this.getAttributes()['data-isCreated'])
          console.log("this is an edit, these attributes changes: ")
          console.log(this.changed.attributes)
          console.log("hasHeader: "+ this.checkHeaderExists())
          if (this.changed.attributes)
          {
            if(this.checkHeaderExists() != this.changed.attributes['data-hasHeader'])
            {
              if(this.changed.attributes['data-hasHeader'])
              {
                let headers = [];
                for (let index = 0; index < this.getAttributes()['data-n_columns']; index++) {
                  headers.push({ type: 'th' });
                }
                this.components().add({ type: 'row', components: headers }, { at: 0 });
              } 
              else 
              {
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
