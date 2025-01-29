import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { toast, Toaster } from "sonner";
import ExportTable from "../../components/ExportTable";
import AdminTable from "../../components/AdminTable";
import { AuthContext } from "../../contexts/auth";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getMyFeedbacks = async (id) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/feedback/getfeedbackbyid/${id}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
const AddFeedBackFunc = async (data) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/feedback/sendFeedback`,
      data
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

const AddNewFeedBack = ({ onClose }) => {
  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  console.log("Got htererere: ", user?.PatientID);
  const [feedbackData, setFeedbackData] = useState({
    patientID: user?.PatientID,
    date: "",
    content: "",
    toWhom: "",
  });

  const AddNewFeedbackMutation = useMutation({
    mutationFn: AddFeedBackFunc,
    onSuccess: () => {
      toast.success("Successfully added feedback.");
      queryClient.invalidateQueries("myfeedbacks");
      onClose();
    },
    onError: () => {
      toast.error("Error while adding feedback.");
      onClose();
    },
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFeedbackData({
      ...feedbackData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("the feedback: ", feedbackData);
    AddNewFeedbackMutation.mutate(feedbackData);
  };
  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ bgcolor: "#154C79", color: "white" }}>
        Create New Feedback
      </DialogTitle>
      <DialogContent className="mt-16">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Patient Id"
              name="pateintId"
              value={feedbackData.patientID}
              fullWidth
              aria-readonly
              onChange={changeHandler}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Date"
              name="date"
              type="date"
              value={feedbackData.date}
              fullWidth
              onChange={changeHandler}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Content"
              name="content"
              value={feedbackData.content}
              fullWidth
              onChange={changeHandler}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="To Whom"
              name="toWhom"
              value={feedbackData.toWhom}
              fullWidth
              onChange={changeHandler}
            />
          </Grid>

          <DialogActions>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Create
            </Button>
            <Button onClick={onClose} variant="outlined" color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

const columns = [
  { label: "Feedback ID", field: "feedbackID" },
  { label: "Date", field: "date" },
  { label: "Content", field: "content" },
  { label: "To", field: "toWhom" },
];

const Feedback = () => {
  let data = [];
  const { user } = useContext(AuthContext);
  const id = user.PatientID;

  const { data: myFeedbackData, isLoading: myFeedbackDataLoading } = useQuery({
    queryKey: ["myfeedbacks", id],
    queryFn: () => getMyFeedbacks(id),
  });
  console.log("the data is: ", myFeedbackData);

  const [feedbackModal, setFeedbackModal] = useState(false);

  const closeFeedbackModal = () => {
    setFeedbackModal(false);
  };

  return (
    <>
      {/* <div className="mx-10 mt-20">
        <Toaster position="top-right" richcolors />
        <div className="flex justify-center items-center">
          <h1 className="m-5 text-5xl font-semibold text-gray-800">
            Feedbacks
          </h1>
          <button
            // onClick={() => setCreateNewAppointment(true)}
            className="text-gray-900 bg-green-400 hover:bg-green-700 hover:text-white rounded-lg text-lg p-5 h-8 ms-auto inline-flex justify-center items-center"
          >
            Add My Feedback
          </button>
        </div>
        <div>
              </div>
            </div>
         */}
      <>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Toaster position="top-right" />

          {/* Title */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={5}
          >
            <h1 className="m-5 text-5xl font-semibold text-gray-800">
              Feedbacks
            </h1>
          </Box>
          <Box mb={5}>
            <div className="flex justify-between">
              <h3 className="m-5 text-5xl font-semibold text-gray-800">
                My Feedback List
              </h3>
              <div className="flex">
                {/* <Typography>
                  <ExportTable data={data} fileName="Feedback from patient" />
                </Typography> */}
                <div className="mx-5">
                  <Button
                    variant="outlined"
                    onClick={() => setFeedbackModal(true)}
                  >
                    Add My Feedback
                  </Button>
                </div>
              </div>
            </div>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <AdminTable data={myFeedbackData?.data} columns={columns} />
              </Grid>
            </Grid>
          </Box>
        </Container>
        {feedbackModal && <AddNewFeedBack onClose={closeFeedbackModal} />}
      </>
    </>
  );
};

export default Feedback;
