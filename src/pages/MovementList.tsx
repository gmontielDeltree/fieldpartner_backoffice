import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Radio,
  RadioGroup,
  FormControl,
} from "@mui/material";
import { SyncAlt as SyncAltIcon, Add as AddIcon } from "@mui/icons-material";
import { Movement } from "../types";

export const NewMovementPage = () => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [newMovement, setNewMovement] = useState<Movement>({
    concepto: "",
  manual: false,
  sumaStock: "both",
  name: "", // Propiedad faltante
  description: "", // Propiedad faltante
  typeMovement: "", // Propiedad faltante
  });
  const [conceptoError, setConceptoError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMode, setEditingMode] = useState(false);
  const [editedIndex, setEditedIndex] = useState<number | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMovement({
      ...newMovement,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNewMovement({
      ...newMovement,
      [name]: checked,
    });
  };

  const handleEditMovement = (index: number) => {
    const editedMovement = movements[index];
    setNewMovement((prevMovement) => ({
      ...prevMovement,
      concepto: editedMovement.concepto,
      manual: editedMovement.manual,
      sumaStock: editedMovement.sumaStock,
      name: prevMovement.name, // Agrega las propiedades faltantes
      description: prevMovement.description, // Agrega las propiedades faltantes
      typeMovement: prevMovement.typeMovement, // Agrega las propiedades faltantes
    }));
    setMovements(movements.filter((_, i) => i !== index));
    setEditingMode(true);
    setEditedIndex(index);
  };

  const handleCancelEdit = () => {
    setMovements([...movements.slice(0, editedIndex ?? 0), newMovement, ...movements.slice((editedIndex ?? 0) + 1)]);
    setNewMovement({
      concepto: "",
      manual: false,
      sumaStock: "both",
      name: "", // Agregar propiedad name con un valor vacío o adecuado
      description: "", // Agregar propiedad description con un valor vacío o adecuado
      typeMovement: "", // Agregar propiedad typeMovement con un valor vacío o adecuado
    });
    setConceptoError(false);
    setEditingMode(false);
    setEditedIndex(null);
  };

  const handleSaveEdit = () => {
    setMovements([...movements.slice(0, editedIndex ?? 0), newMovement, ...movements.slice((editedIndex ?? 0) + 1)]);
    setNewMovement({
      concepto: "",
      manual: false,
      sumaStock: "both",
      name: "", // Agregar propiedad name con un valor vacío o adecuado
      description: "", // Agregar propiedad description con un valor vacío o adecuado
      typeMovement: "", // Agregar propiedad typeMovement con un valor vacío o adecuado
    });
    setConceptoError(false);
    setEditingMode(false);
    setEditedIndex(null);
  };
  const handleDeleteMovement = (index: number) => {
    const updatedMovements = movements.filter((_, i) => i !== index);
    setMovements(updatedMovements);
  };

  return (
    <Container>
      <Paper elevation={3}>
        <Box padding={3} style={{ position: "relative" }}>
          <Typography variant="h5" style={{ marginBottom: "1rem", color: "#333" }}>
            <SyncAltIcon /> Tipos Movimientos Insumos
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" style={{ color: "#333" }}>
                Concepto:
              </Typography>
              <TextField
                id="concepto"
                name="concepto"
                label="Concepto"
                value={newMovement.concepto}
                onChange={handleInputChange}
                fullWidth
                required
                error={conceptoError}
                helperText={conceptoError && "El concepto es obligatorio"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" style={{ color: "#333" }}>
                Tipo de Movimiento:
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={newMovement.manual}
                    onChange={handleCheckboxChange}
                    name="manual"
                    color="primary"
                  />
                }
                labelPlacement="start"
                label={newMovement.manual ? "Manual" : "Automático"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" style={{ color: "#333" }}>
                Suma o Descuenta Stock:
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  aria-label="stock"
                  name="sumaStock"
                  value={newMovement.sumaStock.toString()}
                  onChange={handleInputChange}
                >
                  <FormControlLabel value="true" control={<Radio />} label="Suma" />
                  <FormControlLabel value="false" control={<Radio />} label="Descuenta" />
                  <FormControlLabel value="both" control={<Radio />} label="Ambos" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              {editingMode ? (
                <div>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveEdit}
                  >
                    Guardar Cambios
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleCancelEdit}
                    style={{ marginLeft: 10 }}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  component={RouterLink}
                  to="/typemovement/new"
                  startIcon={<AddIcon />}
                >
                  Agregar Movimiento
                </Button>
              )}
            </Grid>
            <Grid item xs={12} sm={6} style={{ position: "absolute", top: 0, right: 0 }}>
              <TextField
                label="Buscar Movimiento"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                size="small" 
              />
              {/* <Button
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                style={{ marginLeft: "0.5rem" }}
              >
                Buscar
              </Button> */}
            </Grid>
          </Grid>
        </Box>
      </Paper>
      {movements.length > 0 && (
        <Paper elevation={3} style={{ marginTop: 15 }}>
          <Box padding={3}>
            <Typography variant="h6">Lista de Movimientos</Typography>
            {movements.map((movement, index) => (
              <Paper key={index} elevation={3} style={{ padding: "1rem", marginBottom: "1rem" }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" style={{ color: "#333" }}>
                      Concepto:
                    </Typography>
                    <Typography>{movement.concepto}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" style={{ color: "#333" }}>
                      Tipo de Movimiento:
                    </Typography>
                    <Typography>{movement.manual ? "Manual" : "Automático"}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle1" style={{ color: "#333" }}>
                      Suma o Descuenta Stock:
                    </Typography>
                    <Typography>
                      {movement.sumaStock === "both" ? "Suma/Descuenta" : (movement.sumaStock ? "Suma" : "Descuenta")}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} style={{ textAlign: "right" }}>
                    {editingMode ? (
                      <div>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleSaveEdit}
                        >
                          Guardar Cambios
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleCancelEdit}
                          style={{ marginLeft: 10 }}
                        >
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleEditMovement(index)}
                        >
                          Editar Movimiento
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => handleDeleteMovement(index)}
                          style={{ marginLeft: 10 }}
                        >
                          Eliminar Movimiento
                        </Button>
                      </>
                    )}
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        </Paper>
      )}
    </Container>
  );
};
