import React, { useEffect } from "react";
import { Loading } from "../components";
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Category as CategoryIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector, useCategory, useForm } from "../hooks";
import { Category } from "../types";
import { removeCategoryActive } from "../store/category";

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

  const {
    idCategory,
    description,
    descriptionPt,
    descriptionEn,
    formulario,
    setFormulario,
    handleInputChange,
    reset,
  } = useForm<Category>(initialForm);

  const { isLoading, createCategory, updateCategory } = useCategory();

  const handleAddCategory = () => {
    createCategory(formulario);
    reset();
  };

  const handleUpdateCategory = () => {
    if (!formulario._id) return;
    updateCategory(formulario);
  };

  const onClickCancel = () => {
    dispatch(removeCategoryActive());
    navigate("/categories");
  };

  useEffect(() => {
    if (categoryActive) setFormulario(categoryActive);
    else setFormulario(initialForm);
  }, [categoryActive, setFormulario]);

  useEffect(() => {
    return () => {
      dispatch(removeCategoryActive());
    };
  }, [dispatch]);

  return (
    <>
      <Loading key="loading-new-customer" loading={isLoading} />
      <Container maxWidth="md" sx={{ mb: 4 }}>
        <Box component="div" display="flex" alignItems="center"sx={{ ml: { sm: 2 }, pt: 2 }} >
          <CategoryIcon />
          <Typography variant="h5" sx={{ ml: { sm: 2 } }}>
            Categoría
          </Typography>
        </Box>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} >
          <Typography
            component="h1"
            variant="h4"
            align="center"
            sx={{ my: 3, mb: 5 }}
          >
            {categoryActive ? "Editar" : "Nueva"} Categoría
          </Typography>
          <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={2}>
          <TextField
                label="ID Categoria"
                variant="outlined"
                type="text"
                name="idCategory"
                value={idCategory}
                onChange={handleInputChange}
                inputProps={{ maxLength: 30 }} 
                    InputProps={{
                    startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth
                />
            </Grid>
            <Grid container spacing={1} alignItems="center">
            <Grid item xs={6}>
            <Box sx={{ display: 'block', mt: 2 }}>
              <TextField
                label="Descripcion ES"
                variant="outlined"
                type="text"
                name="description"
                value={description}
                onChange={handleInputChange}
                inputProps={{ maxLength: 30 }} 
                    InputProps={{
                    startAdornment: <InputAdornment position="start" />,
                    }}
                    fullWidth
                />
               </Box>
            </Grid> 
            </Grid>
            <Grid container spacing={1} alignItems="center">
            <Grid item xs={6}>
            <Box sx={{ display: 'block', mt: 2 }}>
              <TextField
                label="Descripcion PT"
                variant="outlined"
                type="text"
                name="descriptionPt"
                value={descriptionPt}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
              />
              </Box>
            </Grid>
          </Grid>
            <Grid container spacing={1} alignItems="center">
            <Grid item xs={6}>
            <Box sx={{ display: 'block', mt: 2 }}>
              <TextField
                label="Descripcion EN"
                variant="outlined"
                type="text"
                name="descriptionEn"
                value={descriptionEn}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start" />,
                }}
                fullWidth
              />
              </Box>
            </Grid>
          </Grid>
          </Grid>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="space-around"
            sx={{ mt: { sm: 5 } }}
          >
            <Grid item xs={12} sm={3} key="grid-back">
              <Button onClick={() => onClickCancel()}>Cancelar</Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                color="primary"
                onClick={
                  categoryActive ? handleUpdateCategory : handleAddCategory
                }
                // fullWidth
              >
                {!categoryActive ? "Guardar" : "Actualizar"}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};
