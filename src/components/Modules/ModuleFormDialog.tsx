import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Button,
  Box,
  IconButton,
  Divider,
  Tooltip,
  CircularProgress,
  Typography,
} from '@mui/material';
import {
  DisplaySettingsRounded as DisplaySettingsIcon,
  CloseRounded as CloseIcon,
  SaveRounded as SaveIcon,
} from '@mui/icons-material';
import { Modules } from '../../types';
import { IconSelector } from '../IconSelector/IconSelector';
import { DynamicIcon } from '../DynamicIcon/DynamicIcon';
import { NumericTextField } from '../NumericTextField/NumericTextField'; // o from '../../components' según tu index.ts

type Props = {
  open: boolean;
  initial?: Modules | null;
  onClose: () => void;
  onSave: (payload: Omit<Modules, '_id' | '_rev'> | Modules) => Promise<void>;
};

const blank: Modules = {
  moduleNameEs: '',
  moduleNameEn: '',
  moduleNamePt: '',
  icon: '',
  orden: 0,
};

export const ModuleFormDialog: React.FC<Props> = ({ open, initial, onClose, onSave }) => {
  const [form, setForm] = useState<Modules>(blank);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initial ?? blank);
  }, [initial]);

  const handleChange = (field: keyof Modules) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleOrderChange = (newValue: number | null) => {
    // Guardar correctamente en el campo "orden" (number)
    setForm(prev => ({ ...prev, orden: newValue === null ? 0 : Number(newValue) }));
  };

  const handleSubmit = async () => {
    if (!form.moduleNameEs.trim()) return;
    try {
      setSaving(true);
      // Asegurarse que 'orden' sea number al enviar
      const payload = { ...form, orden: Number(form.orden ?? 0) } as Modules;
      await onSave(form._id ? payload : payload);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const title = form._id ? 'Editar Módulo' : 'Nuevo Módulo';

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ p: 2 }}>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Box display='flex' alignItems='center' gap={1}>
            <DisplaySettingsIcon color='primary' />
            <Typography variant='h6' component='div'>
              {title}
            </Typography>
          </Box>
          <Tooltip title='Cerrar'>
            <span>
              <IconButton onClick={onClose} edge='end'>
                <CloseIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent dividers sx={{ pt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Nombre (ES)'
              value={form.moduleNameEs}
              onChange={handleChange('moduleNameEs')}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Name (EN)'
              value={form.moduleNameEn}
              onChange={handleChange('moduleNameEn')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label='Nome (PT)'
              value={form.moduleNamePt}
              onChange={handleChange('moduleNamePt')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <NumericTextField
              fullWidth
              variant='outlined'
              label='Orden'
              value={form.orden ?? 0}
              onChange={handleOrderChange}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <IconSelector
              value={form.icon}
              onChange={val => setForm(prev => ({ ...prev, icon: val }))}
              label='Ícono del Módulo'
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                height: '100%',
                border: theme => `1px dashed ${theme.palette.divider}`,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.paper',
              }}
            >
              {form.icon ? (
                <DynamicIcon iconName={form.icon} />
              ) : (
                <Typography variant='body2' color='text.secondary'>
                  Sin ícono
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button variant='outlined' onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          variant='contained'
          color='primary'
          startIcon={saving ? undefined : <SaveIcon />}
          onClick={handleSubmit}
          disabled={!form.moduleNameEs.trim() || saving}
        >
          {saving ? <CircularProgress color='inherit' size={20} /> : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
