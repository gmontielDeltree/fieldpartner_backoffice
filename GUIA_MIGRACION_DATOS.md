# 📦 **GUÍA COMPLETA DE MIGRACIÓN DE DATOS**
## PouchDB → Backend NestJS

---

## 🎯 **Descripción del Proceso**

La migración de datos permite transferir las licencias almacenadas localmente en **PouchDB** hacia el **backend NestJS** para aprovechar las nuevas funcionalidades del sistema modernizado.

### **🔄 Flujo de Migración**
```
PouchDB Local → Análisis → Validación → Transformación → Backend API → Verificación
```

---

## 📋 **Opciones de Migración**

### **1. 🎭 Migración con Asistente (Recomendado)**
La opción más segura y user-friendly.

**📍 Ubicación:** `/licencias/migracion`

**✨ Características:**
- Interface visual intuitiva
- Análisis automático de datos
- Confirmaciones paso a paso
- Backup automático
- Reporte detallado de resultados

**🚀 Cómo usar:**
1. Navegar a **Licencias → Migración**
2. Revisar el análisis automático
3. Hacer clic en **"Migrar con Asistente"**
4. Seguir las instrucciones en pantalla
5. Descargar el reporte final

### **2. ⚡ Migración Programática**
Para desarrolladores y casos avanzados.

```typescript
import { migracionDatos } from '../services/migracionDatos';

// Migración básica
const resultado = await migracionDatos.migrarLicencias();

// Migración con opciones
const resultado = await migracionDatos.migrarLicencias({
  sobreescribir: true,    // Permitir sobrescribir datos duplicados
  crearBackup: true,      // Crear backup antes de migrar
  validarDatos: true      // Validar datos antes de migrar
});
```

---

## 🔍 **Proceso Detallado**

### **FASE 1: Análisis Pre-Migración**

El sistema analiza automáticamente:

```typescript
// Datos analizados
interface AnalisisDatos {
  pouchdb: {
    total: number;           // Cantidad en PouchDB
    licencias: Licencia[];   // Datos a migrar
  };
  backend: {
    total: number;           // Cantidad en Backend
    licencias: Licencia[];   // Datos existentes
  };
  conflictos: string[];      // Códigos duplicados
}
```

**🔍 Validaciones realizadas:**
- ✅ Conteo de licencias en ambos sistemas
- ✅ Detección de códigos duplicados
- ✅ Verificación de conectividad al backend
- ✅ Análisis de datos corruptos o incompletos

### **FASE 2: Transformación de Datos**

Los datos se transforman del formato legacy al nuevo:

```typescript
// ANTES (PouchDB Legacy)
interface LicenciaLegacy {
  _id: string;
  _rev: string;
  id: string;                    // → codigoLicencia
  description: string;           // → descripcion
  licenceType: string;          // → tipoLicencia (enum)
  systemType: string;           // → tipoSistema (enum)
  maximumUnitAllowed: number;   // → maximoUnidadesPermitidas
}

// DESPUÉS (Backend Compatible)
interface CrearLicenciaDto {
  codigoLicencia: string;
  descripcion: string;
  tipoLicencia: TipoLicencia;
  maximoUnidadesPermitidas: number;
  tipoSistema: TipoSistema;
  esLicenciaMultiPais: boolean;
}
```

**🔄 Mapeos automáticos:**

| Campo Legacy | Campo Nuevo | Transformación |
|--------------|-------------|----------------|
| `id` | `codigoLicencia` | Directo |
| `description` | `descripcion` | Directo |
| `licenceType` | `tipoLicencia` | Enum mapping |
| `systemType` | `tipoSistema` | Enum mapping |
| `maximumUnitAllowed` | `maximoUnidadesPermitidas` | Directo |
| N/A | `esLicenciaMultiPais` | Default: false |

### **FASE 3: Validación de Datos**

Cada licencia se valida antes de migrar:

```typescript
// Validaciones aplicadas
const validaciones = {
  codigoRequerido: id && id.trim() !== '',
  descripcionRequerida: description && description.trim() !== '',
  unidadesValidas: maximumUnitAllowed > 0,
  tipoValido: tipoLicencia in TipoLicencia,
  sistemaValido: tipoSistema in TipoSistema
};
```

**❌ Casos que fallan validación:**
- Código vacío o nulo
- Descripción vacía
- Unidades ≤ 0
- Tipos de licencia/sistema inválidos

### **FASE 4: Creación en Backend**

Cada licencia validada se envía al backend:

```typescript
// Llamada API por cada licencia
POST /api/licencias
Content-Type: application/json

{
  "codigoLicencia": "FP-001",
  "descripcion": "Licencia básica",
  "tipoLicencia": "Licencia",
  "maximoUnidadesPermitidas": 100,
  "tipoSistema": "FieldPartner",
  "esLicenciaMultiPais": false
}
```

### **FASE 5: Verificación y Reporte**

El sistema genera un reporte completo:

```markdown
# REPORTE DE MIGRACIÓN

**Fecha:** 2024-01-15 14:30:25
**Estado:** ✅ EXITOSA

## Estadísticas
- Licencias migradas: 15/15
- Errores encontrados: 0

## Log de Migración
- [14:30:25] 🚀 Iniciando migración...
- [14:30:26] 📊 PouchDB: 15 licencias
- [14:30:27] ✅ Migrada: FP-001
- [14:30:28] ✅ Migrada: FP-002
...
```

---

## 🛡️ **Seguridad y Backups**

### **💾 Sistema de Backup Automático**

Antes de cada migración se crean backups:

1. **Backup en localStorage:**
   ```javascript
   localStorage.getItem('backup_licencias_2024-01-15')
   ```

2. **Archivo descargable:**
   ```json
   // backup_licencias_2024-01-15.json
   {
     "fecha": "2024-01-15",
     "total": 15,
     "licencias": [...]
   }
   ```

### **🔒 Manejo de Conflictos**

Cuando se detectan códigos duplicados:

```typescript
// Estrategias disponibles
const estrategias = {
  sobreescribir: true,     // Reemplazar datos existentes
  omitir: false,           // Saltar licencias duplicadas
  preguntar: 'ui'          // Confirmar cada conflicto (UI)
};
```

**🎭 En modo UI:** El usuario decide qué hacer con cada conflicto
**⚡ En modo programático:** Se usa la estrategia configurada

---

## 🚨 **Manejo de Errores**

### **Tipos de Errores Comunes**

#### **1. Error de Conectividad**
```
❌ Error: No se puede conectar al backend
🔧 Solución: Verificar URL del backend en variables de entorno
```

#### **2. Error de Validación**
```
❌ Error: Licencia FP-001 - Descripción vacía
🔧 Solución: Corregir datos en PouchDB antes de migrar
```

#### **3. Error de Autorización**
```
❌ Error: 401 Unauthorized
🔧 Solución: Verificar token de autenticación
```

#### **4. Error de Datos Duplicados**
```
❌ Error: Código 'FP-001' ya existe
🔧 Solución: Usar modo sobreescribir o cambiar código
```

### **🔄 Estrategias de Recuperación**

1. **Reintento automático:** Para errores de red temporales
2. **Rollback:** Restaurar desde backup si falla
3. **Migración parcial:** Continuar con licencias válidas
4. **Log detallado:** Para debugging posterior

---

## 📊 **Monitoreo y Métricas**

### **Métricas Recolectadas**

```typescript
interface MetricasMigracion {
  tiempoTotal: number;           // Duración en ms
  licenciasProcesadas: number;   // Total procesadas
  licenciasMigradas: number;     // Migradas exitosamente
  erroresEncontrados: number;    // Errores totales
  tasaExito: number;             // % éxito
  velocidadPromedio: number;     // Licencias/segundo
}
```

### **Estados de Progreso**

Durante la migración se pueden observar:

- 🔍 **Analizando** - Revisando datos
- 💾 **Creando backup** - Guardando respaldo
- 🔄 **Migrando** - Transfiriendo datos
- ✅ **Completado** - Proceso terminado
- ❌ **Error** - Problema encontrado

---

## 🧹 **Post-Migración**

### **Limpieza de PouchDB**

Después de una migración exitosa:

```typescript
// Limpiar datos legacy (OPCIONAL)
await migracionDatos.limpiarPouchDB();
```

**⚠️ IMPORTANTE:** Solo ejecutar después de verificar que la migración fue exitosa.

### **Verificación de Integridad**

```typescript
// Verificar que los datos migraron correctamente
const licenciasBackend = await licenciasService.obtenerLicencias();
const totalEsperado = analisis.pouchdb.total;

if (licenciasBackend.length === totalEsperado) {
  console.log('✅ Migración verificada correctamente');
} else {
  console.log('❌ Faltan licencias en el backend');
}
```

---

## 🛠️ **Troubleshooting**

### **Problemas Frecuentes**

#### **"No se encontraron licencias"**
```bash
# Verificar que PouchDB tiene datos
localStorage.getItem('licences') // o similar
```

#### **"Error de CORS"**
```bash
# Verificar configuración del backend
VITE_API_URL=http://localhost:3000/api
```

#### **"Migración lenta"**
```bash
# Reducir el batch size en migracionDatos.ts
const BATCH_SIZE = 5; // En lugar de 10
```

#### **"Datos incorrectos después de migrar"**
```bash
# Restaurar desde backup
localStorage.getItem('backup_licencias_2024-01-15')
```

### **Logs de Debug**

Para activar logs detallados:

```typescript
// En migracionDatos.ts
console.log('DEBUG: Procesando licencia:', licencia);
console.log('DEBUG: DTO generado:', dto);
console.log('DEBUG: Respuesta backend:', respuesta);
```

---

## 📞 **Soporte**

Para problemas con la migración:

1. **Verificar logs** en la consola del navegador
2. **Descargar reporte** de migración para análisis
3. **Revisar backup** creado automáticamente
4. **Consultar esta documentación** para casos comunes

---

## 🎯 **Checklist de Migración**

### **Antes de Migrar**
- [ ] Verificar conectividad al backend
- [ ] Confirmar que hay datos en PouchDB
- [ ] Revisar variables de entorno
- [ ] Hacer backup manual (opcional)

### **Durante la Migración**
- [ ] Monitorear progreso en UI
- [ ] Revisar logs en consola
- [ ] No cerrar navegador/pestaña
- [ ] Verificar estado de red

### **Después de Migrar**
- [ ] Verificar reporte de migración
- [ ] Confirmar datos en nueva UI
- [ ] Descargar backup generado
- [ ] Limpiar PouchDB (opcional)
- [ ] Actualizar marcadores/links

---

> 🎉 **¡Migración Lista!**
> Con esta guía tienes todo lo necesario para migrar tus datos de licencias
> de forma segura y eficiente al nuevo sistema integrado.