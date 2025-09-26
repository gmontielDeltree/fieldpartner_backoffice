/**
 * Componente para una fila de la tabla de cuentas
 */

import React from 'react';
import {
  TableRow,
  TableCell,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import {
  CuentaDto,
  CategoriaCuenta,
  EstadoCuenta,
  CategoriasCuentaLabels,
  EstadosCuentaLabels,
  ColoresCategorias,
  ColoresEstados
} from '../../types';

interface CuentaRowProps {
  cuenta: CuentaDto;
  onEdit: (cuenta: CuentaDto) => void;
  onView: (cuenta: CuentaDto) => void;
  onDeactivate: (cuenta: CuentaDto) => void;
}

export const CuentaRow: React.FC<CuentaRowProps> = ({
  cuenta,
  onEdit,
  onView,
  onDeactivate
}) => {
  /**
   * Formatear fecha
   */
  const formatearFecha = (fechaISO: string): string => {
    try {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString('es-ES');
    } catch (error) {
      return 'N/A';
    }
  };

  /**
   * Obtener información del país
   */
  const obtenerInfoPais = () => {
    if (cuenta.paisId && typeof cuenta.paisId === 'object') {
      return cuenta.paisId?.descripcionES;
    }
    return cuenta.paisId || 'N/A';
  };

  return (
    <TableRow hover>
      {/* Referencia */}
      <TableCell>
        <strong>{cuenta.referenciaCuenta}</strong>
      </TableCell>

      {/* Denominación */}
      <TableCell>
        {cuenta.denominacion}
      </TableCell>

      {/* Categoría */}
      <TableCell align="center">
        <Chip
          label={CategoriasCuentaLabels[cuenta.categoria as CategoriaCuenta]}
          color={ColoresCategorias[cuenta.categoria as CategoriaCuenta] as any}
          variant="outlined"
          size="small"
        />
      </TableCell>

      {/* País */}
      <TableCell align="center">
        {obtenerInfoPais()}
      </TableCell>

      {/* Estado */}
      <TableCell align="center">
        <Chip
          label={EstadosCuentaLabels[cuenta.estado as EstadoCuenta]}
          color={ColoresEstados[cuenta.estado as EstadoCuenta] as any}
          variant="filled"
          size="small"
        />
      </TableCell>

      {/* Licencias */}
      <TableCell align="center">
        {cuenta.contadorLicencias}
      </TableCell>

      {/* Campos */}
      <TableCell align="center">
        {cuenta.contadorCampos}
      </TableCell>

      {/* Hectáreas */}
      <TableCell align="center">
        {cuenta.contadorHectareas}
      </TableCell>

      {/* Fecha de creación */}
      <TableCell align="center">
        {formatearFecha(cuenta.fechaCreacion)}
      </TableCell>

      {/* Acciones */}
      <TableCell align="right">
        <Tooltip title="Ver detalles">
          <IconButton
            size="small"
            onClick={() => onView(cuenta)}
            sx={{ mr: 1 }}
          >
            <Visibility fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Editar cuenta">
          <IconButton
            size="small"
            onClick={() => onEdit(cuenta)}
            sx={{ mr: 1 }}
          >
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>

        {cuenta.estado === EstadoCuenta.ACTIVA && (
          <Tooltip title="Desactivar cuenta">
            <IconButton
              size="small"
              onClick={() => onDeactivate(cuenta)}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </TableCell>
    </TableRow>
  );
};