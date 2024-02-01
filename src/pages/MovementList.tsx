import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from "@mui/material";
import {
  SyncAlt as SyncAltIcon,
  Search as SearchIcon,
  Add as AddIcon,
} from "@mui/icons-material";


const NewMovementPage = () => {
  const [movements, setMovements] = useState([]);
  const [newMovement, setNewMovement] = useState({
    concepto: "",
    manual: false,
    sumaStock: false,
  });
  const [conceptoError, setConceptoError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingMode, setEditingMode] = useState(false);
  const [editedIndex, setEditedIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovement({
      ...newMovement,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setNewMovement({
      ...newMovement,
      [name]: checked,
    });
  };

  const handleAddMovement = () => {
    if (newMovement.concepto.trim() !== "") {
      setMovements([...movements, newMovement]);
      setNewMovement({
        concepto: "",
        manual: false,
        sumaStock: false,
      });
      setConceptoError(false);
    } else {
      setConceptoError(true);
    }
  };

  const handleDeleteMovement = (index) => {
    const updatedMovements = movements.filter((_, i) => i !== index);
    setMovements(updatedMovements);
  };

  const handleSearch = () => {
    const filteredMovements = movements.filter(movement => {
      return movement.concepto.toLowerCase().includes(searchTerm.toLowerCase());
    });
  
    if (filteredMovements.length > 0) {
      setMovements(filteredMovements);
    } else {
      
      alert("No hay coincidencias.");
    }
  };

  const handleEditMovement = (index) => {
    const editedMovement = movements[index];
    setNewMovement(editedMovement);
    setMovements(movements.filter((_, i) => i !== index));
    setEditingMode(true);
    setEditedIndex(index);
  };

  const handleCancelEdit = () => {
    setMovements([...movements.slice(0, editedIndex), newMovement, ...movements.slice(editedIndex)]);
    setNewMovement({
      concepto: "",
      manual: false,
      sumaStock: false,
    });
    setConceptoError(false);
    setEditingMode(false);
    setEditedIndex(null);
  };

  const handleSaveEdit = () => {
    setMovements([...movements.slice(0, editedIndex), newMovement, ...movements.slice(editedIndex)]);
    setNewMovement({
      concepto: "",
      manual: false,
      sumaStock: false,
    });
    setConceptoError(false);
    setEditingMode(false);
    setEditedIndex(null);
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
              <Button
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                style={{ marginLeft: "0.5rem" }}
              >
                Buscar
              </Button>
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

export default NewMovementPage;