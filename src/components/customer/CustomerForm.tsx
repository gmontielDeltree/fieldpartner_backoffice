import React, { useMemo } from 'react';
import {
    Box,
    Container,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Button,
    Typography
} from '@mui/material';
import { AddressForm, InformationForm, UsersByCustomer } from '.';
import { useCustomer, useForm } from '../../hooks';
import { Customer } from '../../types';
import { Loading } from '..';

const steps = ['Informacion Basica', 'Direccion', 'Usuarios'];


const initialForm: Customer = {
    nombreCompleto: '',
    documento: '',
    telefono: '',
    email: '',
    tipoEntidad: 'fisica',
    razonSocial: '',
    tipoLicencia: 'LFPC05',
    descripcion: '',
    inicioLicencia: '',
    finLicencia: '',
    lenguaje: 'español',
    cuit: '',
    contactoPrincipal: '',
    contactoSecundario: '',
    sitioWeb: '',
    domicilio: '',
    localidad: '',
    cp: '',
    provincia: '',
    pais: '',
    usuario: {
        nombre: '',
        apellido: '',
        email: '',
        password: ''
    }
};

export const CustomerForm: React.FC = () => {


    const [activeStep, setActiveStep] = React.useState(0);
    const {
        formulario,
        setFormulario,
        handleInputChange,
        handleSelectChange,
        reset
    } = useForm<Customer>(initialForm);

    const { isLoading, createCustomer } = useCustomer();

    const handleNext = () => {
        setActiveStep(activeStep + 1);
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const getStepContent = useMemo(() => (step: number) => {
        switch (step) {
            case 0:
                return <InformationForm
                    key="information-customer"
                    customer={formulario}
                    handleInputChange={handleInputChange}
                    handleSelectChange={handleSelectChange} />;
            case 1:
                return <AddressForm
                    key="address-customer"
                    customer={formulario}
                    handleInputChange={handleInputChange} />;
            case 2:
                return <UsersByCustomer
                    key="users-customer"
                    customer={formulario}
                    setCustomer={setFormulario} />;
            default:
                throw new Error('Unknown step');
        }
    }, [formulario,
        setFormulario,
        handleInputChange,
        handleSelectChange]);

    const addNewCustomer = () => {
        createCustomer(formulario);
        reset();
    }

    return (
        <>
            <Loading
                key="loading-new-customer"
                loading={isLoading} />
            <Container maxWidth="md" sx={{ mb: 4 }}>
                <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                    <Box sx={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        backgroundImage: 'url(/assets/new-customer.jpg)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        margin: 'auto'
                    }} />
                    <Typography component="h1" variant="h4" align="center">
                        Nuevo cliente
                    </Typography>

                    <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 3, mb: 2 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    <>
                        {getStepContent(activeStep)}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {activeStep !== 0 && (
                                <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                                    Volver
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                onClick={(activeStep === steps.length - 1) ? addNewCustomer : handleNext}
                                sx={{ mt: 3, ml: 1 }}
                            >
                                {(activeStep === steps.length - 1) ? 'Agregar' : 'Siguiente'}
                            </Button>
                        </Box>
                    </>
                </Paper>
            </Container>
        </>
    );
}