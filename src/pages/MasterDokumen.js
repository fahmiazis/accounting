import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Spinner} from 'reactstrap'
import logo from "../assets/img/logo.png"
import '../assets/css/style.css'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import dokumen from '../redux/actions/dokumen'
import divisi from '../redux/actions/divisi'
import depo from '../redux/actions/depo'
import {connect} from 'react-redux'
import moment from 'moment'
import auth from '../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../components/Header";
import MaterialTitlePanel from "../components/material_title_panel";
import SidebarContent from "../components/sidebar_content";
const {REACT_APP_BACKEND_URL} = process.env

const dokumenSchema = Yup.object().shape({
    nama_dokumen: Yup.string().required(),
    jenis_dokumen: Yup.string().required(),
    divisi: Yup.string().required(),
    uploadedBy: Yup.string().required(),
    status_depo: Yup.string().required(),
    status: Yup.string().required(),
});

class MasterDokumen extends Component {
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
            alert: false,
            confirm: "",
            isOpen: false,
            dropOpen: false,
            dropOpenNum: false,
            value: '',
            onChange: new Date(),
            sidebarOpen: false,
            modalAdd: false,
            modalEdit: false,
            modalUpload: false,
            modalDownload: false,
            modalConfirm: false,
            detail: {},
            dataDivisi: [],
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 10,
            search: '',
            listDepo: []
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    next = async () => {
        const { page } = this.props.dokumen
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.dokumen
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.prevLink)
    }

    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    DownloadTemplate = () => {
        axios({
            url: `${REACT_APP_BACKEND_URL}/masters/dokumen.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "dokumen.xlsx");
            document.body.appendChild(link);
            link.click();
        });
    }

    dropDown = () => {
        this.setState({dropOpen: !this.state.dropOpen})
    }
    dropOpen = () => {
        this.setState({dropOpenNum: !this.state.dropOpenNum})
    }
    onSetSidebarOpen = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
    }
    openModalAdd = () => {
        this.setState({modalAdd: !this.state.modalAdd})
    }
    openModalEdit = () => {
        this.setState({modalEdit: !this.state.modalEdit})
    }
    openModalUpload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }
    openModalDownload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }

    addDokumen = async (values) => {
        const token = localStorage.getItem("token")
        const {listDepo} = this.state
        const data = {
            ...values,
            access: listDepo.toString()
        }
        await this.props.addDokumen(token, data)
        const {isAdd} = this.props.dokumen
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            this.openModalAdd()
            setTimeout(() => {
                this.getDataDokumen()
            }, 500)
        }
    }

    prosesAdd = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token, 1000, '')
        this.openModalAdd()
    }

    prosesEdit = async (val) => {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token, 1000, '')
        const arrdep = val.access !== null ? val.access.split(',') : []
        this.setState({detail: val, listDepo: arrdep})
        this.openModalEdit()
    }

    DownloadMaster = () => {
        const {link} = this.props.dokumen
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master dokumen.xlsx"); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    ExportMaster = () => {
        const token = localStorage.getItem('token')
        this.props.exportMaster(token)
    }

    onChangeHandler = e => {
        const {size, type} = e.target.files[0]
        if (size >= 5120000) {
            this.setState({errMsg: "Maximum upload size 5 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' ){
            this.setState({errMsg: 'Invalid file type. Only excel files are allowed.'})
            this.uploadAlert()
        } else {
            this.setState({fileUpload: e.target.files[0]})
        }
    }

    uploadMaster = async () => {
        const token = localStorage.getItem('token')
        const data = new FormData()
        data.append('master', this.state.fileUpload)
        await this.props.uploadMaster(token, data)
    }

    editDokumen = async (values, id) => {
        const token = localStorage.getItem("token")
        const {listDepo} = this.state
        const data = {
            ...values,
            access: listDepo.toString()
        }
        await this.props.updateDokumen(token, id, data)
        const {isUpdate} = this.props.dokumen
        if (isUpdate) {
            this.setState({confirm: 'edit'})
            this.openConfirm()
            this.openModalEdit()
            setTimeout(() => {
                this.getDataDokumen()
            }, 700)
        }
    }

    componentDidUpdate() {
        const {isError, isUpload, isExport} = this.props.dokumen
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.getDataDokumen()
             }, 2100)
        } else if (isExport) {
            this.props.resetError()
            this.DownloadMaster()
        }
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataDokumen({limit: 10, search: this.state.search})
        }
    }

    async componentDidMount() {
        const token = localStorage.getItem("token")
        this.getDataDokumen()
        this.getDataDivisi()
    }

    getDataDokumen = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.dokumen
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getDokumen(token, limit, search, page.currentPage)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    getDataDivisi = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDivisi(token, 100, '')
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    checkDepApp = (val) => {
        const { listDepo } = this.state
        const { dataDepo } = this.props.depo
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataDepo.length; i++) {
                data.push(dataDepo[i].kode_plant)
            }
            this.setState({listDepo: data})
        } else {
            listDepo.push(val)
            this.setState({listDepo: listDepo})
        }
    }

    checkDepRej = (val) => {
        const { listDepo } = this.state
        if (val === 'all') {
            const data = []
            this.setState({listDepo: data})
        } else {
            const data = []
            for (let i = 0; i < listDepo.length; i++) {
                if (listDepo[i] === val) {
                    data.push()
                } else {
                    data.push(listDepo[i])
                }
            }
            this.setState({listDepo: data})
        }
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, alert, upload, errMsg, listDepo} = this.state
        const {dataDokumen, isGet, alertM, alertMsg, alertUpload, page} = this.props.dokumen
        const {dataDivisi} = this.props.divisi
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataDepo} = this.props.depo

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
                            <Alert color="danger" className="alertWrong" isOpen={alert}>
                                <div>{alertMsg}</div>
                                <div>{alertM}</div>
                                {alertUpload !== undefined && alertUpload.map(item => {
                                    return (
                                        <div>{item}</div>
                                    )
                                })}
                            </Alert>
                            <Alert color="danger" className="alertWrong" isOpen={upload}>
                                <div>{errMsg}</div>
                            </Alert>
                            <div className="bodyDashboard">
                                <div className="headMaster">
                                    <div className="titleDashboard col-md-12">Master Dokumen</div>
                                </div>
                                <div className="secHeadDashboard">
                                    <div>
                                        <text>Show: </text>
                                        <ButtonDropdown className="drop" isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                        <DropdownItem className="item" onClick={() => this.getDataDokumen({limit: 10, search: ''})}>10</DropdownItem>
                                            <DropdownItem className="item" onClick={() => this.getDataDokumen({limit: 20, search: ''})}>20</DropdownItem>
                                            <DropdownItem className="item" onClick={() => this.getDataDokumen({limit: 50, search: ''})}>50</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                        <text className="textEntries">entries</text>
                                    </div>
                                </div>
                                <div className="secEmail mt-4">
                                    <div className="headEmail1">
                                        <Button onClick={this.prosesAdd} color="primary" size="lg">Add</Button>
                                        <Button onClick={this.openModalUpload} className='ml-2' color="warning" size="lg">Upload</Button>
                                        <Button onClick={this.ExportMaster} className='ml-2' color="success" size="lg">Download</Button>
                                    </div>
                                    <div className="searchEmail">
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
                                {isGet === false ? (
                                    <div className="tableDashboard">
                                    <Table bordered responsive hover className="tab">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Nama Dokumen</th>
                                                <th>Jenis</th>
                                                <th>Divisi</th>
                                                <th>Status Depo</th>
                                                <th>Create Date</th>
                                                <th>Hak akses</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                    </Table>
                                    </div>                    
                                ) : (
                                    <div className="tableDashboard">
                                    <Table bordered responsive hover className="tab">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Nama Dokumen</th>
                                                <th>Jenis</th>
                                                <th>Divisi</th>
                                                <th>Status Depo</th>
                                                <th>Diupload oleh</th>
                                                <th>Create Date</th>
                                                <th>Hak akses</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {dataDokumen.length !== 0 && dataDokumen.map(item => {
                                                return (
                                            <tr onClick={() => this.prosesEdit(item)}>
                                                <th scope="row">{(dataDokumen.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                                <td>{item.nama_dokumen}</td>
                                                <td>{item.jenis_dokumen}</td>
                                                <td>{item.divisi}</td>
                                                <td>{item.status_depo}</td>
                                                <td>{item.uploadedBy}</td>
                                                <td>{moment(item.createdAt).format('DD MMMM, YYYY')}</td>
                                                <td>{item.access !== null && item.access.split(',').length > 0 
                                                    ? item.access.slice(0, 20) + `...(${item.access.split(',').length} area lainnya)`
                                                    : item.access}
                                                </td>
                                                <td>{item.status}</td>
                                            </tr>
                                                )})}
                                        </tbody>
                                    </Table>
                                    </div>
                                )}
                                <div>
                                    <div className="infoPageEmail">
                                        <text>Showing {page.currentPage} of {page.pages} pages</text>
                                        <div className="pageButton">
                                            <button className="btnPrev" color="info" disabled={page.prevLink === null ? true : false} onClick={this.prev}>Prev</button>
                                            <button className="btnPrev" color="info" disabled={page.nextLink === null ? true : false} onClick={this.next}>Next</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd} size="lg">
                    <ModalHeader toggle={this.openModalAdd}>Add Master Dokumen</ModalHeader>
                    <Formik
                    initialValues={{
                        nama_dokumen: "", 
                        jenis_dokumen: "",
                        divisi: "",
                        status_depo: "",
                        uploadedBy: "",
                        status: ""
                    }}
                    validationSchema={dokumenSchema}
                    onSubmit={(values) => {this.addDokumen(values)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Nama Dokumen
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="textarea" 
                                name="nama_pic"
                                value={values.nama_dokumen}
                                onChange={handleChange("nama_dokumen")}
                                onBlur={handleBlur("nama_dokumen")}
                                />
                                {errors.nama_dokumen ? (
                                    <text className="txtError">{errors.nama_dokumen}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Jenis Dokumen
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="select"
                                value={values.jenis_dokumen}
                                onChange={handleChange("jenis_dokumen")}
                                onBlur={handleBlur("jenis_dokumen")}
                                >
                                    <option>-Pilih Jenis Dokumen-</option>
                                    <option value="daily">Daily</option>
                                    <option value="monthly">Monthly</option>
                                </Input>
                                {errors.jenis_dokumen ? (
                                        <text className="txtError">{errors.jenis_dokumen}</text>
                                    ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Divisi
                            </text>
                            <div className="col-md-9">
                                <Input
                                type="select" 
                                name="select"
                                value={values.divisi}
                                onChange={handleChange("divisi")}
                                onBlur={handleBlur("divisi")}
                                >
                                    <option>-Pilih Divisi-</option>
                                    {dataDivisi.length !== 0 && dataDivisi.map(item =>{
                                        return (
                                        <option value={item.divisi}>{item.divisi}</option>
                                        )
                                    })}
                                </Input>
                                {errors.divisi ? (
                                    <text className="txtError">{errors.divisi}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Status Depo
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="select"
                                value={values.status_depo}
                                onChange={handleChange("status_depo")}
                                onBlur={handleBlur("status_depo")}
                                >
                                    <option>-Pilih Status Depo-</option>
                                    <option value="Cabang SAP">Cabang SAP</option>
                                    <option value="Cabang Scylla">Cabang Scylla</option>
                                    <option value="Depo SAP">Depo SAP</option>
                                    <option value="Depo Scylla">Depo Scylla</option>
                                </Input>
                                {errors.status_depo ? (
                                    <text className="txtError">{errors.status_depo}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Diupload oleh
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select"
                                name="select"
                                value={values.uploadedBy}
                                onChange={handleChange("uploadedBy")}
                                onBlur={handleBlur("uploadedBy")}
                                >
                                    <option>-Pilih-</option>
                                    <option value="sa">SA</option>
                                    <option value="kasir">Kasir</option>
                                </Input>
                                {errors.uploadedBy ? (
                                    <text className="txtError">{errors.uploadedBy}</text>
                                ) : null}
                            </div>
                        </div>

                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Status
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select"
                                name="select"
                                value={values.status}
                                onChange={handleChange("status")}
                                onBlur={handleBlur("status")}
                                >   
                                    <option>-Pilih Status-</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Input>
                                {errors.status ? (
                                    <text className="txtError">{errors.status}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalMenu">
                            <text className="col-md-3">
                                Hak akses
                            </text>
                            <div className="col-md-9 listcek">
                                <div className='listcek mr-2'>
                                    <Input 
                                    type="checkbox" 
                                    name="access"
                                    className='ml-1'
                                    checked={listDepo.length === 0 ? false : listDepo.length === dataDepo.length ? true : false}
                                    onChange={() => listDepo.length === dataDepo.length ? this.checkDepRej('all') : this.checkDepApp('all')}
                                    />
                                    <text className='ml-4'>all</text>
                                </div>
                                {dataDepo.length > 0 && dataDepo.map(item => {
                                    return (
                                        <div className='listcek mr-2'>
                                            <Input 
                                            type="checkbox" 
                                            name="access"
                                            checked={listDepo.find(element => element === item.kode_plant) !== undefined ? true : false}
                                            className='ml-1'
                                            onChange={listDepo.find(element => element === item.kode_plant) === undefined ? () => this.checkDepApp(item.kode_plant) : () => this.checkDepRej(item.kode_plant)}
                                            />
                                            <text className='ml-4'>{item.nama_depo}</text>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <hr/>
                        <div className="foot">
                            <div></div>
                            <div>
                                <Button 
                                className="mr-2" 
                                onClick={handleSubmit} 
                                color="primary" 
                                disabled={listDepo.length === 0 ? true : false}
                                >
                                    Save
                                </Button>
                                <Button className="mr-3" onClick={this.openModalAdd}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit} size="lg">
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Dokumen</ModalHeader>
                    <Formik
                    initialValues={{
                        nama_dokumen: detail.nama_dokumen, 
                        jenis_dokumen: detail.jenis_dokumen,
                        divisi: detail.divisi,
                        status_depo: detail.status_depo,
                        uploadedBy: detail.uploadedBy,
                        createdAt: detail.createdAt,
                        status: detail.status
                    }}
                    validationSchema={dokumenSchema}
                    onSubmit={(values) => {this.editDokumen(values, detail.id)}}
                    >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <ModalBody>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Nama Dokumen
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="textarea" 
                                name="nama_pic"
                                value={values.nama_dokumen}
                                onChange={handleChange("nama_dokumen")}
                                onBlur={handleBlur("nama_dokumen")}
                                />
                                {errors.nama_dokumen ? (
                                    <text className="txtError">{errors.nama_dokumen}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Jenis Dokumen
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="select"
                                value={values.jenis_dokumen}
                                onChange={handleChange("jenis_dokumen")}
                                onBlur={handleBlur("jenis_dokumen")}
                                >
                                    <option>-Pilih Jenis Dokumen-</option>
                                    <option value="daily">Daily</option>
                                    <option value="monthly">Monthly</option>
                                </Input>
                                {errors.jenis_dokumen ? (
                                        <text className="txtError">{errors.jenis_dokumen}</text>
                                    ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Divisi
                            </text>
                            <div className="col-md-9">
                                <Input
                                type="select" 
                                name="select"
                                value={values.divisi}
                                onChange={handleChange("divisi")}
                                onBlur={handleBlur("divisi")}
                                >
                                    <option>-Pilih Divisi-</option>
                                    {dataDivisi.length !== 0 && dataDivisi.map(item =>{
                                        return (
                                        <option value={item.divisi}>{item.divisi}</option>
                                        )
                                    })}
                                </Input>
                                {errors.divisi ? (
                                    <text className="txtError">{errors.divisi}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Status Depo
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="select"
                                value={values.status_depo}
                                onChange={handleChange("status_depo")}
                                onBlur={handleBlur("status_depo")}
                                >
                                    <option>-Pilih Status Depo-</option>
                                    <option value="Cabang SAP">Cabang SAP</option>
                                    <option value="Cabang Scylla">Cabang Scylla</option>
                                    <option value="Depo SAP">Depo SAP</option>
                                    <option value="Depo Scylla">Depo Scylla</option>
                                </Input>
                                {errors.status_depo ? (
                                    <text className="txtError">{errors.status_depo}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Diupload oleh
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select"
                                name="select"
                                value={values.uploadedBy}
                                onChange={handleChange("uploadedBy")}
                                onBlur={handleBlur("uploadedBy")}
                                >
                                    <option>-Pilih-</option>
                                    <option value="sa">SA</option>
                                    <option value="kasir">Kasir</option>
                                </Input>
                                {errors.uploadedBy ? (
                                    <text className="txtError">{errors.uploadedBy}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Create Date
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="date"
                                name="createdAt"
                                value={moment(values.createdAt).format('YYYY-MM-DD')}
                                disabled
                                onChange={handleChange('createdAt')}
                                onBlur={handleBlur('createdAt')}
                                />
                                {errors.createdAt ? (
                                    <text className="txtError">{errors.createdAt}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Status
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select"
                                name="select"
                                value={values.status}
                                onChange={handleChange("status")}
                                onBlur={handleBlur("status")}
                                >   
                                    <option>-Pilih Status-</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </Input>
                                {errors.status ? (
                                    <text className="txtError">{errors.status}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalMenu">
                            <text className="col-md-3">
                                Hak akses
                            </text>
                            <div className="col-md-9 listcek">
                                <div className='listcek mr-2'>
                                    <Input 
                                    type="checkbox" 
                                    name="access"
                                    className='ml-1'
                                    checked={listDepo.length === 0 ? false : listDepo.length === dataDepo.length ? true : false}
                                    onChange={() => listDepo.length === dataDepo.length ? this.checkDepRej('all') : this.checkDepApp('all')}
                                    />
                                    <text className='ml-4'>all</text>
                                </div>
                                {dataDepo.length > 0 && dataDepo.map(item => {
                                    return (
                                        <div className='listcek mr-2'>
                                            <Input 
                                            type="checkbox" 
                                            name="access"
                                            checked={listDepo.find(element => element === item.kode_plant) !== undefined ? true : false}
                                            className='ml-1'
                                            onChange={listDepo.find(element => element === item.kode_plant) === undefined ? () => this.checkDepApp(item.kode_plant) : () => this.checkDepRej(item.kode_plant)}
                                            />
                                            <text className='ml-4'>{item.nama_depo}</text>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <hr/>
                        <div className="foot">
                            <div></div>
                            <div>
                                <Button 
                                className="mr-2" 
                                onClick={handleSubmit} 
                                color="primary"
                                disabled={listDepo.length === 0 ? true : false}
                                >
                                    Save
                                </Button>
                                <Button className="mr-5" onClick={this.openModalEdit}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                    )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master Dokumen</ModalHeader>
                    <ModalBody className="modalUpload">
                        <div className="titleModalUpload">
                            <text>Upload File: </text>
                            <div className="uploadFileInput ml-4">
                                <AiOutlineFileExcel size={35} />
                                <div className="ml-3">
                                    <Input
                                    type="file"
                                    name="file"
                                    accept=".xls,.xlsx"
                                    onChange={this.onChangeHandler}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="btnUpload">
                            <Button color="info" onClick={this.DownloadTemplate}>Download Template</Button>
                            <Button color="primary" disabled={this.state.fileUpload === "" ? true : false } onClick={this.uploadMaster}>Upload</Button>
                            <Button onClick={this.openModalUpload}>Cancel</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                    <ModalBody>
                        {this.state.confirm === 'edit' ? (
                        <div className="cekUpdate">
                            <AiFillCheckCircle size={80} className="green" />
                            <div className="sucUpdate green">Berhasil Update Dokumen</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Menambah Dokumen</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Mengupload Master Dokumen</div>
                            </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.dokumen.isLoading || this.props.depo.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className="cekUpdate">
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.dokumen.isUpload ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className="cekUpdate">
                                <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Mengupload Master</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    dokumen: state.dokumen,
    divisi: state.divisi,
    depo: state.depo
})

const mapDispatchToProps = {
    logout: auth.logout,
    addDokumen: dokumen.addDokumen,
    updateDokumen: dokumen.updateDokumen,
    getDokumen: dokumen.getDokumen,
    resetError: dokumen.resetError,
    getDivisi: divisi.getDivisi,
    uploadMaster: dokumen.uploadMaster,
    nextPage: dokumen.nextPage,
    exportMaster: dokumen.exportMaster,
    getDepo: depo.getDepo,
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterDokumen)
