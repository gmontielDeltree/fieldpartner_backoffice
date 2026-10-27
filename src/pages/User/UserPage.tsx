import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useForm, useUser } from "../../hooks";
import { UserDto } from "../../types";
import { FormActions, FormCard, Loading, PageContainer, PageHeader, UserForm } from "../../components";
import { removeUserActive } from "../../store/user";
import {
  Button,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { PersonOutlineOutlined } from "@mui/icons-material";

const initialForm: UserDto = {
  username: "",
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
    if (!formValues._id) return;
    updateUser(formValues._id, formValues);
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
      <PageContainer maxWidth={980}>
        <PageHeader
          icon={<PersonOutlineOutlined />}
          eyebrow="Usuarios y cuentas · Usuarios Backoffice"
          title={userActive ? "Editar usuario" : "Nuevo usuario"}
          onBack={onClickCancel}
        />
        <FormCard
          title="Datos del usuario"
          icon={<PersonOutlineOutlined />}
          aside={
            user?.isAdmin && (
              <FormControlLabel
                sx={{ mr: 0 }}
                control={
                  <Switch
                    checked={formValues.isAdmin}
                    onChange={() => handleChangeAdmin()}
                    defaultChecked
                  />
                }
                label="Full Admin"
              />
            )
          }
        >
          <UserForm
            key="users"
            // user={formValues}
            {...formValues}
            isNewUser={!userActive}
            setUser={handleInputChange}
          />
        </FormCard>
        <FormActions>
          <Button variant="outlined" onClick={() => onClickCancel()}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={userActive ? handleUpdateUser : handleAddNewUser}
          // fullWidth
          >
            {!userActive ? "Guardar" : "Actualizar"}
          </Button>
        </FormActions>
      </PageContainer>
    </>
  );
};
