import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  Licencia,
  // LicenciaPorCliente,
  LicenciasState,
  CrearLicenciaDto,
  ActualizarLicenciaDto,
  AsignarLicenciaClienteDto
} from '../../types/licencias.types';
import { licenciasService } from '../../services/licenciasService';

// Estado inicial
const initialState: LicenciasState = {
  licencias: [],
  licenciaActiva: null,
  licenciasPorCliente: [],
  isLoading: false,
  error: null,
};

// 📋 ASYNC THUNKS para acciones asíncronas

// Obtener todas las licencias
export const obtenerLicencias = createAsyncThunk(
  'licencias/obtenerLicencias',
  async (_, { rejectWithValue }) => {
    try {
      const licencias = await licenciasService.obtenerLicencias();
      return licencias;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener licencias');
    }
  }
);

// Obtener licencia por ID
export const obtenerLicenciaPorId = createAsyncThunk(
  'licencias/obtenerLicenciaPorId',
  async (id: string, { rejectWithValue }) => {
    try {
      const licencia = await licenciasService.obtenerLicenciaPorId(id);
      return licencia;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener licencia');
    }
  }
);

// Crear nueva licencia
export const crearLicencia = createAsyncThunk(
  'licencias/crearLicencia',
  async (licenciaData: CrearLicenciaDto, { rejectWithValue }) => {
    try {
      const nuevaLicencia = await licenciasService.crearLicencia(licenciaData);
      return nuevaLicencia;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al crear licencia');
    }
  }
);

// Actualizar licencia
export const actualizarLicencia = createAsyncThunk(
  'licencias/actualizarLicencia',
  async (
    { id, datos }: { id: string; datos: ActualizarLicenciaDto },
    { rejectWithValue }
  ) => {
    try {
      const licenciaActualizada = await licenciasService.actualizarLicencia(id, datos);
      return licenciaActualizada;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al actualizar licencia');
    }
  }
);

// Asignar licencia a cliente
export const asignarLicenciaACliente = createAsyncThunk(
  'licencias/asignarLicenciaACliente',
  async (datos: AsignarLicenciaClienteDto, { rejectWithValue }) => {
    try {
      const asignacion = await licenciasService.asignarLicenciaACliente(datos);
      return asignacion;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al asignar licencia');
    }
  }
);

// Obtener licencias de cliente
export const obtenerLicenciasDeCliente = createAsyncThunk(
  'licencias/obtenerLicenciasDeCliente',
  async (clienteId: string, { rejectWithValue }) => {
    try {
      const licenciasCliente = await licenciasService.obtenerLicenciasDeCliente(clienteId);
      return licenciasCliente;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al obtener licencias del cliente');
    }
  }
);

// Buscar licencias con filtros
export const buscarLicencias = createAsyncThunk(
  'licencias/buscarLicencias',
  async (
    filtros: {
      descripcion?: string;
      tipoLicencia?: string;
      tipoSistema?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const licencias = await licenciasService.buscarLicencias(filtros);
      return licencias;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Error al buscar licencias');
    }
  }
);

// 🏪 SLICE
export const licenciasSlice = createSlice({
  name: 'licencias',
  initialState,
  reducers: {
    // Establecer licencia activa
    establecerLicenciaActiva: (state, action: PayloadAction<Licencia>) => {
      state.licenciaActiva = action.payload;
    },

    // Limpiar licencia activa
    limpiarLicenciaActiva: (state) => {
      state.licenciaActiva = null;
    },

    // Limpiar error
    limpiarError: (state) => {
      state.error = null;
    },

    // Limpiar estado
    limpiarEstado: (state) => {
      state.licencias = [];
      state.licenciaActiva = null;
      state.licenciasPorCliente = [];
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    // 📋 OBTENER LICENCIAS
    builder
      .addCase(obtenerLicencias.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(obtenerLicencias.fulfilled, (state, action) => {
        state.isLoading = false;
        state.licencias = action.payload;
        state.error = null;
      })
      .addCase(obtenerLicencias.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 🔍 OBTENER LICENCIA POR ID
      .addCase(obtenerLicenciaPorId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(obtenerLicenciaPorId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.licenciaActiva = action.payload;
        state.error = null;
      })
      .addCase(obtenerLicenciaPorId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ➕ CREAR LICENCIA
      .addCase(crearLicencia.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(crearLicencia.fulfilled, (state, action) => {
        state.isLoading = false;
        state.licencias.push(action.payload);
        state.error = null;
      })
      .addCase(crearLicencia.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ✏️ ACTUALIZAR LICENCIA
      .addCase(actualizarLicencia.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(actualizarLicencia.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.licencias.findIndex(l => l.id === action.payload.id);
        if (index !== -1) {
          state.licencias[index] = action.payload;
        }
        if (state.licenciaActiva?.id === action.payload.id) {
          state.licenciaActiva = action.payload;
        }
        state.error = null;
      })
      .addCase(actualizarLicencia.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 🔗 ASIGNAR LICENCIA A CLIENTE
      .addCase(asignarLicenciaACliente.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(asignarLicenciaACliente.fulfilled, (state, action) => {
        state.isLoading = false;
        state.licenciasPorCliente.push(action.payload);
        state.error = null;
      })
      .addCase(asignarLicenciaACliente.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 👥 OBTENER LICENCIAS DE CLIENTE
      .addCase(obtenerLicenciasDeCliente.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(obtenerLicenciasDeCliente.fulfilled, (state, action) => {
        state.isLoading = false;
        state.licenciasPorCliente = action.payload;
        state.error = null;
      })
      .addCase(obtenerLicenciasDeCliente.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // 🔍 BUSCAR LICENCIAS
      .addCase(buscarLicencias.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(buscarLicencias.fulfilled, (state, action) => {
        state.isLoading = false;
        state.licencias = action.payload;
        state.error = null;
      })
      .addCase(buscarLicencias.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Exportar acciones
export const {
  establecerLicenciaActiva,
  limpiarLicenciaActiva,
  limpiarError,
  limpiarEstado,
} = licenciasSlice.actions;

// Exportar reducer
export default licenciasSlice.reducer;