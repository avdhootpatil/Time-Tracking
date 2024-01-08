import { TableRow } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { tTheme } from "../components/theme";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: tTheme.palette.tableHeader,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    border: 0,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const dataTableStyles = {
  rows: {
    style: {
      minHeight: "34px", // override the row height
    },
  },
  headCells: {
    style: {
      minHeight: "34px", // override the row height
    },
  },
  headRow: {
    style: {
      minHeight: "34px",
      backgroundColor: "#3b444b",
      color: "#fff",
    },
  },
  cells: {
    style: {
      minHeight: "34px", // override the row height
      border: "none",
    },
  },
};
