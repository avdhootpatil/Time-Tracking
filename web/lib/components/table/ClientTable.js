"use client";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "../../styles/tableStyles";
import EmptyComponent from "../emptyComponent";
import StyledIconButton from "../styledIconButton";
import TableLoader from "../tableLoader";

function ClientTable({
  clients = [],
  onAdd = () => {},
  onEdit = () => {},
  onDelete = () => {},
  isLoading = false,
}) {
  return (
    <TableContainer
      sx={{
        borderRadius: "5px",
        backgroundColor: "white",
        borderBottom: "1px solid #ccc",
        borderLeft: "1px solid #ccc",
        borderRight: "1px solid #ccc",
        marginTop: "20px",
      }}
    >
      <Table sx={{ minWidth: 700 }} size="small">
        <TableHead className="background-color-light">
          <TableRow>
            <StyledTableCell sx={{ fontWeight: "bold" }}>
              Client Name
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: "bold" }}>
              Client Description
            </StyledTableCell>

            <StyledTableCell>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <StyledIconButton icon={<AddIcon />} onClick={onAdd} />
              </div>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clients.map((client, index) => (
            <StyledTableRow key={client.id} sx={{ height: "35px" }}>
              <StyledTableCell scope="row">{client.name}</StyledTableCell>
              <StyledTableCell scope="row">
                {client.description}
              </StyledTableCell>

              <StyledTableCell>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <EditIcon
                    sx={{
                      marginRight: "10px",
                      marginLeft: "10px",
                      color: "blue",
                      cursor: "pointer",
                      height: "18px",
                    }}
                    onClick={onEdit(index)}
                  />

                  <DeleteIcon
                    sx={{
                      color: "red",
                      cursor: "pointer",
                      height: "18px",
                    }}
                    onClick={onDelete(index)}
                  />
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      {isLoading ? (
        <TableLoader />
      ) : !clients.length ? (
        <EmptyComponent />
      ) : null}
    </TableContainer>
  );
}

export default ClientTable;
