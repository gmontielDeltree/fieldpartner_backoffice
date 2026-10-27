import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined';
import ScienceOutlined from '@mui/icons-material/ScienceOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VisibilityOutlined from '@mui/icons-material/VisibilityOutlined';
import { generateMaterialIcon } from '../../services/iconGeneratorService';
import { DialogHeading, FormSectionTitle } from '../ui';

interface IconGeneratorModalProps {
  open: boolean;
  onClose: () => void;
  onIconGenerated: (iconBase64: string) => void;
}

export const IconGeneratorModal: React.FC<IconGeneratorModalProps> = ({
  open,
  onClose,
  onIconGenerated,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIcon, setGeneratedIcon] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [timeoutId, setTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Función para manejar timeout de generación
  const handleGenerationTimeout = () => {
    const timeout = setTimeout(() => {
      setIsGenerating(false);
      setGenerationStatus(
        '⚠️ La generación está tomando más de lo esperado. Por favor, intente nuevamente.',
      );
    }, 180000); // 3 minutos = 180000ms

    setTimeoutId(timeout);
    return timeout;
  };

  const handleConfirm = () => {
    if (generatedIcon) {
      onIconGenerated(generatedIcon);
      handleReset();
      onClose();
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenerationStatus('Iniciando generación...');

    handleGenerationTimeout();

    try {
      const result = await generateMaterialIcon(prompt);
      console.log('7. Resultado de generación:', result);

      if (timeoutId) clearTimeout(timeoutId);

      setGenerationStatus('Procesando SVG...');
      setGeneratedIcon(result.icon);

      // No cerramos el modal aquí, esperamos a que el usuario confirme
      setGenerationStatus('¡Ícono generado con éxito!');
    } catch (error) {
      console.error('Error en generación:', error);
      setGenerationStatus('❌ Error en la generación. Intente nuevamente.');
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setIsGenerating(false);
    }
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  // Actualizar el componente de carga para mostrar progreso
  const LoadingIndicator = () => (
    <Box sx={{ textAlign: 'center' }}>
      <CircularProgress
        size={56}
        thickness={4}
        sx={{
          color: 'var(--accent)',
          mb: 2,
        }}
      />
      <Typography sx={{ mb: 0.5, fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' }}>
        {generationStatus}
      </Typography>
      <Typography sx={{ fontSize: 12.5, color: 'var(--ink-3)' }}>
        Este proceso puede tomar hasta 3 minutos...
      </Typography>
    </Box>
  );

  // Actualizar la sección de vista previa para mostrar estados de generación
  const renderPreviewIcon = (svgContent: string) => {
    return (
      <Box
        sx={{
          width: '100%',
          height: 250,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--inset)',
          borderRadius: '10px',
          boxShadow: 'var(--shadow-hairline)',
          color: 'var(--ink)',
          p: 2,
          position: 'relative',
        }}
      >
        {isGenerating ? (
          <LoadingIndicator />
        ) : svgContent ? (
          <>
            <div
              dangerouslySetInnerHTML={{
                __html: svgContent.replace('<svg', '<svg style="width: 150px; height: 150px;"'),
              }}
            />
            <Typography sx={{ mt: 2, fontSize: 12.5, fontWeight: 500, color: 'var(--green)' }}>
              {generationStatus}
            </Typography>
          </>
        ) : (
          <Typography sx={{ fontSize: 13, color: 'var(--ink-3)' }}>
            El ícono generado aparecerá aquí
          </Typography>
        )}
      </Box>
    );
  };

  // Función para reiniciar el estado del generador
  const handleReset = () => {
    setPrompt('');
    setGeneratedIcon(null);
    setGenerationStatus('');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
      <DialogTitle sx={{ pb: 2 }}>
        <DialogHeading icon={<AutoAwesomeOutlined />} subtitle='Potenciado por QTS Agro IA'>
          Generador de íconos con QTS Agro IA
        </DialogHeading>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormSectionTitle icon={<ScienceOutlined />}>Describe tu ícono</FormSectionTitle>

              <TextField
                fullWidth
                multiline
                rows={4}
                label='Descripción para la IA'
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder='Ej: Un ícono de una hoja de árbol'
                disabled={isGenerating}
              />

              <Box
                sx={{
                  px: 1.5,
                  py: 1.25,
                  borderRadius: '8px',
                  background: 'var(--inset)',
                  boxShadow: 'var(--shadow-hairline)',
                  fontSize: 13,
                  color: 'var(--ink-2)',
                }}
              >
                <Box component='strong' sx={{ color: 'var(--ink)', fontWeight: 600 }}>
                  Sugerencia:
                </Box>{' '}
                Sé lo más específico posible y menciona elementos clave.
              </Box>

              <Alert severity='info'>
                Por ahora genera cualquier cosa; más adelante se puede mejorar.
              </Alert>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                height: '100%',
                borderLeft: { md: '1px solid var(--line)' },
                pl: { md: 3 },
                pt: { xs: 1, md: 0 },
              }}
            >
              <FormSectionTitle icon={<VisibilityOutlined />}>Vista previa</FormSectionTitle>

              {renderPreviewIcon(generatedIcon || '')}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button
          onClick={() => {
            handleReset();
            onClose();
          }}
          variant='outlined'
        >
          Cancelar
        </Button>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {generatedIcon && (
            <Button variant='outlined' onClick={handleReset} startIcon={<AutoAwesomeOutlined />}>
              Generar otro
            </Button>
          )}

          {!generatedIcon ? (
            <Button
              variant='contained'
              onClick={handleGenerate}
              disabled={!prompt || isGenerating}
              startIcon={<AutoAwesomeIcon />}
            >
              Generar con IA
            </Button>
          ) : (
            <Button
              variant='contained'
              onClick={handleConfirm}
              color='primary'
              startIcon={<CheckCircleIcon />}
            >
              Usar este ícono
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};
