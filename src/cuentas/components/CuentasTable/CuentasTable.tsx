/**
 * Componente de tabla para mostrar lista de cuentas
 */

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Box,
  Typography,
  Chip,
  Skeleton
} from '@mui/material';
import {
  CuentaDto,
  CategoriaCuenta,
  EstadoCuenta,
} from '../../types';
import { CuentaRow } from './CuentaRow';

interface CuentasTableProps {
  cuentas: CuentaDto[];
  isLoading: boolean;
  onEdit: (cuenta: CuentaDto) => void;
  onView: (cuenta: CuentaDto) => void;
  onDeactivate: (cuenta: CuentaDto) => void;
}

type OrdenCampo = keyof CuentaDto;
type OrdenDireccion = 'asc' | 'desc';

interface ColumnaTabla {
  id: OrdenCampo;
  label: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  minWidth?: number;
}

const columnas: ColumnaTabla[] = [
  { id: 'referenciaCuenta', label: 'Referencia', sortable: true, minWidth: 120 },
  { id: 'denominacion', label: 'Denominación', sortable: true, minWidth: 200 },
  { id: 'categoria', label: 'Categoría', align: 'center', sortable: true, minWidth: 130 },
  { id: 'paisId', label: 'País', align: 'center', sortable: true, minWidth: 100 },
  { id: 'estado', label: 'Estado', align: 'center', sortable: true, minWidth: 100 },
  { id: 'contadorLicencias', label: 'Licencias', align: 'center', sortable: true, minWidth: 90 },
  { id: 'contadorCampos', label: 'Campos', align: 'center', sortable: true, minWidth: 80 },
  { id: 'contadorHectareas', label: 'Hectáreas', align: 'center', sortable: true, minWidth: 90 },
  { id: 'fechaCreacion', label: 'Creado', align: 'center', sortable: true, minWidth: 120 }
];

// Columna adicional para acciones (no sortable)
const columnaAcciones = {
  label: 'Acciones',
  align: 'right' as const,
  sortable: false,
  minWidth: 140
};

export const CuentasTable: React.FC<CuentasTableProps> = ({
  cuentas,
  isLoading,
  onEdit,
  onView,
  onDeactivate
}) => {
  const [orden, setOrden] = useState<OrdenCampo>('fechaCreacion');
  const [direccionOrden, setDireccionOrden] = useState<OrdenDireccion>('desc');

  /**
   * Manejar cambio de ordenamiento
   */
  const handleRequestSort = (campo: OrdenCampo) => {
    const isAsc = orden === campo && direccionOrden === 'asc';
    setDireccionOrden(isAsc ? 'desc' : 'asc');
    setOrden(campo);
  };

  /**
   * Ordenar cuentas
   */
  const cuentasOrdenadas = React.useMemo(() => {
    return [...cuentas].sort((a, b) => {
      let aVal = a[orden];
      let bVal = b[orden];

      // Manejar fechas
      if (orden === 'fechaCreacion' || orden === 'fechaActualizacion') {
        aVal = new Date(aVal as string).getTime();
        bVal = new Date(bVal as string).getTime();
      }

      // Manejar números
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return direccionOrden === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // Manejar strings
      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();

      if (direccionOrden === 'asc') {
        return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
      } else {
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
      }
    });
  }, [cuentas, orden, direccionOrden]);

  /**
   * Obtener estadísticas de la tabla
   */
  const estadisticas = React.useMemo(() => {
    const totalCuentas = cuentas.length;
    const cuentasActivas = cuentas.filter(c => c.estado === EstadoCuenta.ACTIVA).length;
    const cuentasInactivas = totalCuentas - cuentasActivas;

    const categorias = {
      [CategoriaCuenta.A]: cuentas.filter(c => c.categoria === CategoriaCuenta.A).length,
      [CategoriaCuenta.B]: cuentas.filter(c => c.categoria === CategoriaCuenta.B).length,
      [CategoriaCuenta.C]: cuentas.filter(c => c.categoria === CategoriaCuenta.C).length,
    };

    return {
      totalCuentas,
      cuentasActivas,
      cuentasInactivas,
      categorias
    };
  }, [cuentas]);

  if (isLoading) {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columnas.map((columna) => (
                <TableCell key={columna.id} align={columna.align}>
                  <Skeleton variant="text" width="100%" />
                </TableCell>
              ))}
              {/* Columna de acciones */}
              <TableCell key="acciones" align={columnaAcciones.align}>
                <Skeleton variant="text" width="100%" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.from(new Array(5)).map((_, index) => (
              <TableRow key={index}>
                {columnas.map((columna) => (
                  <TableCell key={columna.id}>
                    <Skeleton variant="text" width="100%" />
                  </TableCell>
                ))}
                {/* Columna de acciones */}
                <TableCell key="acciones">
                  <Skeleton variant="text" width="100%" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (cuentas.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No hay cuentas registradas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Comience creando su primera cuenta
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Estadísticas resumidas */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <Chip
          label={`Total: ${estadisticas.totalCuentas}`}
          color="default"
          variant="outlined"
        />
        <Chip
          label={`Activas: ${estadisticas.cuentasActivas}`}
          color="success"
          variant="outlined"
        />
        {estadisticas.cuentasInactivas > 0 && (
          <Chip
            label={`Inactivas: ${estadisticas.cuentasInactivas}`}
            color="error"
            variant="outlined"
          />
        )}
        <Chip
          label={`Cat. A: ${estadisticas.categorias.A}`}
          color="primary"
          variant="outlined"
        />
        <Chip
          label={`Cat. B: ${estadisticas.categorias.B}`}
          color="secondary"
          variant="outlined"
        />
        <Chip
          label={`Cat. C: ${estadisticas.categorias.C}`}
          color="info"
          variant="outlined"
        />
      </Box>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columnas.map((columna) => (
                <TableCell
                  key={columna.id}
                  align={columna.align}
                  style={{ minWidth: columna.minWidth }}
                >
                  {columna.sortable ? (
                    <TableSortLabel
                      active={orden === columna.id}
                      direction={orden === columna.id ? direccionOrden : 'asc'}
                      onClick={() => handleRequestSort(columna.id)}
                    >
                      {columna.label}
                    </TableSortLabel>
                  ) : (
                    columna.label
                  )}
                </TableCell>
              ))}
              {/* Columna de acciones */}
              <TableCell
                key="acciones"
                align={columnaAcciones.align}
                style={{ minWidth: columnaAcciones.minWidth }}
              >
                {columnaAcciones.label}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cuentasOrdenadas.map((cuenta) => (
              <CuentaRow
                key={cuenta.cuentaId}
                cuenta={cuenta}
                onEdit={onEdit}
                onView={onView}
                onDeactivate={onDeactivate}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Información adicional al pie */}
      <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="text.secondary">
          Mostrando {cuentasOrdenadas.length} de {estadisticas.totalCuentas} cuentas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ordenado por: {columnas.find(c => c.id === orden)?.label} ({direccionOrden === 'asc' ? 'A-Z' : 'Z-A'})
        </Typography>
      </Box>
    </Box>
  );
};