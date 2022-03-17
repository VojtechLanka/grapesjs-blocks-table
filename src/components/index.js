import CustomTable from "./CustomTable";
import TableCell from "./TableCell";

export default (editor, config = {}) => {
  const domc = editor.DomComponents;
  config.modal = editor.Modal;

  CustomTable(domc, config);
  TableCell(domc, config);
};
