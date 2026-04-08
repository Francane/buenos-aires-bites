

## Plan: Estabilizar runtime (fix blank screen)

### Diagnóstico confirmado
- `react` y `react-dom` están en `^18.3.1` (no fijados a `18.2.0`).
- `react-leaflet` está en `4.2.1` (correcto), pero con React 18.3.x puede haber incompatibilidad de contexto.
- Existen `bun.lock` y `bun.lockb` junto a `package-lock.json` — riesgo de árbol inconsistente.
- `.gitignore` no excluye lockfiles de bun.
- `MapSection` tiene un `ref={mapRef}` en `MapContainer` que no se usa realmente y puede interferir con el tree interno de react-leaflet.
- No hay `ErrorBoundary` en ningún lugar del árbol.

---

### Paso 1 — Fijar versiones exactas en `package.json`

Cambiar a versiones sin caret:
- `"react": "18.2.0"`
- `"react-dom": "18.2.0"`
- `"leaflet": "1.9.4"`
- `"react-leaflet": "4.2.1"` (ya está sin caret)
- `"@types/react": "18.2.79"` (compatible con 18.2.0)
- `"@types/react-dom": "18.2.25"` (compatible)

Eliminar `"next-themes"` (no se usa tras el fix anterior de sonner).

### Paso 2 — Limpiar lockfiles y caché

- Borrar `bun.lock` y `bun.lockb`.
- Agregar `bun.lock` y `bun.lockb` a `.gitignore`.
- Borrar `node_modules` y `.vite` cache.
- Reinstalar con `npm install`.
- Verificar con `npm ls react react-dom react-leaflet leaflet` que hay una sola copia de cada uno.

### Paso 3 — Crear `ErrorBoundary` reutilizable

Nuevo archivo: `src/components/error/ErrorBoundary.tsx`
- Class component con `componentDidCatch`.
- Prop `fallback` para UI personalizable.
- Fallback por defecto: mensaje amigable bilingüe sin romper layout.

### Paso 4 — Blindar mapa en `Index.tsx`

Envolver el `Suspense` + `MapSection` con `ErrorBoundary` local:
```
<ErrorBoundary fallback={<MapFallback />}>
  <Suspense fallback={<SkeletonLoader />}>
    <MapSection ... />
  </Suspense>
</ErrorBoundary>
```
El fallback muestra la sección "explorar" con un mensaje de "mapa no disponible" en vez de blank screen.

### Paso 5 — ErrorBoundary global en `App.tsx`

Envolver `<Routes>` con el `ErrorBoundary` para que cualquier crash de ruta no deje pantalla blanca.

### Paso 6 — Ajuste mínimo en `MapSection.tsx`

- Quitar `ref={mapRef}` del `MapContainer` (no se usa y puede crear conflicto con el ref interno de react-leaflet v4).
- Eliminar el `useRef` asociado.
- Verificar que `MapContainer` tiene un child tree plano y válido (ya lo es: `TileLayer`, `MapUpdater`, y `Marker[]` directos — sin fragments ni wrappers extra).

### Paso 7 — Verificación

- Home carga sin blank screen.
- Mapa renderiza con markers.
- Si mapa falla, solo cae su sección.
- Navbar, cards, favoritos, detalle siguen funcionando.

---

### Archivos tocados
| Archivo | Cambio |
|---|---|
| `package.json` | Fijar versiones, eliminar next-themes |
| `.gitignore` | Agregar bun.lock, bun.lockb |
| `bun.lock`, `bun.lockb` | Eliminar |
| `src/components/error/ErrorBoundary.tsx` | Nuevo |
| `src/pages/Index.tsx` | Envolver mapa con ErrorBoundary |
| `src/App.tsx` | ErrorBoundary global |
| `src/components/map/MapSection.tsx` | Quitar ref no usado |

