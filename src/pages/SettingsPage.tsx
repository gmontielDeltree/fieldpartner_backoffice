import React from 'react'
import { SettingsOutlined } from '@mui/icons-material'
import { EmptyState, ListCard, PageContainer, PageHeader } from '../components'

export const SettingsPage: React.FC = () => {
    return (
        <PageContainer maxWidth={980}>
            <PageHeader icon={<SettingsOutlined />} title="Configuración" />
            <ListCard>
                <EmptyState icon={<SettingsOutlined />} title="Todavía no hay opciones de configuración" />
            </ListCard>
        </PageContainer>
    )
}
