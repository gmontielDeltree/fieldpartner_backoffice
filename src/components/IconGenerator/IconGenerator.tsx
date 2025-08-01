import React from 'react';
import { Button } from '@mui/material';
import { generateMaterialIcon } from '../../services/iconGeneratorService';

interface IconGeneratorProps {
  onIconGenerated?: (icon: string) => void;
  onError?: (error: Error) => void;
  prompt: string;
  buttonText?: string;
}

export const IconGenerator: React.FC<IconGeneratorProps> = ({
  onIconGenerated,
  onError,
  prompt,
  buttonText = 'Generar Ícono',
}) => {
  const handleGenerateIcon = async () => {
    try {
      const iconResponse = await generateMaterialIcon(prompt);

      if (onIconGenerated) {
        onIconGenerated(iconResponse.icon);
      }
    } catch (error) {
      console.error('Error generando icono:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  };

  return (
    <Button variant='contained' color='primary' onClick={handleGenerateIcon} fullWidth>
      {buttonText}
    </Button>
  );
};
