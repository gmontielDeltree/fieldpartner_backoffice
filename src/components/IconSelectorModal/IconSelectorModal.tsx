import React, { useState, useMemo } from 'react';
import * as MuiIcons from '@mui/icons-material';
import { AutoSizer, Grid as VirtualizedGrid } from 'react-virtualized';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  InputAdornment,
  Typography,
  Button,
  Tooltip,
  Tabs,
  Tab,
  Grid,
} from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { purpleTheme } from '../../themes/purpleTheme';
import { iconCategories } from '../../helpers/iconsByCategory';
import { IconGeneratorModal } from '../IconGeneratorModal/IconGeneratorModal';
import { iconStorageService } from '../../services/iconStorageService';

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
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            p: 1,
            border: isSelected
              ? `2px solid ${purpleTheme.palette.primary.main}`
              : '2px solid transparent',
            borderRadius: 1,
            '&:hover': {
              backgroundColor: purpleTheme.palette.action?.hover || 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <Icon
            sx={{
              fontSize: 32,
              color: isSelected ? purpleTheme.palette.primary.main : 'inherit',
            }}
          />
          <Typography
            variant='caption'
            noWrap
            sx={{
              color: isSelected ? purpleTheme.palette.primary.main : 'inherit',
              mt: 1,
            }}
          >
            {name.replace(/([A-Z])/g, ' $1').trim()}
          </Typography>
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
            borderRadius: 1,
            height: '80vh', // Altura fija del modal
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            textAlign: 'center',
            py: 2,
            flex: '0 0 auto', // Evita que el título se encoja
          }}
        >
          Seleccionar Ícono
        </DialogTitle>

        <DialogContent
          sx={{
            pt: 3,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            flex: '1 1 auto',
          }}
        >
          <Grid
            container
            spacing={0}
            direction='row'
            alignItems='center'
            justifyContent='space-between'
            sx={{ mb: 3 }}
          >
            <Grid item xs={6} sm={2}>
              <Button
                variant='contained'
                color='primary'
                startIcon={<AddIcon />}
                fullWidth
                onClick={() => setIsGeneratorOpen(true)}
              >
                Nuevo
              </Button>
            </Grid>
            <Grid item xs={12} sm={10}>
              <Grid container justifyContent='flex-end'>
                <Grid item xs={8} sm={5}>
                  <TextField
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder='Buscar ícono...'
                    size='small'
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position='start'>
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={4} sm={3}>
                  <Button
                    variant='contained'
                    color='secondary'
                    size='medium'
                    fullWidth
                    sx={{
                      height: '98%',
                      margin: 'auto',
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                    startIcon={<SearchIcon />}
                  >
                    Buscar
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Tabs
            value={selectedCategory}
            onChange={(_, value) => setSelectedCategory(value)}
            sx={{
              mb: 3,
              flex: '0 0 auto', // Evita que los tabs se encojan
            }}
            TabIndicatorProps={{
              sx: { backgroundColor: purpleTheme.palette.primary.main },
            }}
          >
            {iconCategories.map(category => (
              <Tab
                key={category.id}
                label={category.label}
                value={category.id}
                sx={{
                  '&.Mui-selected': {
                    color: purpleTheme.palette.primary.main,
                  },
                }}
              />
            ))}
          </Tabs>

          <Box sx={{ flex: '1 1 auto', minHeight: 0 }}>
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

        <DialogActions
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flex: '0 0 auto', // Evita que los botones se encojan
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              px: 4, // Padding horizontal para hacer los botones más anchos
            }}
            variant='outlined'
          >
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
            sx={{
              px: 4, // Padding horizontal para hacer los botones más anchos
            }}
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
