import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Alert,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  SwapHoriz as MigrationIcon,
  Storage as StorageIcon,
  Cloud as CloudIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { migracionDatos } from '../../services/migracionDatos';
import { Loading } from '../../components';

interface EstadoAnalisis {
  pouchdb: { total: number; licencias: any[] };
  backend: { total: number; licencias: any[] };
  conflictos: string[];
}

export const MigracionLicenciasPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [analisis, setAnalisis] = useState<EstadoAnalisis | null>(null);
  const [resultadoMigracion, setResultadoMigracion] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Analizar datos al cargar el componente
  useEffect(() => {
    analizarDatos();
  }, []);

  const analizarDatos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resultado = await migracionDatos.analizarDatos();
      setAnalisis(resultado);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const ejecutarMigracion = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resultado = await migracionDatos.migrarLicencias({
        sobreescribir: true,
        crearBackup: true,
        validarDatos: true,
      });
      setResultadoMigracion(resultado);

      // Reanalizar datos después de la migración
      await analizarDatos();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const ejecutarMigracionConUI = async () => {
    await migracionDatos.migrarConUI();
    await analizarDatos();
  };

  const limpiarPouchDB = async () => {
    setIsLoading(true);
    try {
      await migracionDatos.limpiarPouchDB();
      await analizarDatos();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Loading loading={isLoading} />

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Encabezado */}
        <Box display="flex" alignItems="center" mb={4}>
          <MigrationIcon sx={{ mr: 2, fontSize: 40, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Migración de Licencias
          </Typography>
        </Box>

        <Typography variant="body1" color="text.secondary" mb={4}>
          Herramienta para migrar licencias desde PouchDB local hacia el backend integrado.
          Esta migración es necesaria para usar las nuevas funcionalidades del sistema.
        </Typography>

        {/* Alertas */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {resultadoMigracion && (
          <Alert
            severity={resultadoMigracion.exito ? 'success' : 'warning'}
            sx={{ mb: 3 }}
          >
            Migración completada: {resultadoMigracion.migradas} licencias migradas
            {resultadoMigracion.errores.length > 0 && ` con ${resultadoMigracion.errores.length} errores`}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Panel de Análisis */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📊 Análisis de Datos
                </Typography>

                {analisis ? (
                  <Box>
                    {/* PouchDB */}
                    <Box display="flex" alignItems="center" mb={2}>
                      <StorageIcon sx={{ mr: 1, color: 'orange' }} />
                      <Typography variant="body1">
                        PouchDB Local:
                        <Chip
                          label={`${analisis.pouchdb.total} licencias`}
                          size="small"
                          color={analisis.pouchdb.total > 0 ? 'warning' : 'default'}
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Box>

                    {/* Backend */}
                    <Box display="flex" alignItems="center" mb={2}>
                      <CloudIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography variant="body1">
                        Backend API:
                        <Chip
                          label={`${analisis.backend.total} licencias`}
                          size="small"
                          color="primary"
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Box>

                    {/* Conflictos */}
                    <Box display="flex" alignItems="center" mb={2}>
                      <WarningIcon sx={{ mr: 1, color: analisis.conflictos.length > 0 ? 'error' : 'success' }} />
                      <Typography variant="body1">
                        Conflictos:
                        <Chip
                          label={`${analisis.conflictos.length} detectados`}
                          size="small"
                          color={analisis.conflictos.length > 0 ? 'error' : 'success'}
                          sx={{ ml: 1 }}
                        />
                      </Typography>
                    </Box>

                    {/* Lista de conflictos */}
                    {analisis.conflictos.length > 0 && (
                      <Accordion>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography variant="body2" color="error">
                            Ver conflictos detectados
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List dense>
                            {analisis.conflictos.map((conflicto, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <ErrorIcon color="error" fontSize="small" />
                                </ListItemIcon>
                                <ListItemText primary={conflicto} />
                              </ListItem>
                            ))}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    )}
                  </Box>
                ) : (
                  <Typography color="text.secondary">
                    Analizando datos...
                  </Typography>
                )}

                <Box mt={2}>
                  <Button
                    variant="outlined"
                    onClick={analizarDatos}
                    disabled={isLoading}
                    fullWidth
                  >
                    🔄 Reanalizar Datos
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Panel de Acciones */}
          <Grid item xs={12} md={6}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🚀 Acciones de Migración
                </Typography>

                <Grid container spacing={2}>
                  {/* Migración con UI */}
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={ejecutarMigracionConUI}
                      disabled={isLoading || !analisis || analisis.pouchdb.total === 0}
                      startIcon={<MigrationIcon />}
                      fullWidth
                      size="large"
                    >
                      Migrar con Asistente
                    </Button>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Recomendado: Migración guiada con confirmaciones
                    </Typography>
                  </Grid>

                  {/* Migración directa */}
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      onClick={ejecutarMigracion}
                      disabled={isLoading || !analisis || analisis.pouchdb.total === 0}
                      startIcon={<CloudIcon />}
                      fullWidth
                    >
                      Migración Directa
                    </Button>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Para usuarios avanzados
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                  </Grid>

                  {/* Limpiar PouchDB */}
                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={limpiarPouchDB}
                      disabled={isLoading || !analisis || analisis.pouchdb.total === 0}
                      startIcon={<DeleteIcon />}
                      fullWidth
                    >
                      Limpiar PouchDB
                    </Button>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }} color="error">
                      ⚠️ Solo después de migrar exitosamente
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Panel de Estado de Migración */}
          {resultadoMigracion && (
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  📋 Resultado de Migración
                </Typography>

                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    {resultadoMigracion.exito ? (
                      <CheckCircleIcon color="success" fontSize="large" />
                    ) : (
                      <ErrorIcon color="error" fontSize="large" />
                    )}
                  </Grid>
                  <Grid item xs>
                    <Typography variant="body1">
                      <strong>Estado:</strong> {resultadoMigracion.exito ? 'Exitosa' : 'Con errores'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {resultadoMigracion.migradas} licencias migradas exitosamente
                    </Typography>
                  </Grid>
                </Grid>

                {resultadoMigracion.errores.length > 0 && (
                  <Accordion sx={{ mt: 2 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography color="error">
                        {resultadoMigracion.errores.length} errores encontrados
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List dense>
                        {resultadoMigracion.errores.map((error: string, index: number) => (
                          <ListItem key={index}>
                            <ListItemIcon>
                              <ErrorIcon color="error" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary={error} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                )}

                <Box mt={2}>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => {
                      const reporte = migracionDatos.generarReporte(resultadoMigracion);
                      const blob = new Blob([reporte], { type: 'text/markdown' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `reporte_migracion_${new Date().toISOString().split('T')[0]}.md`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    Descargar Reporte
                  </Button>
                </Box>
              </Paper>
            </Grid>
          )}

          {/* Información adicional */}
          <Grid item xs={12}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>💡 Información importante:</strong>
              </Typography>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>La migración es un proceso de una sola vez</li>
                <li>Se creará un backup automático antes de migrar</li>
                <li>Los datos duplicados serán sobrescritos si se confirma</li>
                <li>Después de migrar exitosamente, puedes limpiar PouchDB</li>
              </ul>
            </Alert>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};