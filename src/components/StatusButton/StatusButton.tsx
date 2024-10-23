import { Typography, Grid, Switch, Box } from '@mui/material';
import { DeviceStatus } from '../../types';

interface StatusButtonProps {
  available: DeviceStatus; // Tipo explícito
  onSwitchChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Tipo para el manejador de cambios
}

const StatusButton: React.FC<StatusButtonProps> = ({ available, onSwitchChange }) => {
  return (
    <Box
      sx={{
        width: 200, 
        height: 200, 
        border: '1px solid #ccc',
        borderRadius: 2,
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
        Disponible: {available === DeviceStatus.Inactivo ? 'Inactivo' : 'Activo'}
      </Typography>
      <Grid container alignItems="center" justifyContent="center">
        <Typography variant="body2" color="textPrimary" sx={{ mr: 1 }}>
        Inactivo
        </Typography>
        <Switch
          checked={available === DeviceStatus.Activo}
          onChange={onSwitchChange} 
          name="manual"
          color="primary"
        />
        <Typography variant="body2" color="textPrimary" sx={{ ml: 1 }}>
        Activo
        </Typography>
      </Grid>
    </Box>
  );
};

export default StatusButton;
