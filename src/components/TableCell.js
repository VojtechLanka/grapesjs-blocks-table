import $ from "jquery";
import * as tblHelper from "../tableHelper"

export default (comps, config) => {
  const cellsResizable = config.cellsResizable;

  comps.addType(tblHelper.cellType, {
    isComponent: el => el.tagName === 'TD',
    model: {
      defaults: {
        name: 'Cell',
        tagName: 'td',
        draggable: false,
        removable: false,
        resizable: cellsResizable,
        classes: [],
      }
    },
    view: {
      onRender() {
        let aThis = this;
        $(this.$el).dblclick(function() {
          if ($(this).children().length === 0) {
            aThis.model.components().add({ type: 'text', content: 'Text' });
          }
        });
      },
    }
  });

  comps.addType(tblHelper.cellHeaderType, {
    isComponent: el => el.tagName === 'TH',
    model: {
      defaults: {
        name: 'Header Cell',
        tagName: 'th',
        draggable: false,
        removable: false,
        resizable: cellsResizable,
        classes: [],
      }
    },
    view: {
      onRender() {
        let aThis = this;
        $(this.$el).dblclick(function() {
          if ($(this).children().length === 0) {
            aThis.model.components().add({ type: 'text', content: 'Text' });
          }
        });
      },
    }
  });
};
