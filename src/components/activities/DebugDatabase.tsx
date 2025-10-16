import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import PouchDB from 'pouchdb';

const DebugDatabase: React.FC = () => {
  const [dbInfo, setDbInfo] = useState<any>({});

  const inspectDatabase = async () => {
    try {
      const db = new PouchDB('fields');
      
      // Obtener todos los documentos con attachments
      const allDocs = await db.allDocs({
        include_docs: true,
        attachments: true,
        limit: 200
      });

      // Analizar estructura
      const docTypes = new Map<string, number>();
      const sampleDocs: any[] = [];
      const lotesDocs: any[] = [];
      const actividadesDocs: any[] = [];

      allDocs.rows.forEach(row => {
        const doc = row.doc;
        if (doc && !doc._id?.startsWith('_')) {
          // Contar tipos de documentos
          const prefix = doc._id?.split(':')[0] || 'sin_prefijo';
          docTypes.set(prefix, (docTypes.get(prefix) || 0) + 1);

          // Extraer datos de attachments si existen
          let attachmentData = null;
          if (doc._attachments) {
            const firstAttachment = Object.values(doc._attachments)[0] as any;
            if (firstAttachment && firstAttachment.data) {
              try {
                // Decodificar base64 si es necesario
                const decoded = atob(firstAttachment.data);
                attachmentData = JSON.parse(decoded);
              } catch (e) {
                attachmentData = firstAttachment.data;
              }
            }
          }

          // Guardar muestras
          if (sampleDocs.length < 10) {
            sampleDocs.push({
              _id: doc._id,
              tipo: doc.tipo,
              lote_uuid: doc.lote_uuid,
              lote: doc.lote,
              campo: doc.campo,
              nombre: doc.nombre,
              keys: Object.keys(doc),
              hasAttachments: !!doc._attachments,
              attachmentKeys: doc._attachments ? Object.keys(doc._attachments) : [],
              attachmentData: attachmentData ? Object.keys(attachmentData).slice(0, 5) : null
            });
          }

          // Buscar en attachments también
          const dataToCheck = attachmentData || doc;
          
          // Buscar lotes
          if (doc._id?.includes('lote') || dataToCheck.tipo === 'lote' || dataToCheck.lote || dataToCheck.nombre_lote) {
            lotesDocs.push({
              _id: doc._id,
              uuid: dataToCheck.uuid || doc._id,
              nombre: dataToCheck.nombre || dataToCheck.lote || dataToCheck.nombre_lote,
              lote: dataToCheck.lote,
              campo: dataToCheck.campo || dataToCheck.nombre_campo,
              tipo: dataToCheck.tipo,
              hasAttachment: !!doc._attachments
            });
          }

          // Buscar actividades
          if (doc._id?.startsWith('actividad') || dataToCheck.tipo || dataToCheck.activity_type) {
            actividadesDocs.push({
              _id: doc._id?.substring(0, 30),
              tipo: dataToCheck.tipo || dataToCheck.activity_type,
              lote_uuid: dataToCheck.lote_uuid?.substring(0, 12),
              lote_nombre: dataToCheck.lote_nombre || dataToCheck.lote,
              campo_nombre: dataToCheck.campo_nombre || dataToCheck.campo,
              hasAttachment: !!doc._attachments
            });
          }
        }
      });

      setDbInfo({
        totalDocs: allDocs.rows.length,
        docTypes: Array.from(docTypes.entries()),
        sampleDocs,
        lotesDocs: lotesDocs.slice(0, 10),
        actividadesDocs: actividadesDocs.slice(0, 10)
      });

      console.log('Database inspection:', {
        docTypes: Array.from(docTypes.entries()),
        sampleDocs,
        lotesDocs,
        actividadesDocs
      });

    } catch (error) {
      console.error('Error inspecting database:', error);
    }
  };

  useEffect(() => {
    inspectDatabase();
  }, []);

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>Database Debug Info</Typography>
      
      <Button onClick={inspectDatabase} variant="contained" sx={{ mb: 2 }}>
        Refresh
      </Button>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Total Documents: {dbInfo.totalDocs}</Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Document Types:</Typography>
        <pre>{JSON.stringify(dbInfo.docTypes, null, 2)}</pre>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Sample Documents:</Typography>
        <pre style={{ fontSize: '0.8em', overflow: 'auto', maxHeight: '200px' }}>
          {JSON.stringify(dbInfo.sampleDocs, null, 2)}
        </pre>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Lotes Found:</Typography>
        <pre style={{ fontSize: '0.8em', overflow: 'auto', maxHeight: '200px' }}>
          {JSON.stringify(dbInfo.lotesDocs, null, 2)}
        </pre>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="h6">Activities Sample:</Typography>
        <pre style={{ fontSize: '0.8em', overflow: 'auto', maxHeight: '200px' }}>
          {JSON.stringify(dbInfo.actividadesDocs, null, 2)}
        </pre>
      </Box>
    </Paper>
  );
};

export default DebugDatabase;