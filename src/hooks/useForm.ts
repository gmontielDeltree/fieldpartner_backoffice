import { SelectChangeEvent } from '@mui/material';
import { ChangeEvent, useState } from 'react';

// export function useForm<T>( initialState: T) {}
// const currentYear = new Date().getFullYear();
export const useForm = <T extends object>(initialState: T) => {

    const [formValues, setFormValues] = useState(initialState);

    const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = target;

        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleSelectChange = ({ target }: SelectChangeEvent) => {
        const { name, value } = target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleYearChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = target;

        if (/^\d*$/.test(value) && value.length <= 4) {
            setFormValues({
                ...formValues,
                [name]: value
            });
        }
    };

    const handleCheckboxChange = ({ target }: ChangeEvent<HTMLInputElement>, checked: boolean) => {
        const { name } = target;
        setFormValues({
            ...formValues,
            [name]: checked
        });
    }

    const reset = () => {
        setFormValues(initialState);
    }

    const handleFormValueChange = (key: string, value: string) => {
        setFormValues({
            ...formValues,
            [key]: value
        })
    }

    return {
        formValues,
        handleInputChange,
        handleSelectChange,
        setFormValues,
        reset,
        handleYearChange,
        handleFormValueChange,
        handleCheckboxChange,
        ...formValues
    }
};
