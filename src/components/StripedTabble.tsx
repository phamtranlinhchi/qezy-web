import { DataGrid, GridPagination, GridToolbar, gridClasses } from '@mui/x-data-grid';
import { Box, TablePaginationProps } from '@mui/material';
import MuiPagination from '@mui/material/Pagination'
import { alpha, styled } from '@mui/material/styles'
const ODD_OPACITY = 0.2;

function Pagination({
    page,
    onPageChange,
    className,
    pageCount,
}: Pick<TablePaginationProps, 'page' | 'onPageChange' | 'className'> & { pageCount: any }) {
    return (
        <MuiPagination
            color={"primary"}
            className={className}
            count={pageCount}
            page={page + 1}
            onChange={(event: any, newPage: number) => {
                onPageChange(event, newPage - 1);
            }}
        />
    );
}

function CustomPagination(props: { pageCount: number }) {
    const { pageCount, ...otherProps } = props;
    return <GridPagination ActionsComponent={(paginationProps) => <Pagination {...paginationProps} pageCount={pageCount} />} {...otherProps} />;
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

export default function StripedDataTableClone({ rows, columns, loading, onSelectionModelChange, pageCount, checkboxSelection = true, autoHeight = false, onPageChange }: { rows: any[], columns: any[], loading?: boolean, onSelectionModelChange?: any, checkboxSelection?: boolean, autoHeight?: boolean, pageCount: number, onPageChange: (page: number) => void }) {
    return (
        <Box sx={autoHeight ? {
            width: '100%',
        } : {
            width: '100%',
            height: "80vh"
        }}>

            <StripedDataGrid
                density={"compact"}
                getRowHeight={() => 'auto'}
                autoHeight={autoHeight}
                loading={loading}
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 20 },
                    },
                }}
                slots={{
                    toolbar: GridToolbar,
                    pagination: (props) => <CustomPagination {...props} pageCount={pageCount} onPageChange={onPageChange} />
                }}
                pageSizeOptions={[20]}
                checkboxSelection={checkboxSelection}
                getRowClassName={(params) => params.indexRelativeToCurrentPage % 2 === 0 ? 'odd' : 'even'}
                onRowSelectionModelChange={onSelectionModelChange}
            />
        </Box>
    );
}