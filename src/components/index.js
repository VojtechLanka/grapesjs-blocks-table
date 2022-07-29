import CustomTable from './CustomTable';
import TableCell from './TableCell';

export default (editor, options = {}) => {
  const domc = editor.DomComponents;

  CustomTable(domc, options);
  TableCell(domc, options);
};
