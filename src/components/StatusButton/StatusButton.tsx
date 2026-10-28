import { Box, Switch, Typography } from '@mui/material';
import { DeviceStatus } from '../../types';
import { StatusPill } from '../ui';

interface StatusButtonProps {
  available: DeviceStatus; // Tipo explícito
  onSwitchChange: (event: React.ChangeEvent<HTMLInputElement>) => void; // Tipo para el manejador de cambios
}

/* Disponibilidad con la altura de un input: rótulo, estado en píldora
 * y el interruptor a la derecha. Misma API y mismo Switch que antes. */
const StatusButton: React.FC<StatusButtonProps> = ({ available, onSwitchChange }) => {
  const label = available === DeviceStatus.Inactivo ? 'Inactivo' : 'Activo';
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1.5,
        minHeight: 40,
        pl: 1.5,
        pr: 0.75,
        py: 0.5,
        borderRadius: '8px',
        background: 'var(--inset)',
        boxShadow: 'var(--shadow-hairline)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
        <Typography component="span" sx={{ fontSize: 13, color: 'var(--ink-2)' }}>
          Disponible
        </Typography>
        <StatusPill status={label === 'Activo' ? 'done' : 'neutral'} size="sm" dot>
          {label}
        </StatusPill>
      </Box>
      <Switch
        checked={available === DeviceStatus.Activo}
        onChange={onSwitchChange}
        name="manual"
        color="primary"
        inputProps={{ 'aria-label': 'Disponible' }}
      />
    </Box>
  );
};

export default StatusButton;
