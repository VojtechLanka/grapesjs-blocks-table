import onLoad from './onLoad'
import components from './components';
import blocks from './blocks';
import commands from './commands';

export default (editor, opts = {}) => {
  const options = {
    ...{
      tblResizable: true,
      cellsResizable:true,
      traitsPanelId:"#open-tm"
    },
    ...opts,
  };

  onLoad();
  
  components(editor, options)
  blocks(editor, options)
  commands(editor, options)
};

