// import { useNavigate } from "react-router-dom";
// import React, { useMemo, useEffect, useCallback } from "react";
// import {
//   Box,
//   Container,
//   Paper,
//   Stepper,
//   Step,
//   StepLabel,
//   Button,
//   Typography,
// } from "@mui/material";
// import { AddressForm, InformationForm } from "../../components/customer";
// import { useAppDispatch, useAppSelector, useCustomer, useForm } from "../../hooks";
// import { TipoEntidad, EnumLicenceType } from "../../types";
// import { Loading, UserForm } from "../../components";
// import { removeCustomerActive } from "../../store/customer";
// import { Grid } from "@mui/material";
// import { ChangeEvent } from "react";
// import { Customer } from "../../interfaces/customer";

// const initialForm: Customer = {
//   nombreCompleto: "",
//   documento: "",
//   telefono: "",
//   email: "",
//   tipoEntidad: TipoEntidad.FISICA.toString(),
//   razonSocial: "",
//   account: {
//     tipoLicencia: EnumLicenceType.CAMPO.toString(),
//     descripcion: "",
//     inicioLicencia: "",
//     finLicencia: "",
//     lenguaje: "español",
//   },
//   cuit: "",
//   contactoPrincipal: "",
//   contactoSecundario: "",
//   sitioWeb: "",
//   domicilio: "",
//   localidad: "",
//   cp: "",
//   provincia: "",
//   pais: "",
//   usuario: {
//     name: "",
//     lastName: "",
//     email: "",
//     password: ""
//   },
// };

// export const CustomerPage: React.FC = () => {
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
//   const { customerActive } = useAppSelector((state) => state.customer);
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [steps, setSteps] = React.useState<string[]>([
//     "Informacion Basica",
//     "Direccion",
//     "Usuarios",
//   ]);

//   const {
//     formValues,
//     setFormValues,
//     handleInputChange,
//     handleSelectChange,
//     reset,
//   } = useForm<Customer>(initialForm);

//   const { isLoading, createCustomer, updateCustomer } = useCustomer();

//   const handleNext = () => {
//     setActiveStep(activeStep + 1);
//   };

//   const handleBack = () => {
//     setActiveStep(activeStep - 1);
//   };

//   const setUserByCustomer = useCallback(
//     ({ target }: ChangeEvent<HTMLInputElement>) => {
//       const { name, value } = target;
//       setFormValues((prevState) => ({
//         ...prevState,
//         usuario: {
//           ...prevState.usuario,
//           [name]: value,
//         },
//       }));
//     },
//     [setFormValues]
//   );

//   const getStepContent = useMemo(
//     () => (step: number) => {
//       switch (step) {
//         case 0:
//           return (
//             <InformationForm
//               key="information-customer"
//               customer={formValues}
//               setCustomer={setFormValues}
//               handleInputChange={handleInputChange}
//               handleSelectChange={handleSelectChange}
//             />
//           );
//         case 1:
//           return (
//             <AddressForm
//               key="address-customer"
//               customer={formValues}
//               handleInputChange={handleInputChange}
//             />
//           );
//         case 2:
//           return (
//             <UserForm
//               key="users-customer"
//               // user={formValues.usuario}
//               {...formValues.usuario}
//               setUser={setUserByCustomer}
//             />
//           );
//         default:
//           throw new Error("Unknown step");
//       }
//     },
//     [
//       formValues,
//       setFormValues,
//       handleInputChange,
//       handleSelectChange,
//       setUserByCustomer,
//     ]
//   );

//   const addNewCustomer = () => {
//     createCustomer(formValues);
//     reset();
//   };

//   const handleUpdateCustomer = () => {
//     if (!formValues.id) return;
//     updateCustomer(formValues.id, formValues);
//   };

//   const onClickCancel = () => {
//     dispatch(removeCustomerActive());
//     navigate("/list-customer");
//   };

//   useEffect(() => {
//     if (customerActive) {
//       setFormValues({ ...customerActive });
//       setSteps(["Informacion Basica", "Direccion"]);
//     } else setFormValues(initialForm);
//   }, [customerActive, setFormValues]);

//   useEffect(() => {
//     return () => {
//       dispatch(removeCustomerActive());
//     };
//   }, [dispatch]);

//   return (
//     <>
//       <Loading key="loading-new-customer" loading={isLoading} />
//       <Container maxWidth="md" sx={{ mb: 4 }}>
//         <Paper
//           variant="outlined"
//           sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
//         >
//           <Box
//             sx={{
//               width: "60px",
//               height: "60px",
//               borderRadius: "50%",
//               backgroundImage: "url(/assets/new-customer.jpg)",
//               backgroundRepeat: "no-repeat",
//               backgroundColor: (t) =>
//                 t.palette.mode === "light"
//                   ? t.palette.grey[50]
//                   : t.palette.grey[900],
//               backgroundSize: "cover",
//               backgroundPosition: "center",
//               margin: "auto",
//             }}
//           />
//           <Typography component="h1" variant="h4" align="center">
//             {customerActive ? "Editar" : "Nuevo"} cliente
//           </Typography>

//           <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 3, mb: 2 }}>
//             {steps.map((label) => (
//               <Step key={label}>
//                 <StepLabel>{label}</StepLabel>
//               </Step>
//             ))}
//           </Stepper>
//           <>
//             {getStepContent(activeStep)}
//             <Grid
//               container
//               spacing={1}
//               alignItems="center"
//               justifyContent="space-around"
//               sx={{ mt: { sm: 5 } }}
//             >
//               <Grid item xs={12} sm={3} key="grid-back">
//                 <Button onClick={activeStep !== 0 ? handleBack : onClickCancel}>
//                   {activeStep !== 0 ? "Volver" : "Cancelar"}
//                 </Button>
//               </Grid>
//               <Grid item xs={12} sm={3} key="grid-next">
//                 {!(activeStep === steps.length - 1) && (
//                   <Button
//                     variant="contained"
//                     color="secondary"
//                     onClick={handleNext}
//                     // fullWidth
//                   >
//                     Siguiente
//                   </Button>
//                 )}
//               </Grid>
//               <Grid item xs={12} sm={3}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   onClick={
//                     customerActive ? handleUpdateCustomer : addNewCustomer
//                   }
//                   // fullWidth
//                 >
//                   {!customerActive ? "Guardar" : "Actualizar"}
//                 </Button>
//               </Grid>
//             </Grid>
//           </>
//         </Paper>
//       </Container>
//     </>
//   );
// };
