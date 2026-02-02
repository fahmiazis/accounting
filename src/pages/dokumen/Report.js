import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Input, Button, ButtonDropdown,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Spinner } from 'reactstrap'
import logo from "../../assets/img/logo.png"
import '../../assets/css/style.css'
import auth from '../../redux/actions/auth'
import {connect} from 'react-redux'
import dashboard from '../../redux/actions/dashboard'
import {BsBell} from 'react-icons/bs'
import depo from '../../redux/actions/depo'
import downloadFile from 'js-file-download'
import {default as axios} from 'axios'
import Select from 'react-select'
import { FcDocument } from 'react-icons/fc'
import moment from 'moment'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import {BsFillCircleFill} from 'react-icons/bs'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import * as XLSX from "xlsx";
import NewNavbar from '../../components/NewNavbar'
import styleTrans from '../../assets/css/transaksi.module.css'
import style from '../../assets/css/public.module.css'

class Report extends Component {

    constructor(props) {
        super(props);
        this.state = {
            docked: false,
            open: false,
            transitions: true,
            touch: true,
            shadow: true,
            pullRight: false,
            touchHandleWidth: 20,
            dragToggleDistance: 30,
            month: [],
            moon: 0,
            isOpen: false,
            dropOpen: false,
            dropOpenNum: false,
            value: '',
            onChange: new Date(),
            sidebarOpen: false,
            modalAdd: false,
            settingOpen: false,
            modalEdit: false,
            modalUpload: false,
            modalDownload: false,
            type: "daily",
            openType: false,
            depo: [],
            kode: '',
            pic: '',
            from: '',
            to: '',
            options: [],
            alert: false
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    prosesSidebar = (val) => {
        this.setState({sidebarOpen: val})
    }
    
    goRoute = (val) => {
        this.props.history.push(`/${val}`)
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    showAlert = () => {
        this.setState({alert: true})
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    dropSetting = () => {
        this.setState({settingOpen: !this.state.settingOpen})
    }

    dropDown = () => {
        this.setState({dropOpen: !this.state.dropOpen})
    }
    dropOpen = () => {
        this.setState({dropOpenNum: !this.state.dropOpenNum})
    }

    chooseFrom = (e) => {
        if (this.state.type === 'monthly') {
            this.setState({from: e.target.value, to: e.target.value})
            console.log(e)
        } else {
            this.setState({from: e.target.value})   
        }
    }

    chooseTo = (e) => {
        this.setState({to: e.target.value})
    }
    
    chooseDepo = (e) => {
        this.setState({kode: e.value})
    }

    choosePic = (e) => {
        this.setState({pic: e.value})
    }

    openTypeFunc = () => {
        this.setState({openType: !this.state.openType})
    }

    componentDidMount() {
        const moon = []
        for (let i = 0; i < 3; i++) {
            const temp = moment().subtract(i, 'month')
            moon.push(temp)
        }
        this.setState({ month: [moment().add(1, 'month'), ...moon], moon: moon[0] })
        this.getDataDepo()
        this.getNotif()
         
    }

    createReportOld = async () => {
        const {kode, pic, from, to} = this.state
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        const depo = localStorage.getItem('kode')
        const names = localStorage.getItem('name')
        let data = {}
        if (level === '1' || level === '2') {
            if (kode === '') {
                if (level === '2' && pic === 'all') {
                    data = {
                        spv: names,
                        pic: '',
                        kode_plant: ''
                    }
                    console.log(data)
                    await this.props.report(token, from, to, data, this.state.type)
                } else {
                    data = {
                        pic: pic,
                        kode_plant: ''
                    }
                    await this.props.report(token, from, to, data, this.state.type)
                }
            } else if (pic === '') {
                if (level === '2' && kode === 'all') {
                    data = {
                        spv: names,
                        pic: '',
                        kode_plant: ''
                    }
                    await this.props.report(token, from, to, data, this.state.type)
                } else {
                    data = {
                        pic: '',
                        kode_plant: kode
                    }
                    await this.props.report(token, from, to, data, this.state.type)
                }
            } 
        } else if (level === '4' || level === '5') {
            data = {
                pic: '',
                kode_plant: depo
            }
            await this.props.report(token, from, to, data, this.state.type)
        } else if (level === '3') {
            if (kode === 'all') {
                data = {
                    pic: names,
                    kode_plant: ''
                }
                await this.props.report(token, from, to, data, this.state.type)
            } else {
                data = {
                    pic: '',
                    kode_plant: kode
                }
                await this.props.report(token, from, to, data, this.state.type)
            }
        }
    }

    createReport = async () => {
        const { kode, pic, from, to, type } = this.state
        const level = localStorage.getItem("level")
        const token = localStorage.getItem("token")
        const depo = localStorage.getItem("kode")
        const names = localStorage.getItem("name")
        
        let data = {}
        
        // 🔑 Logic per level
        if (level === '1' || level === '2') {
            if (kode === '') {
            if (level === '2' && pic === 'all') {
                data = { spv: names, pic: '', kode_plant: '' }
            } else {
                data = { pic: pic, kode_plant: '' }
            }
            } else if (pic === '') {
            if (level === '2' && kode === 'all') {
                data = { spv: names, pic: '', kode_plant: '' }
            } else {
                data = { pic: '', kode_plant: kode }
            }
            }
        } else if (level === '4' || level === '5') {
            data = { pic: '', kode_plant: depo }
        } else if (level === '3') {
            if (kode === 'all') {
            data = { pic: names, kode_plant: '' }
            } else {
            data = { pic: '', kode_plant: kode }
            }
        }
        
        try {
            // 🔎 Panggil API (props.report harus return axios/fetch response)
            await this.props.report(token, from, to, data, type)
            const {dataReport} = this.props.dashboard
            if (dataReport.length > 1) {
            const body = dataReport
        
            // ✨ Buat workbook & sheet
            const wb = XLSX.utils.book_new()
            const ws = XLSX.utils.aoa_to_sheet(body)
            XLSX.utils.book_append_sheet(wb, ws, "Report")
        
            // 📥 Simpan file ke user
            const colWidths = body[0].map((_, colIndex) => {
                const maxLength = Math.max(
                    ...body.map(row => row[colIndex] ? row[colIndex].toString().length : 0)
                )
                return { wch: Math.min(maxLength + 2, 25) }
            })

            ws['!cols'] = colWidths

            XLSX.writeFile(wb, `Report_${Date.now()}.xlsx`)
        
            } else {
            alert("Tidak ada data untuk periode/parameter yang dipilih")
            }
        } catch (err) {
            console.error("Error create report:", err)
            alert("Gagal membuat report, coba lagi.")
        }
    }

    componentDidUpdate(){
        const level = localStorage.getItem('level')
        const { isGet } = this.props.depo
        const { isReport, isDownload, isError } = this.props.dashboard
        if (level === "1" && isGet) {
          this.preparePic()
          this.prepareSelect()
          this.props.resetError()
        } else if (level === "2" && isGet) {
            this.preparePic()
            this.prepareSelect()
            this.props.resetError()
        } else if (level === "3" && isGet) {
            this.preparePic()
            this.prepareSelect()
            this.props.resetError()
        } else if (isReport) {
            this.downloadResultReport()
            this.props.resetErrorReport()
        } else if (isDownload) {
            this.download()
            this.props.resetErrorReport()
        } else if (isError) {
            this.props.resetError()
            this.showAlert()
        }
        console.log(this.state.to)
        console.log(this.state.from)
    }

    downloadResultReport = async () => {
        const {dataReport} = this.props.dashboard
        // this.props.downloadReport(dataReport)
        axios({
            url: `${dataReport}`,
            method: 'GET',
            responseType: 'blob', // important
          }).then((response) => {
             const url = window.URL.createObjectURL(new Blob([response.data]));
             const link = document.createElement('a');
             link.href = url;
             link.setAttribute('download', 'report.xls'); //or any other extension
             document.body.appendChild(link);
             link.click();
          });
    }

    download = async () => {
        const {dataDownload} = this.props.dashboard
        downloadFile(dataDownload, 'report.xls')
    }

    getNotif = async () => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        if (level === '2' || level === '3') {
            await this.props.getNotif(token)
        } else if (level === '4' || level === '5') {
            await this.props.getNotifArea(token)
        }
    }

    getDataDepo = async () => {
        const token = localStorage.getItem("token")
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        if (level === "1") {
            await this.props.getDepo(token, 1000, '')
        } else if (level === '2' || level === '3') {
            await this.props.getDepo(token, 1000, names)
        }
    }

    preparePic = () => {
        const { dataDepo } = this.props.depo
        const temp = []
        const data = [
            {value: '', label: '-Pilih PIC-'},
            {value: 'all', label: 'All'}
        ]
        if (dataDepo.length !== 0) {
            dataDepo.map(item => {
                return (
                    temp.push(item.nama_pic_1)
                )
            })
            const set = new Set(temp)
            const newData = [...set]
            newData.map(item => {
                return (
                    data.push({value: item, label: item})
                )
            })
            this.setState({depo: data})
        }
    }

    prepareSelect = () => {
        const { dataDepo } = this.props.depo
        
        const temp = [
            {value: '', label: '-Pilih Depo-'},
            {value: 'all', label: 'All'}
        ]

        if (dataDepo.length !== 0) {
            dataDepo.map(item => {
                return (
                    temp.push({value: item.kode_plant, label: item.kode_plant + '-' + item.nama_depo})
                )
            })
            this.setState({options: temp})
        }

       
        
        
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    render() {
        const {isOpen, dropOpenNum, type, depo} = this.state
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataDepo} = this.props.depo
        const {notif, notifSa, notifKasir} = this.props.dashboard

        const contentHeader =  (
            <div className="navbar">
                <NavbarBrand
                    href="#"
                    onClick={this.menuButtonClick}
                    >
                        <FaBars size={20} className="white" />
                    </NavbarBrand>
                    <div className="divLogo">
                        <marquee className='marquee'>
                            <span>WEB ACCOUNTING</span>
                        </marquee>
                        <div className="textLogo">
                            <FaUserCircle size={24} className="mr-2" />
                            <text className="mr-3">{level === '1' ? 'Super admin' : names }</text>
                            <UncontrolledDropdown>
                                <DropdownToggle nav>
                                    <div className="optionType">
                                        <BsBell size={20} className="white"/>
                                        {notif.length > 0 ? (
                                            <BsFillCircleFill className="red ball" size={10} />
                                        ) : notifSa.length > 0 || notifKasir.length > 0 ? (
                                            <BsFillCircleFill className="red ball" size={10} />
                                        ) : ( 
                                            <div></div>
                                        )}
                                    </div>
                                </DropdownToggle>
                                {level === '2' || level === '3' ? (
                                    <DropdownMenu right
                                    modifiers={{
                                        setMaxHeight: {
                                          enabled: true,
                                          order: 890,
                                          fn: (data) => {
                                            return {
                                              ...data,
                                              styles: {
                                                ...data.styles,
                                                overflow: 'auto',
                                                maxHeight: '600px',
                                              },
                                            };
                                          },
                                        },
                                      }}
                                    >
                                        {notifSa.length > 0 && notifSa.map(item => {
                                            return (
                                            <DropdownItem href="/dokumen">
                                                <div className="notif">
                                                    <FcDocument size={60} className="mr-4"/>
                                                    <div>
                                                        <div>User Area {item.tipe} Telah Mengirim Dokumen</div>
                                                        <div>Kode Plant: {item.kode_plant}</div>
                                                        <div>{item.dokumen.dokumen}</div>
                                                        <div>{moment(item.active.createdAt).format('LLL')}</div>
                                                    </div>
                                                </div>
                                                <hr/>
                                            </DropdownItem>
                                            )
                                        })}
                                        {notifKasir.length === 0 && notifSa.length === 0 && (
                                        <DropdownItem>
                                            <div className="grey">
                                                You don't have any notifications 
                                            </div>        
                                        </DropdownItem>
                                        )}
                                    </DropdownMenu>
                                ) : level === '4' || level === '5' ? (
                                    <DropdownMenu right
                                    modifiers={{
                                        setMaxHeight: {
                                          enabled: true,
                                          order: 890,
                                          fn: (data) => {
                                            return {
                                              ...data,
                                              styles: {
                                                ...data.styles,
                                                overflow: 'auto',
                                                maxHeight: '600px',
                                              },
                                            };
                                          },
                                        },
                                      }}
                                    >
                                    {notif.length > 0 && notif.map(item => {
                                        return (
                                        <DropdownItem href="/dokumen">
                                            <div className="notif">
                                                <FcDocument size={40} className="mr-4"/>
                                                <div>
                                                    <div>Dokumen Anda Direject</div>
                                                    <div>{item.dokumen.dokumen}</div>
                                                    <div>Jenis Dokumen: {item.active.jenis_dokumen}</div>
                                                    <div>{moment(item.active.createdAt).format('LLL')}</div>
                                                </div>
                                            </div>
                                            <hr/>
                                        </DropdownItem>
                                        )
                                    })}
                                    {notif.length === 0 && (
                                        <DropdownItem>
                                            <div className="grey">    
                                                You don't have any notifications 
                                            </div>        
                                        </DropdownItem>
                                    )}
                                    </DropdownMenu>
                                ) : (
                                    <DropdownMenu right>
                                        <DropdownItem>
                                                <div className="grey">    
                                                    You don't have any notifications 
                                                </div>        
                                        </DropdownItem>
                                    </DropdownMenu>
                                )}
                            </UncontrolledDropdown>
                        </div>
                    </div>
            </div>
        )

        const sidebar = <SidebarContent />
        const sidebarProps = {
            sidebar,
            docked: this.state.docked,
            sidebarClassName: "custom-sidebar-class",
            contentId: "custom-sidebar-content-id",
            open: this.state.open,
            touch: this.state.touch,
            shadow: this.state.shadow,
            pullRight: this.state.pullRight,
            touchHandleWidth: this.state.touchHandleWidth,
            dragToggleDistance: this.state.dragToggleDistance,
            transitions: this.state.transitions,
            onSetOpen: this.onSetOpen
          };
        return (
            <>
            <div className={styleTrans.app}>
                <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                    <Alert color="danger" className="alertWrong" isOpen={this.state.alert}>
                        <div>Report not found</div>
                    </Alert>
                    <h2 className={styleTrans.pageTitle}>Report</h2>
                    <div className='mt-4'>
                        <div className="headReport">
                            <text className="col-md-2 fontReport">Jenis</text>
                            <div className="optionType col-md-4">
                                <text className="colon">:</text>
                                <ButtonDropdown isOpen={this.state.openType} toggle={this.openTypeFunc}>
                                    <DropdownToggle caret color="light">
                                        {type}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={() => this.setState({type: 'daily'})}>
                                            Daily
                                        </DropdownItem>
                                        <DropdownItem onClick={() => this.setState({type: 'monthly'})}>
                                            Monthly
                                        </DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </div>
                        </div>
                        {type === "daily" ? (
                        <div className="headReport">
                            <text className="col-md-2 fontReport">Tanggal Dokumen</text>
                            <div className="optionType col-md-4">
                                <text className="colon">:</text>
                                <Input type="date" name="creeatedAt" onChange={this.chooseFrom}/>
                                <text className="toColon">To</text>
                                <text className="colon">:</text>
                                <Input type="date" name="creeatedAt" onChange={this.chooseTo} />
                            </div>
                        </div>
                        ) : type === "monthly" ?(
                        <div className="headReport">
                            <text className="col-md-2 fontReport">Periode Dokumen</text>
                            <div className="optionType col-md-4">
                                <text className="colon">:</text>
                                <Input type="select" name="select" onChange={this.chooseFrom}>
                                    <option value="">-Pilih Period-</option>
                                    {this.state.month.length !== 0 && this.state.month.map(item => {
                                        return (
                                            <option value={moment(item).format('YYYY-MM-DD')}>{moment(item).format('MMMM YYYY')}</option>
                                        )
                                    })}
                                </Input>
                            </div>
                        </div>
                        ): (
                            <div></div>
                        )}
                        {level === '3' ? (
                        <div>
                            <div className="headReport">
                                <text className="col-md-2 fontReport">Depo</text>
                                <div className="optionType col-md-4">
                                    <text className="colons">:</text>
                                    <Select
                                            className="col-md-12"
                                            options={this.state.options}
                                            onChange={this.chooseDepo}
                                            isDisabled={this.state.pic === '' ? false : true}
                                        />
                                </div>
                            </div>
                            <Button
                            onClick={this.createReport}
                                color="primary" 
                                size="lg" 
                                className="ml-3 mt-3 col-md-1"
                                disabled={this.state.from === '' || this.state.to === '' ? true : this.state.kode === '' ? true : false }
                                >
                                    Download
                                </Button>
                        </div>   
                        ) : level === '4' || level === '5' ? (
                                <Button
                                onClick={this.createReport}
                                color="primary" 
                                size="lg" 
                                className="ml-3 mt-3 col-md-1"
                                disabled={this.state.from === '' || this.state.to === '' ? true : false }
                                >
                                    Download
                                </Button>
                        ) : (
                            <div>
                                <div className="headReport">
                                    <text className="col-md-2 fontReport">PIC</text>
                                    <div className="optionType col-md-4">
                                        <text className="colons">:</text>
                                        <Select
                                            className="col-md-12"
                                            options={this.state.depo}
                                            onChange={this.choosePic}
                                            isDisabled={this.state.kode === '' ? false : true}
                                        />
                                    </div>
                                </div>
                                <div className="headReport">
                                    <text className="col-md-2 fontReport">Depo</text>
                                    <div className="optionType col-md-4">
                                        <text className="colons">:</text>
                                        <Select
                                            className="col-md-12"
                                            options={this.state.options}
                                            onChange={this.chooseDepo}
                                            isDisabled={this.state.pic === '' ? false : true}
                                        />
                                    </div>
                                </div>
                                <Button
                                onClick={this.createReport}
                                color="primary" 
                                size="lg" 
                                className="ml-3 mt-3 col-md-1"
                                disabled={this.state.from === '' || this.state.to === '' ? true : this.state.pic === '' && this.state.kode !== '' ? false : this.state.pic !== '' && this.state.kode === '' ? false : true }
                                >
                                    Download
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Modal isOpen={this.props.dashboard.isLoading ? true: false} size="sm">
                    <ModalBody>
                    <div>
                        <div className="cekUpdate">
                            <Spinner />
                            <div sucUpdate>Waiting....</div>
                        </div>
                    </div>
                    </ModalBody>
            </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    depo: state.depo,
    dashboard: state.dashboard
})

const mapDispatchToProps = {
    logout: auth.logout,
    getDepo: depo.getDepo,
    resetError: depo.resetError,
    report: dashboard.report,
    resetErrorReport: dashboard.resetErrorReport,
    downloadReport: dashboard.downloadReport,
    getNotifArea: dashboard.getNotifArea,
    getNotif: dashboard.getNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(Report)
	