import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Link, Typography } from '@mui/material';
import { HomeOutlined, NorthEastRounded } from '@mui/icons-material';
import { GlideMenu, IconTile, PageContainer, PageHeader, enter } from '../components';
import { NAV_GROUPS } from '../components/LayoutApp/navigation';
import { useAppSelector } from '../hooks';

/* Inicio: accesos a las secciones del backoffice (las mismas de la barra
 * lateral) y, al pie, las marcas que antes ocupaban toda la pantalla. */
export const HomePage: React.FC = () => {
    const { user } = useAppSelector((state) => state.auth);
    const firstName = user?.firstName || '';
    const sections = NAV_GROUPS.filter((group) => group.items.length > 1);

    return (
        <PageContainer maxWidth={1180}>
            <PageHeader icon={<HomeOutlined />} eyebrow="FieldPartner Backoffice" title={firstName ? `Hola, ${firstName}` : 'Inicio'} />

            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' },
                    gap: 2,
                }}
            >
                {sections.map((group, index) => (
                    <Box
                        key={group.key}
                        component="section"
                        sx={{
                            borderRadius: '12px',
                            background: 'var(--surface)',
                            boxShadow: 'var(--shadow-card)',
                            p: 1,
                            ...enter(index + 1),
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1, pt: 0.75, pb: 1 }}>
                            <IconTile size={30} tone="accent">{group.icon}</IconTile>
                            <Typography component="h2" sx={{ fontSize: 14.5, fontWeight: 600, letterSpacing: '-0.012em', color: 'var(--ink)' }}>
                                {group.label}
                            </Typography>
                        </Box>
                        <GlideMenu highlight="var(--hover-2)" sx={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                            {group.items.map((item) => (
                                <Box
                                    key={item.key}
                                    data-menu-row
                                    component={RouterLink}
                                    to={item.route}
                                    sx={{
                                        position: 'relative',
                                        zIndex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1.25,
                                        height: 38,
                                        px: 1,
                                        borderRadius: '8px',
                                        color: 'var(--ink)',
                                        textDecoration: 'none',
                                        fontSize: 13.5,
                                        fontWeight: 500,
                                        '& .home-icon': { display: 'flex', color: 'var(--ink-3)', '& svg': { fontSize: 18 } },
                                        '& .home-arrow': { opacity: 0, transition: 'opacity 120ms ease' },
                                        '&:hover': { color: 'var(--ink)', textDecoration: 'none' },
                                        '&:hover .home-arrow': { opacity: 1 },
                                        '&:focus-visible': { outline: '2px solid var(--accent)', outlineOffset: -2 },
                                    }}
                                >
                                    <span className="home-icon">{item.icon}</span>
                                    <Box component="span" sx={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.label}
                                    </Box>
                                    <Box component="span" className="home-arrow" sx={{ display: 'flex', color: 'var(--ink-3)' }}>
                                        <NorthEastRounded sx={{ fontSize: 15 }} />
                                    </Box>
                                </Box>
                            ))}
                        </GlideMenu>
                    </Box>
                ))}
            </Box>

            <Box
                component="footer"
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mt: 5, fontSize: 12, color: 'var(--ink-3)', ...enter(sections.length + 1) }}
            >
                <Box component="img" src="/assets/fieldpartner-logo.png" alt="FieldPartner" sx={{ height: 20, width: 'auto', opacity: 0.85 }} />
                <Box component="span" aria-hidden>
                    ·
                </Box>
                <span>Una solución de</span>
                <Link href="https://www.qtsagro.net/" aria-label="QTS Agro" sx={{ display: 'inline-flex', opacity: 0.9, '&:hover': { opacity: 1 } }}>
                    <Box
                        component="img"
                        src="/assets/qtsagro-logo.png"
                        alt="QTS Agro"
                        sx={{ height: 34, width: 'auto', clipPath: 'polygon(0 0, 100% 0, 100% 74%, 23.4% 74%, 23.4% 100%, 0 100%)' }}
                    />
                </Link>
            </Box>
        </PageContainer>
    );
};
