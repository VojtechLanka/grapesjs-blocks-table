import onLoad from './onLoad'
import components from './components';
import blocks from './blocks';
import commands from './commands';

export default (editor, options = {}) => {
  const optionsDefault = {
    tblResizable: true,
    cellsResizable: true,
    componentCell: 'customCell',
    componentCellHeader: 'customHeaderCell',
    componentRow: 'customRow'
    }

  const optionsUpdated = {
    ...optionsDefault,
    ...options,
  };

  onLoad(editor, optionsUpdated);
  components(editor, optionsUpdated)
  blocks(editor, optionsUpdated)
  commands(editor, optionsUpdated)
};

