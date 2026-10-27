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
  Tooltip,
  CircularProgress,
} from '@mui/material';
import {
  CloseRounded as CloseIcon,
  InterestsOutlined,
  TranslateOutlined,
  ViewModuleOutlined,
} from '@mui/icons-material';
import { Modules } from '../../types';
import { IconSelector } from '../IconSelector/IconSelector';
import { DynamicIcon } from '../DynamicIcon/DynamicIcon';
import { DialogHeading, FormSectionTitle } from '../ui';

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

  const title = form._id ? 'Editar módulo' : 'Nuevo módulo';

  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle sx={{ pb: 2 }}>
        <Box display='flex' alignItems='center' justifyContent='space-between' gap={1}>
          <DialogHeading icon={<ViewModuleOutlined />}>{title}</DialogHeading>
          <Tooltip title='Cerrar'>
            <span>
              <IconButton aria-label='Cerrar' onClick={onClose} edge='end' size='small'>
                <CloseIcon fontSize='small' />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* SECCIÓN 1: Nombres Multilenguaje */}
        <Box sx={{ mb: 3 }}>
          <FormSectionTitle icon={<TranslateOutlined />} sx={{ mb: 2 }}>
            Nombres del módulo
          </FormSectionTitle>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Español (ES)'
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

        {/* SECCIÓN 2: Ícono */}
        <Box>
          <FormSectionTitle icon={<InterestsOutlined />} sx={{ mb: 2 }}>
            Ícono del módulo
          </FormSectionTitle>

          <Grid container spacing={2} alignItems='flex-start'>
            <Grid item xs={12} sm={8}>
              <IconSelector
                value={form.icon}
                onChange={val => setForm(prev => ({ ...prev, icon: val }))}
                label='Seleccionar ícono *'
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  minHeight: 40,
                  px: 1.5,
                  borderRadius: '8px',
                  background: 'var(--inset)',
                  boxShadow: 'var(--shadow-hairline)',
                }}
              >
                {form.icon ? (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      borderRadius: '8px',
                      background: 'var(--accent-tint)',
                      color: 'var(--accent-ink)',
                      '& .MuiSvgIcon-root': { fontSize: 18 },
                      '& > span': { width: 18, height: 18 },
                    }}
                  >
                    <DynamicIcon iconName={form.icon} />
                  </Box>
                ) : (
                  <Box component='span' sx={{ fontSize: 12.5, color: 'var(--ink-3)' }}>
                    Vista previa
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant='outlined' onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={handleSubmit}
          disabled={!form.moduleNameEs.trim() || saving}
          sx={{ minWidth: 136 }}
        >
          {saving ? <CircularProgress color='inherit' size={18} /> : 'Guardar módulo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
