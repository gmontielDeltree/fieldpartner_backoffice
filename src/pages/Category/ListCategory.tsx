import { useNavigate, Link as RouterLink } from "react-router-dom";
import { ColumnProps, Category } from "../../types";
import React, { useEffect } from "react";
import { useAppDispatch, useCategory, useForm } from "../../hooks";
import {
  DataTable,
  EmptyState,
  FilteredCount,
  ItemRow,
  ListCard,
  ListToolbar,
  Loading,
  PageContainer,
  PageHeader,
  RollingNumber,
  SearchField,
  TableCellStyled,
  ValuePill,
} from "../../components";
import { Button, IconButton, Tooltip } from "@mui/material";
import { AddRounded, CategoryOutlined, DeleteOutline, EditOutlined } from "@mui/icons-material";
import { setCategoryACtive } from "../../store/category";

const columns: ColumnProps[] = [
  { text: "ID Categoria", align: "left", field: "idCategory", sortable: true },
  { text: "Descripcion ES", align: "left", field: "description", sortable: true },
  { text: "Descripcion PT", align: "left", field: "descriptionPt", sortable: true },
  { text: "Descripcion EN", align: "left", field: "descriptionEn", sortable: true },
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
      <PageContainer>
        <PageHeader
          icon={<CategoryOutlined />}
          title="Categorías"
          meta={
            !isLoading ? (
              <ValuePill>
                <RollingNumber value={rows.length} />
              </ValuePill>
            ) : undefined
          }
          actions={
            <Button variant="contained" component={RouterLink} to="/category/new" startIcon={<AddRounded />}>
              Nuevo
            </Button>
          }
        />
        <ListCard>
          <ListToolbar aside={filterText ? <FilteredCount shown={rows.length} total={categories.length} /> : undefined}>
            <SearchField
              value={filterText}
              onChange={handleInputChange}
              placeholder="Buscar por ID o descripción…"
              onSubmit={onClickSearch}
            />
          </ListToolbar>
          {!isLoading && rows.length === 0 ? (
            filterText ? (
              <EmptyState title="Sin resultados" hint="Probá con otra búsqueda" />
            ) : (
              <EmptyState icon={<CategoryOutlined />} title="No se encontraron categorías" hint="Cargá la primera con «Nuevo»." />
            )
          ) : (
            <DataTable
              key="datatable-categories"
              columns={columns}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              {rows.map((row) => (
                <ItemRow key={row._id} hover>
                  <TableCellStyled align="left" sx={{ fontWeight: 500 }}>{row.idCategory}</TableCellStyled>
                  <TableCellStyled align="left">{row.description}</TableCellStyled>
                  <TableCellStyled align="left">{row.descriptionPt}</TableCellStyled>
                  <TableCellStyled align="left">{row.descriptionEn}</TableCellStyled>
                  <TableCellStyled align="right" sx={{ whiteSpace: "nowrap" }}>
                    <Tooltip title="Editar">
                      <IconButton aria-label="Editar" onClick={() => onClickUpdateCategory(row)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton aria-label="Eliminar" onClick={() => handleDeleteCategory(row)}>
                        <DeleteOutline />
                      </IconButton>
                    </Tooltip>
                  </TableCellStyled>
                </ItemRow>
              ))}
            </DataTable>
          )}
        </ListCard>
      </PageContainer>
    </>
  );
};
