import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useAppDispatch, useAppSelector, useForm, useUser } from "../../hooks";
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
  const { accounts, getAccounts } = useAccount();

  // GENERAL_ADMIN elige la cuenta destino; al ADMIN el back le fuerza su propia cuenta.
  const isGeneralAdmin = user?.role === "GENERAL_ADMIN";
  const canAssignAdmin = isGeneralAdmin || user?.role === "ADMIN";
  const [accountId, setAccountId] = useState("");

  const accountOptions = useMemo(
    () => accounts.map((a) => ({ id: a.id, denomination: a.denomination })),
    [accounts]
  );

  // Cargar cuentas solo cuando hace falta el selector (alta + GENERAL_ADMIN).
  useEffect(() => {
    if (isGeneralAdmin && !userActive) getAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGeneralAdmin, userActive]);

  const handleAddNewUser = () => {
    createUser({
      email: formValues.email,
      username: formValues.username,
      password: formValues.password,
      language: "es",
      accountId: isGeneralAdmin ? accountId : undefined,
      role: formValues.isAdmin ? "ADMIN" : "USER",
    });
    reset();
    setAccountId("");
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

  // Un GENERAL_ADMIN no puede dar de alta sin elegir cuenta.
  const createDisabled = !userActive && isGeneralAdmin && !accountId;

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
            canAssignAdmin && (
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
            showAccountSelector={isGeneralAdmin}
            accounts={accountOptions}
            accountId={accountId}
            onAccountChange={setAccountId}
          />
        </FormCard>
        <FormActions>
          <Button variant="outlined" onClick={() => onClickCancel()}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            disabled={createDisabled}
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
