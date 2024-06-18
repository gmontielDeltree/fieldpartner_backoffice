import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useForm, useUser } from "../../hooks";
import { UserDto } from "../../types";
import { Loading, UserForm } from "../../components";
import { removeUserActive } from "../../store/user";
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";

const initialForm: UserDto = {
  name: "",
  lastName: "",
  email: "",
  password: "",
  isAdmin: false,
};

export const UserPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth); // sesion del usuario
  const { userActive } = useAppSelector((state) => state.user);// Alta de usuario

  const { formValues, setFormValues, handleInputChange, reset } =
    useForm<UserDto>(initialForm);

  const { isLoading, createUser, updateUser } = useUser();

  const handleAddNewUser = () => {
    createUser(formValues);
    reset();
  };

  const handleUpdateUser = () => {
    if (!formValues.id) return;
    updateUser(formValues.id, formValues);
  };

  const onClickCancel = () => {
    dispatch(removeUserActive());
    navigate("/list-user");
  };

  const handleChangeAdmin = () =>
    setFormValues({ ...formValues, isAdmin: !formValues.isAdmin });

  useEffect(() => {
    if (userActive)
      setFormValues({
        ...userActive,
        previousPassword: "",
        newPassword: "",
      });
    else setFormValues(initialForm);
  }, [userActive, setFormValues]);

  useEffect(() => {
    return () => {
      dispatch(removeUserActive());
    };
  }, [dispatch]);

  return (
    <>
      <Loading key="loading-new-customer" loading={isLoading} />
      <Container maxWidth="md" sx={{ mb: 4 }}>
        <Box
          component="div"
          display="flex"
          alignItems="center"
          sx={{ ml: { sm: 2 }, pt: 2 }}
        >
          <PersonIcon />
          <Typography variant="h5" sx={{ ml: { sm: 2 } }}>
            Usuarios-Backoffice
          </Typography>
        </Box>

        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center" sx={{ my: 3 }}>
            {userActive ? "Editar" : "Nuevo"} usuairo
          </Typography>
          {user?.isAdmin && (
            <FormControlLabel
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                mb: 2,
              }}
              control={
                <Switch
                  checked={formValues.isAdmin}
                  onChange={() => handleChangeAdmin()}
                  defaultChecked
                />
              }
              label="Full Admin"
            />
          )}
          <UserForm
            key="users"
            // user={formValues}
            {...formValues}
            isNewUser={!userActive}
            setUser={handleInputChange}
          />
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="space-around"
            sx={{ mt: { sm: 5 } }}
          >
            <Grid item xs={12} sm={3} key="grid-back">
              <Button onClick={() => onClickCancel()}>Cancelar</Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={userActive ? handleUpdateUser : handleAddNewUser}
                // fullWidth
              >
                {!userActive ? "Guardar" : "Actualizar"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};
