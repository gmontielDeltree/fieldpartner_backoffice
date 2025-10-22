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

type Props = {
  open: boolean;
  initial?: Modules | null;
  onClose: () => void;
  onSave: (payload: Omit<Modules, '_id' | '_rev'> | Modules) => Promise<void>;
};

const blank: Modules = { moduleNameEs: '', moduleNameEn: '', moduleNamePt: '', icon: '' };

export const ModuleFormDialog: React.FC<Props> = ({ open, initial, onClose, onSave }) => {
  const [form, setForm] = useState<Modules>(blank);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initial ?? blank);
  }, [initial]);

  const handleChange = (field: keyof Modules) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.moduleNameEs.trim()) return;
    try {
      setSaving(true);
      await onSave(form._id ? form : { ...form });
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

      <DialogContent dividers sx={{ pt: 3, pb: 3 }}>
        {/* SECCIÓN 1: Nombres Multilenguaje */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant='subtitle2'
            sx={{
              mb: 2,
              color: 'primary.main',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            🌐 Nombres del Módulo
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Español (ES) *'
                value={form.moduleNameEs}
                onChange={handleChange('moduleNameEs')}
                required
                placeholder='Ej: Configuración'
                error={!form.moduleNameEs.trim()}
                helperText={!form.moduleNameEs.trim() ? 'Campo obligatorio' : ''}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Inglés (EN)'
                value={form.moduleNameEn}
                onChange={handleChange('moduleNameEn')}
                placeholder='Ej: Settings'
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Portugués (PT)'
                value={form.moduleNamePt}
                onChange={handleChange('moduleNamePt')}
                placeholder='Ej: Configurações'
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* SECCIÓN 2: Ícono */}
        <Box>
          <Typography
            variant='subtitle2'
            sx={{
              mb: 2,
              color: 'primary.main',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            🎨 Ícono del Módulo
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <IconSelector
                value={form.icon}
                onChange={val => setForm(prev => ({ ...prev, icon: val }))}
                label='Seleccionar Ícono *'
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  height: '56px',
                  border: theme => `2px dashed ${theme.palette.divider}`,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'background.default',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                {form.icon ? (
                  <Box sx={{ transform: 'scale(1.3)' }}>
                    <DynamicIcon iconName={form.icon} />
                  </Box>
                ) : (
                  <Typography variant='caption' color='text.secondary' sx={{ fontSize: '0.7rem' }}>
                    Vista previa
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          variant='outlined'
          onClick={onClose}
          disabled={saving}
          sx={{ minWidth: '100px' }}
        >
          Cancelar
        </Button>
        <Button
          variant='contained'
          color='primary'
          startIcon={saving ? undefined : <SaveIcon />}
          onClick={handleSubmit}
          disabled={!form.moduleNameEs.trim() || saving}
          sx={{
            minWidth: '120px',
            fontWeight: 600,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4,
            },
          }}
        >
          {saving ? <CircularProgress color='inherit' size={20} /> : 'Guardar Módulo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
