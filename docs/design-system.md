# Sistema de diseño del Backoffice

El backoffice usa **el mismo sistema de diseño que FieldPartner** (rediseño de octubre 2026, PR front#45 y #48): mismos tokens, mismo theme de MUI, mismo shell y las mismas piezas de `components/ui`. La base visual es **Beautiful UI** ([beautifului.dev](https://www.beautifului.dev), MIT): superficies blancas sobre un lienzo neutro frío, bordes de un pixel, sombras en capas de muy baja opacidad, tipografía Inter y curvas de animación fuertes, con el **verde de la marca** como acento.

Los archivos de `src/themes` y `src/components/ui` son copia de los de `fieldparner_frontend` (master). Si allá cambian, conviene traer los cambios tal cual para que las dos apps sigan iguales. Única diferencia: el theme de acá no trae los estilos de `DataGrid` (el backoffice no usa `@mui/x-data-grid`).

## Dónde vive cada cosa

| Archivo | Qué tiene |
|---|---|
| `src/themes/tokens.ts` | Colores (claro y oscuro: `tokensFor(mode)`), sombras, radios, curvas, fuentes, medidas del shell y la receta del encabezado de tabla (`tableHeadCell`). |
| `src/themes/foundation.css` | Los mismos tokens como variables CSS (`--ink`, `--line`, `--accent`…), su versión oscura en `:root[data-theme="dark"]`, keyframes (`fade-up`, `fade-in`, `pop-in`) y la puesta a tono de sweetalert2 y semantic-ui. |
| `src/themes/ColorMode.tsx` | Modo claro/oscuro (`useColorMode()`), guardado en `localStorage` (`fp_color_mode`, la misma clave que FieldPartner). `index.html` lo aplica antes de cargar. |
| `src/themes/fieldpartnerTheme.tsx` | Theme de MUI con *overrides* de casi todos los componentes: cualquier `Button`, `TextField`, `Dialog`, `Chip`, `Tabs`… hereda el estilo sin tocar la página. |
| `src/components/LayoutApp/` | Shell: `SideBar` (256px, colapsa a 60), `NavBar` (migas + buscador), `CommandPalette` (⌘K / Ctrl+K), `UserMenu` (modo oscuro y cerrar sesión), `AuthLayout` (ingreso) y `navigation.tsx`, el árbol de pantallas que usan los tres. |
| `src/components/ui/` | Piezas de FieldPartner (`PageHeader`, `EmptyState`, `ValuePill`, `StatusPill`, `RollingNumber`, `LoadingState`, `FormKit`, `FormSection`…) y `ListKit` (contenedor de página y lista). |
| `src/components/DataTable` | Tabla compartida con el encabezado de FieldPartner y orden por columna. |

Para sumar una pantalla al menú, al buscador y a las migas: agregarla en `src/components/LayoutApp/navigation.tsx`.

## Tokens

Usar siempre las variables, nunca hex sueltos: `--canvas`, `--page`, `--surface`, `--inset`, `--field`, `--hover`, `--hover-2` (superficies); `--ink`, `--ink-2`, `--ink-3`, `--ink-inverse` (texto); `--line`, `--line-strong`, `--grid-line` (bordes); `--accent`, `--accent-ink`, `--accent-tint`, `--green`, `--orange`, `--red`, `--blue` y sus `-tint`; `--shadow-hairline`, `--shadow-btn`, `--shadow-card`, `--shadow-raised`, `--shadow-overlay`. Radios: chips 6px, controles 8px, cards 10–12px, diálogos 14px, píldoras 999px.

## Pantallas

**Lista** (ver `pages/Category/ListCategory.tsx`):

```tsx
<PageContainer>
  <PageHeader icon={…} title="Categorías" meta={<ValuePill><RollingNumber value={rows.length} /></ValuePill>}
    actions={<Button variant="contained" startIcon={<AddRounded />}>Nuevo</Button>} />
  <ListCard>
    <ListToolbar aside={filterText ? <FilteredCount shown={…} total={…} /> : undefined}>
      <SearchField value={filterText} onChange={handleInputChange} onSubmit={onClickSearch} />
    </ListToolbar>
    {sinFilas ? <EmptyState … /> : <DataTable …>{filas con ItemRow / TableCellStyled}</DataTable>}
  </ListCard>
</PageContainer>
```

**Alta / edición** (ver `pages/Category/CategoryPage.tsx`): `PageContainer` (más angosto) → `PageHeader` con `eyebrow` (sección · pantalla), título «Nuevo…/Editar…» y `onBack` → una o más `FormCard` con los campos en `Grid` → `FormActions` (Cancelar `outlined`, Guardar `contained`).

## Reglas

1. **Encabezado:** siempre `PageHeader`; el título no se centra; nada de `Typography h4` sueltos ni cajas con gradiente.
2. **Contenedor:** el contenido va en cards (`FormCard`, `ListCard`, `Paper`) sobre `--page`; no pintar fondos de página ni sombras propias.
3. **Botones:** principal `contained` (verde, píldora), secundaria `outlined`, terciaria `text`; peligro `color="error"`. No pisar `background` ni `borderRadius`.
4. **Tablas:** `DataTable` + `ItemRow` + `TableCellStyled`. Columnas de texto alineadas a la izquierda, números a la derecha. Acciones por fila con `IconButton` + `aria-label` («Editar», «Eliminar»): quedan quietas hasta el hover y el borrar se pone rojo. Estados con `StatusPill`.
5. **Colores:** variables, nunca hex sueltos (`#1976d2` → `var(--accent)`; `#333` → `var(--ink)`; grises → `--ink-2`/`--ink-3`; fondos grises → `var(--inset)`). Así funciona el modo oscuro.
6. **Movimiento:** entradas con `fade-up` (ya lo traen `PageHeader`, `ListCard` y `FormCard`); hover de 120–160ms; sin rebotes.
7. **Datos:** el diseño no cambia qué datos se muestran, cómo se guardan ni qué hace cada botón. Hooks, servicios, store y formas de los documentos no se tocan.

## Demo local

Para ver todas las pantallas sin tocar staging, en `Fieldpartner\_demo-harness\backoffice` está `bo-mock.mjs` (login falso y API de cuentas/usuarios en :5992, y crea las bases que faltan en el CouchDB local del contenedor `fp-demo-couch`) y `env.bo-demo`, que se copia como `.env.demo.local` y se usa con `npx vite --mode demo`.
