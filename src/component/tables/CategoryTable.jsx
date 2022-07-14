import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Axios from "axios";
import api from "../../assets/JsonData/api.json";
import Swal from "sweetalert2";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Modal,
  Backdrop,
  Fade,
  TextField,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AddCategoryButton from "../buttons/AddCategoryButton";

function createData(categoryId, categoryName) {
  return {
    categoryId,
    categoryName,
  };
}

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "15px",
  boxShadow: 24,
  p: 4,
};

const headCells = [
  {
    id: "categoryName",
    numeric: false,
    disablePadding: true,
    label: "Category Name",
    sortable: true,
  },
  {
    id: "categoryId",
    numeric: false,
    disablePadding: true,
    label: "Category ID",
    sortable: true,
  },
  {
    id: "categoryId",
    numeric: false,
    disablePadding: true,
    label: "",
    sortable: false,
  },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell, index) => (
          <TableCell
            key={index}
            align="center"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : null}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token-admin")}`,
    },
  };

  const deleteSelectedCategories = async () => {
    try {
      let kt = true;
      await Promise.all(
        props.selected.map(async (item) => {
          const res = await Axios.delete(
            api.find((e) => e.pages === "Category").api["delete-category"] +
              item +
              "/delete",
            axiosConfig
          );
          if (res.data.code !== 200) kt = false;
        })
      );

      handleClose();
      if (kt)
        Swal.fire(
          "Done",
          "Categories has been deleted successfully",
          "success"
        ).then(() => window.location.reload());
      else
        Swal.fire(
          "Error",
          "Something happened, check infomations and try again, glhf!",
          "error"
        );
    } catch (error) {
      Swal.fire(
        "Error",
        "Something happened, check infomations and try again, glhf!",
        "error"
      );
    }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Typography
              textAlign="center"
              variant="h4"
              fontWeight="bold"
              color="red"
            >
              Delete all selected categories?
            </Typography>
            <Box width="100%" pt={2} textAlign="center">
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>{" "}
              <Button variant="contained" onClick={deleteSelectedCategories}>
                Confirm
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            Categories
          </Typography>
        )}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton onClick={handleOpen}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function CategoryTable(props) {
  const rows = props.categories.map((item) => createData(item.id, item.name));

  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("categoryId");
  const [selected, setSelected] = React.useState([]);
  const [edittingCategory, setEdittingCategory] = React.useState({
    id: "",
    name: "",
  });
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.categoryId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, categoryId) => {
    const selectedIndex = selected.indexOf(categoryId);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, categoryId);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openEditModal = (categoryId) => {
    setEdittingCategory({ ...edittingCategory, id: categoryId });
    handleOpen();
  };

  const submitEdit = async () => {
    console.log(edittingCategory);
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token-admin")}`,
      },
    };

    try {
      const res = await Axios.put(
        api.find((e) => e.pages === "Category").api["edit-category"] +
          edittingCategory.id +
          "/edit",
        { name: edittingCategory.name },
        axiosConfig
      );
      handleClose();

      if (res.data.code === 200)
        Swal.fire(
          "Done",
          "Category has been updated successfully",
          "success"
        ).then(() => window.location.reload());
      else
        Swal.fire(
          "Error",
          "Something happened, check infomations and try again, glhf!",
          "error"
        );
    } catch (error) {
      Swal.fire(
        "Error",
        "Something happened, check infomations and try again, glhf!",
        "error"
      );
    }
  };

  const isSelected = (categoryId) => selected.indexOf(categoryId) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Typography textAlign="center" variant="h6">
              Edit category
            </Typography>
            <br />
            <TextField
              fullWidth
              label="New category name..."
              variant="standard"
              onChange={(e) =>
                setEdittingCategory({
                  ...edittingCategory,
                  name: e.target.value,
                })
              }
            />
            <Box width="100%" pt={2} textAlign="right">
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>{" "}
              <Button variant="contained" onClick={submitEdit}>
                Confirm
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            selected={selected}
          />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.categoryId);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.categoryId)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={index}
                        selected={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="h6">
                            {row.categoryName}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography>{row.categoryId}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            onClick={() => openEditModal(row.categoryId)}
                          >
                            <BorderColorIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <AddCategoryButton />
      </Box>
    </>
  );
}
