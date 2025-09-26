import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  TableContainer,
  Paper,
  Chip,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DisplaySettings as DisplaySettingsIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";
import { useLicencias } from "../../hooks/useLicencias";
import { DataTable, ItemRow, Loading, SearchButton, SearchInput, TableCellStyled } from "../../components";
import { ColumnProps } from "../../types";
import { Licencia, TipoLicencia, TipoSistema } from "../../types/licencias.types";

const columnas: ColumnProps[] = [
  { text: "Código", align: "left" },
  { text: "Descripción", align: "left" },
  { text: "Tipo", align: "center" },
  { text: "Sistema", align: "center" },
  { text: "Máx. Unidades", align: "center" },
  { text: "Multi-País", align: "center" },
  { text: "Acciones", align: "right" },
];

export const ListaLicenciasPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    licencias,
    isLoading,
    error,
    cargarLicencias,
    buscarLicenciasConFiltros,
    irAEditarLicencia,
    irANuevaLicencia,
    confirmarEliminacion,
    limpiarErrores,
  } = useLicencias();

  const [filtroTexto, setFiltroTexto] = React.useState("");

  // Función para filtrar licencias localmente
  const filtrarLicencias = (licencias: Licencia[], filtro: string): Licencia[] => {
    if (!filtro.trim()) return licencias;

    const filtroNormalizado = filtro.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    return licencias.filter((licencia) => {
      const camposBusqueda = [
        licencia.codigoLicencia,
        licencia.descripcion,
        licencia.tipoLicencia,
        licencia.tipoSistema,
      ];

      return camposBusqueda.some((campo) =>
        campo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(filtroNormalizado)
      );
    });
  };

  // Manejar búsqueda
  const manejarBusqueda = () => {
    if (filtroTexto.trim() === "") {
      cargarLicencias();
    } else {
      // Buscar tanto localmente como en el servidor
      buscarLicenciasConFiltros({
        descripcion: filtroTexto,
      });
    }
  };

  // Función para obtener color del chip según el tipo
  const obtenerColorTipo = (tipo: TipoLicencia) => {
    switch (tipo) {
      case TipoLicencia.CAMPO:
        return "success";
      case TipoLicencia.LICENCIA:
        return "primary";
      case TipoLicencia.HECTAREA:
        return "warning";
      default:
        return "default";
    }
  };

  // Función para obtener color del chip según el sistema
  const obtenerColorSistema = (sistema: TipoSistema) => {
    switch (sistema) {
      case TipoSistema.FIELD_PARTNER:
        return "primary";
      case TipoSistema.AGRO_TOOLS:
        return "secondary";
      case TipoSistema.FARM_MANAGER:
        return "info";
      default:
        return "default";
    }
  };

  // Cargar licencias al montar el componente
  useEffect(() => {
    cargarLicencias();
  }, [cargarLicencias]);

  // Limpiar errores cuando cambie el error
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        limpiarErrores();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, limpiarErrores]);

  return (
    <>
      {isLoading && <Loading loading />}

      <Container maxWidth="lg" sx={{ ml: 0 }}>
        {/* Encabezado */}
        <Box
          component="div"
          display="flex"
          alignItems="center"
          sx={{ ml: { sm: 2 }, pt: 2 }}
        >
          <DisplaySettingsIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography component="h4" variant="h4" sx={{ ml: { sm: 1 } }}>
            Gestión de Licencias
          </Typography>
        </Box>

        {/* Mostrar error si existe */}
        {error && (
          <Box sx={{ mt: 2, mx: 2 }}>
            <Alert severity="error" onClose={limpiarErrores}>
              {error}
            </Alert>
          </Box>
        )}

        {/* Controles */}
        <Box component="div" sx={{ mt: 4 }}>
          <Grid
            container
            spacing={2}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 2, mt: { sm: 1 } }}
          >
            {/* Botón Nueva Licencia */}
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={irANuevaLicencia}
                startIcon={<AddIcon />}
                fullWidth
                sx={{ mb: 2 }}
              >
                Nueva Licencia
              </Button>
            </Grid>

            {/* Búsqueda */}
            <Grid item xs={12} sm={9}>
              <Grid container spacing={1} justifyContent="flex-end" alignItems="center">
                <Grid item xs={12} sm={7}>
                  <SearchInput
                    value={filtroTexto}
                    placeholder="Buscar por código, descripción, tipo..."
                    handleInputChange={(e) => setFiltroTexto(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && manejarBusqueda()}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <SearchButton
                    text="Buscar"
                    onClick={manejarBusqueda}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Tabla de licencias */}
          <Box component="div" sx={{ p: 1 }}>
            <TableContainer
              sx={{
                minHeight: "200px",
                maxHeight: "600px",
                overflow: "auto",
                mb: 3
              }}
              component={Paper}
              elevation={2}
            >
              <DataTable
                columns={columnas}
                isLoading={isLoading}
              >
                {filtrarLicencias(licencias, filtroTexto).map((licencia) => (
                  <ItemRow key={licencia.id} hover>
                    <TableCellStyled align="left">
                      <Typography variant="body2" fontWeight="medium">
                        {licencia.codigoLicencia}
                      </Typography>
                    </TableCellStyled>

                    <TableCellStyled align="left">
                      <Typography variant="body2">
                        {licencia.descripcion}
                      </Typography>
                    </TableCellStyled>

                    <TableCellStyled align="center">
                      <Chip
                        label={licencia.tipoLicencia}
                        size="small"
                        color={obtenerColorTipo(licencia.tipoLicencia)}
                        variant="outlined"
                      />
                    </TableCellStyled>

                    <TableCellStyled align="center">
                      <Chip
                        label={licencia.tipoSistema}
                        size="small"
                        color={obtenerColorSistema(licencia.tipoSistema)}
                        variant="filled"
                      />
                    </TableCellStyled>

                    <TableCellStyled align="center">
                      <Typography variant="body2" fontWeight="medium">
                        {licencia.maximoUnidadesPermitidas.toLocaleString()}
                      </Typography>
                    </TableCellStyled>

                    <TableCellStyled align="center">
                      <Chip
                        label={licencia.esLicenciaMultiPais ? "Sí" : "No"}
                        size="small"
                        color={licencia.esLicenciaMultiPais ? "success" : "default"}
                        variant="outlined"
                      />
                    </TableCellStyled>

                    <TableCellStyled align="right">
                      <Tooltip title="Asignar a Cliente">
                        <IconButton
                          color="info"
                          onClick={() => navigate(`/licencias/asignar/${licencia.id}`)}
                          size="small"
                        >
                          <AssignmentIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Editar Licencia">
                        <IconButton
                          color="primary"
                          onClick={() => irAEditarLicencia(licencia)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Eliminar Licencia">
                        <IconButton
                          color="error"
                          onClick={() => confirmarEliminacion(licencia)}
                          size="small"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCellStyled>
                  </ItemRow>
                ))}
              </DataTable>
            </TableContainer>

            {/* Información adicional */}
            {!isLoading && licencias.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No se encontraron licencias
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Comienza creando una nueva licencia
                </Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={irANuevaLicencia}
                  sx={{ mt: 2 }}
                >
                  Crear Primera Licencia
                </Button>
              </Box>
            )}

            {!isLoading && filtrarLicencias(licencias, filtroTexto).length !== licencias.length && (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Mostrando {filtrarLicencias(licencias, filtroTexto).length} de {licencias.length} licencias
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </>
  );
};