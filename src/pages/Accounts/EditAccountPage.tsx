import React, { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Chip,
    Typography,
} from '@mui/material';
import { BadgeOutlined } from '@mui/icons-material';
import { EmptyState, FormActions, PageContainer, PageHeader } from '../../components';
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
            <PageContainer maxWidth={1180}>
                <EmptyState icon={<BadgeOutlined />} title="No se encontró la cuenta. Redirigiendo..." />
            </PageContainer>
        );
    }

    return (
        <>
            {isLoading && <Loading loading={true} />}
            <PageContainer maxWidth={1180}>
                <PageHeader
                    icon={<BadgeOutlined />}
                    eyebrow="Usuarios y cuentas · Cuentas"
                    title="Editar cuenta"
                    description={<>{accountActive.denomination} ({accountActive.accountReference})</>}
                    onBack={handleCancel}
                    actions={
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                            <Chip
                                label={`Categoría ${accountActive.category}`}
                                color={getCategoryColor(accountActive.category)}
                                sx={{ fontWeight: 600 }}
                            />
                            <Typography sx={{ fontSize: 12, color: 'var(--ink-3)' }}>
                                {getCategoryLabel(accountActive.category)}
                            </Typography>
                        </Box>
                    }
                />

                {/* Información de la Cuenta (Readonly) */}
                <Box sx={{ mb: 2 }}>
                    <AccountInfoDisplay account={accountActive} />
                </Box>

                {/* Formulario Editable */}
                <EditAccountForm
                    status={formValues.status}
                    startDateLicence={formValues.startDateLicence}
                    endDateLicence={formValues.endDateLicence}
                    isLicenceMultipleCountry={formValues.isLicenceMultipleCountry}
                    onChangeStatus={handleChangeStatus}
                    onChangeDate={handleChangeDate}
                    onChangeCheckbox={handleChangeCheckbox}
                />

                {/* Botones de Acción */}
                <FormActions
                    start={
                        hasChanges && (
                            <Typography sx={{ fontSize: 13, fontWeight: 500, color: 'var(--orange)' }}>
                                Tienes cambios sin guardar
                            </Typography>
                        )
                    }
                >
                    <Button
                        variant="outlined"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={!canSave()}
                    >
                        Guardar cambios
                    </Button>
                </FormActions>
            </PageContainer>
        </>
    );
};
