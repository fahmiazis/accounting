/* eslint-disable no-async-promise-executor */
import React, { Component } from 'react'
import {
  Input, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Spinner, Table, Progress
} from 'reactstrap'
import { Formik } from 'formik'
import { connect } from 'react-redux'
import { default as axios } from 'axios'
import moment from 'moment'
import {
  FaSearch, FaSortAlphaDown, FaSortAlphaUpAlt
} from 'react-icons/fa'
import {
  AiFillCheckCircle, AiOutlineClose, AiOutlineInbox
} from 'react-icons/ai'
import NewNavbar from '../../components/NewNavbar'
import sales_tax from '../../redux/actions/sales_tax'
import inventory from '../../redux/actions/inventory'
import styleTrans from '../../assets/css/transaksi.module.css'
import style from '../../assets/css/public.module.css'

const { REACT_APP_BACKEND_URL } = process.env

const dataStatus = [
  { status: 1, text: 'File Upload' },
  { status: 2, text: 'Merge Output Report' }
]

class ReportSalesTax extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sidebarOpen:   false,
      search:        '',
      selectMonth:   moment().month() + 1,
      selectYear:    moment().year(),
      typeReport:    1,
      limit:         10,
      sortType:      'asc',
      sortTypePic:   'asc',

      // inventory list (sama persis kayak endstock)
      listInventory: [],   // plant yang di-centang untuk generate/upload
      stateInv:      [],   // inventory yang tampil (bisa difilter)
      baseInv:       [],   // base inventory (untuk reset filter)

      // report list selection
      listReport:    [],

      // modal flags
      modalAdd:      false,
      modalUpdate:   false,
      modalUpload:   false,  // bulk upload
      modalDelete:   false,
      modalGenerate: false,  // konfirmasi merge
      modalConfirm:  false,

      // detail
      detailInv:     {},
      detailData:    {},
      typeModal:     '',  // 'add' | 'update'
      fileUpload:    '',
      errMsg:        '',
      idDelete:      null,
      confirm:       '',

      // merge SSE
      mergeProgress:   [],
      mergePercentage: 0,
      mergeStatus:     '',   // '' | 'running' | 'done' | 'error'
      mergeResult:     null,
      mergeError:      '',
      isLoading:       false
    }
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────
  componentDidMount() {
    this.getDataSalesTax()
    this.getDataInventory()
  }

  componentDidUpdate(prevProps) {
    const { isError } = this.props.sales_tax
    if (isError && !prevProps.sales_tax.isError) {
      this.props.resetSalesTax()
    }
  }

  // ─── Data loaders ──────────────────────────────────────────────────────────
  getDataInventory = async () => {
    const token = localStorage.getItem('token')
    const level = localStorage.getItem('level')
    const name  = localStorage.getItem('name')
    await this.props.getInventory(token, 1000, '', 1)
    const { dataInventory } = this.props.inventory
    if (level === '3') {
      const cek = dataInventory.filter(x => x.pic_kasbank.toString().toLowerCase() === name.toString().toLowerCase())
      this.setState({ stateInv: cek, baseInv: cek })
    } else {
      this.setState({ stateInv: dataInventory, baseInv: dataInventory })
    }
  }

  getDataSalesTax = async (value) => {
    const token = localStorage.getItem('token')
    const { selectMonth, selectYear, typeReport, limit } = this.state
    const startOfMonth = moment(`${selectYear}-${selectMonth}-01`, 'YYYY-M-DD').startOf('month')
    const lim  = value?.limit !== undefined ? value.limit : limit
    await this.props.getSalesTax(token, lim, this.state.search, 1, startOfMonth.format('YYYY-MM-DD'), typeReport)
    this.setState({ limit: value?.limit !== undefined ? value.limit : limit })
  }

  // ─── Search & Sort ─────────────────────────────────────────────────────────
  goRoute      = (val) => this.props.history.push(`/${val}`)
  prosesSidebar = (val) => this.setState({ sidebarOpen: val })

  onSearch = (e) => {
    this.setState({ search: e.target.value })
    if (e.key === 'Enter') this.searchInv()
  }

  searchInv = () => {
    const { search, baseInv } = this.state
    const cekFilter = baseInv.filter(x =>
      (x.plant         || '').toLowerCase().includes(search.toLowerCase()) ||
      (x.area          || '').toLowerCase().includes(search.toLowerCase()) ||
      (x.pic_kasbank   || '').toLowerCase().includes(search.toLowerCase()) ||
      (x.profit_center || '').toLowerCase().includes(search.toLowerCase()) ||
      (x.kode_dist     || '').toLowerCase().includes(search.toLowerCase())
    )
    this.setState({ stateInv: search === '' ? baseInv : cekFilter })
  }

  sortData = (key, order) => {
    const { baseInv } = this.state
    const sorted = [...baseInv].sort((a, b) => {
      const A = String(a[key] ?? '').toUpperCase()
      const B = String(b[key] ?? '').toUpperCase()
      return order === 'asc' ? A.localeCompare(B) : B.localeCompare(A)
    })
    if (key === 'plant') {
      this.setState({ sortType: order })
    } else {
      this.setState({ sortTypePic: order })
    }
    this.setState({ stateInv: sorted })
  }

  handleMonth = (e) => { this.setState({ selectMonth: e.target.value }, () => this.getDataSalesTax()) }
  handleYear  = (e) => { this.setState({ selectYear:  e.target.value }, () => this.getDataSalesTax()) }
  handleType  = (e) => {
    this.setState({ typeReport: e.target.value, listReport: [], listInventory: [] }, () => this.getDataSalesTax())
  }

  // ─── Checkbox inventory (untuk typeReport=1) ───────────────────────────────
  chekApp = (val) => {
    const { listInventory, stateInv } = this.state
    if (val === 'all') {
      this.setState({ listInventory: stateInv.map(x => x.plant) })
    } else {
      this.setState({ listInventory: [...listInventory, val] })
    }
  }

  chekRej = (val) => {
    const { listInventory } = this.state
    if (val === 'all') {
      this.setState({ listInventory: [] })
    } else {
      this.setState({ listInventory: listInventory.filter(p => p !== val) })
    }
  }

  // ─── Checkbox report (untuk typeReport=2) ─────────────────────────────────
  reportApp = (val) => {
    const { dataSalesTax } = this.props.sales_tax
    if (val === 'all') {
      this.setState({ listReport: dataSalesTax.map(x => x.id) })
    } else {
      this.setState(prev => ({ listReport: [...prev.listReport, val] }))
    }
  }

  reportRej = (val) => {
    if (val === 'all') {
      this.setState({ listReport: [] })
    } else {
      this.setState(prev => ({ listReport: prev.listReport.filter(id => id !== val) }))
    }
  }

  // ─── Modal helpers ─────────────────────────────────────────────────────────
  openModalAdd    = () => this.setState(p => ({ modalAdd:      !p.modalAdd }))
  openModalUpdate = () => this.setState(p => ({ modalUpdate:   !p.modalUpdate }))
  openModalUpload = () => this.setState(p => ({ modalUpload:   !p.modalUpload }))
  openModalDelete = () => this.setState(p => ({ modalDelete:   !p.modalDelete }))
  openModalGenerate = () => this.setState(p => ({ modalGenerate: !p.modalGenerate }))
  openConfirm     = () => this.setState(p => ({ modalConfirm:  !p.modalConfirm }))

  // buka upload single per plant (sama kayak endstock prosesOpen)
  prosesOpen = (val, type) => {
    if (type === 'add') {
      this.setState({ detailInv: val, typeModal: type })
    } else {
      this.setState({ detailData: val, typeModal: type })
    }
    this.openModalAdd()
  }

  prosesOpenUpdate = (val) => {
    this.setState({ detailInv: val })
    this.openModalUpdate()
  }

  prosesDeletePartial = (val) => {
    this.setState({ idDelete: val.id })
    this.openModalDelete()
  }

  // ─── File input ────────────────────────────────────────────────────────────
  onChangeHandler = (e) => {
    if (!e.target.files || !e.target.files[0]) return
    const { size, type } = e.target.files[0]
    if (size >= 100000000) {
      this.setState({ errMsg: 'Maximum upload size 100 MB' })
    } else if (
      type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' &&
      type !== 'application/vnd.ms-excel' &&
      type !== 'application/vnd.ms-excel.sheet.binary.macroEnabled.12'
    ) {
      this.setState({ errMsg: 'Invalid file type. Only excel files are allowed.' })
    } else {
      this.setState({ fileUpload: e.target.files[0], errMsg: '' })
    }
  }

  // ─── Upload single ─────────────────────────────────────────────────────────
  uploadSalesTax = async (values) => {
    const token = localStorage.getItem('token')
    const data  = new FormData()
    data.append('master', this.state.fileUpload)
    data.append('name', values.name)
    data.append('plant', values.plant)
    data.append('date_report', values.date_report)
    await this.props.uploadSalesTax(token, data)
    this.setState({ confirm: 'upload', fileUpload: '' })
    this.openConfirm()
    this.getDataSalesTax()
    this.openModalAdd()
  }

  // ─── Bulk upload ───────────────────────────────────────────────────────────
  uploadBulkSalesTax = async (values) => {
    const { listInventory } = this.state
    const token = localStorage.getItem('token')
    const data  = new FormData()
    data.append('master', this.state.fileUpload)
    data.append('name', values.name)
    data.append('plant', listInventory[0])
    data.append('list', listInventory.toString())
    data.append('date_report', values.date_report)
    await this.props.uploadSalesTax(token, data, 'bulk')
    this.setState({ confirm: 'upload', fileUpload: '' })
    this.openConfirm()
    this.getDataSalesTax()
    this.openModalUpload()
  }

  // ─── Update ────────────────────────────────────────────────────────────────
  updateSalesTax = async (values) => {
    const token = localStorage.getItem('token')
    const { detailData, fileUpload } = this.state
    if (!fileUpload) {
      const data = { id: detailData.id, name: values.name, plant: values.plant, date_report: values.date_report }
      await this.props.updateSalesTax(token, 'update', data)
    } else {
      const data = new FormData()
      data.append('id', detailData.id)
      data.append('name', values.name)
      data.append('plant', values.plant)
      data.append('date_report', values.date_report)
      data.append('master', fileUpload)
      await this.props.updateSalesTax(token, 'upload', data)
    }
    this.setState({ confirm: 'update', fileUpload: '' })
    this.openConfirm()
    this.getDataSalesTax()
    this.openModalAdd()
    this.openModalUpdate()
  }

  // ─── Delete bulk ───────────────────────────────────────────────────────────
  prosesDelete = async () => {
    const token = localStorage.getItem('token')
    const { listReport } = this.state
    await this.props.deleteSalesTax(token, { listId: listReport })
    this.getDataSalesTax()
    this.openModalDelete()
    this.setState({ confirm: 'delete' })
    this.openConfirm()
  }

  // ─── Delete partial (dari modal update) ────────────────────────────────────
  deletePartial = async () => {
    const token = localStorage.getItem('token')
    const { idDelete } = this.state
    await this.props.deleteSalesTax(token, { listId: [idDelete] })
    this.getDataSalesTax()
    this.openModalDelete()
    this.openModalUpdate()
    this.setState({ confirm: 'delete' })
    this.openConfirm()
  }

  // ─── prosesReport (tombol Generate) — cek dulu status, baru merge ──────────
  prosesReport = () => {
    const { listInventory, typeReport, listReport } = this.state
    const { dataSalesTax } = this.props.sales_tax
    if (parseInt(typeReport) === 1) {
      // Cek semua plant yang dipilih sudah upload file
      const cek = listInventory.filter(plant => this.getStatus(plant) === 'Sudah Upload')
      if (cek.length === listInventory.length) {
        this.prosesMerge()
      } else {
        this.setState({ confirm: 'failGenerate' })
        this.openConfirm()
      }
    } else if (parseInt(typeReport) === 2) {
      if (listReport.length > 1) {
        this.prosesMergeSelected()
      } else {
        this.setState({ confirm: 'failMerge' })
        this.openConfirm()
      }
    } else {
      this.setState({ confirm: 'failReport' })
      this.openConfirm()
    }
  }

  // ─── Merge semua file bulan ini (dari typeReport=1) ────────────────────────
  prosesMerge = () => {
    this.setState({ mergeProgress: [], mergePercentage: 0, mergeStatus: 'running', mergeResult: null, mergeError: '' })
    this.openModalGenerate()
    this._runMergeSSE()
  }

  // ─── Merge dari selected report (typeReport=2) — placeholder ───────────────
  prosesMergeSelected = () => {
    this.setState({ mergeProgress: [], mergePercentage: 0, mergeStatus: 'running', mergeResult: null, mergeError: '' })
    this.openModalGenerate()
    this._runMergeSSE()
  }

  _runMergeSSE = () => {
    const token = localStorage.getItem('token')
    const { selectMonth, selectYear } = this.state
    const startOfMonth = moment(`${selectYear}-${selectMonth}-01`, 'YYYY-M-DD').startOf('month')

    fetch(`${REACT_APP_BACKEND_URL}/sales-tax/report/merge`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization:  'Bearer ' + token
      },
      body: JSON.stringify({ date: startOfMonth.format('YYYY-MM-DD') })
    }).then(response => {
      const reader  = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      const read = () => {
        reader.read().then(({ done, value }) => {
          if (done) return

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop()

          for (const line of lines) {
            if (!line.startsWith('data:')) continue
            try {
              const parsed = JSON.parse(line.replace('data:', '').trim())
              if (parsed.type === 'progress') {
                this.setState(prev => ({
                  mergeProgress:   [...prev.mergeProgress, parsed.message],
                  mergePercentage: parsed.percentage || prev.mergePercentage
                }))
              } else if (parsed.type === 'complete') {
                this.setState({ mergeStatus: 'done', mergeResult: parsed.data })
                this.getDataSalesTax()
              } else if (parsed.type === 'error') {
                this.setState({ mergeStatus: 'error', mergeError: parsed.message })
              }
            } catch (_) {}
          }
          read()
        }).catch(err => {
          this.setState({ mergeStatus: 'error', mergeError: err.message })
        })
      }
      read()
    }).catch(err => {
      this.setState({ mergeStatus: 'error', mergeError: err.message })
    })
  }

  // ─── Status helper ─────────────────────────────────────────────────────────
  getStatus = (plant) => {
    const { dataSalesTax } = this.props.sales_tax
    const files = dataSalesTax.filter(x => x.plant === plant)
    if (files.length === 0) return 'Belum Upload'
    return 'Sudah Upload'
  }

  // ─── Download ──────────────────────────────────────────────────────────────
  downloadFile = async (val) => {
    try {
      this.setState({ isLoading: true })
      const pathParts = val.path.replace(/\\/g, '/').split('/')
      const fileName  = pathParts[pathParts.length - 1]
      const folder    = val.status === 1 ? 'masters' : 'exports'
      const url       = `${REACT_APP_BACKEND_URL}/${folder}/${fileName}`
      const res = await axios.get(url, { responseType: 'blob' })
      const disposition = res.headers['content-disposition']
      let filename = `${val.name}.xlsx`
      if (disposition && disposition.includes('filename=')) {
        filename = disposition.split('filename=')[1].replace(/['"]/g, '').trim()
      }
      const blob    = new Blob([res.data])
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(blobUrl)
      this.setState({ isLoading: false })
    } catch (err) {
      console.error(err)
      alert('Download gagal: ' + err.message)
      this.setState({ isLoading: false })
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  render () {
    const {
      sidebarOpen, search, selectMonth, selectYear, typeReport,
      listInventory, stateInv, detailInv, detailData, typeModal,
      listReport, fileUpload, errMsg, confirm,
      mergeProgress, mergePercentage, mergeStatus, mergeResult, mergeError,
      sortType, sortTypePic, isLoading: localLoading
    } = this.state

    const { dataSalesTax, isLoading } = this.props.sales_tax

    const months      = moment.locale('id') && moment.months()
    const currentYear = moment().year()
    const years       = []
    for (let y = 2000; y <= currentYear; y++) years.push(y)

    const startOfMonth = moment(`${currentYear}-${selectMonth}-01`, 'YYYY-M-DD').startOf('month')

    return (
      <>
        <div className={styleTrans.app}>
          <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

          <div className={`${styleTrans.mainContent} ${sidebarOpen ? styleTrans.collapsedContent : ''}`}>
            <h2 className={styleTrans.pageTitle}>Report Sales Tax Detail</h2>

            {/* ── Filter bar ── */}
            <div className={styleTrans.searchContainer}>
              <div className='rowCenter'>
                <Input type='select' name='month' value={selectMonth} onChange={this.handleMonth}>
                  <option value=''>Pilih Bulan</option>
                  {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </Input>
                <Input type='select' className='ml-2' name='year' value={selectYear} onChange={this.handleYear}>
                  <option value=''>Pilih Tahun</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </Input>
              </div>
              <div>
                <Input type='select' name='type' value={typeReport} onChange={this.handleType}>
                  <option value=''>Pilih Tipe Report</option>
                  {dataStatus.map((s, i) => <option key={i} value={s.status}>{s.text}</option>)}
                </Input>
              </div>
            </div>

            {/* ── Action bar ── */}
            <div className={styleTrans.searchContainer}>
              <div className='rowCenter'>
                <Button
                  className='ml-1'
                  disabled={(listInventory.length === 0 && listReport.length === 0)}
                  onClick={this.openModalGenerate}
                  color='success'
                  size='lg'
                >
                  Generate
                </Button>
                {parseInt(typeReport) === 1 && (
                  <Button className='ml-1' onClick={this.openModalUpload} color='warning' size='lg'>
                    Bulk Upload
                  </Button>
                )}
                {parseInt(typeReport) !== 1 && (
                  <Button
                    className='ml-1'
                    disabled={listReport.length === 0}
                    onClick={this.openModalDelete}
                    color='danger'
                    size='lg'
                  >
                    Delete
                  </Button>
                )}
              </div>
              <div className={style.searchEmail2}>
                <text>Search: </text>
                <Input
                  className={style.search}
                  onChange={this.onSearch}
                  value={search}
                  onKeyPress={this.onSearch}
                >
                  <FaSearch size={20} />
                </Input>
              </div>
            </div>

            {/* ══ typeReport === 1 : tabel inventory ══ */}
            {parseInt(typeReport) === 1 ? (
              <>
                <table className={`${styleTrans.table} ${stateInv.length > 0 ? styleTrans.tableFull : ''}`}>
                  <thead>
                    <tr>
                      <th>
                        <input
                          className='mr-2'
                          type='checkbox'
                          checked={listInventory.length > 0 && listInventory.length === stateInv.length}
                          onChange={() => listInventory.length === stateInv.length ? this.chekRej('all') : this.chekApp('all')}
                        />
                      </th>
                      <th>No</th>
                      <th>
                        {sortType === 'desc'
                          ? <FaSortAlphaDown    onClick={() => this.sortData('plant', 'asc')}  className='mr-1' size={20} />
                          : <FaSortAlphaUpAlt   onClick={() => this.sortData('plant', 'desc')} className='mr-1' size={20} />}
                        PLANT
                      </th>
                      <th>
                        {sortTypePic === 'desc'
                          ? <FaSortAlphaDown    onClick={() => this.sortData('pic_kasbank', 'asc')}  className='mr-1' size={20} />
                          : <FaSortAlphaUpAlt   onClick={() => this.sortData('pic_kasbank', 'desc')} className='mr-1' size={20} />}
                        PIC
                      </th>
                      <th>FILE KK SALES</th>
                      <th>PERIODE REPORT</th>
                      <th>STATUS</th>
                      <th>Opsi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stateInv.length > 0 && stateInv.map((item, index) => (
                      <tr key={item.plant}>
                        <td>
                          <input
                            type='checkbox'
                            checked={listInventory.includes(item.plant)}
                            onChange={listInventory.includes(item.plant) ? () => this.chekRej(item.plant) : () => this.chekApp(item.plant)}
                          />
                        </td>
                        <td className={styleTrans.colNo}>{index + 1}</td>
                        <td className={styleTrans.colPlant}>{item.plant}</td>
                        <td>{item.pic_kasbank}</td>
                        <td className={styleTrans.colFile}>
                          {dataSalesTax.length === 0
                            ? '-'
                            : dataSalesTax.find(x => x.plant === item.plant) === undefined
                              ? '-'
                              : `V - ${moment(dataSalesTax.find(x => x.plant === item.plant).createdAt).format('DD/MM/YYYY')} - upload by ${dataSalesTax.find(x => x.plant === item.plant).user_upload}`}
                        </td>
                        <td>{startOfMonth.format('MMMM YYYY')}</td>
                        <td>{this.getStatus(item.plant)}</td>
                        <td className={styleTrans.colOpsi}>
                          <Button onClick={() => this.prosesOpen(item, 'add')} color='success' className='ml-1 mt-1'>Upload</Button>
                          {this.getStatus(item.plant) !== 'Belum Upload' && (
                            <Button onClick={() => this.prosesOpenUpdate(item)} color='primary' className='mt-1 ml-1'>Update</Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {stateInv.length === 0 && (
                  <div className={style.spinCol}>
                    <AiOutlineInbox size={50} className='mb-4' />
                    <div className='textInfo'>Data tidak ditemukan</div>
                  </div>
                )}
              </>
            ) : (
              /* ══ typeReport !== 1 : tabel report ══ */
              <>
                <table className={`${styleTrans.table} ${dataSalesTax.length > 0 ? styleTrans.tableFull : ''}`}>
                  <thead>
                    <tr>
                      <th>
                        <input
                          className='mr-2'
                          type='checkbox'
                          checked={listReport.length > 0 && listReport.length === dataSalesTax.length}
                          onChange={() => listReport.length === dataSalesTax.length ? this.reportRej('all') : this.reportApp('all')}
                        />
                      </th>
                      <th>No</th>
                      {parseInt(typeReport) === 2 && (
                        <>
                          <th>
                            {sortType === 'desc'
                              ? <FaSortAlphaDown    onClick={() => this.sortData('plant', 'asc')}  className='mr-1' size={20} />
                              : <FaSortAlphaUpAlt   onClick={() => this.sortData('plant', 'desc')} className='mr-1' size={20} />}
                            PLANT
                          </th>
                          <th>
                            {sortTypePic === 'desc'
                              ? <FaSortAlphaDown    onClick={() => this.sortData('pic_kasbank', 'asc')}  className='mr-1' size={20} />
                              : <FaSortAlphaUpAlt   onClick={() => this.sortData('pic_kasbank', 'desc')} className='mr-1' size={20} />}
                            PIC
                          </th>
                        </>
                      )}
                      <th>NAMA</th>
                      <th>TYPE</th>
                      <th>PERIODE REPORT</th>
                      <th>STATUS</th>
                      <th>Opsi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataSalesTax.length > 0 && dataSalesTax.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type='checkbox'
                            checked={listReport.includes(item.id)}
                            onChange={listReport.includes(item.id) ? () => this.reportRej(item.id) : () => this.reportApp(item.id)}
                          />
                        </td>
                        <td className={styleTrans.colNo}>{index + 1}</td>
                        {parseInt(typeReport) === 2 && (
                          <>
                            <td className={styleTrans.colPlant}>{item.plant}</td>
                            <td>{stateInv.find(y => y.plant === item.plant)?.pic_kasbank || '-'}</td>
                          </>
                        )}
                        <td>{item.name}</td>
                        <td>{dataStatus.find(s => s.status === item.status)?.text || '-'}</td>
                        <td>{startOfMonth.format('MMMM YYYY')}</td>
                        <td>
                          {parseInt(typeReport) === 2 ? 'Merged Report' : item.info}
                        </td>
                        <td>
                          <Button color='warning' onClick={() => this.downloadFile(item)}>Download</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {dataSalesTax.length === 0 && (
                  <div className={style.spinCol}>
                    <AiOutlineInbox size={50} className='mb-4' />
                    <div className='textInfo'>Data tidak ditemukan</div>
                  </div>
                )}
              </>
            )}

            {/* ── Pagination ── */}
            <div>
              <div className={style.infoPageEmail1}>
                <text>Showing 1 of 1 pages</text>
                <div className={style.pageButton}>
                  <button className={style.btnPrev} color='info' disabled>Prev</button>
                  <button className={style.btnPrev} color='info' disabled>Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════ Modal Upload Single ════ */}
        <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd} size='lg'>
          <ModalHeader toggle={this.openModalAdd}>
            {typeModal === 'add' ? 'Upload' : 'Update'} File KK Sales
          </ModalHeader>
          <Formik
            initialValues={{
              plant:       detailInv.plant || '',
              name:        typeModal === 'add' ? '' : detailData.name || '',
              date_report: typeModal === 'add' ? '' : moment(detailData.date_report).format('YYYY-MM-DD')
            }}
            onSubmit={(values) => typeModal === 'add' ? this.uploadSalesTax(values) : this.updateSalesTax(values)}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <ModalBody>
                <div className='addModalDepo'>
                  <text className='col-md-3'>Plant</text>
                  <div className='col-md-9'>
                    <Input type='text' name='plant' disabled value={values.plant}
                      onBlur={handleBlur('plant')} onChange={handleChange('plant')} />
                  </div>
                </div>
                <div className='addModalDepo'>
                  <text className='col-md-3'>Nama File</text>
                  <div className='col-md-9'>
                    <Input type='text' name='name' value={values.name}
                      onBlur={handleBlur('name')} onChange={handleChange('name')} />
                    {values.name === '' && <text className='txtError'>{errors.name}</text>}
                  </div>
                </div>
                <div className='addModalDepo'>
                  <text className='col-md-3'>Periode Report</text>
                  <div className='col-md-9'>
                    <Input type='date' name='date_report' value={values.date_report}
                      onBlur={handleBlur('date_report')} onChange={handleChange('date_report')} />
                  </div>
                </div>
                <div className='addModalDepo'>
                  <text className='col-md-3'>Upload</text>
                  <div className='col-md-9'>
                    {typeModal !== 'add' && <text>{values.name}</text>}
                    <Input type='file' name='file' accept='.xls,.xlsx,.xlsb' onChange={this.onChangeHandler} />
                    {errMsg && <text className='txtError'>{errMsg}</text>}
                    {fileUpload === '' && typeModal === 'add' && <text className='txtError'>{errors.type}</text>}
                  </div>
                </div>
                <hr />
                <div className='foot'>
                  <div />
                  <div>
                    <Button
                      disabled={values.name === '' || values.date_report === '' || (fileUpload === '' && typeModal === 'add')}
                      className='mr-2'
                      onClick={handleSubmit}
                      color='primary'
                    >Save</Button>
                    <Button className='mr-3' onClick={this.openModalAdd}>Cancel</Button>
                  </div>
                </div>
              </ModalBody>
            )}
          </Formik>
        </Modal>

        {/* ════ Modal Update — list file per plant ════ */}
        <Modal toggle={this.openModalUpdate} isOpen={this.state.modalUpdate} size='lg'>
          <ModalHeader>Update File Upload — Plant {detailInv.plant}</ModalHeader>
          <ModalBody>
            <Table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama File</th>
                  <th>Tgl Upload</th>
                  <th>Opsi</th>
                </tr>
              </thead>
              <tbody>
                {dataSalesTax.filter(x => x.plant === detailInv.plant).map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{moment(item.createdAt).format('DD MMMM YYYY HH:mm')}</td>
                    <td>
                      <Button className='ml-1 mt-1' onClick={() => this.prosesOpen(item, 'update')} color='success'>Update</Button>
                      <Button className='ml-1 mt-1' onClick={() => this.downloadFile(item)} color='primary'>Download</Button>
                      <Button className='ml-1 mt-1' onClick={() => this.prosesDeletePartial(item)} color='danger'>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Button color='danger' onClick={this.openModalUpdate}>Close</Button>
          </ModalFooter>
        </Modal>

        {/* ════ Modal Bulk Upload ════ */}
        <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} size='xl'>
          <ModalHeader toggle={this.openModalUpload}>Bulk Upload File KK Sales</ModalHeader>
          <Formik
            initialValues={{ name: '', date_report: '' }}
            onSubmit={(values) => this.uploadBulkSalesTax(values)}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
              <ModalBody>
                <div className='addModalDepo'>
                  <text className='col-md-3'>Nama File</text>
                  <div className='col-md-9'>
                    <Input type='text' name='name' value={values.name}
                      onBlur={handleBlur('name')} onChange={handleChange('name')} />
                    {values.name === '' && <text className='txtError'>{errors.name}</text>}
                  </div>
                </div>
                <div className='addModalDepo'>
                  <text className='col-md-3'>Periode Report</text>
                  <div className='col-md-9'>
                    <Input type='date' name='date_report' value={values.date_report}
                      onBlur={handleBlur('date_report')} onChange={handleChange('date_report')} />
                    {values.date_report === '' && <text className='txtError'>{errors.date_report}</text>}
                  </div>
                </div>
                <div className='addModalDepo'>
                  <text className='col-md-3'>Upload</text>
                  <div className='col-md-9'>
                    <Input type='file' name='file' accept='.xls,.xlsx,.xlsb' onChange={this.onChangeHandler} />
                    {fileUpload === '' && <text className='txtError'>{errors.type}</text>}
                  </div>
                </div>
                <div className='addModalDepo'>
                  <text className='col-md-3'>Plant</text>
                </div>
                <div className='addModalDepo'>
                  <Table bordered responsive hover className='tab'>
                    <thead>
                      <tr>
                        <th>
                          <input
                            className='mr-2'
                            type='checkbox'
                            checked={listInventory.length > 0 && listInventory.length === stateInv.length}
                            onChange={() => listInventory.length === stateInv.length ? this.chekRej('all') : this.chekApp('all')}
                          />
                        </th>
                        <th>No</th>
                        <th>
                          {sortType === 'desc'
                            ? <FaSortAlphaDown    onClick={() => this.sortData('plant', 'asc')}  className='mr-1' size={20} />
                            : <FaSortAlphaUpAlt   onClick={() => this.sortData('plant', 'desc')} className='mr-1' size={20} />}
                          PLANT
                        </th>
                        <th>
                          {sortTypePic === 'desc'
                            ? <FaSortAlphaDown    onClick={() => this.sortData('pic_kasbank', 'asc')}  className='mr-1' size={20} />
                            : <FaSortAlphaUpAlt   onClick={() => this.sortData('pic_kasbank', 'desc')} className='mr-1' size={20} />}
                          PIC
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stateInv.length > 0 && stateInv.map((item, index) => (
                        <tr key={item.plant}>
                          <td>
                            <input
                              type='checkbox'
                              checked={listInventory.includes(item.plant)}
                              onChange={listInventory.includes(item.plant) ? () => this.chekRej(item.plant) : () => this.chekApp(item.plant)}
                            />
                          </td>
                          <td>{index + 1}</td>
                          <td>{item.plant}</td>
                          <td>{item.pic_kasbank}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <hr />
                <div className='foot'>
                  <div />
                  <div>
                    <Button
                      disabled={values.name === '' || values.date_report === '' || fileUpload === '' || listInventory.length === 0}
                      className='mr-2'
                      onClick={handleSubmit}
                      color='primary'
                    >Save</Button>
                    <Button className='mr-3' onClick={this.openModalUpload}>Cancel</Button>
                  </div>
                </div>
              </ModalBody>
            )}
          </Formik>
        </Modal>

        {/* ════ Modal Konfirmasi Generate/Merge ════ */}
        <Modal isOpen={this.state.modalGenerate} size='md' toggle={mergeStatus === '' ? this.openModalGenerate : undefined} centered>
          {mergeStatus === '' && (
            <ModalBody>
              <div className='modalApprove'>
                <div><text>Anda yakin untuk proses merge Sales Tax Detail?</text></div>
                <div className='btnApproveIo'>
                  <Button color='primary' className='mr-2' onClick={this.prosesReport}>Ya</Button>
                  <Button color='secondary' onClick={this.openModalGenerate}>Tidak</Button>
                </div>
              </div>
            </ModalBody>
          )}
          {mergeStatus === 'running' && (
            <ModalBody>
              <div className='d-flex align-items-center mb-2'>
                <Spinner size='sm' className='mr-2' />
                <strong>Sedang memproses...</strong>
              </div>
              <Progress value={mergePercentage} className='mb-3' style={{ height: '10px' }} />
              <div style={{ maxHeight: '250px', overflowY: 'auto', background: '#f8f9fa', borderRadius: '4px', padding: '10px', fontSize: '12px', fontFamily: 'monospace' }}>
                {mergeProgress.map((msg, i) => (
                  <div key={i} className='text-muted'>{msg}</div>
                ))}
              </div>
            </ModalBody>
          )}
          {mergeStatus === 'done' && mergeResult && (
            <ModalBody>
              <div className='cekUpdate'>
                <AiFillCheckCircle size={80} className='green' />
                <div className='sucUpdate green'>Berhasil Merge Report Sales Tax Detail</div>
                <table className='table table-sm mt-3 text-left'>
                  <tbody>
                    <tr><td><strong>File Berhasil</strong></td><td>{mergeResult.total_files_merged}</td></tr>
                    <tr><td><strong>File Skip</strong></td><td>{mergeResult.total_files_skipped}</td></tr>
                    <tr><td><strong>Total Baris</strong></td><td>{mergeResult.total_data_rows?.toLocaleString()}</td></tr>
                    <tr><td><strong>Ukuran File</strong></td><td>{mergeResult.file_size ? (mergeResult.file_size / 1024 / 1024).toFixed(2) + ' MB' : '-'}</td></tr>
                  </tbody>
                </table>
              </div>
              <div className='foot mt-2'>
                <div />
                <Button color='success' onClick={() => { this.getDataSalesTax(); this.openModalGenerate() }}>Selesai</Button>
              </div>
            </ModalBody>
          )}
          {mergeStatus === 'error' && (
            <ModalBody>
              <div className='cekUpdate'>
                <AiOutlineClose size={80} className='red' />
                <div className='sucUpdate red'>Merge Gagal</div>
                <div className='sucUpdate red'>{mergeError}</div>
              </div>
              <div className='foot mt-2'>
                <div />
                <div>
                  <Button color='warning' className='mr-2' onClick={this._runMergeSSE}>Coba Lagi</Button>
                  <Button color='secondary' onClick={this.openModalGenerate}>Tutup</Button>
                </div>
              </div>
            </ModalBody>
          )}
        </Modal>

        {/* ════ Modal Delete ════ */}
        <Modal isOpen={this.state.modalDelete} size='md' toggle={this.openModalDelete} centered>
          <ModalBody>
            <div className='modalApprove'>
              <div><text>Anda yakin untuk delete data?</text></div>
              <div className='btnApproveIo'>
                <Button color='primary' className='mr-2'
                  onClick={this.state.modalUpdate ? this.deletePartial : this.prosesDelete}>
                  Ya
                </Button>
                <Button color='secondary' onClick={this.openModalDelete}>Tidak</Button>
              </div>
            </div>
          </ModalBody>
        </Modal>

        {/* ════ Modal Confirm ════ */}
        <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size='md'>
          <ModalBody>
            {confirm === 'upload' && (
              <div className='cekUpdate'>
                <AiFillCheckCircle size={80} className='green' />
                <div className='sucUpdate green'>Berhasil Upload File</div>
              </div>
            )}
            {confirm === 'update' && (
              <div className='cekUpdate'>
                <AiFillCheckCircle size={80} className='green' />
                <div className='sucUpdate green'>Berhasil Update File</div>
              </div>
            )}
            {confirm === 'delete' && (
              <div className='cekUpdate'>
                <AiFillCheckCircle size={80} className='green' />
                <div className='sucUpdate green'>Berhasil Delete Data</div>
              </div>
            )}
            {confirm === 'failGenerate' && (
              <div className='cekUpdate'>
                <AiOutlineClose size={80} className='red' />
                <div className='sucUpdate red'>Gagal Merge Report</div>
                <div className='sucUpdate red'>Pastikan plant yang dipilih sudah upload file</div>
              </div>
            )}
            {confirm === 'failMerge' && (
              <div className='cekUpdate'>
                <AiOutlineClose size={80} className='red' />
                <div className='sucUpdate red'>Gagal Merge Report</div>
                <div className='sucUpdate red'>Pastikan telah memilih lebih dari 1 report</div>
              </div>
            )}
            {confirm === 'failReport' && (
              <div className='cekUpdate'>
                <AiOutlineClose size={80} className='red' />
                <div className='sucUpdate red'>Gagal Proses Report</div>
                <div className='sucUpdate red'>Pastikan memilih file dengan benar</div>
              </div>
            )}
          </ModalBody>
        </Modal>

        {/* ════ Loading ════ */}
        <Modal isOpen={isLoading || localLoading} size='sm'>
          <ModalBody>
            <div className='cekUpdate'>
              <Spinner />
              <div>Waiting....</div>
            </div>
          </ModalBody>
        </Modal>
      </>
    )
  }
}

const mapStateToProps = state => ({
  sales_tax:  state.sales_tax,
  inventory: state.inventory
})

const mapDispatchToProps = {
  getSalesTax:    sales_tax.getSalesTax,
  uploadSalesTax: sales_tax.uploadSalesTax,
  updateSalesTax: sales_tax.updateSalesTax,
  deleteSalesTax: sales_tax.deleteSalesTax,
  resetSalesTax:  sales_tax.resetSalesTax,
  getInventory:   inventory.getInventory
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportSalesTax)