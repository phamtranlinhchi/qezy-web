import * as React from "react";
import {
  DataGrid,
  gridPageSizeSelector,
  GridPagination,
  gridFilteredTopLevelRowCountSelector,
  useGridRootProps,
} from "@mui/x-data-grid";
import { GridToolbar, gridClasses, useGridApiContext, useGridSelector } from '@mui/x-data-grid';
import { Box, TablePaginationProps } from '@mui/material';
import MuiPagination from '@mui/material/Pagination'
import { alpha, styled } from '@mui/material/styles'
import UserInformation from "./Logout/UserInformation";
const ODD_OPACITY = 0.2;
const pageSizeOptions = [5, 25, 50, 100]
const getPageCount = (rowCount: number, pageSize: number): number => {
  if (pageSize > 0 && rowCount > 0) {
    return Math.ceil(rowCount / pageSize);
  }

  return 0;
};
function Pagination({
  page,
  onPageChange,
  className,
  handlePage,
  handleTotalPage
}: Pick<TablePaginationProps, "page" | "onPageChange" | "className"> & { handlePage: (newPage: number) => void, handleTotalPage: (totalPages: number) => void }) {
  const apiRef = useGridApiContext();
  const pageSize = useGridSelector(apiRef, gridPageSizeSelector);
  const visibleTopLevelRowCount = useGridSelector(
    apiRef,
    gridFilteredTopLevelRowCountSelector
  );
  const rootProps = useGridRootProps();
  const pageCount = getPageCount(
    rootProps.rowCount ?? visibleTopLevelRowCount,
    pageSize
  );
  handleTotalPage(pageCount)
  return (
    <MuiPagination
      color="primary"
      className={className}
      count={pageCount}
      page={page + 1}
      onChange={(event: any, newPage: number) => {
        onPageChange(event as any, newPage - 1)
        handlePage(newPage)
      }}
    />
  );
}
// * update 

// * update
function CustomPagination(props: { handlePage: (newPage: number) => void, handleTotalPage: (totalPages: number) => void }) {
  const { handlePage, handleTotalPage, ...otherProps } = props;
  return (
    <GridPagination
      ActionsComponent={(paginationProps) => (
        <Pagination handleTotalPage={handleTotalPage} handlePage={handlePage}  {...paginationProps} />
      )}
      {...otherProps}
    />
  );
}
const StripedDataGrid = styled(DataGrid)(({ theme }) => ({
  [`& .${gridClasses.cell}`]: {
    whiteSpace: "normal !important",
    wordWrap: "break-word !important",
  },
  [`& .${gridClasses.columnHeader}`]: {
    backgroundColor: "#1976d2",
    fontWeight: 'bold',
    fontSize: '15px',
    color: "#fff"
  },
  [`& .${gridClasses.row}.even`]: {
    backgroundColor: theme.palette.grey[200],
    '&:hover, &.Mui-hovered': {
      backgroundColor: alpha(theme.palette.primary.main, ODD_OPACITY),
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&.Mui-selected': {
      backgroundColor: alpha(
        theme.palette.primary.main,
        ODD_OPACITY + theme.palette.action.selectedOpacity,
      ),
      '&:hover, &.Mui-hovered': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          ODD_OPACITY +
          theme.palette.action.selectedOpacity +
          theme.palette.action.hoverOpacity,
        ),
        // Reset on touch devices, it doesn't add specificity
        '@media (hover: none)': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            ODD_OPACITY + theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  },
}));
export default function StripedDataTable({ handleTotalPage, hiddenFooter = false, disableVirtualization = false, getHeight = true, autoHeight = false, checkboxSelection = true, onSelectionModelChange, onChangePageSizeOptions, handlePage, columns, rows, loading, rowCount }: { hiddenFooter?: boolean, handleTotalPage?: (totalPages: number) => void, onChangePageSizeOptions?: (pageSizeOption: number) => void, getHeight?: boolean, autoHeight?: boolean, disableVirtualization?: boolean, handlePage: (newPage: number) => void, columns: any, onSelectionModelChange?: any, rows: any, checkboxSelection?: boolean, loading: boolean, rowCount?: number }) {
  React.useEffect(() => {
    if (rowCount !== undefined && rowCount !== null) {
      setPaginationModel(prevState => ({ ...prevState, page: 0 }));
    }
  }, [rowCount]);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 5
  });
  if (onChangePageSizeOptions) {
    onChangePageSizeOptions(paginationModel.pageSize)
  }

  const { role } = UserInformation();
  const safeHandleTotalPage = handleTotalPage || (() => { 
    // 
  });

  return (
    <Box style={{ height: "80vh", width: "100%", overflowY: "scroll" }}>
      <StripedDataGrid
        density={"compact"}
        getRowHeight={getHeight ? () => 'auto' : undefined}
        rows={rows}
        autoHeight={autoHeight}
        rowCount={rowCount}
        loading={loading}
        pageSizeOptions={pageSizeOptions}
        paginationModel={paginationModel}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'odd' : 'even'}
        onRowSelectionModelChange={onSelectionModelChange}
        checkboxSelection={checkboxSelection}
        columns={columns}
        hideFooter={hiddenFooter}
        slots={{
          toolbar: role === "ZMI.GlobalAdmin" ? GridToolbar : undefined,
          pagination: () => <CustomPagination handleTotalPage={safeHandleTotalPage} handlePage={handlePage} />
        }}
        keepNonExistentRowsSelected
        disableVirtualization={disableVirtualization ? true : false}
      />
    </Box>
  );
}

