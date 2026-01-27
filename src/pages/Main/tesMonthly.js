import React from 'react';
import * as XLSX from 'xlsx';

const MonthlyUploadMapping = () => {
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

    const dokumenInventorySAP = [
      'Form Perbandingan Sales',
      'Kertas Kerja Sales area SAP (FBL3N vs LBP/ZSDRP001N) Excel dan PDF (Full Approval)',
      'Tarikan LBP ZSDRP001N',
      'End Stock MB52 (Tarikan di SAP, layout : /MB52 NEW)',
      'MB5B (All Gudang : Sloc dikosongkan dan Gudang BS : Sloc diisi BS00)',
      'MB51 All mutasi (BPPR: DTB: Adjustment + BA: Pemusnahan BS + BA Full Approval: Sales & Retur)',
      'BA SO Excel + PDF Full Approval cross opname',
      'BA SO Excel + KKSO + LSO PDF Full Approval Closing',
      'BA Pemusnahan BS, Dokumentasi, FPR, Full Approval',
      'BA Adjustment, Full Approval'
    ];

    const dokumenInventoryEDS = [
      'Form Perbandingan Sales',
      'Kertas Kerja Sales area SAP (FBL3N vs LBP/ZSDRP001N) Excel dan PDF (Full Approval)',
      'Tarikan LBP ZSDRP001N',
      'ZNDSU Sales',
      'End Stock Real time EDS (Tarikan di EDS)',
      'ZNDSU Inventory',
      'End Stock MB52 (Tarikan di SAP, layout : /MB52 NEW)',
      'MB5B (All Gudang : Sloc dikosongkan dan Gudang BS : Sloc diisi BS00)',
      'MB51 All mutasi (BPPR: DTB: Adjustment + BA: Pemusnahan BS + BA Full Approval: Sales & Retur)',
      'BA SO Excel + PDF Full Approval cross opname',
      'BA SO Excel + KKSO + LSO PDF Full Approval Closing',
      'BA Pemusnahan BS, Dokumentasi, FPR, Full Approval',
      'BA Adjustment, Full Approval'
    ];

    const dokumenKasbankAll = [
      'Berita Acara Cash Opname Kas Besar',
      'Berita Acara Cash Opname Kas Kecil',
      'Daftar Transaksi Kas & Bank dari awal Live (FBL3N GL Kas Bank)',
      'Form Monitoring Spending Card',
      'Kertas Kerja Collection Account Excel + PDF Full Approval',
      'Laporan Kasbon + PDF Full Approval',
      'Laporan Rekonsiliasi Bank --> Status Cabang',
      'Laporan Rekonsiliasi Bank Spending Card',
      'Laporan Transaksi Kas & Bank dari awal Live (ZFIR0007)',
      'Rekening Koran Bank Collection (format :excel) --> Status Cabang',
      'Rekening Koran Bank Collection (format :pdf) --> Status Cabang',
      'Rekening Koran Bank Operasional (format :excel) --> Status Cabang',
      'Rekening Koran Bank Operasional (format :pdf) --> Status Cabang',
      'Rekening Koran Bank Spending Card (format :excel)',
      'Rekening Koran Bank Spending Card (format :pdf)'
    ];

    const dokumenKasbankEDS = [
      'Rekening Koran Bank ZBA (format :excel)',
      'Rekening Koran Bank ZBA (format :pdf)'
    ];

    const data = [];
    
    statusDepo.forEach(status => {
      const isEDS = status.includes('EDS') && !status.includes('SAP');
      const isSAP = status.includes('SAP');
      const isCentralPoint = status === 'Central Point EDS';
      
      // Inventory documents
      if (isEDS) {
        dokumenInventoryEDS.forEach(doc => {
          data.push({
            'Nama Dokumen': doc,
            'Jenis Dokumen': 'monthly',
            'Divisi': 'Accounting',
            'Status Depo': status,
            'Uploaded By': 'sa'
          });
        });
      } else if (isSAP) {
        dokumenInventorySAP.forEach(doc => {
          data.push({
            'Nama Dokumen': doc,
            'Jenis Dokumen': 'monthly',
            'Divisi': 'Accounting',
            'Status Depo': status,
            'Uploaded By': 'sa'
          });
        });
      }
      
      // Kasbank documents (EDS & SAP)
      dokumenKasbankAll.forEach(doc => {
        data.push({
          'Nama Dokumen': doc,
          'Jenis Dokumen': 'monthly',
          'Divisi': 'Accounting',
          'Status Depo': status,
          'Uploaded By': isCentralPoint ? 'sa' : 'kasir'
        });
      });

      // Kasbank documents (only EDS)
      if (isEDS) {
        dokumenKasbankEDS.forEach(doc => {
          data.push({
            'Nama Dokumen': doc,
            'Jenis Dokumen': 'monthly',
            'Divisi': 'Accounting',
            'Status Depo': status,
            'Uploaded By': isCentralPoint ? 'sa' : 'kasir'
          });
        });
      }
    });
    
    return data;
  };

  const downloadExcel = () => {
    const data = generateData();
    
    const ws = XLSX.utils.json_to_sheet(data, {
      header: ['Nama Dokumen', 'Jenis Dokumen', 'Divisi', 'Status Depo', 'Uploaded By']
    });
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Upload Mapping');
    
    XLSX.writeFile(wb, 'Monthly_Upload_Dokumen_Mapping.xlsx');
  };

  const data = generateData();

  return (
    <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial' }}>
      <h1>Monthly Upload Dokumen Mapping</h1>
      <p style={{ marginBottom: '30px', color: '#666' }}>
        Total: {data.length} Records
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

export default MonthlyUploadMapping;