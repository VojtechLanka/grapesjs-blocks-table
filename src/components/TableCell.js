import $ from 'jquery';

export default (domComponents, options) => {
  const cellsResizable = options.cellsResizable;

  domComponents.addType(options.componentCell, {
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

  domComponents.addType(options.componentCellHeader, {
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
