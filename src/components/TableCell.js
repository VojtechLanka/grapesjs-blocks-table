import $ from "jquery";

export default (comps, config) => {
  const type = "tbl-cell";
  const cellsResizable = config.cellsResizable;

  comps.addType(type, {
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

  comps.addType('th', {
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
