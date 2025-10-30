import React, { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Box,
    Breadcrumbs,
    Button,
    Chip,
    Container,
    Link,
    Paper,
    Typography,
} from '@mui/material';
import {
    BusinessCenter as BusinessCenterIcon,
    NavigateNext as NavigateNextIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
} from '@mui/icons-material';
import { AccountInfoDisplay, EditAccountForm } from '../../components/account';
import { Loading } from '../../components/Loading';
import { useAccount, useAppDispatch, useAppSelector } from '../../hooks';
import { removeAccountActive } from '../../store';

const getCategoryColor = (code: string): 'success' | 'primary' | 'warning' => {
    switch (code) {
        case 'A':
            return 'success';
        case 'B':
            return 'primary';
        case 'C':
            return 'warning';
        default:
            return 'primary';
    }
};

const getCategoryLabel = (code: string): string => {
    switch (code) {
        case 'A':
            return 'Productores Agropecuarios';
        case 'B':
            return 'Ingenieros Agrónomos';
        case 'C':
            return 'Bancos / Seguros';
        default:
            return code;
    }
};

export const EditAccountPage: React.FC = () => {
    // const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { updateAccount } = useAccount();
    const { accountActive } = useAppSelector((state) => state.account);
    const [isLoading, setIsLoading] = useState(false);

    // Estados para campos editables
    const [formValues, setFormValues] = useState({
        status: '',
        startDateLicence: '',
        endDateLicence: '',
        isLicenceMultipleCountry: false,
    });

    // Estado para detectar cambios
    const [hasChanges, setHasChanges] = useState(false);
    const [initialValues, setInitialValues] = useState(formValues);

    useEffect(() => {
        if (accountActive) {
            const values = {
                status: accountActive.status,
                startDateLicence: accountActive.startDateLicence,
                endDateLicence: accountActive.endDateLicence,
                isLicenceMultipleCountry: accountActive.isLicenceMultipleCountry,
            };
            setFormValues(values);
            setInitialValues(values);
        }
    }, [accountActive]);

    // Detectar cambios
    useEffect(() => {
        const changed =
            formValues.status !== initialValues.status ||
            formValues.startDateLicence !== initialValues.startDateLicence ||
            formValues.endDateLicence !== initialValues.endDateLicence ||
            formValues.isLicenceMultipleCountry !== initialValues.isLicenceMultipleCountry;
        setHasChanges(changed);
    }, [formValues, initialValues]);

    const handleChangeStatus = (value: string | null) => {
        if (value) {
            setFormValues((prev) => ({ ...prev, status: value }));
        }
    };

    const handleChangeDate = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeCheckbox = (_event: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        setFormValues((prev) => ({ ...prev, isLicenceMultipleCountry: checked }));
    };

    const canSave = () => {
        return (
            formValues.status !== '' &&
            formValues.startDateLicence !== '' &&
            formValues.endDateLicence !== '' &&
            hasChanges
        );
    };

    const handleSave = async () => {
        if (!accountActive?.accountId) return;

        setIsLoading(true);
        try {
            const success = await updateAccount(accountActive.accountId, formValues);
            if (success) {
                navigate('/accounts');
            }
        } catch (error) {
            console.error('Error updating account:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        dispatch(removeAccountActive());
        navigate('/accounts');
    };

    useEffect(() => {
        return () => {
            dispatch(removeAccountActive());
        };
    }, [dispatch]);

    if (!accountActive) {
        return (
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Typography variant="h6" color="text.secondary" textAlign="center">
                    No se encontró la cuenta. Redirigiendo...
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            {isLoading && <Loading loading={true} />}

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
                <Typography color="text.primary">Editar Cuenta</Typography>
            </Breadcrumbs>

            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Box>
                    <Box display="flex" alignItems="center" gap={2}>
                        <BusinessCenterIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h4" fontWeight="600">
                                Editar Cuenta
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
                                {accountActive.denomination} ({accountActive.accountReference})
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                    <Chip
                        label={`Categoría ${accountActive.category}`}
                        color={getCategoryColor(accountActive.category)}
                        sx={{ fontWeight: 'bold' }}
                    />
                    <Typography variant="caption" color="text.secondary">
                        {getCategoryLabel(accountActive.category)}
                    </Typography>
                </Box>
            </Box>

            {/* Información de la Cuenta (Readonly) */}
            <Box sx={{ mb: 4 }}>
                <AccountInfoDisplay account={accountActive} />
            </Box>

            {/* Formulario Editable */}
            <Box sx={{ mb: 4 }}>
                <EditAccountForm
                    status={formValues.status}
                    startDateLicence={formValues.startDateLicence}
                    endDateLicence={formValues.endDateLicence}
                    isLicenceMultipleCountry={formValues.isLicenceMultipleCountry}
                    onChangeStatus={handleChangeStatus}
                    onChangeDate={handleChangeDate}
                    onChangeCheckbox={handleChangeCheckbox}
                />
            </Box>

            {/* Botones de Acción */}
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        variant="outlined"
                        color="inherit"
                        size="large"
                        startIcon={<CancelIcon />}
                        onClick={handleCancel}
                    >
                        Cancelar
                    </Button>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        {hasChanges && (
                            <Typography variant="body2" color="warning.main" fontWeight={500}>
                                Tienes cambios sin guardar
                            </Typography>
                        )}
                        <Button
                            variant="contained"
                            color="success"
                            size="large"
                            startIcon={<SaveIcon />}
                            onClick={handleSave}
                            disabled={!canSave()}
                        >
                            Guardar Cambios
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};
