import React, { useEffect, useState } from "react";
import { FormActions, FormCard, Loading, PageContainer, PageHeader } from "../../components";
import { Button, Grid, TextField } from "@mui/material";
import { CategoryOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useCategory, useForm } from "../../hooks";
import { Category } from "../../types";
import { removeCategoryActive } from "../../store/category";
import Swal from "sweetalert2";

const initialForm: Category = {
  idCategory: "",
  description: "",
  descriptionPt: "",
  descriptionEn: ""
};

export const CategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categoryActive } = useAppSelector((state) => state.category); // Alta de usuario
  const [disabledButton, setDisabledButton] = useState(false);
  const {
    idCategory,
    description,
    descriptionPt,
    descriptionEn,
    formValues,
    setFormValues,
    handleInputChange,
    reset,
  } = useForm<Category>(initialForm);

  const { isLoading, createCategory, updateCategory, categoryIdExists } = useCategory();

  const handleAddCategory = () => {
    createCategory(formValues);
    reset();
  };

  const handleUpdateCategory = () => {
    if (!formValues._id) return;
    updateCategory(formValues);
  };

  const onClickCancel = () => {
    dispatch(removeCategoryActive());
    navigate("/categories");
  };

  const onBlurIdCategory = async () => {
    try {
      if (await categoryIdExists(idCategory)) {
        setDisabledButton(true);
        Swal.fire({
          title: 'Categoría',
          text: `El Id categoría ${idCategory} ya existe.`,
          icon: 'warning',
          timer: 2000, // Se autocierra después de 2 segundos
          timerProgressBar: true, // Muestra una barra de progreso
        });
      }
      else {
        setDisabledButton(false);
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  useEffect(() => {
    if (categoryActive) setFormValues(categoryActive);
    else setFormValues(initialForm);
  }, [categoryActive, setFormValues]);

  useEffect(() => {
    return () => {
      dispatch(removeCategoryActive());
    };
  }, [dispatch]);

  return (
    <>
      <Loading key="loading-new-customer" loading={isLoading} />
      <PageContainer maxWidth={980}>
        <PageHeader
          icon={<CategoryOutlined />}
          eyebrow="Maestros · Categorías"
          title={categoryActive ? "Editar categoría" : "Nueva categoría"}
          onBack={onClickCancel}
        />
        <FormCard title="Datos de la categoría" subtitle="El ID no se puede repetir." icon={<CategoryOutlined />}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="ID Categoria"
                variant="outlined"
                type="text"
                name="idCategory"
                value={idCategory}
                onBlur={onBlurIdCategory}
                onChange={handleInputChange}
                inputProps={{ maxLength: 30 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={8} sx={{ display: { xs: "none", sm: "block" } }} />
            <Grid item xs={12} sm={4}>
              <TextField
                label="Descripcion ES"
                variant="outlined"
                type="text"
                name="description"
                value={description}
                onChange={handleInputChange}
                inputProps={{ maxLength: 30 }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Descripcion PT"
                variant="outlined"
                type="text"
                name="descriptionPt"
                value={descriptionPt}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Descripcion EN"
                variant="outlined"
                type="text"
                name="descriptionEn"
                value={descriptionEn}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </FormCard>
        <FormActions>
          <Button variant="outlined" onClick={() => onClickCancel()}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            disabled={disabledButton || idCategory.length === 0}
            onClick={
              categoryActive ? handleUpdateCategory : handleAddCategory
            }
          >
            {!categoryActive ? "Guardar" : "Actualizar"}
          </Button>
        </FormActions>
      </PageContainer>
    </>
  );
};
