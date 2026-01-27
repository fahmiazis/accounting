import React from 'react';
import * as XLSX from 'xlsx';

const DailyUploadMapping = () => {
  const generateData = () => {
    const statusDepo = [
      'Depo EDS',
      'Local Distribution Center EDS',
      'Cabang EDS',
      'Sales Point EDS',
      'Indirect EDS',
      'Central Point EDS',
      'Cabang SAP',
      'Depo SAP'
    ];

    const dokumenEDS = [
      'Laporan Detail Buku Penjualan (ZSDRP001N)',
      'Compare Stock EDS All',
      'mb52 (layout /mb52 new)',
      'End Stok - Stok Realtime (format .excel)',
      'ZNDSU Compare Billing',
      'ZNDSU Compare Inventory GS & BS (Format rar atau zip)'
    ];

    const dokumenSAP = [
      'Laporan Detail Buku Penjualan (ZSDRP001N)',
      'mb52 (layout /mb52 new)'
    ];

    const dokumenKasbank = [
      'RK Bank ZBA/Bank Collection format excel',
      'RK Bank ZBA /Bank Collection (format .pdf)',
      'RK Bank Spending Card (format .pdf)',
      'RK Bank Spending Card (format .excel)',
      'Laporan Transaksi Kas & Bank (ZFIR0007)',
      'Daftar Transaksi Kas & Bank dari awal Live (FBL3N GL Kas Bank)'
    ];

    const data = [];
    
    statusDepo.forEach(status => {
      const isEDS = status.includes('EDS') && !status.includes('SAP');
      const isSAP = status.includes('SAP');
      const isCentralPoint = status === 'Central Point EDS';
      
      if (isEDS) {
        dokumenEDS.forEach(doc => {
          data.push({
            'Nama Dokumen': doc,
            'Jenis Dokumen': 'daily',
            'Divisi': 'Accounting',
            'Status Depo': status,
            'Uploaded By': 'sa'
          });
        });
      } else if (isSAP) {
        dokumenSAP.forEach(doc => {
          data.push({
            'Nama Dokumen': doc,
            'Jenis Dokumen': 'daily',
            'Divisi': 'Accounting',
            'Status Depo': status,
            'Uploaded By': 'sa'
          });
        });
      }
      
      dokumenKasbank.forEach(doc => {
        data.push({
          'Nama Dokumen': doc,
          'Jenis Dokumen': 'daily',
          'Divisi': 'Accounting',
          'Status Depo': status,
          'Uploaded By': isCentralPoint ? 'sa' : 'kasir'
        });
      });
    });
    
    return data;
  };

  const downloadExcel = () => {
    const data = generateData();
    
    const ws = XLSX.utils.json_to_sheet(data, {
      header: ['Nama Dokumen', 'Jenis Dokumen', 'Divisi', 'Status Depo', 'Uploaded By']
    });
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daily Upload Mapping');
    
    XLSX.writeFile(wb, 'Daily_Upload_Dokumen_Mapping.xlsx');
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>Daily Upload Dokumen Mapping</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        Total: 96 Records
      </p>
      <button
        onClick={downloadExcel}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '15px 40px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Download Excel File
      </button>
    </div>
  );
};

export default DailyUploadMapping;