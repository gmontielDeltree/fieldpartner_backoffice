import React from 'react';
import * as MuiIcons from '@mui/icons-material';
import { iconStorageService } from '../../services/iconStorageService';
import { Box } from '@mui/material';

interface DynamicIconProps {
  iconName: string;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ iconName }) => {
  // Primero intentar obtener del storage
  const storedIcon = iconStorageService.getIcon(iconName);
  if (storedIcon) {
    return (
      <Box
        component="span"
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 24,
          height: 24
        }}
        dangerouslySetInnerHTML={{ 
          __html: storedIcon.replace(
            '<svg',
            '<svg style="width: 100%; height: 100%;"'
          )
        }}
      />
    );
  }

  // Si no existe en storage, usar Material-UI
  const Icon = MuiIcons[iconName as keyof typeof MuiIcons];
  return Icon ? <Icon /> : null;
};
