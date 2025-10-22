import * as XLSX from 'xlsx';
import { MenuModules } from '../types';

/**
 * Exporta un array de MenuModules a formato Excel (.xlsx)
 * @param data - Array de MenuModules a exportar
 * @param fileName - Nombre del archivo (opcional, se genera automáticamente si no se proporciona)
 * @returns void - Descarga automáticamente el archivo
 */
export const exportMenuModulesToExcel = (
  data: MenuModules[],
  fileName?: string
): void => {
  // 1. Formatear datos para Excel (todos los campos)
  const formattedData = data.map(item => ({
    'ID': item.id || '-',
    'Orden': item.order || '-',
    'Módulo': item.module?.moduleNameEs || '-',
    'Sistema': item.systemType || '-',
    'Menú (ES)': item.menuOption || '-',
    'Menú (EN)': item.menuOptionEn || '-',
    'Menú (PT)': item.menuOptionPt || '-',
    'Tipo': item.menuType || '-',
    'Ícono': item.icon || '-',
    'Ruta': item.route || '-',
    'Full': item.full || '',
    'Light': item.light || '',
    'Detalles': item.details || '-',
  }));

  // 2. Crear worksheet
  const ws = XLSX.utils.json_to_sheet(formattedData);

  // 3. Ajustar ancho de columnas automáticamente
  const colWidths = [
    { wch: 8 },  // ID
    { wch: 8 },  // Orden
    { wch: 20 }, // Módulo
    { wch: 15 }, // Sistema
    { wch: 25 }, // Menú ES
    { wch: 25 }, // Menú EN
    { wch: 25 }, // Menú PT
    { wch: 12 }, // Tipo
    { wch: 15 }, // Ícono
    { wch: 35 }, // Ruta
    { wch: 6 },  // Full
    { wch: 6 },  // Light
    { wch: 40 }, // Detalles
  ];
  ws['!cols'] = colWidths;

  // 4. Crear workbook y agregar worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Menús y Módulos');

  // 5. Generar nombre de archivo con timestamp
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, -5)
    .replace('T', '_');
  const finalFileName = fileName || `MenuModulos_${timestamp}.xlsx`;

  // 6. Descargar archivo
  XLSX.writeFile(wb, finalFileName);
};

/**
 * Exporta un array de MenuModules a formato CSV
 * @param data - Array de MenuModules a exportar
 * @param fileName - Nombre del archivo (opcional)
 */
export const exportMenuModulesToCSV = (
  data: MenuModules[],
  fileName?: string
): void => {
  // Formatear datos
  const formattedData = data.map(item => ({
    'ID': item.id || '-',
    'Orden': item.order || '-',
    'Módulo': item.module?.moduleNameEs || '-',
    'Sistema': item.systemType || '-',
    'Menú (ES)': item.menuOption || '-',
    'Menú (EN)': item.menuOptionEn || '-',
    'Menú (PT)': item.menuOptionPt || '-',
    'Tipo': item.menuType || '-',
    'Ícono': item.icon || '-',
    'Ruta': item.route || '-',
    'Full': item.full || '',
    'Light': item.light || '',
    'Detalles': item.details || '-',
  }));

  // Crear worksheet
  const ws = XLSX.utils.json_to_sheet(formattedData);

  // Crear workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Menús y Módulos');

  // Generar nombre de archivo
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, -5)
    .replace('T', '_');
  const finalFileName = fileName || `MenuModulos_${timestamp}.csv`;

  // Descargar como CSV
  XLSX.writeFile(wb, finalFileName, { bookType: 'csv' });
};

/**
 * Tipo de exportación disponible
 */
export type ExportFormat = 'excel' | 'csv';

/**
 * Exporta MenuModules al formato especificado
 * @param data - Array de MenuModules a exportar
 * @param format - Formato de exportación ('excel' o 'csv')
 * @param fileName - Nombre del archivo (opcional)
 */
export const exportMenuModules = (
  data: MenuModules[],
  format: ExportFormat = 'excel',
  fileName?: string
): void => {
  if (format === 'excel') {
    exportMenuModulesToExcel(data, fileName);
  } else if (format === 'csv') {
    exportMenuModulesToCSV(data, fileName);
  }
};
