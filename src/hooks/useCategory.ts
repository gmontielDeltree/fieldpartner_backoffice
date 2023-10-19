import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useState } from "react"
import { Category } from "../types";
import { dbContext } from "../services/pouchdbService";


export const useCategory = () => {

    const navigate = useNavigate();
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);


    const createCategory = async (newCategory: Category) => {
        setIsLoading(true);
        try {
            const response = await dbContext.categories.post(newCategory);

            setIsLoading(false);
            if (response.ok)
                Swal.fire('Categoría', 'Nueva Categoría agregada.', 'success');
            else
                Swal.fire('Cliente', 'Verificar campos obligatorios.', 'error');

            navigate('/categories');
        } catch (error) {
            console.log(error)
            Swal.fire('Ups', 'Ocurrio un error inesperado ', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const getCategories = async () => {
        setIsLoading(true);
        try {
            const response = await dbContext.categories.allDocs({ include_docs: true });

            setIsLoading(false);

            if (response.rows.length) {
                const documents: Category[] = response.rows.map(row => row.doc as Category);
                setCategories(documents);
            }
            else
                setCategories([]);

        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron categorias.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const updateCategory = async (updateCategory: Category) => {
        setIsLoading(true);

        try {
            const response = await dbContext.categories.put(updateCategory);
            setIsLoading(false);

            if (response.ok)
                Swal.fire('Categoría', 'Actualizado.', 'success');

            navigate('/categories');
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron categorias.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }

    const removeCategory = async (categoryId: string, revCategory: string) => {
        setIsLoading(true);

        try {
            const response = await dbContext.categories.remove(categoryId, revCategory);
            setIsLoading(false);

            if (response.ok)
                Swal.fire('Categoría', 'Eliminada.', 'success');

            navigate('/categories');
        } catch (error) {
            console.log(error)
            Swal.fire('Error', 'No se encontraron categorias.', 'error');
            setIsLoading(false);
            if (error) setError(error);
        }
    }



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
        removeCategory
    }
}