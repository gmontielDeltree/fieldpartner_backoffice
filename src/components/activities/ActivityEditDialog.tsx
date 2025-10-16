import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Box,
  Chip
} from '@mui/material';
import { Activity } from '../../services/activitiesService';

interface ActivityEditDialogProps {
  open: boolean;
  activity: Activity | null;
  onClose: () => void;
  onSave: (activity: Activity) => void;
}

const ActivityEditDialog: React.FC<ActivityEditDialogProps> = ({
  open,
  activity,
  onClose,
  onSave
}) => {
  const [editedActivity, setEditedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    if (activity) {
      setEditedActivity({ ...activity });
    } else {
      setEditedActivity(null);
    }
  }, [activity]);

  const handleChange = (field: string, value: any) => {
    if (!editedActivity) return;

    if (field.startsWith('detalles.')) {
      const detailField = field.replace('detalles.', '');
      setEditedActivity({
        ...editedActivity,
        detalles: {
          ...editedActivity.detalles,
          [detailField]: value
        }
      });
    } else {
      setEditedActivity({
        ...editedActivity,
        [field]: value
      });
    }
  };

  const handleSave = () => {
    if (editedActivity) {
      onSave(editedActivity);
    }
  };

  if (!editedActivity) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6">Editar Actividad</Typography>
          <Chip 
            label={editedActivity.uuid.substring(0, 8) + '...'} 
            size="small" 
            variant="outlined"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Tipo"
              select
              value={editedActivity.tipo}
              onChange={(e) => handleChange('tipo', e.target.value)}
            >
              <MenuItem value="siembra">Siembra</MenuItem>
              <MenuItem value="cosecha">Cosecha</MenuItem>
              <MenuItem value="aplicacion">Aplicación</MenuItem>
              <MenuItem value="preparado">Preparado</MenuItem>
            </TextField>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Estado"
              select
              value={editedActivity.estado}
              onChange={(e) => handleChange('estado', e.target.value)}
            >
              <MenuItem value="pendiente">Pendiente</MenuItem>
              <MenuItem value="completada">Completada</MenuItem>
              <MenuItem value="en_proceso">En Proceso</MenuItem>
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Comentario"
              value={editedActivity.comentario || ''}
              onChange={(e) => handleChange('comentario', e.target.value)}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Lote UUID"
              value={editedActivity.lote_uuid || ''}
              onChange={(e) => handleChange('lote_uuid', e.target.value)}
              helperText="UUID del lote asociado"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Detalles
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Cultivo"
              value={editedActivity.detalles?.cultivo?.descriptionES || ''}
              onChange={(e) => handleChange('detalles.cultivo', { 
                ...editedActivity.detalles?.cultivo,
                descriptionES: e.target.value 
              })}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fecha Tentativa"
              type="date"
              value={editedActivity.detalles?.fecha_ejecucion_tentativa || ''}
              onChange={(e) => handleChange('detalles.fecha_ejecucion_tentativa', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          {editedActivity.estado === 'completada' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fecha Ejecución"
                  type="date"
                  value={editedActivity.detalles?.fecha_ejecucion || ''}
                  onChange={(e) => handleChange('detalles.fecha_ejecucion', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Rinde Obtenido"
                  type="number"
                  value={editedActivity.detalles?.rinde_obtenido || ''}
                  onChange={(e) => handleChange('detalles.rinde_obtenido', parseFloat(e.target.value))}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hora Inicio"
                  type="datetime-local"
                  value={editedActivity.detalles?.fecha_hora_inicio || ''}
                  onChange={(e) => handleChange('detalles.fecha_hora_inicio', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Hora Fin"
                  type="datetime-local"
                  value={editedActivity.detalles?.fecha_hora_fin || ''}
                  onChange={(e) => handleChange('detalles.fecha_hora_fin', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Depósito"
                  value={editedActivity.detalles?.deposito || ''}
                  onChange={(e) => handleChange('detalles.deposito', e.target.value)}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Superficie"
              type="number"
              value={editedActivity.detalles?.superficie || ''}
              onChange={(e) => handleChange('detalles.superficie', parseFloat(e.target.value))}
              helperText="En hectáreas"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Dosis"
              type="number"
              value={editedActivity.detalles?.dosis || ''}
              onChange={(e) => handleChange('detalles.dosis', parseFloat(e.target.value))}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="textSecondary">
              UUID: {editedActivity.uuid}
            </Typography>
          </Grid>
          
          {editedActivity._id && (
            <Grid item xs={12}>
              <Typography variant="caption" color="textSecondary">
                ID: {editedActivity._id}
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActivityEditDialog;