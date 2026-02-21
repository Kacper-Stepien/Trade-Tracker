import { ChangeEvent, useState } from "react";
import { DEFAULT_ROWS_PER_PAGE } from "../constants/pagination";

export const usePagination = (initialRowsPerPage = DEFAULT_ROWS_PER_PAGE) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  const handlePageChange = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number(event.target.value));
    setPage(0);
  };

  return {
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    handlePageChange,
    handleRowsPerPageChange,
  };
};
