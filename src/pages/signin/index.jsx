import React, { useState, useContext } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { RoleBasedViews } from "../view";
import { AuthContext } from "../../contexts/auth";
import { Link, useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    patientId: "",
    password: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!credentials.patientId || !credentials.password) {
        setError("Please enter username and password");
        return;
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/patient/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );
      const awaitedUser = await response.json();
      console.log("user infor: ", response.data);
      console.log("user infor: ", awaitedUser);

      if (awaitedUser.status) {
        // const result = await response.json();
        // console.log('JSON response',result);

        // window.localStorage.setItem("token", result.data.token);

        const roleBasedView = RoleBasedViews["patient"];
        if (roleBasedView && roleBasedView.routes) {
          const roles_menu = Object.keys(roleBasedView?.routes)?.map((key) => {
            const { icons, label } = roleBasedView.routes[key];
            return { Icon: icons, label, to: key };
          });
          console.log("log all data: ", roles_menu);

          if (roles_menu?.length > 0) {
            const user = awaitedUser.data;
            console.log("user to set: ", user);
            setUser(user);
            window.localStorage.setItem("user", JSON.stringify(user));
            setToken(awaitedUser.data.token);
            navigate(roles_menu[0].to);
          } else {
            setError(
              "No menu access has been granted to you. Please contact your administrator."
            );
          }
        } else {
          setError("Unknown role. Please contact your administrator.");
        }
      } else {
        setError("Invalid username or password.");
      }
    } catch (error) {
      console.log("error", error);

      setError("Unable to connect to server.", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          paddingTop: 6,
          paddingBottom: 10,
          paddingLeft: 5,
          paddingRight: 5,
          mt: 8,
          borderRadius: 2,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "primary.main" }}>
          Login
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "text.secondary", mb: 3 }}>
          Welcome to the Patient Information Management System
        </Typography>
        <form onSubmit={submitHandler}>
          <TextField
            fullWidth
            label="Patient Id"
            name="patientId"
            variant="outlined"
            onChange={changeHandler}
            sx={{ mb: 3 }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            onChange={changeHandler}
            sx={{ mb: 3 }}
          />
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <FormControlLabel
              control={<Checkbox />}
              label="Keep me signed in"
            />
            <Typography
              variant="body2"
              sx={{ color: "warning.main", cursor: "pointer" }}
              onClick={(e) => navigate("/resetPassword")}
            >
              Forgot password?
            </Typography>
          </Box>
          {error && (
            <Typography
              variant="body2"
              color="error"
              sx={{ textAlign: "center", mb: 2 }}
            >
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5 }}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
          {/* <Link to="/dashboard">Login</Link> */}
        </form>
        <Typography variant="body2" className="float-end" sx={{ mt: 3 }}>
          Need help?
        </Typography>
      </Paper>
    </Container>
  );
};

export default Signin;
