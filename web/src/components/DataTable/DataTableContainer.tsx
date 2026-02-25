import { Paper } from "@mui/material";
import { ReactNode } from "react";

type DataTableContainerProps = {
  children: ReactNode;
  pagination?: ReactNode;
};

export const DataTableContainer = ({ children, pagination }: DataTableContainerProps) => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {children}
      {pagination}
    </Paper>
  );
};
