/**
 * Página de detalle de cuenta
 * Muestra información completa de una cuenta con sus usuarios, compañías y licencias
 */

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Alert,
  Skeleton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Folder as LicenseIcon,
  Domain as DomainIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useCuentas } from '../hooks/useCuentas';
import { cuentasService } from '../services/cuentasService';
import {
  CuentaDto,
  UsuarioCuentaDto,
  CompaniaDto,
  // LicenciaPorCuentaDto,
  CategoriaCuenta,
  EstadoCuenta,
  CategoriasCuentaLabels,
  EstadosCuentaLabels,
  ColoresCategorias,
  ColoresEstados,
  LicenciaPorCuentaDto
} from '../types';
import { RUTAS_CUENTAS } from '../../shared/constants/routes';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cuenta-tabpanel-${index}`}
      aria-labelledby={`cuenta-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const DetalleCuentaPage: React.FC = () => {
  const navigate = useNavigate();
  const { cuentaId } = useParams<{ cuentaId: string }>();
  const { cuentaActiva, setCuentaActiva, irAEditarCuenta } = useCuentas();

  // Estados locales
  const [cuenta, setCuenta] = useState<CuentaDto | null>(cuentaActiva);
  const [usuarios, setUsuarios] = useState<UsuarioCuentaDto[]>([]);
  const [companias, setCompanias] = useState<CompaniaDto[]>([]);
  const [licencias, setLicencias] = useState<LicenciaPorCuentaDto[]>([]);
  const [isLoading, setIsLoading] = useState(!cuentaActiva);
  const [error, setError] = useState<string | null>(null);
  const [tabActiva, setTabActiva] = useState(0);

  // Cargar datos de la cuenta
  useEffect(() => {
    const cargarDatosCuenta = async () => {
      if (!cuentaId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Si no tenemos la cuenta activa, cargarla
        if (!cuenta) {
          const dataCuenta = await cuentasService.obtenerCuentaCompleta(cuentaId);
          if (!dataCuenta) {
            setError('Cuenta no encontrada');
            setIsLoading(false);
            return;
          }
          setCuenta(dataCuenta.cuenta);
          setCuentaActiva(dataCuenta.cuenta);
          setUsuarios(dataCuenta.usuarios);
          setCompanias(dataCuenta.companias);
          setLicencias(dataCuenta.licencias);
        }

      } catch (error: any) {
        setError(error.message || 'Error al cargar los datos de la cuenta');
      } finally {
        setIsLoading(false);
      }
    };

    cargarDatosCuenta();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Formatear fecha
   */
  const formatearFecha = (fechaISO: string): string => {
    try {
      return new Date(fechaISO).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  /**
   * Obtener información del país
   */
  const obtenerInfoPais = () => {
    if (cuenta?.paisId && typeof cuenta.paisId === 'object') {
      return `${cuenta?.paisId.descripcionES} (${cuenta.paisId.codigo})`;
    }
    return cuenta?.paisId || 'No especificado';
  };

  /**
   * Ir a editar
   */
  const handleEditar = () => {
    if (cuenta) {
      irAEditarCuenta(cuenta);
    }
  };

  /**
   * Volver atrás
   */
  const handleVolver = () => {
    navigate(RUTAS_CUENTAS.LISTA);
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Skeleton variant="rectangular" height={200} sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {Array.from(new Array(3)).map((_, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Skeleton variant="rectangular" height={300} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error || !cuenta) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error" action={
          <Button onClick={handleVolver}>Volver</Button>
        }>
          {error || 'Cuenta no encontrada'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleVolver}
            sx={{ mr: 3 }}
          >
            Volver
          </Button>
          <Box display="flex" alignItems="center" gap={2}>
            <BusinessIcon color="primary" fontSize="large" />
            <Box>
              <Typography variant="h4" component="h1" color="primary">
                {cuenta.referenciaCuenta}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {cuenta.denominacion}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<EditIcon />}
          onClick={handleEditar}
        >
          Editar Cuenta
        </Button>
      </Box>

      {/* Información general */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              Referencia
            </Typography>
            <Typography variant="h6">
              {cuenta.referenciaCuenta}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              Categoría
            </Typography>
            <Chip
              label={CategoriasCuentaLabels[cuenta.categoria as CategoriaCuenta]}
              color={ColoresCategorias[cuenta.categoria as CategoriaCuenta] as any}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              Estado
            </Typography>
            <Chip
              label={EstadosCuentaLabels[cuenta.estado as EstadoCuenta]}
              color={ColoresEstados[cuenta.estado as EstadoCuenta] as any}
              variant="filled"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="body2" color="text.secondary">
              País
            </Typography>
            <Typography variant="body1">
              <>{obtenerInfoPais()}</>
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Campos
            </Typography>
            <Typography variant="h6">
              {cuenta.contadorCampos}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Licencias
            </Typography>
            <Typography variant="h6">
              {cuenta.contadorLicencias}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Hectáreas
            </Typography>
            <Typography variant="h6">
              {cuenta.contadorHectareas}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Fecha de Creación
            </Typography>
            <Typography variant="body1">
              {formatearFecha(cuenta.fechaCreacion)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="text.secondary">
              Última Actualización
            </Typography>
            <Typography variant="body1">
              {formatearFecha(cuenta.fechaActualizacion)}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs con información detallada */}
      <Paper>
        <Tabs
          value={tabActiva}
          onChange={(_, newValue) => setTabActiva(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={`Usuarios (${usuarios.length})`} icon={<PersonIcon />} />
          <Tab label={`Compañías (${companias.length})`} icon={<DomainIcon />} />
          <Tab label={`Licencias (${licencias.length})`} icon={<LicenseIcon />} />
        </Tabs>

        {/* Panel de Usuarios */}
        <TabPanel value={tabActiva} index={0}>
          {usuarios.length === 0 ? (
            <Alert severity="info">
              No hay usuarios asociados a esta cuenta.
            </Alert>
          ) : (
            <List>
              {usuarios.map((usuario, index) => (
                <ListItem key={usuario._id} divider={index < usuarios.length - 1}>
                  <Avatar sx={{ mr: 2 }}>
                    <PersonIcon />
                  </Avatar>
                  <ListItemText
                    primary={usuario.nombreUsuario}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {usuario.email}
                        </Typography>
                        <Box display="flex" gap={1} mt={0.5}>
                          {usuario.esAdmin && (
                            <Chip label="Admin" size="small" color="primary" />
                          )}
                          {usuario.esUsuarioConLicenciaAdmin && (
                            <Chip label="Licencia Admin" size="small" color="secondary" />
                          )}
                          <Chip
                            label={usuario.estado}
                            size="small"
                            color={usuario.estado === 'ACTIVO' ? 'success' : 'default'}
                          />
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end">
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </TabPanel>

        {/* Panel de Compañías */}
        <TabPanel value={tabActiva} index={1}>
          {companias.length === 0 ? (
            <Alert severity="info">
              No hay compañías asociadas a esta cuenta.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {companias.map((compania) => (
                <Grid item xs={12} md={6} key={compania._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {compania.nombreFantasia}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {compania.razonSocial}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body2">
                        <strong>Código Tributario:</strong> {compania.codigoTributario}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Dirección:</strong> {compania.direccion}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Teléfono:</strong> {compania.telefono}
                      </Typography>
                      {compania.sitioWeb && (
                        <Typography variant="body2">
                          <strong>Sitio Web:</strong> {compania.sitioWeb}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Panel de Licencias */}
        <TabPanel value={tabActiva} index={2}>
          <Alert severity="info">
            Panel de licencias en desarrollo. Actualmente hay {cuenta.contadorLicencias} licencias asociadas.
          </Alert>
        </TabPanel>
      </Paper>
    </Container>
  );
};