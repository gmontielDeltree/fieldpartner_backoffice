import React, { useState, useMemo } from 'react';
import * as MuiIcons from '@mui/icons-material';
import { AutoSizer, Grid as VirtualizedGrid } from 'react-virtualized';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Tooltip,
  Tabs,
  Tab,
} from '@mui/material';
import { AddRounded, InterestsOutlined } from '@mui/icons-material';
import { iconCategories } from '../../helpers/iconsByCategory';
import { IconGeneratorModal } from '../IconGeneratorModal/IconGeneratorModal';
import { iconStorageService } from '../../services/iconStorageService';
import { DialogHeading, SearchField } from '../ui';

interface IconSelectorModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
}

export const IconSelectorModal: React.FC<IconSelectorModalProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  const handleGeneratedIcon = (iconSvg: string) => {
    console.log('Icon generated:', iconSvg);
    // Generar un nombre único para el ícono
    const iconName = `Custom${Date.now()}Icon`;

    // Guardar el ícono en el storage
    iconStorageService.saveIcon(iconName, iconSvg);

    // Cerrar el modal de generación pero NO el selector
    setIsGeneratorOpen(false);

    // Actualizar la selección actual
    setSelectedIcon(iconName);
  };

  // Modificar la memoización de la lista de íconos para eliminar duplicados
  const iconList = useMemo(() => {
    // Crear un Map para detectar duplicados basados en el nombre normalizado
    const uniqueIcons = new Map();

    Object.keys(MuiIcons)
      .filter(key => key !== 'default')
      .forEach(name => {
        // Normalizar el nombre del ícono removiendo sufijos comunes
        const normalizedName = name
          .replace(/Outlined$/, '')
          .replace(/Rounded$/, '')
          .replace(/Sharp$/, '')
          .replace(/TwoTone$/, '')
          .replace(/Icon$/, '');

        // Solo guardar el primer ícono encontrado para cada nombre normalizado
        if (!uniqueIcons.has(normalizedName)) {
          uniqueIcons.set(normalizedName, {
            name,
            Icon: MuiIcons[name as keyof typeof MuiIcons],
            normalizedName,
          });
        }
      });

    // Convertir el Map a array
    return Array.from(uniqueIcons.values());
  }, []);

  // El resto del filtrado permanece similar pero usa el nombre normalizado para búsquedas
  const filteredIcons = useMemo(() => {
    let filtered = iconList;

    if (selectedCategory !== 'all') {
      const category = iconCategories.find(cat => cat.id === selectedCategory);
      if (category?.icons) {
        filtered = filtered.filter(icon =>
          category.icons.some(
            categoryIcon => icon.normalizedName.toLowerCase() === categoryIcon.toLowerCase(),
          ),
        );
      }
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        ({ name, normalizedName }) =>
          name.toLowerCase().includes(term) || normalizedName.toLowerCase().includes(term),
      );
    }

    return filtered;
  }, [iconList, searchTerm, selectedCategory]);

  // Configuración de la grid virtualizada
  const COLUMN_WIDTH = 100;
  const ROW_HEIGHT = 100;
  const COLUMNS_PER_ROW = 6;

  const cellRenderer = ({
    columnIndex,
    key,
    rowIndex,
    style,
  }: {
    columnIndex: number;
    key: string;
    rowIndex: number;
    style: React.CSSProperties;
  }) => {
    const index = rowIndex * COLUMNS_PER_ROW + columnIndex;
    const icon = filteredIcons[index];

    if (!icon) return null;

    const { name, Icon } = icon;
    const isSelected = selectedIcon === name;

    return (
      <Tooltip title={name.replace(/([A-Z])/g, ' $1').trim()} key={key}>
        <Box
          style={style}
          onClick={() => setSelectedIcon(name)}
          role='button'
          aria-pressed={isSelected}
          sx={{ p: '4px', cursor: 'pointer' }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              width: '100%',
              height: '100%',
              px: 1,
              borderRadius: '10px',
              color: isSelected ? 'var(--accent-ink)' : 'var(--ink-2)',
              background: isSelected ? 'var(--accent-tint)' : 'transparent',
              boxShadow: isSelected ? 'inset 0 0 0 1.5px var(--accent)' : 'none',
              transition: 'background-color 140ms ease, color 140ms ease',
              '&:hover': {
                backgroundColor: isSelected ? 'var(--accent-tint)' : 'var(--hover)',
                color: isSelected ? 'var(--accent-ink)' : 'var(--ink)',
              },
            }}
          >
            <Icon sx={{ fontSize: 28 }} />
            <Typography
              variant='caption'
              noWrap
              sx={{
                maxWidth: '100%',
                fontSize: 11.5,
                fontWeight: isSelected ? 500 : 400,
                color: 'inherit',
              }}
            >
              {name.replace(/([A-Z])/g, ' $1').trim()}
            </Typography>
          </Box>
        </Box>
      </Tooltip>
    );
  };

  const handleIconSelect = (iconName: string) => {
    // Si es un ícono generado, obtenerlo del storage
    const storedIcon = iconStorageService.getIcon(iconName);
    if (storedIcon) {
      // Aquí solo pasamos el nombre del ícono que se guardará en MenuModules
      onSelect(iconName);
    } else {
      // Para íconos de Material-UI, comportamiento normal
      onSelect(iconName);
    }
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh', // Altura fija del modal
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1.5, flex: '0 0 auto' /* Evita que el título se encoja */ }}>
          <DialogHeading icon={<InterestsOutlined />}>Seleccionar ícono</DialogHeading>
        </DialogTitle>

        <DialogContent
          sx={{
            pt: 0.5,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            flex: '1 1 auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              mb: 1,
              flex: '0 0 auto',
            }}
          >
            <SearchField
              name='searchTerm'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder='Buscar ícono…'
            />
            <Button
              variant='outlined'
              startIcon={<AddRounded />}
              onClick={() => setIsGeneratorOpen(true)}
            >
              Nuevo
            </Button>
          </Box>

          <Tabs
            value={selectedCategory}
            onChange={(_, value) => setSelectedCategory(value)}
            variant='scrollable'
            scrollButtons='auto'
            sx={{
              mb: 1.5,
              borderBottom: '1px solid var(--line)',
              flex: '0 0 auto', // Evita que los tabs se encojan
            }}
          >
            {iconCategories.map(category => (
              <Tab key={category.id} label={category.label} value={category.id} />
            ))}
          </Tabs>

          <Box sx={{ flex: '1 1 auto', minHeight: 0, mx: -0.5 }}>
            <AutoSizer>
              {({ width, height }: { width: number; height: number }) => {
                const columnCount = Math.floor(width / COLUMN_WIDTH);
                const rowCount = Math.ceil(filteredIcons.length / columnCount);

                return (
                  <VirtualizedGrid
                    cellRenderer={cellRenderer}
                    columnCount={columnCount}
                    columnWidth={COLUMN_WIDTH}
                    height={height}
                    rowCount={rowCount}
                    rowHeight={ROW_HEIGHT}
                    width={width}
                  />
                );
              }}
            </AutoSizer>
          </Box>
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid var(--line)', pt: 1.5, flex: '0 0 auto' /* Evita que los botones se encojan */ }}>
          <Button onClick={onClose} variant='outlined'>
            Cancelar
          </Button>
          <Button
            variant='contained'
            disabled={!selectedIcon}
            onClick={() => {
              if (selectedIcon) {
                handleIconSelect(selectedIcon);
              }
            }}
            color='primary'
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>

      <IconGeneratorModal
        open={isGeneratorOpen}
        onClose={() => setIsGeneratorOpen(false)}
        onIconGenerated={handleGeneratedIcon}
      />
    </>
  );
};
