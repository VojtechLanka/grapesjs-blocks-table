import components from ".";
import * as traitsHelper from "../traitsHelper"
import * as tblHelper from "../tableHelper"

export default (comps, { modal, ...config }) => {
  const tblResizable = config.tblResizable;
  const nRows = "nRows"
  const nColumns = "nColumns"

  comps.addType('customTable', {
    isComponent: element => element.tagName === 'TABLE',
    model: {
      defaults: {
        nRows: 4,
        nColumns: 3,
        hasHeaders: false,
        tagName: 'table',
        droppable: true,
        resizable: tblResizable,
        traits: [
          {
            type: 'number',
            name: 'nColumns',
            label: 'Number of Columns',
            min: 1,
            changeProp: 1
          },
          {
            type: 'number',
            name: 'nRows',
            label: 'Number of Rows',
            min: 1,
            changeProp: 1
          },
          {
            type: 'checkbox',
            name: 'hasHeaders',
            label: 'Enable headers',
            changeProp: 1
          }
        ]
      },

      init() {
        if(!this.hasChildren()){
          this.createTable()
        }
        this.listenTo(this, 'change:nColumns', this.columnsChanged);
        this.listenTo(this, 'change:nRows', this.rowsChanged);
        this.listenTo(this, 'change:hasHeaders', this.headerChanged);
      },
      createTable(){
        let calcWidth =  Number(this.props().nColumns)*46
        let setWidth = calcWidth < 900? calcWidth:900;
        let calcHeight = Number(this.props().nRows)*22
        
        this.setStyle({width:  setWidth + "px", height: calcHeight + "px"})

        let cells = [];
        let header = this.props().hasHeader;
        let headers = [];
        for (let index = 0; index < this.props().nColumns; index++) {
          cells.push({ type: 'cell' });
        }
        for (let index = 0; index < this.props().nRows; index++) {
          this.components().add({ type: 'row', components: cells }, { at: -1 });
        }
        if(header) {
          for (let index = 0; index < this.props().nColumns; index++) {
            headers.push({ type: 'th' });
          }
          this.components().add({ type: 'row', components: headers }, { at: 0 });
        }
      },
      columnsChanged(selected, value, opts) {
        if(this.columnCount() === value)
          return  
        
        const baseDifference = value - this.columnCount();
        const difference = Math.abs(value - this.columnCount())
        if(baseDifference<0){
          for(let i=0;i<difference; i++){
            tblHelper.removeColumn(this, this.getLastColumnIndex())
          }
        } else {
          for(let i=0;i<difference; i++){
            tblHelper.insertColumn(this, this.columnCount())
          }
        }
      },
      rowsChanged(selected, value, opts) {
        if(this.rowCount() === value)
          return

        const baseDifference = value - this.rowCount();
        const difference = Math.abs(value - this.rowCount())
        if(baseDifference<0){
          for(let i=0;i<difference; i++){
            tblHelper.removeRow(this, this.getLastRowIndex())
          }
        } else {
          for(let i=0;i<difference; i++){
            tblHelper.insertRow(this, this.rowCount())
          }
        }
      },
      headerChanged(selected, value, opts) {
        if(this.checkHeaderExists() != this.props().hasHeaders) {
          if(this.props().hasHeaders) {
            let headers = [];
            for (let index = 0; index < this.props().nColumns; index++) {
              headers.push({ type: 'th' });
            }
            this.components().add({ type: 'row', components: headers }, { at: 0 });
          } else {
            this.components().at(0).remove()
          }
        }
      },
      checkHeaderExists(){
        return this.components().at(0).components().at(0).is('th')
      },
      hasChildren(){
        return this.components().length > 0
      },
      rowCount(){
        return this.components().length
      },
      columnCount(){
        return this.components().at(0).components().length
      },
      getLastRowIndex(){
        return this.rowCount() - 1
      },
      getLastColumnIndex(){
        return this.columnCount() - 1
      }
    },
  });
};
