import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, TextField, Select, MenuItem } from '@mui/material';
import PouchDB from 'pouchdb';

const DatabaseExplorer: React.FC = () => {
  const [databases, setDatabases] = useState<string[]>([]);
  const [selectedDb, setSelectedDb] = useState<string>('fields');
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchId, setSearchId] = useState<string>('');

  // Lista de posibles bases de datos
  const possibleDatabases = [
    'fields',
    'productive-units',
    'campos',
    'lotes',
    'activities',
    'campos_randyv7',
    'fieldpartner',
    'fields-by-product-unit'
  ];

  const loadDatabases = async () => {
    const availableDbs: string[] = [];
    
    for (const dbName of possibleDatabases) {
      try {
        const db = new PouchDB(dbName);
        const info = await db.info();
        if (info.doc_count > 0) {
          availableDbs.push(dbName);
        }
      } catch (e) {
        // Database doesn't exist or error
      }
    }
    
    setDatabases(availableDbs);
  };

  const loadDocuments = async (dbName: string) => {
    try {
      const db = new PouchDB(dbName);
      
      // Get sample documents
      const result = await db.allDocs({
        include_docs: true,
        limit: 50,
        startkey: searchId || undefined,
        endkey: searchId ? searchId + '\ufff0' : undefined
      });

      const docs = result.rows.map(row => {
        const doc = row.doc;
        return {
          _id: doc._id,
          _rev: doc._rev?.substring(0, 8),
          ...doc,
          _attachments: doc._attachments ? 'YES' : 'NO'
        };
      });

      setDocuments(docs);

      // Log for debugging
      console.log(`Database: ${dbName}`, docs);
      
      // Look for fields/lotes patterns
      const fieldsRelated = docs.filter(d => 
        d.lote || d.campo || d.field || d.nombre || d.nombre_lote || d.nombre_campo ||
        d.lote_uuid || d.campo_uuid || d.tipo === 'lote' || d.tipo === 'campo'
      );
      
      if (fieldsRelated.length > 0) {
        console.log('Fields/Lotes related documents:', fieldsRelated);
      }

    } catch (error) {
      console.error('Error loading documents:', error);
      setDocuments([]);
    }
  };

  useEffect(() => {
    loadDatabases();
  }, []);

  useEffect(() => {
    if (selectedDb) {
      loadDocuments(selectedDb);
    }
  }, [selectedDb, searchId]);

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>Database Explorer</Typography>
      
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <Select
          value={selectedDb}
          onChange={(e) => setSelectedDb(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          {databases.map(db => (
            <MenuItem key={db} value={db}>{db}</MenuItem>
          ))}
        </Select>
        
        <TextField
          label="Search by ID prefix"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          placeholder="e.g., lote:, actividad:"
        />
        
        <Button onClick={() => loadDocuments(selectedDb)} variant="contained">
          Refresh
        </Button>
      </Box>

      <Typography variant="h6" sx={{ mb: 1 }}>
        Database: {selectedDb} ({documents.length} documents shown)
      </Typography>

      <Box sx={{ overflow: 'auto', maxHeight: '600px' }}>
        <pre style={{ fontSize: '0.75em' }}>
          {JSON.stringify(documents, null, 2)}
        </pre>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="caption" color="textSecondary">
          Available databases: {databases.join(', ')}
        </Typography>
      </Box>
    </Paper>
  );
};

export default DatabaseExplorer;