/* eslint-disable jsx-a11y/anchor-is-valid */
// eslint-disable-next-line jsx-a11y/anchor-is-valid
import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Dropdown,
    Spinner} from 'reactstrap'
import Pdf from "../components/Pdf"
import logo from "../assets/img/logo.png"
import '../assets/css/style.css'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
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
import {BiRevision} from 'react-icons/bi'
import {default as axios} from 'axios'
import { FcDocument } from 'react-icons/fc'
import Sidebar from "../components/Header";
import MaterialTitlePanel from "../components/material_title_panel";
import SidebarContent from "../components/sidebar_content";
moment.locales('id')

const {REACT_APP_BACKEND_URL} = process.env

const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
});

class Dokumen extends Component {

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
            settingOpen: false,
            tipe: 'daily',
            appAct: {},
            date: '',
            search: '',
            limit: 10,
            moon: 0,
            periode: false,
            listMut: [],
            noindex: null,
            sucupload: false,
            confirm: '',
            dataDown: {},
            dataDoc: [],
            time: moment().format('YYYY-MM-DD'),
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    chekRej = (val) => {
        const { listMut } = this.state
        const data = []
        if (val === 'all') {
            this.setState({listMut: []})
        } else {
            for (let i = 0; i < listMut.length; i++) {
                if (listMut[i] === val) {
                    data.push()
                } else {
                    data.push(listMut[i])
                }
            }
            this.setState({listMut: data})
        }
    }

    chekApp = (val) => {
        const { listMut, act } = this.state
        if (val === 'all') {
            const dok = act[0].doc
            const cek = []
            for (let i = 0; i < dok.length; i++) {
                cek.push(dok[i].id)
            }
            this.setState({listMut: cek})
        } else {
            listMut.push(val)
            this.setState({listMut: listMut})
        }
    }

    sucUpload = () => {
        this.setState({sucupload: !this.state.sucupload})
    }

    afterUpload = async () => {
        const token = localStorage.getItem('token')
        const { noindex, tipe } = this.state
        await this.props.getActivity(token, tipe)
        await this.props.getDashboard(token, tipe)
        const { active } = this.props.dashboard
        const sear = active.find(({id}) => id === noindex.id)
        this.setState({doc: active[noindex].doc, aktif: active[noindex]})
        this.sucUpload()
    }

    afterAppRej = async () => {
        const token = localStorage.getItem('token')
        const { noindex } = this.state
        const {page} = this.props.dashboard
        const {tipe} = this.state
        await this.props.getDashboardPic(token, tipe, this.state.time === '' ? moment().format('YYYY-MM-DD') : this.state.time, this.state.search, this.state.limit, page.currentPage)
        await this.props.getAlasan(token, 100, '')
        const {dataAll} = this.props.dashboard
        this.setState({doc: dataAll[noindex].dokumen, act: dataAll[noindex].active})
        this.sucUpload()
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

    approveDokumen = async () => {
        const {fileName, appAct, listMut, act} = this.state
        const token = localStorage.getItem('token')
        const data = {
            list: listMut
        }
        await this.props.approve(token, fileName.id, act[0].id, data)
    }

    rejectDokumen = async (value) => {
        const {fileName, appAct, listMut, act} = this.state
        const token = localStorage.getItem('token')
        const {isReject} = this.props.dashboard
        const data = {
            alasan: value.alasan,
            list: listMut
        }
        await this.props.reject(token, fileName.id, act[0].id, data)
        // await this.props.sendEmail(token, fileName.id)
        if (isReject) {
            this.getDataDashboard()
        }
    }
    
    sendEmailArea = async () => {
        const token = localStorage.getItem('token')
        const {listMut} = this.state
        const data = {
            listMut: listMut
        }
        await this.props.sendEmailArea(token, data)
    }

    sendEmail = async () => {
        const token = localStorage.getItem('token')
        const {listMut} = this.state
        const data = {
            listMut: listMut
        }
        await this.props.sendEmail(token, data)
    }

    showDokumen = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.showDokumen(token, value.id)
        this.setState({date: value.path.createdAt, dataDown: value})
        const {isShow} = this.props.dashboard
        if (isShow) {
            // this.downloadData(value)
            this.openModalPdf()
        }
    }

    onSearch = async (e) => {
        this.setState({search: e.target.value})
        const token = localStorage.getItem('token')
        if(e.key === 'Enter'){
            this.getDataDashboard(this.state.tipe)
        }
    }

    uploadDokumen = async () => {
        const {detail, fileUpload, aktif} = this.state
        const token = localStorage.getItem('token')
        const data = new FormData()
        data.append('document', fileUpload)
        await this.props.uploadDocument(token, detail.id, aktif.id, data)
        const {isUpload} = this.props.dashboard
        if (isUpload) {
            this.setState({fileUpload: ''})
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

    onChangeHandler = e => {
        const {size, type, name} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        const ext = name.split(".")
        if (size >= 100000000) {
            this.setState({errMsg: "Maximum upload size 100 MB"})
            this.uploadAlert()
        } else if (type !== "" && type !== null && type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' && type !== 'application/pdf' && type !== 'application/x-7z-compressed' && type !== 'application/vnd.rar' && type !== 'application/zip' && type !== 'application/x-zip-compressed' && type !== 'application/octet-stream' && type !== 'multipart/x-zip' && type !== 'application/x-rar-compressed') {
            this.setState({errMsg: 'Invalid file type. Only excel, pdf, zip, rar, and 7z files are allowed.'})
            this.uploadAlert()
        } else {
            const {detail, aktif} = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.uploadDocument(token, detail.id, aktif.id, data)
        }
    }
    dropSetting = () => {
        this.setState({settingOpen: !this.state.settingOpen})
    }

    dropOpen = () => {
        this.setState({drop: !this.state.drop})
    }

    dropPeriod = () => {
        this.setState({periode: !this.state.periode})
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

    openProses = (value) => {
        const { active, dataDash } = this.props.dashboard
        const dok = []
        for (let i = 0; i < dataDash.length; i++) {
            dok.push(dataDash[i].nama_dokumen)
        }
        for (let i = 0; i < active[value].doc.length; i++) {
            dok.push(active[value].doc[i].dokumen)
        }
        const setDoc = new Set(dok)
        const dokumen = [...setDoc]
        this.setState({dataDoc: dokumen, doc: active[value].doc, aktif: active[value], noindex: value})
        this.openModalProses()
    }

    openProsesPic = (val) => {
       const {dataAll} = this.props.dashboard
       const dok = []
       const temp = dataAll[val].active[0].doc
        for (let i = 0; i < dataAll[val].dokumen.length; i++) {
            dok.push(dataAll[val].dokumen[i].nama_dokumen)
        }
        for (let i = 0; i < temp.length; i++) {
            dok.push(temp[i].dokumen)
        }
        const setDoc = new Set(dok)
        const dokumen = [...setDoc]
       this.setState({dataDoc: dokumen, doc: dataAll[val].dokumen, act: dataAll[val].active, noindex: val})
       this.openModalProses()
    }

    showDok = async (value) => {
        const token = localStorage.getItem('token')
        this.setState({fileName: value.path, appAct: value.active})
        // this.props.download(download[2])
        await this.props.showDokumen(token, value.path.id)
        this.setState({date: value.path.createdAt, dataDown: value})
        const {isShow} = this.props.dashboard
        if (isShow) {
            // this.downloadDataPic(value)
            this.openModalPdf()
        }
    }

    onEditDokumen = e => {
        const {size, type} = e.target.files[0]
        this.setState({fileUpload: e.target.files[0]})
        if (size >= 100000000) {
            this.setState({errMsg: "Maximum upload size 100 MB"})
            this.uploadAlert()
        } else if (type !== "" && type !== null && type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' && type !== 'application/pdf' && type !== 'application/x-7z-compressed' && type !== 'application/vnd.rar' && type !== 'application/zip' && type !== 'application/x-zip-compressed' && type !== 'application/octet-stream' && type !== 'multipart/x-zip' && type !== 'application/x-rar-compressed') {
            this.setState({errMsg: 'Invalid file type. Only excel, pdf, zip, rar, and 7z files are allowed.'})
            this.uploadAlert()
        } else {
            const {detail, aktif} = this.state
            const token = localStorage.getItem('token')
            const data = new FormData()
            data.append('document', e.target.files[0])
            this.props.updateUploadDokumen(token, detail.id, aktif.id, data)
        }
    }

    downloadData = (value) => {
        const download = value.path.split('/')
        const cek = download[2].split('.')
        axios({
            url: `${REACT_APP_BACKEND_URL}/uploads/${download[2]}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${value.dokumen}.${cek[1]}`); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    downloadDataPic = (value) => {
        const download = value.path.path.split('/')
        const cek = download[2].split('.')
        axios({
            url: `${REACT_APP_BACKEND_URL}/uploads/${download[2]}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${value.path.kode_depo}_${value.path.dokumen}.${cek[1]}`); //or any other extension
            document.body.appendChild(link)
            link.click();
        })
    }

    downloadDataAll = () => {
        const {act, listMut} = this.state
        const val = act[0].doc
        for (let i = 0; i < val.length; i++) {
            if (listMut.find(element => element === val[i].id) !== undefined) {
                const download = val[i].path.split('/')
                const cek = download[2].split('.')
                axios({
                    url: `${REACT_APP_BACKEND_URL}/uploads/${download[2]}`,
                    method: 'GET',
                    responseType: 'blob', // important
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${val[i].kode_depo}_${val[i].dokumen}.${cek[1]}`); //or any other extension
                    document.body.appendChild(link)
                    link.click();
                })
            }
        }
    }

    next = async () => {
        const { page } = this.props.dashboard
        const token = localStorage.getItem('token')
        await this.props.nextDashboard(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.dashboard
        const token = localStorage.getItem('token')
        await this.props.nextDashboard(token, page.prevLink)
    }

    chooseTime = async (e) => {
        this.setState({time: e.target.value})
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        await this.props.getDashboardPic(token, this.state.tipe === '' ? 'daily' : this.state.tipe, e.target.value, this.state.search, this.state.limit )
    }

    getDataLimit = async (value) => {
        const token = localStorage.getItem('token')
        const limit = value === undefined ? this.state.limit : value
        await this.props.getDashboardPic(token, this.state.tipe === '' ? 'daily' : this.state.tipe, this.state.time === '' ? moment().format('YYYY-MM-DD') : this.state.time, this.state.search, limit)
        this.setState({limit: value === undefined ? 10 : value})
    }

    getDataMonthly = async (value) => {
        const token = localStorage.getItem('token')
        await this.props.getDashboardPic(token, 'monthly', moment(value).format('YYYY-MM-DD'), this.state.search, this.state.limit)
        this.setState({moon: moment(value), time: value})
    }


    getDataDashboard = async (value) => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        const { page } = this.props.dashboard
        const finalPage = page.currentPage
        if (level === '4' || level === '5') {
            await this.props.getDashboard(token, value === undefined ? 'daily' : value)
            setTimeout(() => {
                this.props.getActivity(token, value === undefined ? 'daily' : value)
            }, 1000)
            this.setState({tipe: value === undefined ? 'daily' : value})
        } else if (level === '3' || level === '1' || level === '2') {
            const {tipe} = this.state
            await this.props.getDashboardPic(token, value === undefined ? tipe : value, this.state.time === '' ? moment().format('YYYY-MM-DD') : this.state.time, this.state.search, this.state.limit, finalPage)
            await this.props.getAlasan(token, 100, '')
            this.setState({tipe: value === undefined ? 'daily' : value, })
        }
    }

    prepareDokumen = () => {
        const {dataSa, dataKasir} = this.props.dashboard
        const data = []
        const moon = []
        dataSa.map(x => {
            return (
                data.push(x !== null ? x.dokumen.length : 0)
            )
        })
        dataKasir.map(x => {
            return (
                data.push(x !== null ? x.dokumen.length : 0)
            )
        })
        const res = []
        for (let i = 0; i <= Math.max(...data)-1; i++) {
            res.push(i)
        }
        for (let i = 0; i < 6; i++) {
            const temp = moment().subtract(i, 'month')
            console.log(temp)
            moon.push(temp)
        }
        this.setState({totalDoc: res, month: moon, moon: moon[0]})
    }

    componentDidUpdate () {
        const {isError, isUpload, isGetPic, isApprove, isReject, isUpdate, isSend, sendArea} = this.props.dashboard
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (sendArea === true) {
            this.setState({confirm: 'sucsend'})
            this.props.resetError()
            this.sucUpload()
        } else if (sendArea === false) {
            this.setState({confirm: 'falsend'})
            this.props.resetError()
            this.sucUpload()
        } else if (isSend === true) {
            this.setState({confirm: 'sucsend'})
            this.props.resetError()
            this.sucUpload()
        } else if (isSend === false) {
            this.setState({confirm: 'falsend'})
            this.props.resetError()
            this.sucUpload()
        } else if (isUpload) {
            this.props.resetError()
            this.afterUpload()
        } else if (isUpdate) {
            this.props.resetError()
            this.afterUpload()
        } else if (isGetPic) {
            this.prepareDokumen()
            this.props.resetError()
        } else if (isApprove) {
            this.setState({openPdf: false, openApprove: false, confirm: 'approve'})
            this.props.resetError()
            this.afterAppRej()
        } else if (isReject) {
            this.setState({openPdf: false, openReject: false, confirm: 'reject'})
            this.props.resetError()
            this.afterAppRej()
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
        const {isOpen, dataDoc, dropOpen, act, errMsg, dropOpenNum, doc, openModal, openPdf, openApprove, openReject, drop, upload, totalDoc, listMut} = this.state
        const level = localStorage.getItem('level')
        const {notif, notifSa, notifKasir, dataDash, dataActive, active, alertMsg, alertM, dataShow, dataSa, dataKasir, dataDepo, page, dataAll} = this.props.dashboard
        const {dataAlasan} = this.props.alasan
        const names = localStorage.getItem('name')

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
                <Sidebar {...sidebarProps}>
                    <MaterialTitlePanel title={contentHeader}>
                        <div className="background-logo">
                            <Alert color="danger" className="alertWrong" isOpen={upload}>
                                <div>{errMsg}</div>
                            </Alert>
                            <Alert color="danger" className="alertWrong" isOpen={this.state.alert}>
                                <div>{alertMsg}</div>
                                <div>{alertM}</div>
                            </Alert>
                            <div className="bodyDashboard">
                            <div className="headMaster">
                                <div className="titleDashboard col-md-12">Verifikasi Dokumen</div>
                            </div>
                                <div className="headDashboard">
                                    {level === '5' || level === '4' ? (
                                        <div></div>
                                    ) : (
                                    <div>
                                        <text>Jenis: </text>
                                        <ButtonDropdown className="drop" isOpen={dropOpenNum} toggle={this.dropOpenN}>
                                        <DropdownToggle caret color="light">
                                            {this.state.tipe}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem onClick={() => this.getDataDashboard('daily')}>Daily</DropdownItem>
                                            <DropdownItem onClick={() => this.getDataDashboard('monthly')}>Monthly</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                    </div>
                                    )}
                                    {this.state.tipe === 'daily' ? (
                                        level == "6" || level == '1' || level == '2' || level == '3' ? (
                                            <div className="dateDash">
                                                <div>Tanggal Upload: </div>
                                                <div className="inputCalendar">
                                                    <Input value={this.state.time} type="date" onChange={this.chooseTime}/>
                                                </div>
                                                {/* <div><FaCalendarAlt size={22} /></div> */}
                                                {/* <Calendar
                                                value={this.state.value}
                                                onChange={this.state.onChange}
                                                /> */}
                                            </div>
                                        ) : (
                                            <div></div>
                                        )
                                    ) : (
                                        level == "6" || level == '1' || level == '2' || level == '3' ? (
                                        <>
                                            <div className="dateDash">
                                                <div>Periode: </div>
                                                <ButtonDropdown className="inputCalendar" isOpen={this.state.periode} toggle={this.dropPeriod}>
                                                    <DropdownToggle caret color="light">
                                                        {moment(this.state.moon).format('MMMM (YYYY)')}
                                                    </DropdownToggle>
                                                    <DropdownMenu >
                                                        {this.state.month.length !== 0 && this.state.month.map(item => {
                                                            return (
                                                                <DropdownItem className="item" onClick={() => this.getDataMonthly(moment(item))}>{moment(item).format('MMMM (YYYY)')}</DropdownItem>
                                                            )
                                                        })}
                                                    </DropdownMenu>
                                                </ButtonDropdown>
                                                {/* <div><FaCalendarAlt size={22} /></div> */}
                                                {/* <Calendar
                                                value={this.state.value}
                                                onChange={this.state.onChange}
                                                /> */}
                                            </div>
                                        </>
                                        ) : (
                                            <div></div>
                                        )
                                    )}
                                </div>
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
                                        {level === '5' || level === '4' ? (
                                            <div>
                                                <text>Jenis: </text>
                                                <ButtonDropdown className="drop" isOpen={dropOpenNum} toggle={this.dropOpenN}>
                                                <DropdownToggle caret color="light">
                                                    {this.state.tipe}
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem onClick={() => this.getDataDashboard('daily')}>Daily</DropdownItem>
                                                    <DropdownItem onClick={() => this.getDataDashboard('monthly')}>Monthly</DropdownItem>
                                                </DropdownMenu>
                                                </ButtonDropdown>
                                            </div>
                                        ) : (
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
                                        )}
                                    </div>
                                    <div className="statusSym">
                                        <div className='mr-1 signbtn'><AiOutlineCheck size={20} className="blue" /><text>  Approve</text></div>
                                        <div className='mr-1 signbtn'><AiOutlineClose size={20} className="red" /><text>  Reject</text></div>
                                        <div className='mr-1 signbtn'><BsCircle size={20} className="green" /><text>  Upload</text></div>
                                        <div className='mr-1 signbtn'><BiRevision size={20} className="black" /><text>  Revisi</text></div>
                                        <div className='mr-1 signbtn'><BsDashCircleFill size={20} className="black" /><text>  Empty</text></div>
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
                                        ) : level === '6' || level === '3' || level === '1' || level === '2' ? (
                                            <tr>
                                                <th>No</th>
                                                <th>PIC</th>
                                                <th>Kode Plant</th>
                                                <th>Nama Depo</th>
                                                <th>Tanggal Dokumen</th>
                                                <th>Tanggal Upload</th>
                                                {totalDoc.length !== 0 && totalDoc.map(item => {
                                                    return (
                                                        <th>{item + 1}</th>
                                                    )
                                                })}
                                                <th>Jumlah File Upload</th>
                                                <th>Persentase</th>
                                                <th>Status</th>
                                            </tr>
                                        ) : (
                                            <tr>
                                                <th>No</th>
                                                <th>PIC</th>
                                                <th>Kode Plant</th>
                                                <th>Nama Depo</th>
                                                <th>Tanggal Dokumen</th>
                                                <th>Tanggal Upload</th>
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
                                        {level === '4' || level === '5' ? (
                                            <tbody>
                                                    {active !== undefined && active.map(x => {
                                                        return (
                                                        <tr className="danger" onClick={() => this.openProses(active.indexOf(x))}>
                                                            <th scope="row">{(active.indexOf(x) + 1)}</th>
                                                            {x.jenis_dokumen == 'monthly' ? (
                                                                <td>{moment(x.createdAt).format('MMMM YYYY')}</td>
                                                            ) : moment(moment(x.createdAt).format('YYYY-MM-DD')).utc().format('dddd') === moment.weekdays(0) ? (
                                                                <td>{moment(x.createdAt).subtract(2, 'day').format('DD MMMM, YYYY')}</td>
                                                            ) : (
                                                                <td>{moment(x.createdAt).subtract(1, 'day').format('DD MMMM, YYYY')}</td>
                                                            )}
                                                            {x.jenis_dokumen == 'monthly' ? (
                                                                <td>{moment(x.createdAt).format('DD MMMM, YYYY')}</td>
                                                            ) : (
                                                                <td>{moment(x.createdAt).format('DD MMMM, YYYY')}</td>
                                                            )}
                                                            {dataDash !== undefined && dataDash.map(y => {
                                                                return (
                                                                <td>
                                                                    {/* {x.doc.length === 0 ? (
                                                                        <AiOutlineMinus className="black" />
                                                                    ):(
                                                                        x.doc.map(item => {
                                                                            return (
                                                                                item.status_dokumen === 1 && item.dokumen === y.nama_dokumen ? (
                                                                                    <BsCircle className="black"/>
                                                                                ) : item.status_dokumen === 2 && item.dokumen === y.nama_dokumen ? (
                                                                                    <BsCircle className="green" />
                                                                                ) : item.status_dokumen === 3 && item.dokumen === y.nama_dokumen ? (
                                                                                    <AiOutlineCheck className="blue"/>
                                                                                ) : item.status_dokumen === 0 && item.dokumen === y.nama_dokumen ? (
                                                                                    <AiOutlineClose className="red" />
                                                                                ) : item.status_dokumen === 4 && item.dokumen === y.nama_dokumen ? (
                                                                                    <MdWatchLater className="red" size={20}/>
                                                                                ) : item.status_dokumen === 5 && item.dokumen === y.nama_dokumen ? (
                                                                                    <MdWatchLater className="red" size={20}/>
                                                                                ) : item.status_dokumen === 6 && item.dokumen === y.nama_dokumen ? (
                                                                                    <MdWatchLater className="red" size={20}/>
                                                                                ) : item.status_dokumen === 7 && item.dokumen === y.nama_dokumen ? (
                                                                                    <BiRevision className="black" size={20}/>
                                                                                ) : (
                                                                                    <AiOutlineMinus className="black" />
                                                                                )
                                                                            )
                                                                        })
                                                                    )} */}
                                                                    {x.doc.length === 0 || x.doc[dataDash.indexOf(y)] === undefined ? (
                                                                            <AiOutlineMinus className="black" />
                                                                        ) : (
                                                                            x.doc[dataDash.indexOf(y)].status_dokumen === 1 ? (
                                                                                <BsCircle className="black"/>
                                                                            ) : x.doc[dataDash.indexOf(y)].status_dokumen === 2 ? (
                                                                                <BsCircle className="green" />
                                                                            ) : x.doc[dataDash.indexOf(y)].status_dokumen === 3 ? (
                                                                                <AiOutlineCheck className="blue"/>
                                                                            ) : x.doc[dataDash.indexOf(y)].status_dokumen === 0 ? (
                                                                                <AiOutlineClose className="red" />
                                                                            ) : x.doc[dataDash.indexOf(y)].status_dokumen === 4 ? (
                                                                                <MdWatchLater className="red" size={20}/>
                                                                            ) : x.doc[dataDash.indexOf(y)].status_dokumen === 5 ? (
                                                                                <MdWatchLater className="red" size={20}/>
                                                                            ) : x.doc[dataDash.indexOf(y)].status_dokumen === 6 ? (
                                                                                <MdWatchLater className="red" size={20}/>
                                                                            ) : x.doc[dataDash.indexOf(y)].status_dokumen === 7 ? (
                                                                                <BiRevision className="black" size={20}/>
                                                                            ) : (
                                                                                <AiOutlineMinus className="black" />
                                                                            )
                                                                        )
                                                                    }
                                                                </td>
                                                                )
                                                            })}
                                                            <td>{dataDash.length}</td>
                                                            {x.doc.length === 0 ? (
                                                                <td>0 %</td>
                                                            ) : (
                                                                <td>{Math.round((x.progress/dataDash.length) * 100)} %</td>
                                                            )}
                                                            {x.doc.length > 0 ? (
                                                                <td>{Math.round((x.progress/dataDash.length) * 100) === 100 ? 'Done' : Math.round((x.doc.length/dataDash.length) * 100) > 0 ? 'Kurang Upload' : ''}</td>
                                                            ):(
                                                                <td>Belum Upload</td>
                                                            )}
                                                        </tr>
                                                        )
                                                    })}
                                            </tbody>
                                        ): level === '6' || level === '3' || level === '2' || level === '1' ? (
                                            <tbody>
                                                    {dataAll !== undefined && dataAll.map(x => {
                                                        return (
                                                        x !== null ? (
                                                        <tr className="danger" onClick={() => this.openProsesPic(dataAll.indexOf(x))}>
                                                            <th scope="row">{(dataAll.indexOf(x) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                                            <td>{x.nama_pic_1}</td>
                                                            <td>{x.kode_plant}</td>
                                                            <td>{x.nama_depo}</td>
                                                            {x.active.length > 0 ? (
                                                                x.active[0].jenis_dokumen === 'monthly' ? 
                                                                <td>{moment(x.active[0].createdAt).subtract(1, 'day').format('MMMM, YYYY')}</td>
                                                                : moment(moment(x.active[0].createdAt).format('YYYY-MM-DD')).utc().format('dddd') === moment.weekdays(0) ?
                                                                    <td>{moment(x.active[0].createdAt).subtract(2, 'day').format('DD MMMM, YYYY')}</td>
                                                                :   <td>{moment(x.active[0].createdAt).subtract(1, 'day').format('DD MMMM, YYYY')}</td>
                                                            ):(
                                                                <td>-</td>
                                                            )}
                                                            {x.active.length > 0 ? (
                                                                <td>{moment(x.active[0].createdAt).format('DD MMMM, YYYY')}</td>
                                                            ):(
                                                                <td>-</td>
                                                            )}
                                                            {x.active.length > 0 ? (
                                                                x.active[0].doc.length > 0 ? (
                                                                    x.active[0].doc.length <= totalDoc.length ? (
                                                                            totalDoc.map(y => {
                                                                                return (
                                                                                    <td>
                                                                                        {x.active[0].doc[y] ? (
                                                                                            x.active[0].doc[y].status_dokumen === 1 && x.active[0].doc[y].status_dokumen !== undefined ? (
                                                                                                <BsCircle className="black"/>
                                                                                            ) : x.active[0].doc[y].status_dokumen === 2 && x.active[0].doc[y].status_dokumen !== undefined ? (
                                                                                                <BsCircle className="green" />
                                                                                            ) : x.active[0].doc[y].status_dokumen === 3 && x.active[0].doc[y].status_dokumen !== undefined ? (
                                                                                                <AiOutlineCheck className="blue"/>
                                                                                            ) : x.active[0].doc[y].status_dokumen === 0 && x.active[0].doc[y].status_dokumen !== undefined ? (
                                                                                                <AiOutlineClose className="red" />
                                                                                            ) : x.active[0].doc[y].status_dokumen === 4 && x.active[0].doc[y].status_dokumen !== undefined ? (
                                                                                                <MdWatchLater className="red" size={20}/>
                                                                                            ) : x.active[0].doc[y].status_dokumen === 5 && x.active[0].doc[y].status_dokumen !== undefined ? (
                                                                                                <MdWatchLater className="red" size={20}/>
                                                                                            ) : x.active[0].doc[y].status_dokumen === 6 && x.active[0].doc[y].status_dokumen !== undefined ? (
                                                                                                <MdWatchLater className="red" size={20}/>
                                                                                            ) : x.active[0].doc[y].status_dokumen === 7 && x.active[0].doc[y].status_dokumen !== undefined ? (
                                                                                                <BiRevision className="black" size={20}/>
                                                                                            ) : (
                                                                                                <div></div>
                                                                                            )
                                                                                        ): (
                                                                                            <AiOutlineMinus className="black" />
                                                                                        )}
                                                                                    </td>
                                                                                )
                                                                            })
                                                                    ) : (
                                                                        x.active[0].doc.map(item => {
                                                                            return (
                                                                                <td>
                                                                                    {item.status_dokumen === 1 ? (
                                                                                        <BsCircle className="black"/>
                                                                                    ) : (
                                                                                        <AiOutlineMinus className="black" />
                                                                                    )}
                                                                                </td>
                                                                            )
                                                                        })
                                                                    )
                                                                ): (
                                                                    totalDoc.map(item => {
                                                                        return (
                                                                            <td><AiOutlineMinus className="black" /></td>
                                                                        )
                                                                    }) 
                                                                )
                                                            ): (
                                                                totalDoc.map(item => {
                                                                    return (
                                                                        <td><AiOutlineMinus className="black" /></td>
                                                                    )
                                                                })
                                                            )}
                                                            <td>{x.dokumen.length}</td>
                                                            {x.active.length > 0 ? (
                                                                <td>{Math.round((x.active[0].progress/x.dokumen.length) * 100)} %</td>
                                                            ):(
                                                                <td>0 %</td>
                                                            )}
                                                            {x.active.length > 0 ? (
                                                                <td>{Math.round((x.active[0].progress/x.dokumen.length) * 100) === 100 ? 'Done' : Math.round((x.active[0].doc.length/x.dokumen.length) * 100) > 0 ? 'Kurang Upload': 'Belum Upload' }</td>
                                                            ):(
                                                                <td>Belum Upload</td>
                                                            )}
                                                        </tr>
                                                        ) : (
                                                            <div></div>
                                                        )
                                                        )
                                                    })}
                                            </tbody>
                                        ): (
                                            <tbody>
                                                <tr className="danger" onClick={this.openModalProses}>
                                                    <th scope="row">1</th>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td><AiOutlineCheck className="blue" /></td>
                                                    <td><AiOutlineCheck className="blue" /></td>
                                                    <td><AiOutlineCheck className="blue" /></td>
                                                    <td><AiOutlineCheck className="blue" /></td>
                                                    <td><AiOutlineCheck className="blue" /></td>
                                                    <td><AiOutlineCheck className="blue" /></td>
                                                    <td><AiOutlineCheck className="blue" /></td>
                                                    <td><AiOutlineCheck className="blue" /></td>
                                                    <td><AiOutlineCheck className="blue" /></td>
                                                    <td><AiOutlineCheck className="blue" /></td>
                                                    <td><AiOutlineCheck className="blue" /></td>
                                                    <td><AiOutlineCheck className="blue" /></td>
                                                    <td><AiOutlineCheck className="blue" /></td>
                                                    <td><AiOutlineCheck className="blue" /></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        )}
                                    </Table>
                                </div>
                                <div>
                                    <div className="infoPage">
                                        <text>Showing {page.currentPage} of {page.pages} pages</text>
                                        {level == '5' || level == '4' ? (
                                        <div className="pageButton">
                                            <button className="btnPrev" color="info" disabled onClick={this.prev}>Prev</button>
                                            <button className="btnPrev" color="info" disabled onClick={this.next}>Next</button>
                                        </div>
                                        ) : (
                                        <div className="pageButton">
                                            <button className="btnPrev" color="info" disabled={page.prevLink === null ? true : false} onClick={this.prev}>Prev</button>
                                            <button className="btnPrev" color="info" disabled={page.nextLink === null ? true : false} onClick={this.next}>Next</button>
                                        </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal isOpen={openModal} size="lg" toggle={this.openModalProses}>
                    <ModalHeader toggle={this.openModalProses}>Proses Dokumen</ModalHeader>
                    {level === '4' || level === '5' ? (
                            <ModalBody>
                            <div className="modal-dashboard">
                            {/* <div className='checall ml-3 mb-4'>
                                <Input
                                addon
                                disabled={true}
                                checked={false}
                                type="checkbox"
                                className='mr-1' />
                                <text>Check All</text>
                            </div> */}
                            {dataDoc !== undefined && dataDoc.map(item => {
                                    return (
                                <div className="secModal">
                                    <div className="col-md-6">
                                        {doc.find(({dokumen}) => dokumen === item) === undefined ? (
                                            <Input
                                            addon
                                            disabled={true}
                                            checked={false}
                                            type="checkbox"
                                            className='mr-1' />
                                        ) : (
                                            <Input
                                            addon
                                            disabled={doc.find(({dokumen}) => dokumen === item).status_dokumen === 1 || doc.find(({dokumen}) => dokumen === item).status_dokumen === 4 || doc.find(({dokumen}) => dokumen === item).status_dokumen === 2 || doc.find(({dokumen}) => dokumen === item).status_dokumen === 7 ? false : true}
                                            checked={listMut.find(element => element === doc.find(({dokumen}) => dokumen === item).id) !== undefined ? true : false}
                                            type="checkbox"
                                            className='mr-1'
                                            onClick={listMut.find(element => element === doc.find(({dokumen}) => dokumen === item).id) === undefined ? () => this.chekApp(doc.find(({dokumen}) => dokumen === item).id) : () => this.chekRej(doc.find(({dokumen}) => dokumen === item).id)}
                                            value={item.no_asset} />
                                        )}
                                        <text>{item}</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                            {doc.find(({dokumen}) => dokumen === item) === undefined ? (
                                                <BsDashCircleFill size={23} className="black" />
                                            ) : doc.find(({dokumen}) => dokumen === item).status_dokumen === 2 ? (
                                                <BsCircle className="green" size={25} />
                                            ) : doc.find(({dokumen}) => dokumen === item).status_dokumen === 3 ? (
                                                <AiOutlineCheck className="blue" size={25}/>
                                            ) : doc.find(({dokumen}) => dokumen === item).status_dokumen === 4 ? (
                                                <MdWatchLater className="red" size={25}/>
                                            ) : doc.find(({dokumen}) => dokumen === item).status_dokumen === 5 ? (
                                                <MdWatchLater className="red" size={25}/>
                                            ) : doc.find(({dokumen}) => dokumen === item).status_dokumen === 6 ? (
                                                <MdWatchLater className="red" size={25}/>
                                            ) : doc.find(({dokumen}) => dokumen === item).status_dokumen === 7 ? (
                                                <BiRevision className="black" size={25}/>
                                            ) : doc.find(({dokumen}) => dokumen === item).status_dokumen === 0 ? (
                                                <AiOutlineClose className="red" size={25}/>
                                            ) : doc.find(({dokumen}) => dokumen === item).status_dokumen === 1 ? (
                                                <BsCircle className="black" size={20} />
                                            ) : (
                                                <div></div>
                                            )}
                                            <AiOutlineFilePdf size={25} className="pdf" />
                                            {doc.find(({dokumen}) => dokumen === item) === undefined ? (
                                            <Input
                                                type="file"
                                                name="file"
                                                accept=".xls,.xlsx,.pdf,.rar,.zip,.7z"
                                                onClick={() => this.setState({detail: dataDash.find(({nama_dokumen}) => nama_dokumen === item)})}
                                                onChange={this.onChangeHandler}
                                            />
                                            ) : 
                                            (
                                            <div>
                                                {/* this.setState({file: doc.find(({dokumen}) => dokumen === item).path, fileName: doc.find(({dokumen}) => dokumen === item)} */}
                                                <a onClick={() => this.showDokumen(doc.find(({dokumen}) => dokumen === item))}>
                                                    {doc.find(({dokumen}) => dokumen === item).dokumen}
                                                </a>
                                                <Input
                                                type="file"
                                                name="file"
                                                disabled={doc.find(({dokumen}) => dokumen === item).status_dokumen === 0 || doc.find(({dokumen}) => dokumen === item).status_dokumen === 6 ? false : true}
                                                accept=".xls,.xlsx,.pdf,.rar,.zip,.7z"
                                                onClick={() => this.setState({detail: doc.find(({dokumen}) => dokumen === item)})}
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
                                    <div className='mr-1 signbtn'><AiOutlineCheck size={20} className="blue" /><text>  Approve</text></div>
                                    <div className='mr-1 signbtn'><AiOutlineClose size={20} className="red" /><text>  Reject</text></div>
                                    <div className='mr-1 signbtn'><BsCircle size={20} className="green" /><text>  Upload</text></div>
                                    <div className='mr-1 signbtn'><BiRevision size={20} className="black" /><text>  Revisi</text></div>
                                    <div className='mr-1 signbtn'><BsDashCircleFill size={20} className="black" /><text>  Empty</text></div>
                                </div>
                                <div className='divfoot'>
                                    <Button className='btndivfoot mr-2' size='sm' color='warning' disabled={listMut.length === 0 ? true : false} onClick={this.sendEmailArea}>Send info email</Button>
                                    <Button className='btndivfoot mr-2' size='sm' color="primary" onClick={this.openModalProses}>Save</Button>
                                    <Button className='btndivfoot ' color="secondary" size='sm' onClick={this.openModalProses}>Cancel</Button>
                                </div>
                            </div>
                    </ModalBody>
                    ) : level === '3' || level === '1' || level === '2' ? (
                        <ModalBody>
                            <div className="modal-dashboard">
                                <div className="col-md-6 mb-3">
                                    {act[0] === undefined || act[0].doc.length === 0 ? (
                                        <Input
                                        addon
                                        disabled={true}
                                        checked={false}
                                        type="checkbox"
                                        className='mr-1' />
                                    ) : (
                                        <Input
                                        addon
                                        disabled={act[0].doc.length === 0 ? true : false}
                                        checked={listMut.length === act[0].doc.length ? true : false}
                                        type="checkbox"
                                        className='mr-1'
                                        onClick={listMut.length === act[0].doc.length ? () => this.chekRej('all') : () => this.chekApp('all')}
                                        value='all' />
                                    )}
                                    <text>Check All</text>
                                </div>
                            {dataDoc !== undefined && dataDoc.map(item => {
                                return (
                                <div className="secModal">
                                    <div className="col-md-6">
                                        {act[0] === undefined || act[0].doc.find(({dokumen}) => dokumen === item) === undefined ? (
                                            <Input
                                            addon
                                            disabled={true}
                                            checked={false}
                                            type="checkbox"
                                            className='mr-1' />
                                        ) : (
                                            <Input
                                            addon
                                            // disabled={(act[0].doc.find(({dokumen}) => dokumen === item).status_dokumen === 1 || act[0].doc.find(({dokumen}) => dokumen === item).status_dokumen === 4 || act[0].doc.find(({dokumen}) => dokumen === item).status_dokumen === 2 || act[0].doc.find(({dokumen}) => dokumen === item).status_dokumen === 7) ? true : false}
                                            disabled={act[0] === undefined || act[0].doc.length === 0 ? true : false}
                                            checked={listMut.find(element => element === act[0].doc.find(({dokumen}) => dokumen === item).id) !== undefined ? true : false}
                                            type="checkbox"
                                            className='mr-1'
                                            onClick={listMut.find(element => element === act[0].doc.find(({dokumen}) => dokumen === item).id) === undefined ? () => this.chekApp(act[0].doc.find(({dokumen}) => dokumen === item).id) : () => this.chekRej(act[0].doc.find(({dokumen}) => dokumen === item).id)}
                                            />
                                        )}
                                        <text>{item}</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                        {act.length > 0 && act[0].doc.length > 0 ? (
                                                act[0].doc.find(({dokumen}) => dokumen === item) === undefined ? (
                                                    <BsDashCircleFill size={23} className="black" />
                                                ) : act[0].doc.find(({dokumen}) => dokumen === item).status_dokumen === 0 ? (
                                                    <AiOutlineClose className="red" size={25} />
                                                ) : act[0].doc.find(({dokumen}) => dokumen === item).status_dokumen === 1 ? (
                                                    <BsCircle className="black" size={25} />
                                                ) : act[0].doc.find(({dokumen}) => dokumen === item).status_dokumen === 2 ? (
                                                    <BsCircle className="green" size={25}/>
                                                ) : act[0].doc.find(({dokumen}) => dokumen === item).status_dokumen === 3 ? (
                                                    <AiOutlineCheck className="blue" size={25}/>
                                                ) : act[0].doc.find(({dokumen}) => dokumen === item).status_dokumen === 4 ? (
                                                    <MdWatchLater className="red" size={25}/>
                                                ) : act[0].doc.find(({dokumen}) => dokumen === item).status_dokumen === 5 ? (
                                                    <MdWatchLater className="red" size={25}/>
                                                ) : act[0].doc.find(({dokumen}) => dokumen === item).status_dokumen === 6 ? (
                                                    <MdWatchLater className="red" size={25}/>
                                                ) : act[0].doc.find(({dokumen}) => dokumen === item).status_dokumen === 7 ? (
                                                    <BiRevision className="black" size={25}/>
                                                ) : (
                                                    <div></div>
                                                )
                                            ): (
                                                <BsDashCircleFill size={23} className="black" />
                                            )}
                                            <AiOutlineFilePdf size={25} className="pdf" />
                                            {act.length > 0 && act[0].doc.length > 0 ? (
                                                <div>
                                                {act[0].doc.find(({dokumen}) => dokumen === item) === undefined ? (
                                                    <div>Belum Upload</div>
                                                    ) : 
                                                    (
                                                    <div>
                                                        {/* this.setState({file: doc.find(({dokumen}) => dokumen === item).path, fileName: doc.find(({dokumen}) => dokumen === item)} */}
                                                    <button className='btnDocIo' onClick={() => this.showDok({path: act[0].doc.find(({dokumen}) => dokumen === item), active: act[0]})}>
                                                        {act[0].doc.find(({dokumen}) => dokumen === item).dokumen}
                                                    </button>
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
                                {/* <div className="statusSymModal">
                                    <div className='mr-1 signbtn'><AiOutlineCheck size={20} className="blue" /><text>  Approve</text></div>
                                    <div className='mr-1 signbtn'><AiOutlineClose size={20} className="red" /><text>  Reject</text></div>
                                    <div className='mr-1 signbtn'><BsCircle size={20} className="green" /><text>  Upload</text></div>
                                    <div className='mr-1 signbtn'><BiRevision size={20} className="black" /><text>  Revisi</text></div>
                                    <div className='mr-1 signbtn'><BsDashCircleFill size={20} className="black" /><text>  Empty</text></div>
                                </div> */}
                                <div className='divfoot1'>
                                    <Button color="danger" className='mr-2' disabled={listMut.length === 0 ? true : false} onClick={this.openModalReject}>Reject</Button>
                                    <Button color="primary" className='mr-2' disabled={listMut.length === 0 ? true : false} onClick={this.openModalApprove}>Approve</Button>
                                    {/* <Button className="btnFootModal" color="primary" onClick={this.openModalProses}>Save</Button> */}
                                    {/* <Button className='btndivfoot' color="secondary" size='sm' onClick={this.openModalProses}>Cancel</Button> */}
                                </div>
                                <div className='divfoot1'>
                                    <Button className='mr-2' color='warning' disabled={listMut.length === 0 ? true : false} onClick={this.sendEmail}>Send info email</Button>
                                    <Button className="mr-2" color='success' disabled={listMut.length === 0 ? true : false} onClick={this.downloadDataAll}>Download</Button>
                                    {/* <Button className="btnFootModal" color="primary" onClick={this.openModalProses}>Save</Button> */}
                                    {/* <Button className='btndivfoot' color="secondary" size='sm' onClick={this.openModalProses}>Cancel</Button> */}
                                </div>
                            </div>
                    </ModalBody>
                    ): (
                        <div></div>
                    )}
                </Modal>
                <Modal isOpen={openPdf} size="xl" toggle={this.openModalPdf} centered={true}>
                    <ModalHeader toggle={this.openModalPdf}>Dokumen</ModalHeader>
                    <ModalBody>
                        <div className="readPdf">
                            <Pdf pdf={REACT_APP_BACKEND_URL + dataShow} />
                        </div>
                        <hr/>
                        <div className="foot">
                            <div>
                                <div>{moment(this.state.date).format('LLL')}</div>
                            </div>
                            {level === '1' || level === '2' || level === '3' ? (
                                <div>
                                    {/* <Button color="danger" className='mr-2' onClick={this.openModalReject}>Reject</Button>
                                    <Button color="primary" onClick={this.openModalApprove}>Approve</Button> */}
                                    <Button color="success" className='mr-2' onClick={() => this.downloadDataPic(this.state.dataDown)}>Download</Button>
                                    <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                                </div>
                            ) : (
                                <div>
                                    <Button color="success" className='mr-2' onClick={() => this.downloadData(this.state.dataDown)}>Download</Button>
                                    <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                                </div>
                            )}
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={openApprove} toggle={this.openModalApprove} centered={true}>
                    <ModalBody>
                        <div className="modalApprove">
                            <div>
                                <text>
                                    Anda yakin untuk approve 
                                    <text className="verif"> {this.state.fileName.dokumen} </text>
                                    pada tanggal
                                    <text className="verif"> {moment().format('LL')}</text> ?
                                </text>
                            </div>
                            <div className="btnApprove">
                                <Button color="primary" onClick={this.approveDokumen}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApprove}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={openReject} toggle={this.openModalReject} centered={true}>
                    <ModalBody>
                    <Formik
                    initialValues={{
                    alasan: "",
                    }}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {this.rejectDokumen(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <div className="modalApprove">
                            <div className="quest">Anda yakin untuk reject {this.state.fileName.dokumen} ?</div>
                            <div className="alasan">
                                <text className="col-md-3">
                                    Pilih Alasan
                                </text>
                                <Input 
                                type="select" 
                                name="select" 
                                className="col-md-9"
                                value={values.alasan}
                                onChange={handleChange('alasan')}
                                onBlur={handleBlur('alasan')}
                                >
                                    <option>-Pilih Alasan-</option>
                                    {dataAlasan.length !== 0 && dataAlasan.map(item => {
                                        return (
                                        <option value={item.alasan} >{item.alasan}</option>
                                        )
                                    })}
                                </Input>
                            </div>
                            {errors.alasan ? (
                                    <text className="txtError">{errors.alasan}</text>
                                ) : null}
                            <div className="btnApprove">
                                <Button color="primary" onClick={handleSubmit}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalReject}>Tidak</Button>
                            </div>
                        </div>
                        )}
                        </Formik>
                    </ModalBody>
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
                <Modal isOpen={this.state.sucupload} toggle={this.sucUpload} size="sm">
                        <ModalBody>
                        {this.state.confirm === 'sucsend' ? (
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                    <div className="sucUpdate green">Berhasil mengirim info email</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'approve' ? (
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                    <div className="sucUpdate green">Berhasil approve dokumen</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'reject' ? (
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                    <div className="sucUpdate green">Berhasil reject dokumen</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'falsend' ? (
                            <div>
                                <div className="cekUpdate">
                                    <AiOutlineClose size={80} className="red" />
                                    <div className="sucUpdate green">Gagal mengirim info email</div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                    <div className="sucUpdate green">Berhasil upload Dokumen</div>
                                </div>
                            </div>
                        )}
                        
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
    sendEmailArea: dashboard.sendEmailArea,
    getAlasan: alasan.getAlasan,
    logout: auth.logout,
    download: dashboard.download,
    nextDashboard: dashboard.nextDashboard,
    updateUploadDokumen: dashboard.updateUploadDokumen,
    getNotifArea: dashboard.getNotifArea,
    getNotif: dashboard.getNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(Dokumen)