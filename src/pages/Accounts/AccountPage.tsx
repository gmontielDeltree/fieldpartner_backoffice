import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useAppDispatch, useAppSelector, useCountry, useForm, useLicences } from "../../hooks";
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
// import { AccountBox as AccountBoxIcon } from "@mui/icons-material";
import 'semantic-ui-css/semantic.min.css';
import { Icon } from "semantic-ui-react";
import { CompanyForm, LicenceForm } from "../../components/account";
import { Account } from "../../interfaces/account";
import { EnumCategoryAccount, EnumCategoryCod, EnumClaveTributaria, EnumLicenceType } from "../../types";
import { Loading } from '../../components/Loading';
import { getShortDate } from "../../helpers/dates";
import { uploadFile } from "../../helpers/fileUpload";
import { removeAccountActive } from "../../store";

const initialForm: Account = {
    accountReference: "",
    denomination: "",
    country: "",
    user: {
        email: "",
        password: "",
        username: "",
        isAdmin: true,
    },
    status: "",
    category: EnumCategoryAccount.A,
    startDateLicence: getShortDate(false, "-"),
    endDateLicence: getShortDate(false, "-"),
    licenceType: EnumLicenceType.L,
    licence: "",
    amountLicencesAllowed: 0,
    isLicenceMultipleCountry: false,
    fantasyName: "",
    companyLogo: "",
    socialReason: "",
    address: "",
    zipCode: "",
    locality: "",
    province: "",
    trybutaryCode: EnumClaveTributaria.CUIT,
    phone: "",
    website: "",
    // creationDate: getShortDate(),
    observation: "",
};

const initialSteps = ["Licencia", "Compañia"];
export const AccountPage: React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { createAccount, updateAccount } = useAccount();
    const { accountActive } = useAppSelector((state) => state.account);
    const [indexStep, setIndexStep] = useState(0);
    const [steps, setSteps] = useState(initialSteps);
    const { country, isLoading, getCountry } = useCountry();
    const { licences, isLoading: loadingLic, getLicences } = useLicences();
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const {
        category,
        formValues,
        setFormValues,
        handleInputChange,
        handleCheckboxChange,
        reset
    } = useForm<Account>(initialForm);
    const disabledCompany = (formValues.category !== Object.keys(EnumCategoryAccount)[0]);

    const getStepContent = useMemo(
        () => (step: number) => {
            switch (step) {
                case 0:
                    return (
                        <LicenceForm
                            key="info-licence"
                            countries={country}
                            licences={licences}
                            formValues={formValues}
                            setFormValues={setFormValues}
                            handleInputChange={handleInputChange}
                            // handleSelectChange={handleSelectChange}
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    );
                case 1:
                    return (
                        <CompanyForm
                            key="info-company"
                            formValues={formValues}
                            setFile={setLogoFile}
                            setFormValues={setFormValues}
                            handleInputChange={handleInputChange}
                        />
                    );
                default:
                    throw new Error("Unknown step");
            }
        },
        [
            formValues,
            country,
            licences,
            setLogoFile,
            setFormValues,
            handleInputChange,
            handleCheckboxChange
        ]
    );

    const handleNext = () => {
        setIndexStep(indexStep + 1);
    };

    const handleBack = () => {
        setIndexStep(indexStep - 1);
    };

    const initAddAcount = async () => {
        if (logoFile) await uploadFile(logoFile);
        if (await createAccount(formValues)) {
            navigate('/accounts');
            reset();
        }
    }

    const onClickAdd = () => initAddAcount();

    const initUpdateAccount = async () => {
        if (formValues.accountId) {
            const { isLicenceMultipleCountry, startDateLicence, endDateLicence, status } = formValues;
            if (await updateAccount(formValues.accountId,
                {
                    isLicenceMultipleCountry, startDateLicence, endDateLicence, status
                })) {
                navigate('/accounts');
                reset();
            }
        }
    }

    const onClickUpdate = () => initUpdateAccount();

    const onClickCancel = () => {
        dispatch(removeUserActive());
        navigate("/accounts");
    };

    useEffect(() => {
        if (accountActive)
            setFormValues({ ...accountActive });
        else
            setFormValues(initialForm);
    }, [accountActive, setFormValues]);

    useEffect(() => {
        if (category !== EnumCategoryCod.A) {
            setSteps([]);
        } else
            setSteps(initialSteps);
    }, [category])


    useEffect(() => {
        getCountry();
        getLicences();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        return () => {
            dispatch(removeAccountActive());
        };
    }, [dispatch]);

    return (
        <>
            <Container maxWidth="lg" sx={{ mb: 4 }}>
                <Loading key="loading-new-customer" loading={isLoading || loadingLic} />
                <Box
                    component="div"
                    display="flex"
                    alignItems="center"
                    sx={{ ml: { sm: 2 }, pt: 2 }}
                >
                    <Icon name="id card" size="huge" />
                    <Typography variant="h4" sx={{ ml: { sm: 2 } }}>
                        Cuentas
                    </Typography>
                </Box>

                <Paper
                    variant="outlined"
                    sx={{ my: { xs: 3, md: 3 }, p: { xs: 2, md: 3 } }}
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
                    <Typography component="h1" variant="h4" align="center" sx={{ my: 2 }}>
                        {accountActive ? "Editar" : "Nueva"} Cuenta Cliente
                    </Typography>
                    {
                        !accountActive && (
                            <Stepper activeStep={indexStep} sx={{
                                pt: 3,
                                pb: 3,
                                mb: 2,
                                width: "60%",
                                margin: "auto"
                            }}>
                                {steps.map((label, i) => (
                                    <Step key={label} disabled={i === 1}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                                ))}
                            </Stepper>
                        )
                    }
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
                            {!(indexStep === steps.length - 1 || !!accountActive) && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleNext}
                                    disabled={disabledCompany}
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
                                    accountActive ? onClickUpdate : onClickAdd
                                }
                            // fullWidth
                            >
                                {!accountActive ? "Guardar" : "Actualizar"}
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </>
    );
};
