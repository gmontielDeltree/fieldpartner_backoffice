import React, { useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Button, IconButton, Tooltip } from "@mui/material";
import { AddRounded, DeleteOutline, EditOutlined, PublicOutlined } from "@mui/icons-material";
import { useAppDispatch, useCountry, useForm } from "../../hooks";
import { setCountryACtive } from "../../store/country";
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
import { ColumnProps, Country } from "../../types";

const columns: ColumnProps[] = [
  { text: "Código", align: "left", field: "code", sortable: true },
  { text: "Descripción ES", align: "left", field: "descriptionES", sortable: true },
  { text: "Descripción PT", align: "left", field: "descriptionPT", sortable: true },
  { text: "Descripción EN", align: "left", field: "descriptionEN", sortable: true },
];

export const ListCountryPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const [selectedType, setSelectedType] = useState("");
//   const [showInactive,] = useState(false);
//   const [selectedType, setSelectedType] = React.useState('');
  const { isLoading, country, getCountry, removeCountry } = useCountry();
  const { filterText, handleInputChange } = useForm({ filterText: "" });
//   const [showOptions, setShowOptions] = React.useState(false);

  const [sortField, setSortField] = React.useState<keyof Country>("code");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field as keyof Country);
      setSortDirection("asc");
    }
  };

  const compareValues = (a: Country, b: Country, field: keyof Country) => {
    const av = a[field];
    const bv = b[field];
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  };

  const filterCountry = (country: Country[], filterText: string): Country[] => {
    const filteredBySearch = country.filter(country => matchesFilter(country, filterText));
    return [...filteredBySearch].sort((a, b) => {
      const primary = compareValues(a, b, sortField);
      const result = sortDirection === "asc" ? primary : -primary;
      // Desempate: dentro de un mismo valor, ordenar por código
      if (result === 0 && sortField !== "code") {
        return compareValues(a, b, "code");
      }
      return result;
    });
  };



  const normalizeText = (text?: string | number) => {
    return String(text ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const matchesFilter = (country: Country, filter: string) => {
    const normalizedFilter = normalizeText(filter);
    const searchableFields = [
      country.descriptionES,
      country.descriptionPT,
      country.descriptionEN,
      country.code
    ];

    return searchableFields.some(field => normalizeText(field).includes(normalizedFilter));
  };


  // const handleFilter = () => {
  //   setFilteredType(selectedType);
  // };
  const onClickSearch = () => {
    if (filterText === "") {
      getCountry();
      return;
    }
  };

//   const handleFilterButtonClick = () => {
//     setShowOptions(!showOptions); // Invertir el estado de showOptions
//   };

//   const handleSelectChange = (value: string) => {
//     console.log("Tipo seleccionado:", value);
//     setSelectedType(value);
//     setShowOptions(false); // Ocultar las opciones cuando se seleccione una
//   };

  const onClickUpdateCountry = (item: Country) => {
    console.log("Item ID:", item._id);
    dispatch(setCountryACtive(item));
    navigate(`/country/${item._id}`);
  };

  const handleDeleteCountry = (item:  Country) => {
    if (item._id && item._rev) {
      removeCountry(item._id, item._rev);
      getCountry();
    }
  };

  useEffect(() => {
    getCountry();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const rows = filterCountry(country, filterText);

  return (
    <>
      {isLoading && <Loading loading />}
      <PageContainer>
        <PageHeader
          icon={<PublicOutlined />}
          title="Países"
          meta={
            !isLoading ? (
              <ValuePill>
                <RollingNumber value={rows.length} />
              </ValuePill>
            ) : undefined
          }
          actions={
            <Button variant="contained" component={RouterLink} to="/country/new" startIcon={<AddRounded />}>
              Nuevo
            </Button>
          }
        />
        <ListCard>
          <ListToolbar aside={filterText ? <FilteredCount shown={rows.length} total={country.length} /> : undefined}>
            <SearchField
              value={filterText}
              onChange={handleInputChange}
              placeholder="Buscar por código o descripción…"
              onSubmit={onClickSearch}
            />
          </ListToolbar>
          {!isLoading && rows.length === 0 ? (
            filterText ? (
              <EmptyState title="Sin resultados" hint="Probá con otra búsqueda" />
            ) : (
              <EmptyState icon={<PublicOutlined />} title="No se encontraron países" hint="Cargá el primero con «Nuevo»." />
            )
          ) : (
            <DataTable
              key="datatable-country"
              columns={columns}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              {rows.map((row) => (
                <ItemRow key={row._id} hover>
                  <TableCellStyled align="left" sx={{ fontWeight: 500 }}>{row.code}</TableCellStyled>
                  <TableCellStyled align="left">{row.descriptionES}</TableCellStyled>
                  <TableCellStyled align="left">{row.descriptionPT}</TableCellStyled>
                  <TableCellStyled align="left">{row.descriptionEN}</TableCellStyled>
                  <TableCellStyled align="right" sx={{ whiteSpace: "nowrap" }}>
                    <Tooltip title="Editar">
                      <IconButton aria-label="Editar" onClick={() => onClickUpdateCountry(row)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton aria-label="Eliminar" onClick={() => handleDeleteCountry(row)}>
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
