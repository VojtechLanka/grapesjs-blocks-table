import $ from 'jquery';

export default (domComponents, options) => {
  domComponents.addType(options.componentRow, {
    isComponent: el => el.tagName === 'TR',
    model: {
      defaults: {
        name: 'Row',
        tagName: 'tr',
        droppable: options.componentCell + ',' + options.componentCellHeader,
        draggable: false,
        classes: [],
      }
    },
  });
};
