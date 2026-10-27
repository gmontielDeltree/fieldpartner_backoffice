import React from 'react';
import {
  AccountTreeOutlined,
  BadgeOutlined,
  CategoryOutlined,
  ComputerOutlined,
  DisplaySettingsOutlined,
  Inventory2Outlined,
  KeyOutlined,
  ListAltOutlined,
  PeopleAltOutlined,
  PersonOutlineRounded,
  PublicOutlined,
  SettingsInputAntennaOutlined,
  SettingsOutlined,
  SyncAltOutlined,
  TuneOutlined,
  ViewModuleOutlined,
  YardOutlined,
} from '@mui/icons-material';

/* ─────────────────────────────────────────────────────────
 * NAVEGACIÓN DEL BACKOFFICE
 * El backoffice no tiene menú en la base (a diferencia de
 * FieldPartner): las pantallas son fijas. Acá vive el árbol que
 * usan la barra lateral, las migas de la barra superior y el
 * buscador ⌘K, así los tres dicen lo mismo.
 * ───────────────────────────────────────────────────────── */

export interface NavItem {
  key: string;
  label: string;
  route: string;
  icon: React.ReactNode;
  /** prefijos de las pantallas hijas (alta/edición) que cuentan como esta */
  prefixes: string[];
  /** ?view= de la pantalla, para Menús / Módulos que comparten ruta */
  view?: string;
}

export interface NavGroup {
  key: string;
  label: string;
  icon: React.ReactNode;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    key: 'access',
    label: 'Usuarios y cuentas',
    icon: <PeopleAltOutlined />,
    items: [
      { key: 'users', label: 'Usuarios Backoffice', route: '/list-user', icon: <PersonOutlineRounded />, prefixes: ['/list-user', '/user'] },
      { key: 'accounts', label: 'Cuentas', route: '/accounts', icon: <BadgeOutlined />, prefixes: ['/accounts'] },
    ],
  },
  {
    key: 'licensing',
    label: 'Licencias',
    icon: <KeyOutlined />,
    items: [
      { key: 'system', label: 'Sistemas', route: '/system', icon: <ComputerOutlined />, prefixes: ['/system'] },
      { key: 'licences', label: 'Licencias', route: '/licences', icon: <DisplaySettingsOutlined />, prefixes: ['/licences'] },
    ],
  },
  {
    key: 'menus',
    label: 'Menús y módulos',
    icon: <AccountTreeOutlined />,
    items: [
      { key: 'menus', label: 'Menús', route: '/menus-modules', icon: <ListAltOutlined />, prefixes: ['/menus-modules'], view: 'menus' },
      { key: 'modules', label: 'Módulos', route: '/menus-modules?view=modules', icon: <ViewModuleOutlined />, prefixes: ['/menus-modules', '/modules'], view: 'modules' },
    ],
  },
  {
    key: 'masters',
    label: 'Maestros',
    icon: <TuneOutlined />,
    items: [
      { key: 'categories', label: 'Categorías', route: '/categories', icon: <CategoryOutlined />, prefixes: ['/categories', '/category'] },
      { key: 'crops', label: 'Cultivos', route: '/crops', icon: <YardOutlined />, prefixes: ['/crops'] },
      { key: 'country', label: 'Países', route: '/country', icon: <PublicOutlined />, prefixes: ['/country'] },
      { key: 'type-supplies', label: 'Tipos de insumos', route: '/type-supplies', icon: <Inventory2Outlined />, prefixes: ['/type-supplies'] },
      { key: 'type-movement', label: 'Tipos de movimientos', route: '/type-movement', icon: <SyncAltOutlined />, prefixes: ['/type-movement'] },
      { key: 'type-of-devices', label: 'Tipos de dispositivos', route: '/type-of-devices', icon: <SettingsInputAntennaOutlined />, prefixes: ['/type-of-devices'] },
    ],
  },
  {
    key: 'settings',
    label: 'Configuración',
    icon: <SettingsOutlined />,
    items: [
      { key: 'settings', label: 'Configuración', route: '/settings', icon: <SettingsOutlined />, prefixes: ['/settings'] },
    ],
  },
];

export const NAV_FLAT = NAV_GROUPS.flatMap(group => group.items.map(item => ({ group, item })));

export interface NavMatch {
  group: NavGroup;
  item: NavItem;
  /** 'new' en /…/new, 'edit' en /…/:id, null en la lista */
  detail: 'new' | 'edit' | null;
}

const startsWithSegment = (pathname: string, prefix: string) =>
  pathname === prefix || pathname.startsWith(`${prefix}/`);

/** Pantalla del menú que corresponde a la ruta actual (con sus altas y ediciones). */
export const matchNav = (pathname: string, search = ''): NavMatch | null => {
  const view = new URLSearchParams(search).get('view');
  for (const { group, item } of NAV_FLAT) {
    const prefix = item.prefixes.find(p => startsWithSegment(pathname, p));
    if (!prefix) continue;
    // Menús y Módulos comparten /menus-modules: decide ?view=
    if (item.view && pathname === '/menus-modules' && (view === 'modules' ? 'modules' : 'menus') !== item.view) continue;
    if (item.view === 'modules' && pathname !== '/menus-modules' && pathname !== '/modules') continue;
    const rest = pathname.slice(prefix.length).replace(/^\/+/, '');
    return { group, item, detail: !rest ? null : rest === 'new' ? 'new' : 'edit' };
  }
  return null;
};
