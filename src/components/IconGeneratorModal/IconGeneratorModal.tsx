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
  useTheme,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ScienceIcon from '@mui/icons-material/Science';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { generateMaterialIcon } from '../../services/iconGeneratorService';

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
  const theme = useTheme();

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
        size={80}
        thickness={4}
        sx={{
          color: theme.palette.primary.main,
          mb: 2,
        }}
      />
      <Typography variant='body2' color='textSecondary' sx={{ mb: 1 }}>
        {generationStatus}
      </Typography>
      <Typography variant='caption' color='textSecondary'>
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
          backgroundColor: 'background.paper',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider',
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
            <Typography variant='caption' color='success.main' sx={{ mt: 2 }}>
              {generationStatus}
            </Typography>
          </>
        ) : (
          <Typography variant='body2' color='textSecondary'>
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 3,
          background: theme.palette.background.paper,
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          py: 3,
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.getContrastText(theme.palette.primary.light),
          position: 'relative',
        }}
      >
        <Box display='flex' alignItems='center' justifyContent='center' gap={1}>
          <AutoAwesomeIcon fontSize='large' />
          <Typography variant='h5' component='div'>
            Generador de Íconos con QTS Agro IA
          </Typography>
        </Box>
        <Typography variant='subtitle1' sx={{ mt: 1, opacity: 0.9 }}>
          Potenciado por QTS Agro IA
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <ScienceIcon color='primary' />
                <Typography variant='h6'>Describe tu ícono</Typography>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={4}
                label='Descripción para la IA'
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder='Ej: Un ícono de una hoja de árbol'
                disabled={isGenerating}
                sx={{ mb: 1 }}
              />

              <Box
                sx={{
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 1,
                  p: 2,
                  borderLeft: `4px solid ${theme.palette.info.main}`,
                }}
              >
                <Typography variant='body2' color='textSecondary'>
                  <strong>Sugerencia:</strong> Sé lo más específico posible y menciona elementos
                  clave.
                </Typography>
              </Box>

              <Alert severity='info' sx={{ mt: 1 }}>
                Por ahora genera cualquier cosa mas adelante se puede mejorar
              </Alert>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                borderLeft: { md: `1px solid ${theme.palette.divider}` },
                pl: { md: 3 },
                pt: { xs: 3, md: 0 },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AutoAwesomeIcon color='primary' />
                <Typography variant='h6'>Vista previa</Typography>
              </Box>

              {renderPreviewIcon(generatedIcon || '')}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          justifyContent: 'space-between',
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          onClick={() => {
            handleReset();
            onClose();
          }}
          color='inherit'
          variant='outlined'
        >
          Cancelar
        </Button>

        <Box sx={{ display: 'flex', gap: 2 }}>
          {generatedIcon && (
            <Button variant='outlined' onClick={handleReset} startIcon={<AutoAwesomeIcon />}>
              Generar otro
            </Button>
          )}

          {!generatedIcon ? (
            <Button
              variant='contained'
              onClick={handleGenerate}
              disabled={!prompt || isGenerating}
              startIcon={<AutoAwesomeIcon />}
              sx={{ minWidth: 180 }}
            >
              Generar con IA
            </Button>
          ) : (
            <Button
              variant='contained'
              onClick={handleConfirm}
              color='primary'
              startIcon={<CheckCircleIcon />}
              sx={{ minWidth: 180 }}
            >
              Usar este ícono
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};
