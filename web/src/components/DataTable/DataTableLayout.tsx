import { Table, TableContainer } from "@mui/material";
import { ReactNode } from "react";
import { SxProps, Theme } from "@mui/system";

type DataTableLayoutProps = {
  children: ReactNode;
  tableContainerSx?: SxProps<Theme>;
};

export const DataTableLayout = ({ children, tableContainerSx }: DataTableLayoutProps) => {
  return (
    <TableContainer
      sx={{
        overflowY: "auto",
        overflowX: "auto",
        boxShadow: "inset 0 6px 6px -8px rgba(0,0,0,0.35)",
        ...tableContainerSx,
      }}
    >
      <Table
        stickyHeader
        sx={{
          "& .MuiTableCell-stickyHeader": {
            backgroundColor: "background.paper",
            zIndex: 2,
          },
        }}
      >
        {children}
      </Table>
    </TableContainer>
  );
};
