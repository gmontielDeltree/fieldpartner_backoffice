import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useCountry, useForm, useLicences } from "../../hooks";
import { Box, Button } from "@mui/material";
import {
    AssignmentTurnedIn as AssignmentTurnedInIcon,
    Business as BusinessIcon,
    Badge as BadgeIcon,
    BadgeOutlined,
} from "@mui/icons-material";
import { CompanyForm, GeneralInfoForm, CategoryLicenceForm } from "../../components/account";
import { FormActions, FormStepper, PageContainer, PageHeader, ValuePill } from "../../components";
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
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
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
                            onCheckingEmail={setIsCheckingEmail}
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
            handleCheckboxChange,
            setIsCheckingEmail,
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
                            formValues.user?.password?.trim() !== '' &&
                            !isCheckingEmail
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
            <Loading key="loading-new-customer" loading={isLoading || loadingLic || isCheckingEmail} />
            <PageContainer maxWidth={1180}>
                <PageHeader
                    icon={<BadgeOutlined />}
                    eyebrow="Usuarios y cuentas · Cuentas"
                    title="Nueva cuenta"
                    meta={<ValuePill tone="accent">Modo creación</ValuePill>}
                    description="Crea una nueva cuenta cliente en el sistema"
                    onBack={onClickCancel}
                />

                {
                    steps.length > 0 && (
                        <FormStepper
                            activeStep={indexStep}
                            sx={{ '& .MuiStepper-root': { maxWidth: 680 } }}
                            steps={steps.map((step) => ({
                                text: step.label,
                                optional: (
                                    <Box component="span" sx={{ display: 'block', fontSize: 11.5, color: 'var(--ink-3)', whiteSpace: 'nowrap' }}>
                                        {step.description}
                                    </Box>
                                ),
                            }))}
                        />
                    )
                }

                {getStepContent(indexStep)}

                {/* Botones de acción */}
                <FormActions>
                    <Button
                        variant="outlined"
                        onClick={indexStep !== 0 ? handleBack : onClickCancel}
                    >
                        {indexStep !== 0 ? "Volver" : "Cancelar"}
                    </Button>
                    {indexStep < steps.length - 1 && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleNext}
                            disabled={!canGoNext()}
                        >
                            Siguiente
                        </Button>
                    )}
                    {indexStep === steps.length - 1 && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={onClickAdd}
                        >
                            Guardar cuenta
                        </Button>
                    )}
                </FormActions>
            </PageContainer>
        </>
    );
};
