import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Button,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Tooltip,
} from "@mui/material";
import {
  AddRounded,
  DeleteOutline,
  EditOutlined,
  ExpandMoreRounded,
  FilterListRounded,
  YardOutlined,
} from "@mui/icons-material";
import { useAppDispatch, useCrops, useForm } from "../../hooks";
import { setCropsACtive } from "../../store/crops";
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
import { ColumnProps, Crops } from "../../types";

const columns: ColumnProps[] = [
  { text: "Nombre", align: "left", field: "descriptionES", sortable: true },
  { text: "Descripción PT", align: "left", field: "descriptionPT", sortable: true },
  { text: "Descripción EN", align: "left", field: "descriptionEN", sortable: true },
  { text: "Tipo", align: "left", field: "cropType", sortable: true },
];

export const ListCropsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  // const [selectedType, setSelectedType] = useState("");
  const [showInactive,] = useState(false);
  const [selectedType, setSelectedType] = React.useState('');
  const { isLoading, crops, getCrops, removeCrops } = useCrops();
  const { filterText, handleInputChange } = useForm({ filterText: "" });
  const [showOptions, setShowOptions] = React.useState(false);
  // ancla del menú de tipos (solo presentación: el menú se abre fuera de la card)
  const filterAnchorRef = useRef<HTMLButtonElement>(null);

  const [sortField, setSortField] = React.useState<keyof Crops>("descriptionES");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field as keyof Crops);
      setSortDirection("asc");
    }
  };

  const compareValues = (a: Crops, b: Crops, field: keyof Crops) => {
    const av = a[field];
    const bv = b[field];
    if (typeof av === "number" && typeof bv === "number") return av - bv;
    return String(av ?? "").localeCompare(String(bv ?? ""), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  };

  const filterCrops = (crops: Crops[], filterText: string): Crops[] => {
    const filteredBySearch = crops.filter(crop => matchesFilter(crop, filterText));

    const filteredByType = filteredBySearch.filter(crop => {
      if (selectedType && crop.cropType !== selectedType) return false; // Filtrar por tipo seleccionado
      if (!showInactive && !crop.descriptionES) return false;
      return true;
    });

    return [...filteredByType].sort((a, b) => {
      const primary = compareValues(a, b, sortField);
      const result = sortDirection === "asc" ? primary : -primary;
      // Desempate: dentro de un mismo valor, ordenar por descripcion ES por defecto
      if (result === 0 && sortField !== "descriptionES") {
        return compareValues(a, b, "descriptionES");
      }
      return result;
    });
  };



  const normalizeText = (text?: string | number) => {
    return String(text ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const matchesFilter = (crop: Crops, filter: string) => {
    const normalizedFilter = normalizeText(filter);
    const searchableFields = [
      crop.descriptionES,
      crop.descriptionPT,
      crop.descriptionEN,
      crop.cropType
    ];
  
    return searchableFields.some(field => normalizeText(field).includes(normalizedFilter));
  };
  const cropTypes = ['Oleaginosa', 'Legumbres', 'Tubérculo', 'Cereal', 'Gramínea', 'Textil', 'Industrial'];
  
  // const handleFilter = () => {
  //   setFilteredType(selectedType);
  // };
  const onClickSearch = () => {
    if (filterText === "") {
      getCrops();
      return;
    }
  };

  const handleFilterButtonClick = () => {
    setShowOptions(!showOptions); // Invertir el estado de showOptions
  };

  const handleSelectChange = (value: string) => {
    console.log("Tipo seleccionado:", value);
    setSelectedType(value);
    setShowOptions(false); // Ocultar las opciones cuando se seleccione una
  };

  const onClickUpdateCrops = (item: Crops) => {
    console.log("Item ID:", item._id);
    dispatch(setCropsACtive(item));
    navigate(`/crops/${item._id}`);
  };

  const handleDeleteCrops = (item: Crops) => {
    if (item._id && item._rev) {
      removeCrops(item._id, item._rev);
      getCrops();
    }
  };

  useEffect(() => {
    getCrops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const rows = filterCrops(crops, filterText);

  return (
    <>
      {isLoading && <Loading loading />}
      <PageContainer>
        <PageHeader
          icon={<YardOutlined />}
          title="Cultivos"
          meta={
            !isLoading ? (
              <ValuePill>
                <RollingNumber value={rows.length} />
              </ValuePill>
            ) : undefined
          }
          actions={
            <Button variant="contained" component={RouterLink} to="/crops/new" startIcon={<AddRounded />}>
              Nuevo
            </Button>
          }
        />
        <ListCard>
          <ListToolbar
            aside={filterText || selectedType ? <FilteredCount shown={rows.length} total={crops.length} /> : undefined}
          >
            <SearchField
              value={filterText}
              onChange={handleInputChange}
              placeholder="Buscar por nombre, descripción o tipo…"
              onSubmit={onClickSearch}
            />
            <Button
              ref={filterAnchorRef}
              variant="outlined"
              size="small"
              startIcon={<FilterListRounded />}
              endIcon={<ExpandMoreRounded />}
              onClick={handleFilterButtonClick}
              aria-haspopup="menu"
              aria-expanded={showOptions}
              sx={{ height: 34 }}
            >
              Tipo: {selectedType || "Todos"}
            </Button>
            <Popper
              open={showOptions}
              anchorEl={filterAnchorRef.current}
              placement="bottom-start"
              sx={{ zIndex: (theme) => theme.zIndex.modal }}
            >
              <Paper
                sx={{
                  mt: 0.5,
                  minWidth: 200,
                  borderRadius: "12px",
                  background: "var(--surface)",
                  boxShadow: "var(--shadow-overlay)",
                  animation: "fade-in 160ms ease-out both",
                }}
              >
                <MenuList autoFocusItem={showOptions} sx={{ p: "6px" }}>
                  <MenuItem selected={selectedType === ""} onClick={() => handleSelectChange("")}>
                    Todos
                  </MenuItem>
                  {cropTypes.map((type, index) => (
                    <MenuItem key={index} selected={selectedType === type} onClick={() => handleSelectChange(type)}>
                      {type}
                    </MenuItem>
                  ))}
                </MenuList>
              </Paper>
            </Popper>
          </ListToolbar>
          {!isLoading && rows.length === 0 ? (
            filterText || selectedType ? (
              <EmptyState title="Sin resultados" hint="Probá con otra búsqueda o con otro tipo" />
            ) : (
              <EmptyState icon={<YardOutlined />} title="No se encontraron cultivos" hint="Cargá el primero con «Nuevo»." />
            )
          ) : (
            <DataTable
              key="datatable-crops"
              columns={columns}
              isLoading={isLoading}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            >
              {rows.map((row) => (
                <ItemRow key={row._id} hover>
                  <TableCellStyled align="left" sx={{ fontWeight: 500 }}>{row.descriptionES}</TableCellStyled>
                  <TableCellStyled align="left">{row.descriptionPT}</TableCellStyled>
                  <TableCellStyled align="left">{row.descriptionEN}</TableCellStyled>
                  <TableCellStyled align="left">
                    {row.cropType ? <ValuePill>{row.cropType}</ValuePill> : null}
                  </TableCellStyled>
                  <TableCellStyled align="right" sx={{ whiteSpace: "nowrap" }}>
                    <Tooltip title="Editar">
                      <IconButton aria-label="Editar" onClick={() => onClickUpdateCrops(row)}>
                        <EditOutlined />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton aria-label="Eliminar" onClick={() => handleDeleteCrops(row)}>
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
