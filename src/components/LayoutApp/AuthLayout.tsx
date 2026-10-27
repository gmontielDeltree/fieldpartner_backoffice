import React from 'react';
import { Box, Link, Typography } from '@mui/material';
import { AccountTreeOutlined, KeyOutlined, TuneOutlined } from '@mui/icons-material';

/* ─────────────────────────────────────────────────────────
 * AUTH LAYOUT (la plantilla de ingreso de FieldPartner)
 * Escritorio: panel de marca a la izquierda (foto de campo, titular
 * y tres fichas) y el formulario a la derecha sobre --page.
 * Mobile (<900px): la foto queda como franja corta arriba.
 * ───────────────────────────────────────────────────────── */

// Tinta sobre la foto: blancos con alfa (la foto no tiene token propio).
const onPhoto = {
  ink: 'rgba(255, 255, 255, 0.97)',
  ink2: 'rgba(255, 255, 255, 0.76)',
  ink3: 'rgba(255, 255, 255, 0.66)',
  glass: 'rgba(255, 255, 255, 0.08)',
  glassTile: 'rgba(255, 255, 255, 0.12)',
  glassLine: 'rgba(255, 255, 255, 0.16)',
};

// Velo oscuro sobre la foto para que el texto se lea (no es decorativo).
const photoVeil =
  'linear-gradient(180deg, rgba(8, 12, 10, 0.52) 0%, rgba(8, 12, 10, 0.12) 26%, rgba(8, 12, 10, 0.16) 44%, rgba(8, 12, 10, 0.7) 70%, rgba(8, 12, 10, 0.88) 100%)';

/** Entrada escalonada de los bloques (fade-up de foundation.css). */
export const authEnter = (delay = 0) => ({
  animation: 'fade-up 420ms var(--ease-out-strong) both',
  animationDelay: `${delay}ms`,
});

const VALUES = [
  { icon: <KeyOutlined />, title: 'Cuentas y licencias', text: 'Altas, sistemas y licencias de cada cliente' },
  { icon: <AccountTreeOutlined />, title: 'Menús y módulos', text: 'Lo que ve cada usuario en FieldPartner' },
  { icon: <TuneOutlined />, title: 'Maestros', text: 'Cultivos, países, tipos y categorías' },
] as const;

/* Panel de marca: foto + velo + logo, titular y fichas "glass". */
const BrandPanel: React.FC = () => (
  <Box
    component="aside"
    sx={{
      position: { xs: 'relative', md: 'sticky' },
      top: 0,
      alignSelf: 'start',
      height: { xs: 124, md: '100dvh' },
      p: { xs: 1, md: 1.5 },
      pb: { xs: 0, md: 1.5 },
    }}
  >
    <Box sx={{ position: 'relative', height: '100%', overflow: 'hidden', isolation: 'isolate', borderRadius: '14px', bgcolor: 'var(--ink)' }}>
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/assets/load-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: { xs: '50% 58%', md: '56% 50%' },
          animation: 'fade-in 700ms ease both',
        }}
      />
      <Box aria-hidden sx={{ position: 'absolute', inset: 0, background: photoVeil }} />

      <Box sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: { xs: 2, md: 5 } }}>
        <Box
          component="img"
          src="/assets/fieldpartner-logo-white.png"
          alt="FieldPartner"
          sx={{ alignSelf: 'flex-start', height: { xs: 22, md: 28 }, width: 'auto', mt: { xs: '6px', md: 0 }, ...authEnter(0) }}
        />

        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          {/* titular en dos renglones: el segundo, más apagado */}
          <Typography
            sx={{
              fontSize: { md: 28, lg: 34 },
              fontWeight: 600,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: onPhoto.ink,
              '& > span': { display: 'block' },
              ...authEnter(60),
            }}
          >
            <span>Backoffice de FieldPartner,</span>
            <Box component="span" sx={{ color: onPhoto.ink3 }}>
              la trastienda del sistema.
            </Box>
          </Typography>
          <Typography sx={{ maxWidth: 420, mt: 1.5, fontSize: 15, lineHeight: 1.55, color: onPhoto.ink2, ...authEnter(110) }}>
            Administrá cuentas, licencias, menús y los datos maestros que usa toda la plataforma.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { md: 'minmax(0, 1fr)', lg: 'repeat(3, minmax(0, 1fr))' }, gap: 1.25, mt: 4 }}>
            {VALUES.map((value, index) => (
              <Box
                key={value.title}
                sx={{
                  display: 'flex',
                  flexDirection: { md: 'row', lg: 'column' },
                  alignItems: { md: 'center', lg: 'flex-start' },
                  gap: { md: 1.5, lg: 1.25 },
                  p: '14px',
                  borderRadius: '12px',
                  background: onPhoto.glass,
                  boxShadow: `inset 0 0 0 1px ${onPhoto.glassLine}`,
                  backdropFilter: 'blur(14px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(14px) saturate(140%)',
                  ...authEnter(170 + index * 50),
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexShrink: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 30,
                    height: 30,
                    borderRadius: '8px',
                    background: onPhoto.glassTile,
                    color: onPhoto.ink,
                    '& svg': { fontSize: 18 },
                  }}
                >
                  {value.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em', color: onPhoto.ink }}>{value.title}</Typography>
                  <Typography sx={{ mt: 0.25, fontSize: 12, lineHeight: 1.45, color: onPhoto.ink3 }}>{value.text}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
);

/* Pie de la columna del formulario: "una solución de" + logo de QTS Agro. */
const AuthFooter: React.FC = () => (
  <Box
    component="footer"
    sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 1, px: 2, pt: 1, pb: 3, fontSize: 12, color: 'var(--ink-3)', ...authEnter(200) }}
  >
    <span>Una solución de</span>
    <Link href="https://www.qtsagro.net/" aria-label="QTS Agro" sx={{ display: 'inline-flex', opacity: 0.9, transition: 'opacity 140ms ease', '&:hover': { opacity: 1 } }}>
      <Box
        component="img"
        src="/assets/qtsagro-logo.png"
        alt="QTS Agro"
        sx={{
          height: 34,
          width: 'auto',
          // la bajada del logo a este tamaño es una raya ilegible: se recorta
          clipPath: 'polygon(0 0, 100% 0, 100% 74%, 23.4% 74%, 23.4% 100%, 0 100%)',
        }}
      />
    </Link>
    <Box component="span" aria-hidden sx={{ color: 'var(--ink-3)' }}>
      ·
    </Box>
    <span>© {new Date().getFullYear()}</span>
  </Box>
);

export interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => (
  <Box
    component="main"
    sx={{
      position: 'relative',
      display: 'grid',
      gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(420px, 44%) minmax(0, 1fr)' },
      // en mobile la franja de foto no se estira: el sobrante va al formulario
      gridTemplateRows: { xs: 'auto 1fr', md: '1fr' },
      minHeight: '100dvh',
      background: 'var(--page)',
    }}
  >
    <BrandPanel />

    <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: { md: '100dvh' } }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'center', px: 2, pt: { xs: 3.5, md: 4 }, pb: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 380 }}>{children}</Box>
      </Box>

      <AuthFooter />
    </Box>
  </Box>
);

/* Encabezado del formulario: símbolo en ficha, título y bajada. */
export const AuthHeader: React.FC<{ title: React.ReactNode; subtitle?: React.ReactNode }> = ({ title, subtitle }) => (
  <Box sx={{ mb: 3.5, ...authEnter(0) }}>
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 44,
        mb: 2.5,
        borderRadius: '12px',
        background: 'var(--surface)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <Box component="img" src="/assets/fieldpartner-simbolo.png" alt="" sx={{ width: 28, height: 28, objectFit: 'contain' }} />
    </Box>
    <Typography component="h1" sx={{ fontSize: 24, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-0.022em', color: 'var(--ink)' }}>
      {title}
    </Typography>
    {subtitle && <Typography sx={{ mt: 0.75, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-2)', wordBreak: 'break-word' }}>{subtitle}</Typography>}
  </Box>
);

/* Etiqueta de campo arriba del input, con algo opcional a la derecha. */
export const AuthFieldLabel: React.FC<{ htmlFor: string; children: React.ReactNode; aside?: React.ReactNode }> = ({ htmlFor, children, aside }) => (
  <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
    <Typography component="label" htmlFor={htmlFor} sx={{ fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
      {children}
    </Typography>
    {aside}
  </Box>
);
