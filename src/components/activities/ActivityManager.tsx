import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Grid,
  Button,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import RestoreIcon from '@mui/icons-material/Restore';
import AddIcon from '@mui/icons-material/Add';
import { activitiesService, Activity } from '../../services/activitiesService';
import { fieldsService } from '../../services/fieldsService';
import { useUser } from '../../hooks';
import ActivityEditDialog from './ActivityEditDialog';

const ActivityManager: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [availableLotes, setAvailableLotes] = useState<{ uuid: string; nombre: string; campo?: string }[]>([]);
  const [availableCampos, setAvailableCampos] = useState<string[]>([]);
  const [loteToAccountMap, setLoteToAccountMap] = useState<Map<string, string | undefined>>(new Map());
  const { users, getUsers } = useUser();
  const [filters, setFilters] = useState({
    tipo: '',
    estado: '',
    lote: '',
    campo: '',
    userId: '',
    search: ''
  });

  useEffect(() => {
    loadActivities();
    loadLotes();
    loadFieldAccountMapping();
    getUsers();

    // Subscribe to changes
    const unsubscribe = activitiesService.onChanges(() => {
      loadActivities();
      loadLotes();
      loadFieldAccountMapping();
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [activities, filters]);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await activitiesService.getAllActivities();
      setActivities(data);
      console.log('[ActivityManager] Activities loaded:', data.length);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFieldAccountMapping = async () => {
    try {
      const fields = await fieldsService.getAllFields();
      const map = new Map<string, string | undefined>();
      fields.forEach(f => {
        if (f.uuid) {
          map.set(f.uuid, f.empresa_uuid);
        }
      });
      setLoteToAccountMap(map);
      const sample = Array.from(map.entries()).slice(0, 5);
      console.log('[ActivityManager] Field→Account mapping size:', map.size, 'sample:', sample);
    } catch (error) {
      console.error('Error loading field-account mapping:', error);
      setLoteToAccountMap(new Map());
    }
  };

  const loadLotes = async () => {
    try {
      const lotes = await activitiesService.getUniqueLotes();
      setAvailableLotes(lotes);
      const campos = Array.from(new Set(lotes.map(l => l.campo).filter(Boolean))) as string[];
      setAvailableCampos(campos);
      console.log('[ActivityManager] Lotes loaded:', lotes.length, 'Campos:', campos.length);
    } catch (error) {
      console.error('Error loading lotes:', error);
    }
  };

  const applyFilters = () => {
    console.log('[ActivityManager] Applying filters:', filters);
    let filtered = [...activities];

    if (filters.tipo) {
      filtered = filtered.filter(a => a.tipo === filters.tipo);
    }

    if (filters.estado) {
      filtered = filtered.filter(a => a.estado === filters.estado);
    }

    if (filters.lote) {
      filtered = filtered.filter(a => a.lote_uuid === filters.lote);
    }

    if (filters.campo) {
      filtered = filtered.filter(a => a.campo_nombre === filters.campo);
    }

    if (filters.userId) {
      const selectedUser: any = users.find((u: any) => u._id === filters.userId || u.id === filters.userId);
      const selectedAccountId = selectedUser?.accountId;
      console.log('[ActivityManager] User filter:', { userId: filters.userId, selectedAccountId });
      if (selectedAccountId) {
        filtered = filtered.filter(a => a.lote_uuid && loteToAccountMap.get(a.lote_uuid) === selectedAccountId);
      } else {
        console.warn('[ActivityManager] Selected user has no accountId; skipping account-based filter');
      }
    }

    if (filters.search) {
      filtered = filtered.filter(a =>
        a.comentario?.toLowerCase().includes(filters.search.toLowerCase()) ||
        a.uuid?.toLowerCase().includes(filters.search.toLowerCase()) ||
        a.detalles?.cultivo?.descriptionES?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    console.log('[ActivityManager] Filtered activities:', filtered.length);
    setFilteredActivities(filtered);
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setEditDialogOpen(true);
  };

  const handleDelete = async (activity: Activity) => {
    if (!activity._id) return;

    if (window.confirm('¿Estás seguro de eliminar esta actividad?')) {
      const success = await activitiesService.deleteActivity(activity._id);
      if (success) {
        loadActivities();
      }
    }
  };

  const handleReset = async (activity: Activity) => {
    if (!activity._id) return;

    if (window.confirm('¿Resetear esta actividad a estado pendiente?')) {
      const success = await activitiesService.resetActivity(activity._id);
      if (success) {
        loadActivities();
      }
    }
  };

  const handleSave = async (activity: Activity) => {
    const success = await activitiesService.updateActivity(activity);
    if (success) {
      setEditDialogOpen(false);
      loadActivities();
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completada': return 'success';
      case 'pendiente': return 'warning';
      case 'en_proceso': return 'info';
      default: return 'default';
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'siembra': return 'primary';
      case 'cosecha': return 'secondary';
      case 'aplicacion': return 'info';
      case 'preparado': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Administrador de Actividades
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Buscar"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="UUID, comentario, cultivo..."
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Tipo"
              value={filters.tipo}
              onChange={(e) => setFilters({ ...filters, tipo: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="siembra">Siembra</MenuItem>
              <MenuItem value="cosecha">Cosecha</MenuItem>
              <MenuItem value="aplicacion">Aplicación</MenuItem>
              <MenuItem value="preparado">Preparado</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Estado"
              value={filters.estado}
              onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              <MenuItem value="pendiente">Pendiente</MenuItem>
              <MenuItem value="completada">Completada</MenuItem>
              <MenuItem value="en_proceso">En Proceso</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Campo"
              value={filters.campo}
              onChange={(e) => {
                const selectedCampo = e.target.value;
                // Si el lote seleccionado no pertenece al campo elegido, resetearlo
                const loteActual = availableLotes.find(l => l.uuid === filters.lote);
                const lotePertenece = selectedCampo === '' || (loteActual && loteActual.campo === selectedCampo);
                setFilters({ ...filters, campo: selectedCampo, lote: lotePertenece ? filters.lote : '' });
              }}
            >
              <MenuItem value="">Todos</MenuItem>
              {availableCampos.map((campo) => (
                <MenuItem key={campo} value={campo}>
                  {campo}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Usuario"
              value={filters.userId}
              onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              {(users && users.length > 0 ? users : []).map((u: any) => (
                <MenuItem key={u._id || u.id || u.email} value={u._id || u.id}>
                  {u.username || u.email}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              select
              label="Lote"
              value={filters.lote}
              onChange={(e) => setFilters({ ...filters, lote: e.target.value })}
            >
              <MenuItem value="">Todos</MenuItem>
              {(filters.campo
                ? availableLotes.filter(l => l.campo === filters.campo)
                : availableLotes
              ).map((lote) => (
                <MenuItem key={lote.uuid} value={lote.uuid}>
                  {lote.nombre}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={loadActivities}
            >
              Actualizar
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Activities Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>UUID</TableCell>
              <TableCell>Tipo</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Cultivo</TableCell>
              <TableCell>Comentario</TableCell>
              <TableCell>Fecha Tentativa</TableCell>
              <TableCell>Lote</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Cargando actividades...
                </TableCell>
              </TableRow>
            ) : filteredActivities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No se encontraron actividades
                </TableCell>
              </TableRow>
            ) : (
              filteredActivities.map((activity, index) => (
                <TableRow key={activity.uuid || `activity-${index}`}>
                  <TableCell>
                    {activity.uuid ? (
                      <Tooltip title={activity.uuid}>
                        <Typography variant="caption">
                          {activity.uuid.substring(0, 8)}...
                        </Typography>
                      </Tooltip>
                    ) : (
                      <Typography variant="caption">-</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={activity.tipo}
                      size="small"
                      color={getTipoColor(activity.tipo) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={activity.estado}
                      size="small"
                      color={getEstadoColor(activity.estado) as any}
                    />
                  </TableCell>
                  <TableCell>
                    {activity.detalles?.cultivo?.descriptionES ||
                      activity.detalles?.cultivo?.name ||
                      '-'}
                  </TableCell>
                  <TableCell>{activity.comentario || '-'}</TableCell>
                  <TableCell>
                    {activity.detalles?.fecha_ejecucion_tentativa
                      ? new Date(activity.detalles.fecha_ejecucion_tentativa).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Box>
                      {activity.campo_nombre && (
                        <Typography variant="caption" display="block" color="textSecondary">
                          <strong>Campo:</strong> {activity.campo_nombre}
                        </Typography>
                      )}
                      {activity.lote_nombre ? (
                        <Typography variant="caption" display="block">
                          {activity.lote_nombre}
                        </Typography>
                      ) : activity.lote_uuid ? (
                        <Tooltip title={`UUID: ${activity.lote_uuid}`}>
                          <Typography variant="caption" display="block" color="textSecondary">
                            {activity.lote_uuid.substring(0, 12)}...
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" color="textSecondary">-</Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(activity)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {activity.estado === 'completada' && (
                      <Tooltip title="Resetear a pendiente">
                        <IconButton
                          size="small"
                          onClick={() => handleReset(activity)}
                          color="warning"
                        >
                          <RestoreIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Eliminar">
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(activity)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <ActivityEditDialog
        open={editDialogOpen}
        activity={selectedActivity}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSave}
      />
    </Box>
  );
};

export default ActivityManager;