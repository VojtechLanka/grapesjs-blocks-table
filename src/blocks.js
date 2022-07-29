export default (editor, options = {}) => {
  const blockManager = editor.BlockManager;
  
  blockManager.add('table-block', {
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
