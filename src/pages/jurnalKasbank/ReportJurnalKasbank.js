import React, { Component } from 'react'
import {
  Input, Button, Modal, ModalBody, Spinner
} from 'reactstrap'
import { AiFillCheckCircle, AiOutlineClose, AiOutlineInbox } from 'react-icons/ai'
import { connect } from 'react-redux'
import moment from 'moment'
import { default as axios } from 'axios'
import NewNavbar from '../../components/NewNavbar'
import styleTrans from '../../assets/css/transaksi.module.css'
import style from '../../assets/css/public.module.css'
import jurnal from '../../redux/actions/jurnal_kasbank'

const { REACT_APP_BACKEND_URL } = process.env

class ReportJurnalKasBank extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sidebarOpen:   false,
      selectMonth:   moment().month() + 1,
      selectYear:    moment().year(),
      search:        '',
      modalGenerate: false,
      modalDelete:   false,
      modalConfirm:  false,
      confirmType:   '',   // 'success' | 'error'
      confirmMsg:    '',
      listReport:    [],
      isDownloading: false,
    }
  }

  componentDidMount() {
    this.getDataJurnal()
  }

  componentDidUpdate(prevProps) {
    const { isGenerate, isDelete, alertMsg } = this.props.jurnal

    if (isGenerate !== prevProps.jurnal.isGenerate && isGenerate !== null) {
      this.props.resetJurnal()
      this.showConfirm(
        isGenerate ? 'success' : 'error',
        isGenerate ? 'Berhasil Generate Report Jurnal KasBank' : (alertMsg || 'Gagal Generate Report')
      )
      this.getDataJurnal()
    }

    if (isDelete !== prevProps.jurnal.isDelete && isDelete !== null) {
      this.props.resetJurnal()
      this.showConfirm(
        isDelete ? 'success' : 'error',
        isDelete ? 'Berhasil Delete Report' : 'Gagal Delete Report'
      )
      this.getDataJurnal()
      this.setState({ listReport: [] })
    }
  }

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────
  getPeriod = () => {
    const { selectYear, selectMonth } = this.state
    return `${selectYear}${String(selectMonth).padStart(2, '0')}`
  }

  getDataJurnal = async () => {
    const token = localStorage.getItem('token')
    await this.props.getJurnal(token, this.getPeriod(), this.state.search)
  }

  showConfirm = (type, msg) => {
    this.setState({ confirmType: type, confirmMsg: msg, modalConfirm: true })
    setTimeout(() => this.setState({ modalConfirm: false }), 3000)
  }

  // ─────────────────────────────────────────────
  // Event handlers
  // ─────────────────────────────────────────────
  handleMonth = (e) => this.setState({ selectMonth: e.target.value }, this.getDataJurnal)
  handleYear  = (e) => this.setState({ selectYear:  e.target.value }, this.getDataJurnal)

  onSearch = (e) => {
    this.setState({ search: e.target.value })
    if (e.key === 'Enter') this.getDataJurnal()
  }

  prosesSidebar = (val) => this.setState({ sidebarOpen: val })
  goRoute       = (val) => this.props.history.push(`/${val}`)

  toggleModalGenerate = () => this.setState({ modalGenerate: !this.state.modalGenerate })
  toggleModalDelete   = () => this.setState({ modalDelete:   !this.state.modalDelete })

  reportToggleAll = () => {
    const { dataJurnal } = this.props.jurnal
    const { listReport } = this.state
    this.setState({
      listReport: listReport.length === dataJurnal.length ? [] : dataJurnal.map(x => x.id)
    })
  }

  reportApp = (id) => {
    if (!this.state.listReport.includes(id)) {
      this.setState({ listReport: [...this.state.listReport, id] })
    }
  }

  reportRej = (id) => {
    this.setState({ listReport: this.state.listReport.filter(x => x !== id) })
  }

  // ─────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────
  prosesGenerate = async () => {
    const token = localStorage.getItem('token')
    const { selectYear, selectMonth } = this.state
    this.toggleModalGenerate()
    await this.props.generateJurnal(token, {
      year:  parseInt(selectYear),
      month: parseInt(selectMonth),
    })
  }

  prosesDelete = async () => {
    const token = localStorage.getItem('token')
    this.toggleModalDelete()
    await this.props.deleteJurnal(token, { listId: this.state.listReport })
  }

  downloadFile = async (item) => {
    try {
      this.setState({ isDownloading: true })
      const token = localStorage.getItem('token')
      const res = await axios.get(
        `${REACT_APP_BACKEND_URL}/jurnal-kasbank/report/download/${item.id}`,
        { responseType: 'blob', headers: { Authorization: `Bearer ${token}` } }
      )
      const blob    = new Blob([res.data])
      const blobUrl = window.URL.createObjectURL(blob)
      const a       = document.createElement('a')
      a.href        = blobUrl
      a.download    = `${item.name}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(blobUrl)
    } catch (err) {
      alert('Download gagal: ' + err.message)
    } finally {
      this.setState({ isDownloading: false })
    }
  }

  // ─────────────────────────────────────────────
  // Render helpers
  // ─────────────────────────────────────────────
  getStatusLabel = (status) => ({ 0: 'Processing', 1: 'Success', 2: 'Failed' }[status] || '-')
  getStatusColor = (status) => ({ 0: 'warning',    1: 'success', 2: 'danger'  }[status] || 'secondary')

  render() {
    const { dataJurnal, isLoading } = this.props.jurnal
    const { listReport, selectMonth, selectYear, sidebarOpen } = this.state

    const months     = moment.locale('id') && moment.months()
    const currentYear = moment().year()
    const years = []
    for (let y = 2020; y <= currentYear; y++) years.push(y)

    const periodLabel = moment(`${selectYear}-${selectMonth}-01`, 'YYYY-M-DD').format('MMMM YYYY')

    return (
      <>
        <div className={styleTrans.app}>
          <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

          <div className={`${styleTrans.mainContent} ${sidebarOpen ? styleTrans.collapsedContent : ''}`}>
            <h2 className={styleTrans.pageTitle}>Report Jurnal KasBank</h2>

            {/* Filter */}
            <div className={styleTrans.searchContainer}>
              <div className="rowCenter">
                <Input type="select" value={selectMonth} onChange={this.handleMonth}>
                  <option value="">Pilih Bulan</option>
                  {months.map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </Input>
                <Input type="select" className="ml-2" value={selectYear} onChange={this.handleYear}>
                  <option value="">Pilih Tahun</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </Input>
              </div>
              <div className={style.searchEmail2}>
                <span>Search: </span>
                <Input
                  className={style.search}
                  value={this.state.search}
                  onChange={this.onSearch}
                  onKeyPress={this.onSearch}
                  placeholder="Cari report..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className={styleTrans.searchContainer}>
              <div className="rowCenter">
                <Button color="success" size="lg" onClick={this.toggleModalGenerate}>
                  Generate Jurnal
                </Button>
                <Button
                  className="ml-2"
                  color="danger"
                  size="lg"
                  disabled={listReport.length === 0}
                  onClick={this.toggleModalDelete}
                >
                  Delete
                </Button>
              </div>
            </div>

            {/* Table */}
            <table className={`${styleTrans.table} ${dataJurnal.length > 0 ? styleTrans.tableFull : ''}`}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={listReport.length > 0 && listReport.length === dataJurnal.length}
                      onChange={this.reportToggleAll}
                    />
                  </th>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Periode</th>
                  <th>Range Tanggal</th>
                  <th>Status</th>
                  <th>Di-generate Oleh</th>
                  <th>Tanggal Generate</th>
                  <th>Info</th>
                  <th>Opsi</th>
                </tr>
              </thead>
              <tbody>
                {dataJurnal.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={listReport.includes(item.id)}
                        onChange={
                          listReport.includes(item.id)
                            ? () => this.reportRej(item.id)
                            : () => this.reportApp(item.id)
                        }
                      />
                    </td>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.period ? moment(item.period, 'YYYYMM').format('MMMM YYYY') : '-'}</td>
                    <td>
                      {item.start_date && item.end_date
                        ? `${moment(item.start_date).format('DD/MM/YYYY')} - ${moment(item.end_date).format('DD/MM/YYYY')}`
                        : '-'}
                    </td>
                    <td>
                      <span className={`badge badge-${this.getStatusColor(item.status)}`}>
                        {this.getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td>{item.user_upload || '-'}</td>
                    <td>{moment(item.createdAt).format('DD/MM/YYYY HH:mm')}</td>
                    <td>{item.info || '-'}</td>
                    <td>
                      {item.status === 1 && (
                        <Button
                          color="warning"
                          size="sm"
                          onClick={() => this.downloadFile(item)}
                          disabled={this.state.isDownloading}
                        >
                          Download
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {dataJurnal.length === 0 && (
              <div className={style.spinCol}>
                <AiOutlineInbox size={50} className="mb-4" />
                <div className="textInfo">Data tidak ditemukan</div>
              </div>
            )}
          </div>
        </div>

        {/* Modal: Konfirmasi Generate */}
        <Modal isOpen={this.state.modalGenerate} toggle={this.toggleModalGenerate} centered size="md">
          <ModalBody>
            <div className="modalApprove">
              <div>
                <p>Generate Report Jurnal KasBank untuk periode</p>
                <strong>{periodLabel}</strong>
                <p className="mt-2">
                  Proses ini akan mengambil data dari Redshift dan API Accounting.
                  Estimasi waktu: 5–15 menit. Lanjutkan?
                </p>
              </div>
              <div className="btnApproveIo">
                <Button color="primary" className="mr-2" onClick={this.prosesGenerate}>Ya, Generate</Button>
                <Button color="secondary" onClick={this.toggleModalGenerate}>Batal</Button>
              </div>
            </div>
          </ModalBody>
        </Modal>

        {/* Modal: Konfirmasi Delete */}
        <Modal isOpen={this.state.modalDelete} toggle={this.toggleModalDelete} centered size="md">
          <ModalBody>
            <div className="modalApprove">
              <p>Anda yakin ingin menghapus <strong>{listReport.length}</strong> report?</p>
              <div className="btnApproveIo">
                <Button color="danger" className="mr-2" onClick={this.prosesDelete}>Ya, Hapus</Button>
                <Button color="secondary" onClick={this.toggleModalDelete}>Batal</Button>
              </div>
            </div>
          </ModalBody>
        </Modal>

        {/* Modal: Result */}
        <Modal isOpen={this.state.modalConfirm} centered size="md">
          <ModalBody>
            <div className="cekUpdate">
              {this.state.confirmType === 'success'
                ? <AiFillCheckCircle size={80} className="green" />
                : <AiOutlineClose size={80} className="red" />}
              <div className={`sucUpdate ${this.state.confirmType === 'success' ? 'green' : 'red'}`}>
                {this.state.confirmMsg}
              </div>
            </div>
          </ModalBody>
        </Modal>

        {/* Modal: Loading */}
        <Modal isOpen={isLoading || this.state.isDownloading} size="sm">
          <ModalBody>
            <div className="cekUpdate">
              <Spinner />
              <div>Waiting....</div>
            </div>
          </ModalBody>
        </Modal>
      </>
    )
  }
}

const mapStateToProps = state => ({ jurnal: state.jurnal })

const mapDispatchToProps = {
  getJurnal:      jurnal.getJurnal,
  generateJurnal: jurnal.generateJurnal,
  deleteJurnal:   jurnal.deleteJurnal,
  resetJurnal:    jurnal.resetJurnal,
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportJurnalKasBank)