import $ from "jquery";

export default (comps, config) => {
  const type = "cell";
  const cellsResizable = config.cellsResizable;

  comps.addType(type, {
    isComponent: el => el.tagName === 'TD',
    model: {
      defaults: {
        tagName: 'td',
        draggable: false,
        removable: false,
        resizable: cellsResizable,
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
