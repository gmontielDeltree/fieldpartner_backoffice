import React, { useState } from 'react';
import { Button, Grid, TextField } from '@mui/material';
import { ViewModuleOutlined } from '@mui/icons-material';
import { useModules } from '../../hooks/useModules';
import { IconSelector } from '../../components/IconSelector/IconSelector';
import {
  FormActions,
  FormCard,
  NumericTextField,
  PageContainer,
  PageHeader,
} from '../../components';

type ModuleForm = {
  moduleNameEs: string;
  moduleNameEn: string;
  moduleNamePt: string;
  orden: number;
  icon: string;
};

export const NewModulePage: React.FC = () => {
  const { createModules } = useModules();
  const [form, setForm] = useState<ModuleForm>({
    moduleNameEs: '',
    moduleNameEn: '',
    moduleNamePt: '',
    orden: 0,
    icon: '',
  });

  const handleChange =
    (field: keyof ModuleForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm(prev => ({ ...prev, [field]: event.target.value }));
    };

  const handleOrdenChange = (newValue: number | null) => {
    setForm(prev => ({ ...prev, orden: newValue === null ? 0 : Number(newValue) }));
  };

  const handleIconSelect = (iconName: string) => {
    setForm(prev => ({ ...prev, icon: iconName }));
  };

  const handleSubmit = async () => {
    await createModules(form);
    setForm({ moduleNameEs: '', moduleNameEn: '', moduleNamePt: '', orden: 0, icon: '' });
  };

  return (
    <PageContainer maxWidth={980}>
      <PageHeader
        icon={<ViewModuleOutlined />}
        eyebrow='Menús y módulos · Módulos'
        title='Nuevo módulo'
      />
      <FormCard title='Datos del módulo' icon={<ViewModuleOutlined />}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label='Nombre (ES)'
              value={form.moduleNameEs}
              onChange={handleChange('moduleNameEs')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label='Name (EN)'
              value={form.moduleNameEn}
              onChange={handleChange('moduleNameEn')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label='Nome (PT)'
              value={form.moduleNamePt}
              onChange={handleChange('moduleNamePt')}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <NumericTextField
              fullWidth={true}
              variant='outlined'
              label='Orden'
              value={form.orden}
              onChange={handleOrdenChange}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <IconSelector value={form.icon} onChange={handleIconSelect} />
          </Grid>
        </Grid>
      </FormCard>
      <FormActions>
        <Button variant='contained' onClick={handleSubmit} disabled={!form.moduleNameEs}>
          Guardar
        </Button>
      </FormActions>
    </PageContainer>
  );
};
