import { useNavigate, Link as RouterLink } from "react-router-dom";
import { ColumnProps, Category } from "../../types";
import React, { useEffect } from "react";
import { useAppDispatch, useCategory, useForm } from "../../hooks";
import {
  DataTable,
  ItemRow,
  Loading,
  SearchButton,
  SearchInput,
  TableCellStyled,
} from "../../components";
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";

// import 'semantic-ui-css/semantic.min.css';
// import {Icon} from "semantic-ui-react";

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import { setCategoryACtive } from "../../store/category";

const columns: ColumnProps[] = [
  { text: "ID Categoria", align: "left", field: "idCategory", sortable: true },
  { text: "Descripcion ES", align: "center", field: "description", sortable: true },
  { text: "Descripcion PT", align: "center", field: "descriptionPt", sortable: true },
  { text: "Descripcion EN", align: "center", field: "descriptionEn", sortable: true },
];

export const ListCategory: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isLoading, categories, getCategories, removeCategory } =
    useCategory();
  const { filterText, handleInputChange } = useForm({ filterText: "" });

  const [sortField, setSortField] = React.useState<keyof Category>("idCategory");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field as keyof Category);
      setSortDirection("asc");
    }
  };

  const compareValues = (a: Category, b: Category, field: keyof Category) => {
    const av = a[field];
    const bv = b[field];
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  };

  const normalizeText = (text?: string | number) => {
    return String(text ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  };

  const matchesFilter = (category: Category, filter: string) => {
    const normalizedFilter = normalizeText(filter);
    const searchableFields = [
      category.idCategory,
      category.description,
      category.descriptionPt,
      category.descriptionEn,
    ];

    return searchableFields.some(field => normalizeText(field).includes(normalizedFilter));
  };

  const filterCategories = (list: Category[], filterText: string): Category[] => {
    const filteredBySearch = list.filter(category => matchesFilter(category, filterText));
    return [...filteredBySearch].sort((a, b) => {
      const primary = compareValues(a, b, sortField);
      const result = sortDirection === "asc" ? primary : -primary;
      // Desempate: dentro de un mismo valor, ordenar por ID por defecto
      if (result === 0 && sortField !== "idCategory") {
        return compareValues(a, b, "idCategory");
      }
      return result;
    });
  };

  const onClickSearch = () => {
    if (filterText === "") {
      getCategories();
      return;
    }
  };

  const onClickUpdateCategory = (item: Category) => {
    dispatch(setCategoryACtive(item));
    navigate(`/category/${item._id}`);
  };

  const handleDeleteCategory = (item: Category) => {
    if (item._id && item._rev) {
      removeCategory(item._id, item._rev);
      getCategories();
    }
  };

  useEffect(() => {
    getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = filterCategories(categories, filterText);

  return (
    <>
      {isLoading && <Loading loading />}
      <Container maxWidth="md" sx={{ ml: 0 }}>
        <Box
          component="div"
          display="flex"
          alignItems="center"
          sx={{ ml: { sm: 2 }, pt: 2 }}
        >
          <CategoryIcon />
          <Typography component="h4" variant="h4" sx={{ ml: { sm: 2 } }}>
            Categorías
          </Typography>
        </Box>
        <Box component="div" sx={{ mt: 7 }}>
          <Grid
            container
            spacing={0}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ p: 2, mt: { sm: 2 } }}
          >
            <Grid item xs={6} sm={2}>
              <Button
                variant="contained"
                color="primary"
                component={RouterLink}
                to="/category/new"
                startIcon={<AddIcon />}
              >
                Nuevo
              </Button>
            </Grid>
            <Grid item xs={12} sm={10}>
              <Grid container justifyContent="flex-end">
                <Grid item xs={8} sm={5}>
                  <SearchInput
                    value={filterText}
                    placeholder="Name"
                    handleInputChange={handleInputChange}
                  />
                </Grid>
                <Grid item xs={4} sm={3}>
                  <SearchButton text="Buscar" onClick={() => onClickSearch()} />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, textAlign: "right" }}
                  >
                    {rows.length} {rows.length === 1 ? "categoría" : "categorías"}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Box component="div" sx={{ p: 1 }}>
            <DataTable
              key="datatable-categories"
              columns={columns}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              {!isLoading && rows.length === 0 && (
                <ItemRow>
                  <TableCellStyled align="center" colSpan={5}>
                    No se encontraron categorías
                  </TableCellStyled>
                </ItemRow>
              )}
              {rows.map((row) => (
                <ItemRow key={row._id} hover>
                  <TableCellStyled align="left">{row.idCategory}</TableCellStyled>
                  <TableCellStyled align="center"> {row.description} </TableCellStyled>
                  <TableCellStyled align="center"> {row.descriptionPt} </TableCellStyled>
                  <TableCellStyled align="center"> {row.descriptionEn} </TableCellStyled>
                  <TableCellStyled align="right">
                    <Tooltip title="Editar">
                      <IconButton
                        aria-label="Editar"
                        onClick={() => onClickUpdateCategory(row)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        onClick={() => handleDeleteCategory(row)}
                        style={{ fontSize: '1rem' }}
                        color="default"
                      >
                        <DeleteIcon name="trash alternate" />
                      </IconButton>
                    </Tooltip>
                  </TableCellStyled>
                </ItemRow>
              ))}
            </DataTable>
          </Box>
        </Box>
      </Container>
    </>
  );
};
