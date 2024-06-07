import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useForm } from "../../hooks";
import { removeUserActive } from "../../store/user";
import {
    Button,
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import { AccountBox as AccountBoxIcon } from "@mui/icons-material";
import { CompanyForm, LicenceForm } from "../../components/account";

const initialForm = {
    denominacion: "",
    pais: "",
    email: "",
    password: "",
    status: "",
    categoria: "",
    fechaValidezInicio: "",
    fechaValidezFin: "",
    tipoLicencia: "",
    licencia: "",
    cantidadLicenciasPermitidas: 0,
    nombre: "",
    licenciaMultiPais: false,
};

const steps = ["Licencia", "Compañia"];
export const AccountPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { userActive } = useAppSelector((state) => state.user);// Alta de usuario
    const [indexStep, setIndexStep] = useState(0);

    const { formValues, setFormValues, handleInputChange, reset } = useForm(initialForm);

    const getStepContent = useMemo(
        () => (step: number) => {
            switch (step) {
                case 0:
                    return (
                        <LicenceForm
                            key="info-licence"

                        />
                    );
                case 1:
                    return (
                        <CompanyForm
                            key="info-company"

                        />
                    );
                default:
                    throw new Error("Unknown step");
            }
        },
        []
    );

    const handleNext = () => {
        setIndexStep(indexStep + 1);
    };

    const handleBack = () => {
        setIndexStep(indexStep - 1);
    };


    const onClickAdd = () => {
        // createUser(formulario);
        reset();
    };

    const onClickUpdate = () => {
        // updateUser(formulario.id, formulario);
    };

    const onClickCancel = () => {
        dispatch(removeUserActive());
        navigate("/list-user");
    };


    //   useEffect(() => {
    //     if (userActive)
    //       setFormValues({
    //         ...userActive,
    //       });
    //     else setFormValues(initialForm);
    //   }, [userActive, setFormulario]);

    useEffect(() => {
        return () => {
            dispatch(removeUserActive());
        };
    }, [dispatch]);

    return (
        <>
            {/* <Loading key="loading-new-customer" loading={isLoading} /> */}
            <Container maxWidth="lg" sx={{ mb: 4 }}>
                <Box
                    component="div"
                    display="flex"
                    alignItems="center"
                    sx={{ ml: { sm: 2 }, pt: 2 }}
                >
                    <AccountBoxIcon fontSize="large" />
                    <Typography variant="h5" sx={{ ml: { sm: 2 } }}>
                        Cuentas
                    </Typography>
                </Box>

                <Paper
                    variant="outlined"
                    sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
                >
                    <Box
                        sx={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            backgroundImage: "url(/assets/new-customer.jpg)",
                            backgroundRepeat: "no-repeat",
                            backgroundColor: (t) =>
                                t.palette.mode === "light"
                                    ? t.palette.grey[50]
                                    : t.palette.grey[900],
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            margin: "auto",
                        }}
                    />
                    <Typography component="h1" variant="h4" align="center" sx={{ my: 1 }}>
                        {userActive ? "Editar" : "Nueva"} Cuenta Cliente
                    </Typography>
                    <Stepper activeStep={indexStep} sx={{
                        pt: 3,
                        pb: 3,
                        mb: 2,
                        width: "60%",
                        margin: "auto"
                    }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {getStepContent(indexStep)}
                    <Grid
                        container
                        spacing={1}
                        alignItems="center"
                        justifyContent="space-around"
                        sx={{ mt: { sm: 5 } }}
                    >
                        <Grid item xs={12} sm={3} key="grid-back">
                            <Button onClick={indexStep !== 0 ? handleBack : onClickCancel}>
                                {indexStep !== 0 ? "Volver" : "Cancelar"}
                            </Button>
                        </Grid>
                        <Grid item xs={12} sm={3} key="grid-next">
                            {!(indexStep === steps.length - 1) && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleNext}
                                // fullWidth
                                >
                                    Siguiente
                                </Button>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={
                                    userActive ? onClickUpdate : onClickAdd
                                }
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
