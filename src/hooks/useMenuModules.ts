import { HttpStatusCode } from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { MenuModules, MenuOptionType } from '../types';
import { backofficeApi } from '../config';
import { backendErrorMessage } from '../utils/backendError';
import { SystemResponse, systemLabel } from './useSystem';

/** Enum MenuType del back ↔ valores históricos del BO (MenuOptionType). */
const MENU_TYPE_FROM_BACK: Record<string, MenuOptionType> = {
  SIDEBAR: MenuOptionType.SideBar,
  NAVBAR: MenuOptionType.NavBar,
  MODAL: MenuOptionType.Modal,
};
const MENU_TYPE_TO_BACK: Record<string, string> = Object.fromEntries(
  Object.entries(MENU_TYPE_FROM_BACK).map(([back, bo]) => [bo, back]),
);

/** Shape del MenuModuleDto que devuelve el back en /menu-modules. */
interface MenuModuleResponse {
  id: number;
  parentId: number | null;
  menuType: string | null;
  order: number;
  labelEs: string;
  labelEn: string | null;
  labelPt: string | null;
  details: string | null;
  icon: string | null;
  route: string | null;
  full: boolean;
  light: boolean;
  module: { id: string; nameEs: string; icon: string | null };
  system: Omit<SystemResponse, 'technicalDetails'> | null;
}

const fromResponse = (item: MenuModuleResponse): MenuModules => ({
  id: item.id,
  parentId: item.parentId,
  // Sin tipo = opción solo de permisos (no aparece en ningún menú).
  menuType: item.menuType ? MENU_TYPE_FROM_BACK[item.menuType] ?? item.menuType : '',
  // Formato heredado módulo.posición: 6.03 se muestra con 2 decimales.
  order: Number.isInteger(item.order) ? String(item.order) : item.order.toFixed(2),
  menuOption: item.labelEs,
  menuOptionEn: item.labelEn ?? '',
  menuOptionPt: item.labelPt ?? '',
  details: item.details ?? '',
  icon: item.icon ?? '',
  route: item.route ?? '',
  full: item.full ? 'X' : '',
  light: item.light ? 'X' : '',
  module: {
    id: item.module.id,
    moduleNameEs: item.module.nameEs,
    moduleNameEn: '',
    moduleNamePt: '',
    icon: item.module.icon ?? '',
    orden: 0,
  },
  systemId: item.system?.id ?? null,
  systemType: item.system ? systemLabel({ system: item.system.name, version: item.system.version ?? '' }) : '',
});

/** Campos editables (sin id, que es inmutable una vez creado). */
const toEditablePayload = (menu: MenuModules) => ({
  moduleId: menu.module?.id,
  systemId: menu.systemId || null,
  parentId: menu.parentId || null,
  menuType: menu.menuType ? MENU_TYPE_TO_BACK[menu.menuType] ?? menu.menuType : null,
  order: Number(String(menu.order).replace(',', '.')) || 0,
  labelEs: menu.menuOption.trim(),
  labelEn: menu.menuOptionEn || undefined,
  labelPt: menu.menuOptionPt || undefined,
  details: menu.details || undefined,
  icon: menu.icon || undefined,
  route: menu.route || undefined,
  full: menu.full === 'X',
  light: menu.light === 'X',
});

export const useMenuModules = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [menuModules, setMenuModule] = useState<MenuModules[]>([]);

  const getMenuModules = async () => {
    setIsLoading(true);
    try {
      // El back los devuelve ordenados por `order` y después por id.
      const response = await backofficeApi.get<MenuModuleResponse[]>('/menu-modules');
      setMenuModule(response.data.map(fromResponse));
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudieron cargar los menús.', 'error');
      setMenuModule([]);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /** Devuelve true si el back confirmó el alta (la página solo limpia el formulario en ese caso). */
  const createMenuModules = async (newMenu: MenuModules): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.post('/menu-modules', {
        id: Number(newMenu.id),
        ...toEditablePayload(newMenu),
      });
      if (response.status === HttpStatusCode.Created) {
        Swal.fire('Menú', 'Nuevo menú agregado.', 'success');
        navigate('/menus-modules');
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      Swal.fire('Error', backendErrorMessage(error, 'No se pudo crear el menú.'), 'error');
      setError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateMenuModules = async (updatedMenu: MenuModules): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.patch(
        `/menu-modules/${updatedMenu.id}`,
        toEditablePayload(updatedMenu),
      );
      if (response.status === HttpStatusCode.Ok) {
        Swal.fire('Menú', 'Actualizado.', 'success');
        navigate('/menus-modules');
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
      Swal.fire('Error', backendErrorMessage(error, 'No se pudo actualizar el menú.'), 'error');
      setError(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const removeMenuModules = async (menuId: number) => {
    setIsLoading(true);
    try {
      await backofficeApi.delete(`/menu-modules/${menuId}`);
      Swal.fire('Menú', 'Eliminado.', 'success');
      await getMenuModules();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', backendErrorMessage(error, 'No se pudo eliminar el menú.'), 'error');
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    //* Propiedades
    error,
    isLoading,
    menuModules,

    //* Métodos
    createMenuModules,
    getMenuModules,
    setMenuModule,
    updateMenuModules,
    removeMenuModules,
  };
};
