import CustomTable from './CustomTable';
import TableCell from './TableCell';

export default (editor, options = {}) => {
  const domComponents = editor.DomComponents;

  CustomTable(domComponents, options);
  TableCell(domComponents, options);
};
