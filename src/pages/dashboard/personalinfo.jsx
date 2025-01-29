import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
  Grid,
  Box,
  Typography,
} from "@mui/material";
// import { apiUtility } from "../../components/repo/api";
import { AuthContext } from "../../contexts/auth";
import SnackBarShow from "../../components/SnackBarShow";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const updatePhonenumberAndEmail = async (data) => {
  try {
    const id = data.id;
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/patient/updatePatient/${id}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const PersonalInfo = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState(user);
  const [newPassword, setNewPassword] = useState({
    confirmPassword: "",
    oldPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [theData, setTheData] = useState({
    Email: "",
    phoneNumber: "",
  });

  const updatePhonenumberAndEmailMutation = useMutation({
    mutationFn: updatePhonenumberAndEmail,
    onSuccess: () => {
      toast.success("Updated Succssfully");
    },
  });

  // // Handle password change
  const handlePasswordChange = (e) => {
    setNewPassword({
      ...newPassword,
      [e.target.name]: e.target.value,
    });
  };

  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.newPassword !== newPassword.confirmPassword) {
      setMessage("Passwords do not match.");
      setError(true);
      return;
    }
    const datatosend = {
      oldPassword: newPassword.oldPassword,
      newPassword: newPassword.newPassword,
    };
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/patient/changePassword/${
          user.PatientID
        }`,
        datatosend
      );
      if (response) {
        setMessage(response.message);
        setError(false);
        setNewPassword({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage(data.message || "Error changing password.");
        setError(true);
      }
    } catch (err) {
      console.log("error: ", err);
      setMessage("Failed to change password.");
      setError(true);
    }
  };

  const emaPhChange = (e) => {
    const { name, value } = e.target;
    setTheData({
      ...theData,
      [name]: value,
    });
  };
  const emailAndPhoneHandler = (e) => {
    e.preventDefault();
    theData.id = formData.PatientID;
    console.log("the data: ", theData);
    updatePhonenumberAndEmailMutation.mutate(theData);
  };

  return (
    <>
      <Box m={2} className="mt-10">
        <Typography variant="h3" component="h1" color="textPrimary">
          Personal Information
        </Typography>
      </Box>
      <Box p={2}>
        {/* User Information Section */}
        <Typography variant="h5" color="textPrimary" mt={5}>
          User Information
        </Typography>

        <Grid container spacing={3} mt={2}>
          {/* User Name */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Patient ID"
              value={formData.PatientID}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Full Name */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Full Name"
              value={formData.fullName}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Email"
              value={formData.Email}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={2}>
          {/* Phone Number */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Phone Number"
              value={formData.phoneNumber}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Department */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Gender"
              value={formData.Gender}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>

          {/* Role */}
          <Grid item xs={12} md={4}>
            <TextField
              label="City"
              value={formData.City}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Date Of Birth"
              value={formData.DateOfBirth}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} mt={2}>
          {/* Health Center ID */}
          <Grid item xs={12} md={4}>
            <TextField
              label="Health Center ID"
              value={formData.healthCenterId}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>
        <form onSubmit={emailAndPhoneHandler} className="mt-10">
          <h1 className="text-[25px] text-gray-800">
            Update Phone number and Email
          </h1>
          <Grid container spacing={3}>
            {/* Phone Number */}
            <Grid item xs={12} md={4}>
              <TextField
                name="phoneNumber"
                label="Phone Number"
                value={theData.phoneNumber}
                fullWidth
                onChange={emaPhChange}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                name="Email"
                label="Email"
                value={theData.Email}
                fullWidth
                onChange={emaPhChange}
              />
            </Grid>
          </Grid>
          <div className="flex justify-center mt-5">
            <Button variant="outlined" type="submit" color="warning">
              Update
            </Button>
          </div>
        </form>
        <Typography>Additional Information</Typography>
        <Grid container spacing={3} mt={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Emergency Contact"
              value={formData.EmergencyContact}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="House Number"
              value={formData.houseNumber}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Sub City"
              value={formData.subCity}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
        </Grid>

        {/* Change Password Section */}
        <form onSubmit={handlePasswordSubmit} mt={5}>
          <Typography variant="h5" color="textPrimary" mt={5}>
            Change Password
          </Typography>

          <Grid container spacing={3} mt={2}>
            {/* Current Password */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Current Password"
                name="oldPassword"
                type="password"
                value={newPassword.oldPassword}
                onChange={handlePasswordChange}
                fullWidth
                required
              />
            </Grid>

            {/* New Password */}
            <Grid item xs={12} md={4}>
              <TextField
                label="New Password"
                name="newPassword"
                type="password"
                value={newPassword.newPassword}
                onChange={handlePasswordChange}
                fullWidth
                required
              />
            </Grid>

            {/* Confirm Password */}
            <Grid item xs={12} md={4}>
              <TextField
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={newPassword.confirmPassword}
                onChange={handlePasswordChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end" mt={5}>
            <Button variant="contained" color="primary" type="submit">
              Change Password
            </Button>
          </Box>
        </form>
      </Box>

      {/* Snackbar for feedback */}
      {SnackBarShow(message, setMessage, error)}
    </>
  );
};

export default PersonalInfo;
