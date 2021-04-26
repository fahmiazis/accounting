/* eslint-disable jsx-a11y/anchor-is-valid */
// eslint-disable-next-line jsx-a11y/anchor-is-valid
import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Dropdown,
    Spinner,
    Label,
    FormGroup} from 'reactstrap'
import Pdf from "../components/Pdf"
import logo from "../assets/img/logo.png"
import '../assets/css/style.css'
import {FaSearch} from 'react-icons/fa'
import {AiOutlineCheck, AiFillCheckCircle, AiOutlineClose, AiOutlineMinus, AiOutlineFilePdf, AiOutlineFileExcel} from 'react-icons/ai'
import {BsCircle, BsDashCircleFill, BsFillCircleFill} from 'react-icons/bs'
import {MdWatchLater} from 'react-icons/md'
import dashboard from '../redux/actions/dashboard'
import moment from 'moment'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as Yup from 'yup'
import alasan from '../redux/actions/alasan'
import auth from '../redux/actions/auth'
import {BsBell} from 'react-icons/bs'
import {default as axios} from 'axios'
import { FcDocument } from 'react-icons/fc'

const {REACT_APP_BACKEND_URL} = process.env

const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
});

class LockDepo extends Component {
    state = {
        alert: false,
        isOpen: false,
        openModal: false,
        drop: false,
        dropOpen: false,
        dropLink: false,
        dropOpenNum: false,
        value: '',
        onChange: new Date(),
        openPdf: false,
        openApprove: false,
        openReject: false,
        upload: false,
        errMsg: '',
        detail: {},
        fileUpload: '',
        file: '',
        fileName: {},
        alasan: '',
        doc: [],
        aktif: {},
        act: [],
        totalDoc: [],
        tipe: 'daily',
        appAct: {},
        date: '',
        time: '',
        search: '',
        limit: 10,
        lock: {},
        lockModal: false,
        access: ''
    }

    showAlert = () => {
        this.setState({alert: true, openModal: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    uploadAlert = () => {
        this.setState({upload: true, openModal: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    editAccess = async () => {
        const {lock, access} = this.state
        const data = {
            access: access
        }
        const token = localStorage.getItem('token')
        await this.props.editAccessActive(token, lock.id, data)
    }

    approveDokumen = async () => {
        const {fileName, appAct} = this.state
        const token = localStorage.getItem('token')
        await this.props.approve(token, fileName.id, appAct.id)
    }

    rejectDokumen = async (value) => {
        const {fileName, appAct} = this.state
        const token = localStorage.getItem('token')
        const {isReject} = this.props.dashboard
        await this.props.reject(token, fileName.id, appAct.id, value)
        await this.props.sendEmail(token, fileName.id)
        if (isReject) {
            this.getDataDashboard()
        }
    }

    showDokumen = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.showDokumen(token, value.id)
        this.setState({date: value.path.createdAt})
        const {isShow} = this.props.dashboard
        if (isShow) {
            this.downloadData(value)
            this.openModalPdf()
        }
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const token = localStorage.getItem('token')
        if(e.key === 'Enter'){
            await this.props.getAllActivity(token, e.target.value, this.state.limit, this.state.tipe === '' ? 'daily' : this.state.tipe)
        }
    }

    uploadDokumen = async () => {
        const {detail, fileUpload, aktif} = this.state
        const token = localStorage.getItem('token')
        const data = new FormData()
        data.append('document', fileUpload)
        await this.props.uploadDocument(token, detail.id, moment(aktif.createdAt).utc().format('YYYY-MM-DD'), data)
        const {isUpload} = this.props.dashboard
        if (isUpload) {
            this.setState({fileUpload: ''})
        }
    }

    onChangeHandler = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= 10000000) {
            this.setState({errMsg: "Maximum upload size 10 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' && type !== 'application/pdf') {
            this.setState({errMsg: 'Invalid file type. Only excel and pdf files are allowed.'})
            this.uploadAlert()
        } else {
            const {detail, aktif} = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadDocument(token, detail.id, moment(aktif.createdAt).utc().format('YYYY-MM-DD'), data)
        }
    }

    dropOpen = () => {
        this.setState({drop: !this.state.drop})
    }

    lockOpenModal = () => {
        this.setState({lockModal: !this.state.lockModal})
    }

    dropLink = () => {
        this.setState({dropLink: !this.state.dropLink})
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    dropDown = () => {
        this.setState({dropOpen: !this.state.dropOpen})
    }
    dropOpenN = () => {
        this.setState({dropOpenNum: !this.state.dropOpenNum})
    }
    openModalProses = () => {
        this.setState({openModal: !this.state.openModal})
    }
    openModalPdf = () => {
        this.setState({openPdf: !this.state.openPdf})
    }
    openModalApprove = () => {
        this.setState({openApprove: !this.state.openApprove})
    }
    openModalReject = () => {
        this.setState({openReject: !this.state.openReject})
    }

    componentDidMount(){
        this.getDataDashboard()
        this.getNotif()
    }

    showDok = async (value) => {
        const token = localStorage.getItem('token')
        this.setState({fileName: value.path, appAct: value.active})
        // this.props.download(download[2])
        await this.props.showDokumen(token, value.path.id)
        this.setState({date: value.path.createdAt})
        const {isShow} = this.props.dashboard
        console.log(value)
        if (isShow) {
            this.downloadDataPic(value)
            this.openModalPdf()
        }
    }

    onEditDokumen = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= 10000000) {
            this.setState({errMsg: "Maximum upload size 10 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' && type !== 'application/pdf') {
            this.setState({errMsg: 'Invalid file type. Only excel and pdf files are allowed.'})
            this.uploadAlert()
        } else {
            const {detail, aktif} = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.updateUploadDokumen(token, detail.id, data)
        }
    }

    lockOpen = (value) => {
        this.setState({lock: value})
        this.lockOpenModal()
        console.log(value)
    }

    downloadData = (value) => {
        const download = value.path.split('/')
        axios({
            url: `${REACT_APP_BACKEND_URL}/uploads/${download[2]}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${download[2]}`); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    downloadDataPic = (value) => {
        const download = value.path.path.split('/')
        axios({
            url: `${REACT_APP_BACKEND_URL}/uploads/${download[2]}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${download[2]}`); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    next = async () => {
        const { pages } = this.props.dashboard
        const token = localStorage.getItem('token')
        await this.props.nextDashboard(token, pages.nextLink)
    }

    prev = async () => {
        const { pages } = this.props.dashboard
        const token = localStorage.getItem('token')
        await this.props.nextDashboard(token, pages.prevLink)
    }

    getDataLimit = async (value) => {
        const token = localStorage.getItem('token')
        const limit = value === undefined ? this.state.limit : value
        await this.props.getAllActivity(token, this.state.search, this.state.tipe === '' ? 'daily' : this.state.tipe, limit)
        this.setState({limit: value === undefined ? 10 : value})
    }

    getDataDashboard = async (value) => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        if (level === '2') {
            await this.props.getAllActivity(token, this.state.search, this.state.limit, value === undefined ? 'daily' : value)
            this.setState({tipe: value === undefined ? 'daily' : value})
        }
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

    prepareDokumen = () => {
        const data = []
        const time = moment().endOf('month').format('DD')
        for (let i = 1; i <= time; i++) {
            data.push(i)
        }
        this.setState({totalDoc: data})
    }

    componentDidUpdate() {
        const {isError, isUpload, isGetPic, isApprove, isReject, isUpdate, isEdit} = this.props.dashboard
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
             }, 2000)
             setTimeout(() => {
                this.getDataDashboard()
                this.openModalProses()
             }, 2100)
        } else if (isUpdate) {
            setTimeout(() => {
                this.props.resetError()
             }, 2000)
             setTimeout(() => {
                this.getDataDashboard()
                this.openModalProses()
             }, 2100)
        } else if (isGetPic) {
            this.prepareDokumen()
            this.props.resetError()
        } else if (isApprove) {
            this.setState({openModal: false, openPdf: false, openApprove: false})
            setTimeout(() => {
                this.getDataDashboard()
            }, 500)
            this.props.resetError()
        } else if (isReject) {
            this.setState({openModal: false, openPdf: false, openReject: false})
            this.props.resetError()
            setTimeout(() => {
                this.getDataDashboard()
            }, 500)
        } else if (isEdit) {
            this.lockOpenModal()
            this.props.resetError()
            setTimeout(() => {
                this.getDataDashboard()
            }, 500);
        }
    }


    render() {
        const {isOpen, dropOpen, act, errMsg, dropOpenNum, doc, openModal, openPdf, openApprove, openReject, drop, upload, totalDoc, lock, lockModal} = this.state
        const level = localStorage.getItem('level')
        const {notifSa, notifKasir, notif, dataDash, dataActive, active, alertMsg, alertM, dataShow, dataSaActive, dataKasirActive, dataDepo, pages} = this.props.dashboard
        const {dataAlasan} = this.props.alasan
        const names = localStorage.getItem('name')
        return (
            <>
                <Navbar color="light" light expand='lg' className="navbar">
                    <NavbarBrand href="/home"><img src={logo} alt="logo" className="logo" /></NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="/" className="navHome">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/dashboard" className="navDoc">Dashboard</NavLink>
                            </NavItem>
                            {level === '2' ? (
                                <Dropdown nav isOpen={this.state.dropLink} toggle={this.dropLink}>
                                <DropdownToggle nav caret className="navDoc">
                                    Document
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem href="/dokumen">
                                        Verifikasi Dokumen
                                    </DropdownItem>
                                    <DropdownItem href="/setting/dokumen">
                                        Setting Dokumen
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            ) : (
                            <NavItem>
                                <NavLink href="/dokumen" className="navDoc">Document</NavLink>
                            </NavItem>
                            )}
                            {level === '1' ? (
                                <Dropdown nav isOpen={drop} toggle={this.dropOpen}>
                                <DropdownToggle nav caret className="navDoc">
                                    Master
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem href="/email">
                                        Master Email
                                    </DropdownItem>
                                    <DropdownItem href="/master/dokumen">
                                        Master Document
                                    </DropdownItem>
                                    <DropdownItem href="/pic">
                                        Master PIC
                                    </DropdownItem>
                                    <DropdownItem href="/alasan">
                                        Master Alasan
                                    </DropdownItem>
                                    <DropdownItem href="/depo">
                                        Master Depo
                                    </DropdownItem>
                                    <DropdownItem href="/user">
                                        Master User
                                    </DropdownItem>
                                    <DropdownItem href="/divisi">
                                        Master Divisi
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            ) : (
                                <div></div>
                            )}
                            <NavItem>
                                <NavLink href="/report" className="navReport">Report</NavLink>
                            </NavItem>
                            {level === '2' ? (
                            <NavItem>
                                <NavLink href="/lock" className="navReport">Setting Access</NavLink>
                            </NavItem>
                            ) : (
                                <div></div>
                            )}
                        </Nav>
                        <UncontrolledDropdown>
                            <DropdownToggle nav caret>
                            {level === '1' ? names + ' - ' + 'Super Admin': level === '2' ? names + ' - ' + 'SPV': level === '3' ? names + ' - ' + 'PIC': level === '4' ? names :level === '5' ? names: 'User'}
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem onClick={() => this.props.logout()}>Log Out</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown>
                            <DropdownToggle nav>
                                <div className="optionType">
                                    <BsBell size={20} />
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
                                <DropdownMenu right>
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
                                <DropdownMenu right>
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
                    </Collapse>
                </Navbar>
                <Container fluid={true} className="background-logo">
                    <Alert color="danger" className="alertWrong" isOpen={upload}>
                        <div>{errMsg}</div>
                    </Alert>
                    <Alert color="danger" className="alertWrong" isOpen={this.state.alert}>
                        <div>{alertMsg}</div>
                        <div>{alertM}</div>
                    </Alert>
                    <div className="bodyDashboard">
                        <div className="titleDashboard">Lock / Unlock</div>
                        <div className="secHeadDashboard">
                            <div className="searchDash">
                                <div className="secSearch mr-4">
                                    <text className="mr-2">
                                        Show: 
                                    </text>
                                    { level === '5' || level === '4' ? (
                                        <ButtonDropdown className="drop" isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu >
                                            <DropdownItem className="item" onClick={() => this.setState({limit: 10})}>10</DropdownItem>
                                            <DropdownItem className="item" onClick={() => this.setState({limit: 20})}>20</DropdownItem>
                                            <DropdownItem className="item" onClick={() => this.setState({limit: 50})}>50</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                    ) : (
                                        <ButtonDropdown className="drop" isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu >
                                            <DropdownItem className="item" onClick={() => this.getDataLimit(10)}>10</DropdownItem>
                                            <DropdownItem className="item" onClick={() => this.getDataLimit(20)}>20</DropdownItem>
                                            <DropdownItem className="item" onClick={() => this.getDataLimit(50)}>50</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                    )}
                                </div>
                                    <div className="secSearch">
                                        <text>Search: </text>
                                        <Input 
                                        className="search"
                                        onChange={this.onSearch}
                                        value={this.state.search}
                                        onKeyPress={this.onSearch}
                                        >
                                            <FaSearch size={20} />
                                        </Input>
                                    </div>
                            </div>
                        </div>
                        <div className="tableDashboard">
                            <Table bordered responsive hover className="tab">
                                <thead>
                                {level === '4' || level === '5' ? (
                                        <tr>
                                            <th>No</th>
                                            <th>Tanggal Dokumen</th>
                                            <th>Tanggal Upload</th>
                                            {dataDash !== undefined && dataDash.map(item => {
                                                return (
                                                <th>{(dataDash.indexOf(item) + 1)}</th>
                                                )
                                            })}
                                            <th>Jumlah File Upload</th>
                                            <th>Persentase</th>
                                            <th>Status</th>
                                        </tr>
                                        ): level === '6' || level === '3' || level === '1' || level === '2' ? (
                                        <tr>
                                            <th>No</th>
                                            <th>PIC</th>
                                            <th>Kode Plant</th>
                                            <th>Nama Depo</th>
                                            <th>User Area</th>
                                            {totalDoc.length !== 0 && totalDoc.map(item => {
                                                return (
                                                <th>{item}</th>
                                                )
                                            })}
                                        </tr>
                                        ): (
                                        <tr>
                                            <th>No</th>
                                            <th>PIC</th>
                                            <th>Kode Plant</th>
                                            <th>Nama Depo</th>
                                            <th>1</th>
                                            <th>2</th>
                                            <th>3</th>
                                            <th>4</th>
                                            <th>5</th>
                                            <th>6</th>
                                            <th>7</th>
                                            <th>8</th>
                                            <th>9</th>
                                            <th>10</th>
                                            <th>11</th>
                                            <th>12</th>
                                            <th>13</th>
                                            <th>14</th>
                                            <th>Jumlah File Upload</th>
                                            <th>Persentase</th>
                                            <th>Status</th>
                                        </tr>
                                        )}
                                </thead>
                                    { level === '2' || level === '1' ? (
                                <tbody>
                                        {dataSaActive !== undefined && dataSaActive.map(x => {
                                            return (
                                            x !== null ? (
                                                // onClick={() => this.openModalProses(this.setState({doc: dataSaActive[dataSaActive.indexOf(x)].dokumen, act: dataSaActive[dataSaActive.indexOf(x)].active}))}
                                            <tr className="danger">
                                                <th scope="row">{(dataSaActive.indexOf(x) + ((((pages.currentPage - 1) * pages.limitPerPage) * 2) + 1))}</th>
                                                <td>{x.nama_pic_1}</td>
                                                <td>{x.kode_plant === null ? x.kode_depo : x.kode_plant}</td>
                                                <td>{x.nama_depo}</td>
                                                <td>SA</td>
                                                {x.active.length > 0 ? (
                                                    totalDoc.map(y => {
                                                        let cek =  []
                                                        let data = []
                                                        for (let i = 0; i < totalDoc.length; i++) {
                                                            if (x.active[i] === undefined) {
                                                                cek.push('')
                                                            } else if (parseInt(moment(x.active[i].createdAt).format('DD')) == y) {
                                                                cek.push(x.active[i].access)
                                                                data.push(i)
                                                            }
                                                        }
                                                        return (
                                                            <td>
                                                                <a className="green" onClick={() => this.lockOpen(x.active[data])}>
                                                                    {cek}
                                                                </a>
                                                            </td>
                                                        )
                                                    })
                                                ): (
                                                    totalDoc.map(item => {
                                                        return (
                                                            <td></td>
                                                        )
                                                    })
                                                )}
                                            </tr>
                                            ) : (
                                                <div></div>
                                            )
                                            )
                                        })}
                                        {dataKasirActive !== undefined && dataKasirActive.map(x => {
                                            return (
                                            x !== null ? (
                                                // onClick={() => this.openModalProses(this.setState({doc: dataKasirActive[dataKasirActive.indexOf(x)].dokumen, act: dataKasirActive[dataKasirActive.indexOf(x)].active}))}
                                            <tr className="danger" >
                                                <th scope="row">{(dataKasirActive.indexOf(x) + dataSaActive.length + ((((pages.currentPage - 1) * pages.limitPerPage) * 2) + 1))}</th>
                                                <td>{x.nama_pic_1}</td>
                                                <td>{x.kode_plant}</td>
                                                <td>{x.nama_depo}</td>
                                                <td>Kasir</td>
                                                {x.active.length > 0 ? (
                                                    totalDoc.map(y => {
                                                        let cek =  []
                                                        for (let i = 0; i < totalDoc.length; i++) {
                                                            if (x.active[i] === undefined) {
                                                                cek.push('')
                                                            } else if (parseInt(moment(x.active[i].createdAt).format('DD')) == y) {
                                                                cek.push(x.active[i].access)
                                                            }
                                                        }
                                                        return (
                                                            <td>
                                                                <a className="green" onClick={this.openModalProses}>
                                                                    {cek}
                                                                </a>
                                                            </td>
                                                        )
                                                    })
                                                ): (
                                                    totalDoc.map(item => {
                                                        return (
                                                            <td></td>
                                                        )
                                                    })
                                                )}
                                            </tr>
                                            ) : (
                                                <td></td>
                                            )
                                            )
                                        })}
                                </tbody>
                                ): (
                                    <tbody>
                                    <tr className="danger">
                                    </tr>
                                    </tbody>
                                )}
                            </Table>
                        </div>
                        <div>
                            <div className="infoPage">
                                <text>Showing {pages.currentPage} of {pages.pages} pages</text>
                                <div className="pageButton">
                                    <button className="btnPrev" color="info" disabled={pages.prevLink === null ? true : false} onClick={this.prev}>Prev</button>
                                    <button className="btnPrev" color="info" disabled={pages.nextLink === null ? true : false} onClick={this.next}>Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
                <Modal isOpen={openModal} size="lg" toggle={this.openModalProses}>
                    <ModalHeader toggle={this.openModalProses}>Proses Dokumen Daily</ModalHeader>
                    {level === '4' || level === '5' ? (
                            <ModalBody>
                            <div className="modal-dashboard">
                            {dataDash !== undefined && dataDash.map(item => {
                                    return (
                                <div className="secModal">
                                    <div className="col-md-6">
                                        <text>{item.nama_dokumen}</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                            {doc.find(({dokumen}) => dokumen === item.nama_dokumen) === undefined ? (
                                                <BsDashCircleFill size={25} className="black" />
                                            ) : doc.find(({dokumen}) => dokumen === item.nama_dokumen).status_dokumen === 2 ? (
                                                <BsCircle className="green" size={25} />
                                            ) : doc.find(({dokumen}) => dokumen === item.nama_dokumen).status_dokumen === 3 ? (
                                                <AiOutlineCheck className="blue" size={25}/>
                                            ) : doc.find(({dokumen}) => dokumen === item.nama_dokumen).status_dokumen === 4 ? (
                                                <MdWatchLater className="red" size={25}/>
                                            ) : doc.find(({dokumen}) => dokumen === item.nama_dokumen).status_dokumen === 0 ? (
                                                <AiOutlineClose className="red" size={25}/>
                                            ) : doc.find(({dokumen}) => dokumen === item.nama_dokumen).status_dokumen === 1 ? (
                                                <BsCircle className="black" size={20} />
                                            ) : (
                                                <div></div>
                                            )}
                                            <AiOutlineFilePdf size={25} className="pdf" />
                                            {doc.find(({dokumen}) => dokumen === item.nama_dokumen) === undefined ? (
                                            <Input
                                                type="file"
                                                name="file"
                                                accept=".xls,.xlsx,.pdf"
                                                onClick={() => this.setState({detail: item})}
                                                onChange={this.onChangeHandler}
                                            />
                                            ) : 
                                            (
                                            <div>
                                                {/* this.setState({file: doc.find(({dokumen}) => dokumen === item.nama_dokumen).path, fileName: doc.find(({dokumen}) => dokumen === item.nama_dokumen)} */}
                                                <a onClick={() => this.showDokumen(doc.find(({dokumen}) => dokumen === item.nama_dokumen))}>
                                                    {doc.find(({dokumen}) => dokumen === item.nama_dokumen).dokumen}
                                                </a>
                                                <Input
                                                type="file"
                                                name="file"
                                                accept=".xls,.xlsx,.pdf"
                                                onClick={() => this.setState({detail: doc.find(({dokumen}) => dokumen === item.nama_dokumen)})}
                                                onChange={this.onEditDokumen}
                                                />
                                            </div>
                                            )}                                            
                                        </div>
                                    </div>
                                </div>
                                )
                                })}
                            </div>
                            <hr />
                            <div className="foot">
                                <div className="statusSymModal">
                                    <div><AiOutlineCheck size={20} className="blue" /><text>  Approve</text></div>
                                    <div><AiOutlineClose size={20} className="red" /><text>  Reject</text></div>
                                    <div><BsCircle size={20} className="green" /><text>  Open</text></div>
                                    <div><BsDashCircleFill size={20} className="black" /><text>  Empty</text></div>
                                </div>
                                <div>
                                    <Button className="btnFootModal" color="primary" onClick={this.openModalProses}>Save</Button>
                                    <Button color="secondary" onClick={this.openModalProses}>Cancel</Button>
                                </div>
                            </div>
                    </ModalBody>
                    ) : level === '3' || level === '1' || level === '2' ? (
                        <ModalBody>
                            <div className="modal-dashboard">
                            {doc !== undefined && doc.map(item => {
                                    return (
                                <div className="secModal">
                                    <div className="col-md-6">
                                        <text>{item.nama_dokumen}</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                        {act.length > 0 && act[0].doc.length > 0 ? (
                                                act[0].doc.find(({dokumen}) => dokumen === item.nama_dokumen) === undefined ? (
                                                    <BsDashCircleFill size={25} className="black cir" />
                                                ) : act[0].doc.find(({dokumen}) => dokumen === item.nama_dokumen).status_dokumen === 0 ? (
                                                    <AiOutlineClose className="red" size={25} />
                                                ) : act[0].doc.find(({dokumen}) => dokumen === item.nama_dokumen).status_dokumen === 1 ? (
                                                    <BsCircle className="black" size={25} />
                                                ) : act[0].doc.find(({dokumen}) => dokumen === item.nama_dokumen).status_dokumen === 2 ? (
                                                    <BsCircle className="green" size={25}/>
                                                ) : act[0].doc.find(({dokumen}) => dokumen === item.nama_dokumen).status_dokumen === 3 ? (
                                                    <AiOutlineCheck className="blue" size={25}/>
                                                ) : act[0].doc.find(({dokumen}) => dokumen === item.nama_dokumen).status_dokumen === 4 ? (
                                                    <MdWatchLater className="red" size={25}/>
                                                ) : (
                                                    <div></div>
                                                )
                                            ): (
                                                <BsDashCircleFill size={25} className="black cir" />
                                            )}
                                            <AiOutlineFilePdf size={25} className="pdf" />
                                            {act.length > 0 && act[0].doc.length > 0 ? (
                                                <div>
                                                {act[0].doc.find(({dokumen}) => dokumen === item.nama_dokumen) === undefined ? (
                                                    <div>Belum Upload</div>
                                                    ) : 
                                                    (
                                                    <div>
                                                        {/* this.setState({file: doc.find(({dokumen}) => dokumen === item.nama_dokumen).path, fileName: doc.find(({dokumen}) => dokumen === item.nama_dokumen)} */}
                                                    <a onClick={() => this.showDok({path: act[0].doc.find(({dokumen}) => dokumen === item.nama_dokumen), active: act[0]})}>
                                                        {act[0].doc.find(({dokumen}) => dokumen === item.nama_dokumen).dokumen}
                                                    </a>
                                                    </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div>Belum Upload</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                )
                                })}
                            </div>
                            <hr />
                            <div className="foot">
                                <div className="statusSymModal">
                                    <div><AiOutlineCheck size={20} className="blue" /><text>  Approve</text></div>
                                    <div><AiOutlineClose size={20} className="red" /><text>  Reject</text></div>
                                    <div><BsCircle size={20} className="green" /><text>  Open</text></div>
                                    <div><BsDashCircleFill size={20} className="black" /><text>  Empty</text></div>
                                </div>
                                <div>
                                    <Button className="btnFootModal" color="primary" onClick={this.openModalProses}>Save</Button>
                                    <Button color="secondary" onClick={this.openModalProses}>Cancel</Button>
                                </div>
                            </div>
                    </ModalBody>
                    ): (
                        <div></div>
                    )}
                </Modal>
                <Modal isOpen={lockModal} toggle={this.lockOpenModal}>
                    <ModalBody>
                    <div className="headReport">
                            <text className="col-md-3">Kode Plant</text>
                            <div className="optionType col-md-4">
                                <text className="colon">:</text>
                                <text>{lock.kode_plant}</text>
                            </div>
                        </div>
                        <div className="headReports">
                            <text className="col-md-3">Tanggal Upload</text>
                            <div className="optionType col-md-4">
                                <text className="colon">:</text>
                                <text>{moment(lock.createdAt).format('LL')}</text>
                            </div>
                        </div>
                        <div className="headReports">
                            <text className="col-md-3">Access</text>
                            <div className="optionType col-md-4">
                                <text className="colon">:</text>
                                <div className="headReport mt-4 ml-3">
                                    <div className="mr-3">
                                        <Label check>
                                            <Input type="radio" name="radio2" checked={lock.access === 'lock' ? true : this.state.access === 'lock' ? true : false} onChange={() => this.setState({access: 'lock'})}/>
                                            Lock
                                        </Label>
                                    </div>
                                    <div className="ml-3">
                                        <Label check>
                                            <Input type="radio" name="radio2" checked={lock.access === 'unlock' ? true : this.state.access === 'unlock' ? true : false} onChange={() => this.setState({access: 'unlock'})}/>
                                            Unlock
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.editAccess}>Save</Button>
                        <Button color="secondary" onClick={this.lockOpenModal}>Close</Button>
                    </ModalFooter>
                </Modal>
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
                <Modal isOpen={this.props.dashboard.isUpload || this.props.dashboard.isUpdate ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className="cekUpdate">
                                <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Mengupload File</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    dashboard: state.dashboard,
    alasan: state.alasan
})

const mapDispatchToProps = {
    getDashboard: dashboard.getDashboard,
    getActivity: dashboard.getActivity,
    uploadDocument: dashboard.uploadDokumen,
    resetError: dashboard.resetError,
    approve: dashboard.approve,
    reject: dashboard.reject,
    showDokumen: dashboard.showDokumen,
    getDashboardPic: dashboard.getDashboardPic,
    sendEmail: dashboard.sendEmail,
    getAlasan: alasan.getAlasan,
    logout: auth.logout,
    download: dashboard.download,
    nextDashboard: dashboard.nextDashboard,
    updateUploadDokumen: dashboard.updateUploadDokumen,
    getAllActivity: dashboard.getAllActivity,
    editAccessActive: dashboard.editAccessActive,
    getDashboard: dashboard.getDashboard,
    getNotifArea: dashboard.getNotifArea,
    getNotif: dashboard.getNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(LockDepo)