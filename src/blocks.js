export default (editor, options = {}) => {
  const bm = editor.BlockManager;
  
  bm.add('table-block', {
    label: 'Table',
    category: 'Basic',
    attributes: {
      class: 'fa fa-table'
    },
    content: {
      type: 'customTable',
    },
    activate: true,
  });
};
