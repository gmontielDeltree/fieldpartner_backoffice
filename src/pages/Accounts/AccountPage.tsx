import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAccount, useCountry, useForm, useLicences } from "../../hooks";
import {
    Button,
    Container,
    Paper,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    Breadcrumbs,
    Link,
    Chip,
} from "@mui/material";
import {
    BusinessCenter as BusinessCenterIcon,
    NavigateNext as NavigateNextIcon,
    AssignmentTurnedIn as AssignmentTurnedInIcon,
    Business as BusinessIcon,
    Badge as BadgeIcon,
} from "@mui/icons-material";
import { CompanyForm, GeneralInfoForm, CategoryLicenceForm } from "../../components/account";
import { Account } from "../../interfaces/account";
import { EnumCategoryAccount, EnumCategoryCod, EnumClaveTributaria, EnumLicenceType } from "../../types";
import { Loading } from '../../components/Loading';
import { getShortDate } from "../../helpers/dates";
import { uploadFile } from "../../helpers/fileUpload";

const initialForm: Account = {
    accountReference: "",
    licenceNumber: "",
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
    associateUser: false,
    emailToAssociate: "",
};

export const AccountPage: React.FC = () => {

    const navigate = useNavigate();
    // const dispatch = useAppDispatch();
    const { createAccount } = useAccount();
    const [indexStep, setIndexStep] = useState(0);
    const { country, isLoading, getCountry } = useCountry();
    const { licences, isLoading: loadingLic, getLicences } = useLicences();
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const {
        formValues,
        setFormValues,
        handleInputChange,
        handleCheckboxChange,
        reset
    } = useForm<Account>(initialForm);

    // Determinar si el paso 3 (Compañía) debe mostrarse
    const isCategoryA = formValues.category === EnumCategoryCod.A;

    // Definir steps dinámicamente
    const steps = useMemo(() => {
        const baseSteps = [
            { label: 'Información General', icon: BadgeIcon, description: 'Datos básicos de identificación' },
            { label: 'Categoría y Licencia', icon: AssignmentTurnedInIcon, description: 'Tipo de cuenta y configuración' },
        ];

        // Solo agregar paso de compañía si es categoría A
        if (isCategoryA) {
            baseSteps.push({
                label: 'Datos de Compañía',
                icon: BusinessIcon,
                description: 'Información corporativa',
            });
        }

        return baseSteps;
    }, [isCategoryA]);

    const getStepContent = useMemo(
        () => (step: number) => {
            switch (step) {
                case 0:
                    return (
                        <GeneralInfoForm
                            key="general-info"
                            countries={country}
                            formValues={formValues}
                            setFormValues={setFormValues}
                            handleInputChange={handleInputChange}
                        />
                    );
                case 1:
                    return (
                        <CategoryLicenceForm
                            key="category-licence"
                            licences={licences}
                            formValues={formValues}
                            setFormValues={setFormValues}
                            handleInputChange={handleInputChange}
                            handleCheckboxChange={handleCheckboxChange}
                        />
                    );
                case 2:
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

    // Función para validar si se puede avanzar al siguiente paso
    const canGoNext = () => {
        switch (indexStep) {
            case 0: // Información General
                return (
                    formValues.accountReference.trim() !== '' &&
                    formValues.denomination.trim() !== '' &&
                    formValues.country !== '' &&
                    formValues.status !== ''
                );
            case 1: { // Categoría y Licencia
                const hasCategory = formValues.category !== '';
                const hasLicence = formValues.licenceType !== '' && formValues.licence !== '';

                // Si es categoría A, validar usuario
                if (isCategoryA) {
                    if (formValues.associateUser) {
                        // Validar email de asociación
                        return hasCategory && hasLicence && formValues.emailToAssociate.trim() !== '';
                    } else {
                        // Validar nuevo usuario
                        return (
                            hasCategory &&
                            hasLicence &&
                            formValues.user?.username?.trim() !== '' &&
                            formValues.user?.email?.trim() !== '' &&
                            formValues.user?.password?.trim() !== ''
                        );
                    }
                }
                return hasCategory && hasLicence;
            }
            default:
                return true;
        }
    };

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

    const onClickCancel = () => {
        navigate("/accounts");
    };

    useEffect(() => {
        getCountry();
        getLicences();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Loading key="loading-new-customer" loading={isLoading || loadingLic} />

                {/* Breadcrumbs */}
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" />}
                    aria-label="breadcrumb"
                    sx={{ mb: 2 }}
                >
                    <Link
                        component={RouterLink}
                        underline="hover"
                        color="inherit"
                        to="/accounts"
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <BusinessCenterIcon sx={{ mr: 0.5 }} fontSize="small" />
                        Cuentas
                    </Link>
                    <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
                        Nueva Cuenta
                    </Typography>
                </Breadcrumbs>

                {/* Header */}
                <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                    <Box display="flex" alignItems="center">
                        <BusinessCenterIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h4" fontWeight="600">
                                Nueva Cuenta
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Crea una nueva cuenta cliente en el sistema
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        label="Modo Creación"
                        color="success"
                        variant="outlined"
                    />
                </Box>

                <Paper
                    elevation={3}
                    sx={{ my: { xs: 3, md: 3 }, p: { xs: 3, md: 4 } }}
                >
                    {
                        steps.length > 0 && (
                            <Box sx={{ mb: 4 }}>
                                <Stepper
                                    activeStep={indexStep}
                                    alternativeLabel
                                    sx={{ width: "100%", margin: "auto" }}
                                >
                                    {steps.map((step, index) => {
                                        const StepIconComponent = step.icon;
                                        return (
                                            <Step key={step.label}>
                                                <StepLabel
                                                    StepIconComponent={() => (
                                                        <Box
                                                            sx={{
                                                                width: 40,
                                                                height: 40,
                                                                borderRadius: '50%',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                bgcolor: indexStep >= index ? 'primary.main' : 'grey.300',
                                                                color: 'white',
                                                                transition: 'all 0.3s',
                                                            }}
                                                        >
                                                            <StepIconComponent />
                                                        </Box>
                                                    )}
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight={indexStep === index ? 600 : 400}
                                                    >
                                                        {step.label}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {step.description}
                                                    </Typography>
                                                </StepLabel>
                                            </Step>
                                        );
                                    })}
                                </Stepper>
                            </Box>
                        )
                    }
                    {getStepContent(indexStep)}

                    {/* Botones de acción */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 4,
                            pt: 3,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={indexStep !== 0 ? handleBack : onClickCancel}
                            size="large"
                        >
                            {indexStep !== 0 ? "Volver" : "Cancelar"}
                        </Button>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {indexStep < steps.length - 1 && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    disabled={!canGoNext()}
                                    size="large"
                                >
                                    Siguiente
                                </Button>
                            )}
                            {indexStep === steps.length - 1 && (
                                <Button
                                    variant="contained"
                                    color="success"
                                    onClick={onClickAdd}
                                    size="large"
                                >
                                    Guardar Cuenta
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};
