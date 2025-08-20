import React, { useState } from 'react';
import { Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import { useModules } from '../../hooks/useModules';
import { IconSelector } from '../../components/IconSelector/IconSelector';

type ModuleForm = {
  moduleNameEs: string;
  moduleNameEn: string;
  moduleNamePt: string;
  icon: string;
};

export const NewModulePage: React.FC = () => {
  const { createModules } = useModules();
  const [form, setForm] = useState<ModuleForm>({
    moduleNameEs: '',
    moduleNameEn: '',
    moduleNamePt: '',
    icon: '',
  });

  const handleChange =
    (field: keyof ModuleForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: event.target.value }));
    };

  const handleIconSelect = (iconName: string) => {
    setForm(prev => ({ ...prev, icon: iconName }));
  };

  const handleSubmit = async () => {
    await createModules(form);
    setForm({ moduleNameEs: '', moduleNameEn: '', moduleNamePt: '', icon: '' });
  };

  return (
    <Container maxWidth='sm'>
      <Box sx={{ mt: 4 }}>
        <Typography variant='h5'>Nuevo Módulo</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Nombre (ES)'
              value={form.moduleNameEs}
              onChange={handleChange('moduleNameEs')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Name (EN)'
              value={form.moduleNameEn}
              onChange={handleChange('moduleNameEn')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label='Nome (PT)'
              value={form.moduleNamePt}
              onChange={handleChange('moduleNamePt')}
            />
          </Grid>
          <Grid item xs={12}>
            <IconSelector value={form.icon} onChange={handleIconSelect} />
          </Grid>
          <Grid item xs={12} textAlign='right'>
            <Button variant='contained' onClick={handleSubmit} disabled={!form.moduleNameEs}>
              Guardar
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
