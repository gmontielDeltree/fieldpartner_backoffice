interface StoredIcon {
  name: string;
  svg: string;
  timestamp: number;
}

const STORAGE_KEY = 'custom_icons';

export const iconStorageService = {
  saveIcon(name: string, svgString: string): void {
    if (!this.validateIcon(svgString)) {
      console.error('SVG inválido:', svgString);
      throw new Error('SVG inválido');
    }

    const icons = this.getIcons();
    icons[name] = {
      name,
      svg: svgString,
      timestamp: Date.now(),
    };

    console.log('Guardando ícono:', name);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(icons));
  },

  getIcon(name: string): string | null {
    const icons = this.getIcons();
    const icon = icons[name];

    if (icon?.svg) {
      // Asegurarse de que el SVG mantenga el tamaño correcto y sea visible
      return icon.svg.replace(
        '<svg',
        '<svg style="width: 24px; height: 24px; display: inline-block;"',
      );
    }

    return null;
  },

  getIcons(): Record<string, StoredIcon> {
    // Usar la interfaz StoredIcon
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY); // Usar STORAGE_KEY
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  validateIcon(svg: string): boolean {
    const isValidSvg =
      svg.includes('<svg') &&
      svg.includes('</svg>') &&
      svg.includes('viewBox="0 0 24 24"') &&
      (svg.includes('width="24"') || svg.includes('height="24"'));

    // Verificar si el SVG usa demasiados círculos
    const circleCount = (svg.match(/circle|rx="|cy="|r="|ellipse/g) || []).length;
    const pathCount = (svg.match(/<path/g) || []).length;

    if (circleCount > pathCount && !svg.toLowerCase().includes('circle')) {
      console.warn('⚠️ SVG uses too many circular elements');
      return false;
    }

    console.log('Validación de SVG:', isValidSvg ? 'Válido' : 'Inválido');
    return isValidSvg;
  },
};
