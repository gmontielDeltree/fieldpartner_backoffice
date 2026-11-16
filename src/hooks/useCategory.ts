import { HttpStatusCode } from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Category } from '../types';
import { backofficeApi } from '../config';

export const useCategory = () => {
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const getCategories = async () => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.get<Category[]>('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se encontraron categorías.', 'error');
      setCategories([]);
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCategory = async (newCategory: Category) => {
    setIsLoading(true);
    try {
      const response = await backofficeApi.post('/categories', {
        idCategory: newCategory.idCategory,
        descriptionES: newCategory.descriptionES,
        descriptionPT: newCategory.descriptionPT,
        descriptionEN: newCategory.descriptionEN,
      });
      if (response.status === HttpStatusCode.Created) {
        Swal.fire('Categoría', 'Nueva Categoría agregada.', 'success');
        navigate('/categories');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Ups', 'Ocurrió un error inesperado.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (updatedCategory: Category) => {
    const id = updatedCategory.id;
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await backofficeApi.patch(`/categories/${id}`, {
        idCategory: updatedCategory.idCategory,
        descriptionES: updatedCategory.descriptionES,
        descriptionPT: updatedCategory.descriptionPT,
        descriptionEN: updatedCategory.descriptionEN,
      });
      if (response.status === HttpStatusCode.Ok) {
        Swal.fire('Categoría', 'Actualizado.', 'success');
        navigate('/categories');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo actualizar la categoría.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeCategory = async (categoryId: string) => {
    setIsLoading(true);
    try {
      await backofficeApi.delete(`/categories/${categoryId}`);
      Swal.fire('Categoría', 'Eliminada.', 'success');
      getCategories();
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'No se pudo eliminar la categoría.', 'error');
      if (error) setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const categoryIdExists = async (idCategory: string) => {
    try {
      if (!idCategory) return false;
      const response = await backofficeApi.get<Category[]>('/categories');
      return response.data.some(category => category.idCategory === idCategory);
    } catch (error) {
      console.error(error);
      Swal.fire('Ups', 'Ocurrió un error inesperado.', 'error');
      return false;
    }
  };

  return {
    //* Propiedades
    error,
    isLoading,
    categories,

    //* Métodos
    createCategory,
    getCategories,
    setCategories,
    updateCategory,
    removeCategory,
    categoryIdExists,
  };
};
