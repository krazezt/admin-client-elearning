import * as React from "react";
import LibraryAdd from "@mui/icons-material/LibraryAdd";
import Swal from "sweetalert2";
import {
  Button,
  Modal,
  Fade,
  Box,
  Typography,
  Backdrop,
  TextField,
} from "@mui/material";
import api from "../../assets/JsonData/api.json";
import Axios from "axios";

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

export default function AddCategoryButton() {
  const [categoryName, setCategoryName] = React.useState("");
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

  const submit = async () => {
    try {
      const res = await Axios.post(
        api.find((e) => e.pages === "Category").api["add-category"],
        { name: categoryName },
        axiosConfig
      );

      handleClose();
      if (res.data.code === 200)
        Swal.fire(
          "完成",
          "カテゴリーを追加しました",
          "success"
        ).then(() => window.location.reload());
      else
        Swal.fire(
          "エラー",
          "エラーが発生しました。再度お試しください。",
          "error"
        );
    } catch (error) {
      Swal.fire(
        "エラー",
        "エラーが発生しました。再度お試しください。",
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
            <Typography textAlign="center" variant="h6">
              カテゴリー追加
            </Typography>
            <br />
            <TextField
              fullWidth
              label="カテゴリー名"
              variant="standard"
              onChange={(e) => setCategoryName(e.target.value)}
            />
            <Box width="100%" pt={2} textAlign="right">
              <Button variant="outlined" onClick={handleClose}>
                キャンセル
              </Button>{" "}
              <Button variant="contained" onClick={submit}>
                登録
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <Button
        size="large"
        variant="contained"
        startIcon={<LibraryAdd />}
        onClick={handleOpen}
      >
        追加
      </Button>
    </>
  );
}
