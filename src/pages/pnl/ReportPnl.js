import React, { Component } from 'react'
import {
  Input, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Spinner, Table
} from 'reactstrap'
import { AiFillCheckCircle, AiOutlineClose, AiOutlineInbox } from 'react-icons/ai'
import { connect } from 'react-redux'
import moment from 'moment'
import { default as axios } from 'axios'
import NewNavbar from '../../components/NewNavbar'
import styleTrans from '../../assets/css/transaksi.module.css'
import style from '../../assets/css/public.module.css'
import pnl from '../../redux/actions/pnl'

const { REACT_APP_BACKEND_URL } = process.env

class ReportPnL extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sidebarOpen: false,
      // Filter
      selectMonth: moment().month() + 1,
      selectYear: moment().year(),
      search: '',
      // Modal state
      modalGenerate: false,
      modalDelete: false,
      modalConfirm: false,
      confirmType: '',       // 'success' | 'error'
      confirmMsg: '',
      // Selection
      listReport: [],
      // Loading download
      isDownloading: false,
    }
  }

  componentDidMount() {
    this.getDataPnl()
  }

  componentDidUpdate(prevProps) {
    const { isGenerate, isDelete } = this.props.pnl
    if (isGenerate !== prevProps.pnl.isGenerate && isGenerate !== null) {
      this.props.resetPnl()
      if (isGenerate) {
        this.showConfirm('success', 'Berhasil Generate Report PnL')
      } else {
        this.showConfirm('error', this.props.pnl.alertMsg || 'Gagal Generate Report PnL')
      }
      this.getDataPnl()
    }
    if (isDelete !== prevProps.pnl.isDelete && isDelete !== null) {
      this.props.resetPnl()
      if (isDelete) {
        this.showConfirm('success', 'Berhasil Delete Report PnL')
      } else {
        this.showConfirm('error', 'Gagal Delete Report PnL')
      }
      this.getDataPnl()
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

  getDataPnl = async () => {
    const token = localStorage.getItem('token')
    const { search } = this.state
    await this.props.getPnl(token, this.getPeriod(), search)
  }

  showConfirm = (type, msg) => {
    this.setState({ confirmType: type, confirmMsg: msg, modalConfirm: true })
    setTimeout(() => this.setState({ modalConfirm: false }), 3000)
  }

  // ─────────────────────────────────────────────
  // Event handlers
  // ─────────────────────────────────────────────
  handleMonth = (e) => {
    this.setState({ selectMonth: e.target.value }, this.getDataPnl)
  }

  handleYear = (e) => {
    this.setState({ selectYear: e.target.value }, this.getDataPnl)
  }

  onSearch = (e) => {
    this.setState({ search: e.target.value })
    if (e.key === 'Enter') this.getDataPnl()
  }

  prosesSidebar = (val) => this.setState({ sidebarOpen: val })
  goRoute = (val) => this.props.history.push(`/${val}`)

  toggleModalGenerate = () => this.setState({ modalGenerate: !this.state.modalGenerate })
  toggleModalDelete = () => this.setState({ modalDelete: !this.state.modalDelete })

  reportApp = (id) => {
    const { listReport } = this.state
    if (!listReport.includes(id)) this.setState({ listReport: [...listReport, id] })
  }

  reportRej = (id) => {
    this.setState({ listReport: this.state.listReport.filter(x => x !== id) })
  }

  reportToggleAll = () => {
    const { dataPnl } = this.props.pnl
    const { listReport } = this.state
    if (listReport.length === dataPnl.length) {
      this.setState({ listReport: [] })
    } else {
      this.setState({ listReport: dataPnl.map(x => x.id) })
    }
  }

  // ─────────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────────
  prosesGenerate = async () => {
    const token = localStorage.getItem('token')
    const { selectYear, selectMonth } = this.state
    const startOfMonth = moment(`${selectYear}-${selectMonth}-01`, 'YYYY-M-DD').startOf('month')
    const data = {
      period: this.getPeriod(),
      date: startOfMonth.format('YYYY-MM-DD'),
    }
    this.toggleModalGenerate()
    await this.props.generatePnl(token, data)
  }

  prosesDelete = async () => {
    const token = localStorage.getItem('token')
    this.toggleModalDelete()
    await this.props.deletePnl(token, { listId: this.state.listReport })
  }

  downloadFile = async (item) => {
    try {
      this.setState({ isDownloading: true })
      const filePart = item.path.split(/[\\/]/).slice(-2).join('/')
      const url = `${REACT_APP_BACKEND_URL}/exports/${filePart.split('/').pop()}`

      // Gunakan endpoint download by ID agar lebih aman
      const token = localStorage.getItem('token')
      const res = await axios.get(
        `${REACT_APP_BACKEND_URL}/pnl/report/download/${item.id}`,
        { responseType: 'blob', headers: { Authorization: `Bearer ${token}` } }
      )
      const blob = new Blob([res.data])
      const blobUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${item.name}.xlsx`
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
  getStatusLabel = (status) => {
    const map = { 0: 'Processing', 1: 'Success', 2: 'Failed' }
    return map[status] || '-'
  }

  getStatusColor = (status) => {
    const map = { 0: 'warning', 1: 'success', 2: 'danger' }
    return map[status] || 'secondary'
  }

  render() {
    const { dataPnl, isLoading } = this.props.pnl
    const { listReport, selectMonth, selectYear, sidebarOpen } = this.state
    const months = moment.locale('id') && moment.months()
    const currentYear = moment().year()
    const years = []
    for (let y = 2020; y <= currentYear; y++) years.push(y)

    return (
      <>
        <div className={styleTrans.app}>
          <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

          <div className={`${styleTrans.mainContent} ${sidebarOpen ? styleTrans.collapsedContent : ''}`}>
            <h2 className={styleTrans.pageTitle}>Report PnL</h2>

            {/* Filter bar */}
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
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
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

            {/* Action bar */}
            <div className={styleTrans.searchContainer}>
              <div className="rowCenter">
                <Button
                  color="success"
                  size="lg"
                  onClick={this.toggleModalGenerate}
                >
                  Generate PnL
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
            <table className={`${styleTrans.table} ${dataPnl.length > 0 ? styleTrans.tableFull : ''}`}>
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={listReport.length > 0 && listReport.length === dataPnl.length}
                      onChange={this.reportToggleAll}
                    />
                  </th>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Periode</th>
                  <th>Status</th>
                  <th>Di-generate Oleh</th>
                  <th>Tanggal Generate</th>
                  <th>Info</th>
                  <th>Opsi</th>
                </tr>
              </thead>
              <tbody>
                {dataPnl.map((item, index) => (
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
                    <td>
                      {item.period
                        ? moment(item.period, 'YYYYMM').format('MMMM YYYY')
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

            {dataPnl.length === 0 && (
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
                <p>Generate Report PnL untuk periode</p>
                <strong>
                  {moment(`${selectYear}-${selectMonth}-01`, 'YYYY-M-DD').format('MMMM YYYY')}
                </strong>
                <p className="mt-2">Proses ini akan mengambil data dari Redshift. Lanjutkan?</p>
              </div>
              <div className="btnApproveIo">
                <Button color="primary" className="mr-2" onClick={this.prosesGenerate}>Ya</Button>
                <Button color="secondary" onClick={this.toggleModalGenerate}>Batal</Button>
              </div>
            </div>
          </ModalBody>
        </Modal>

        {/* Modal: Konfirmasi Delete */}
        <Modal isOpen={this.state.modalDelete} toggle={this.toggleModalDelete} centered size="md">
          <ModalBody>
            <div className="modalApprove">
              <p>Anda yakin ingin menghapus <strong>{listReport.length}</strong> report PnL?</p>
              <div className="btnApproveIo">
                <Button color="danger" className="mr-2" onClick={this.prosesDelete}>Ya, Hapus</Button>
                <Button color="secondary" onClick={this.toggleModalDelete}>Batal</Button>
              </div>
            </div>
          </ModalBody>
        </Modal>

        {/* Modal: Result confirm */}
        <Modal isOpen={this.state.modalConfirm} centered size="md">
          <ModalBody>
            <div className="cekUpdate">
              {this.state.confirmType === 'success' ? (
                <AiFillCheckCircle size={80} className="green" />
              ) : (
                <AiOutlineClose size={80} className="red" />
              )}
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

const mapStateToProps = state => ({ pnl: state.pnl })

const mapDispatchToProps = {
  getPnl: pnl.getPnl,
  getDetailPnl: pnl.getDetailPnl,
  generatePnl: pnl.generatePnl,
  deletePnl: pnl.deletePnl,
  resetPnl: pnl.resetPnl,
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportPnL)