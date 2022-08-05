import CustomTable from './CustomTable';
import CustomRow from './CustomRow';
import CustomCellHeader from './CustomCellHeader';
import CustomCell from './CustomCell';

export default (editor, options = {}) => {
  const domComponents = editor.DomComponents;

  CustomTable(domComponents, options);
  CustomRow(domComponents, options);
  CustomCellHeader(domComponents, options);
  CustomCell(domComponents, options);
};
