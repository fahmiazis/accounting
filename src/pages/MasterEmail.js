import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Spinner, Alert} from 'reactstrap'
import logo from "../assets/img/logo.png"
import {Formik} from 'formik'
import * as Yup from 'yup'
import '../assets/css/style.css'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle} from 'react-icons/ai'
import email from '../redux/actions/email'
import {connect} from 'react-redux'
import auth from '../redux/actions/auth'
import depo from '../redux/actions/depo'
import {default as axios} from 'axios'
import Sidebar from "../components/Header";
import MaterialTitlePanel from "../components/material_title_panel";
import SidebarContent from "../components/sidebar_content";
const {REACT_APP_BACKEND_URL} = process.env

const emailSchema = Yup.object().shape({
    nama_depo: Yup.string().required('must be filled'),
    email_sa_kasir: Yup.string().email().required('must be filled with a valid email'),
    email_bm: Yup.string().email().required('must be filled with a valid email'),
    email_aos: Yup.string().email().required('must be filled with a valid email'),
    email_ho_pic: Yup.string().email().required('must be filled with a valid email'),
    email_grom: Yup.string().email().required('must be filled with a valid email'),
    email_rom: Yup.string().email().required('must be filled with a valid email'),
    email_ho_1: Yup.string().email().required('must be filled with a valid email'),
    email_ho_2: Yup.string().email('must be valid email'),
    email_ho_3: Yup.string().email('must be valid email'),
    email_ho_4: Yup.string().email('must be valid email'),
    tipe: Yup.string().required(),
    status: Yup.string().required()
});

class MasterEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            val: '',
            modalConfirm: false,
            detail: {},
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 10,
            search: ''
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    } 

    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    next = async () => {
        const { page } = this.props.email
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.email
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.prevLink)
    }

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false})
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }
    ExportMaster = () => {
        const token = localStorage.getItem('token')
        this.props.exportMaster(token)
    }

    DownloadTemplate = () => {
        axios({
            url: `${REACT_APP_BACKEND_URL}/masters/email.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "email.xlsx");
            document.body.appendChild(link);
            link.click();
        });
    }

    DownloadMaster = () => {
        const {link} = this.props.email
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master email.xlsx"); //or any other extension
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
        const {detail} = this.state
        if (detail.length !== 0) {
            this.setState({modalAdd: !this.state.modalAdd})   
        } else {
            console.log('Failed')
        }
    }
    openModalEdit = () => {
        this.setState({modalEdit: true})
    }
    closeEdit = () => {
        this.setState({modalEdit: false})
    }
    openModalUpload = () => {
        this.setState({modalUpload: !this.state.modalUpload})
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    componentDidMount () {
        this.getDataEmail()
        this.getDataDepo()
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataEmail({limit: 10, search: this.state.search})
        }
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

    editEmail = async (values, id) => {
        const token = localStorage.getItem('token')
        const destruct = values.nama_depo.split('-')
        const data = {
            kode_plant: destruct[0],
            area: destruct[1],
            email_sa_kasir: values.email_sa_kasir,
            email_aos: values.email_aos,
            email_bm: values.email_bm,
            email_ho_pic: values.email_ho_pic,
            email_grom: values.email_grom,
            email_rom: values.email_rom,
            email_ho_1: values.email_ho_1,
            email_ho_2: values.email_ho_2,
            email_ho_3: values.email_ho_3,
            email_ho_4: values.email_ho_4,
            tipe: values.tipe,
            status: values.status
        }
        await this.props.updateEmail(token, id, data)
        const {isUpdate} = this.props.email
        if (isUpdate) {
            await this.getDataEmail()
            this.setState({confirm: 'edit'})
            this.openConfirm() 
            this.openModalEdit()
        }
    }

    getDataEmail = async (value) => {
        const token = localStorage.getItem('token')
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getEmail(token, limit, search)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    uploadMasterEmail = async () => {
        const token = localStorage.getItem('token')
        const data = new FormData()
        data.append('master', this.state.fileUpload)
        await this.props.uploadMaster(token, data)
    }

    addEmail = async (values) => {
        const token = localStorage.getItem('token')
        const destruct = values.nama_depo.split('-')
        const data = {
            kode_plant: destruct[0],
            area: destruct[1],
            email_sa_kasir: values.email_sa_kasir,
            email_aos: values.email_aos,
            email_bm: values.email_bm,
            email_ho_pic: values.email_ho_pic,
            email_grom: values.email_grom,
            email_rom: values.email_rom,
            email_ho_1: values.email_ho_1,
            email_ho_2: values.email_ho_2,
            email_ho_3: values.email_ho_3,
            email_ho_4: values.email_ho_4,
            tipe: values.tipe,
            status: values.status
        }
        await this.props.addEmail(token, data)
        const { isAdd } = this.props.email
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            await this.getDataEmail()
            this.openModalAdd()
        }
    }

    getDataDepo = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token, 1000, '')
    }

    componentDidUpdate() {
        const {isError, isUpload, isExport} = this.props.email
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.getDataEmail()
             }, 2100)
        } else if (isExport) {
            this.props.resetError()
            this.DownloadMaster()
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
        const {isOpen, dropOpen, dropOpenNum, detail, alert, upload, errMsg} = this.state
        const {dataEmail, isGet, alertMsg, alertM, alertUpload, page} = this.props.email
        const {dataDepo} = this.props.depo
        const level = localStorage.getItem('level')
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
                                <div>{alertUpload !== undefined && alertUpload.map(item => {
                                    return (
                                        item
                                    )
                                })}</div>
                            </Alert>
                            <Alert color="danger" className="alertWrong" isOpen={upload}>
                                <div>{errMsg}</div>
                            </Alert>
                            <div className="bodyDashboard">
                                <div className="headMaster">
                                    <div className="titleDashboard col-md-12">Master Email</div>
                                </div>
                                <div className="secHeadDashboard">
                                    <div>
                                        <text>Show: </text>
                                        <ButtonDropdown className="drop" isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu >
                                            <DropdownItem className="item" onClick={() => this.getDataEmail({limit: 10, search: ''})}>10</DropdownItem>
                                            <DropdownItem className="item" onClick={() => this.getDataEmail({limit: 20, search: ''})}>20</DropdownItem>
                                            <DropdownItem className="item" onClick={() => this.getDataEmail({limit: 50, search: ''})}>50</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                        <text className="textEntries">entries</text>
                                    </div>
                                </div>
                                <div className="secEmail">
                                    <div className="headEmail">
                                        <Button onClick={this.openModalAdd} color="primary" size="lg">Add</Button>
                                        <Button onClick={this.openModalUpload} color="warning" size="lg">Upload</Button>
                                        <Button onClick={this.ExportMaster} color="success" size="lg">Download</Button>
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
                                <div className="tableDashboard">
                                {isGet === false ?
                                (
                                    <div>
                                        <Table bordered responsive hover className="tab">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Kode Plant</th>
                                                    <th>AREA</th>
                                                    <th>Email SA/KASIR</th>
                                                    <th>Email AOS</th>
                                                    <th>Email HO PIC</th>
                                                    <th>Email BM</th>
                                                    <th>Email GROM</th>
                                                    <th>Email ROM</th>
                                                    <th>Email HO 1</th>
                                                    <th>Email HO 2</th>
                                                    <th>Email HO 3</th>
                                                    <th>Email HO 4</th>
                                                    <th>Tipe</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                        </Table>
                                        <div className="spin">
                                            <Spinner type="grow" color="primary"/>
                                            <Spinner type="grow" className="mr-3 ml-3" color="success"/>
                                            <Spinner type="grow" color="warning"/>
                                            <Spinner type="grow" className="mr-3 ml-3" color="danger"/>
                                            <Spinner type="grow" color="info"/>
                                        </div>
                                    </div>
                                ) : (
                                    <Table bordered responsive hover className="tab">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Kode Plant</th>
                                                <th>AREA</th>
                                                <th>Email SA/KASIR</th>
                                                <th>Email AOS</th>
                                                <th>Email HO PIC</th>
                                                <th>Email BM</th>
                                                <th>Email GROM</th>
                                                <th>Email ROM</th>
                                                <th>Email HO 1</th>
                                                <th>Email HO 2</th>
                                                <th>Email HO 3</th>
                                                <th>Email HO 4</th>
                                                <th>Tipe</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        
                                            <tbody>
                                            {dataEmail.length !== 0 && dataEmail.map(item => {
                                            return (
                                            <tr onClick={()=>this.openModalEdit(item.id, this.setState({detail: item}))}>
                                                <th scope="row">{(dataEmail.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                                <td>{item.kode_plant}</td>
                                                <td>{item.area}</td>
                                                <td>{item.email_sa_kasir}</td>
                                                <td>{item.email_aos}</td>
                                                <td>{item.email_ho_pic}</td>
                                                <td>{item.email_bm}</td>
                                                <td>{item.email_grom}</td>
                                                <td>{item.email_rom}</td>
                                                <td>{item.email_ho_1}</td>
                                                <td>{item.email_ho_2}</td>
                                                <td>{item.email_ho_3}</td>
                                                <td>{item.email_ho_4}</td>
                                                <td>{item.tipe}</td>
                                                <td>{item.status}</td>
                                            </tr>
                                            )
                                            })}
                                            </tbody>
                                    </Table>
                                    )}
                                </div>
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
                        <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd}>
                            <ModalHeader toggle={this.openModalAdd}>Add Master Email</ModalHeader>
                            <Formik
                                initialValues={{ nama_depo: '', email_sa_kasir: '', email_bm: '',
                                email_aos:'', email_ho_pic: '', email_grom: '', email_rom: '', email_ho_1: '', email_ho_2: '',
                                email_ho_3: '', email_ho_4: '', tipe: '', status: '' }}
                                validationSchema={emailSchema}
                                onSubmit={(values) => {this.addEmail(values)}}>
                                {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <ModalBody>
                                <div className="addModalDepo">
                                <text className="col-md-3">
                                    Nama Depo
                                </text>
                                <div className="col-md-9">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.nama_depo}
                                    onBlur={handleBlur('nama_depo')}
                                    onChange={handleChange('nama_depo')}
                                    >
                                        <option>-Pilih Depo-</option>
                                        {dataDepo.length !== 0 && dataDepo.map(item => {
                                        return (
                                            <option value={item.kode_plant + '-' + item.nama_depo}>{item.kode_plant + '-' + item.nama_depo}</option>
                                        )
                                    })}
                                    </Input>
                                    {errors.nama_depo ? (
                                        <text className="txtError">{errors.nama_depo}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email SA / KASIR
                                </text>
                                <div className="col-md-9">
                                    <Input 
                                    type="email" 
                                    name="email_sa_kasir"
                                    value={values.email_sa_kasir}
                                    onBlur={handleBlur('email_sa_kasir')}
                                    onChange={handleChange('email_sa_kasir')}
                                    />
                                    {errors.email_sa_kasir ? (
                                        <text className="txtError">{errors.email_sa_kasir}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email AOS
                                </text>
                                <div className="col-md-9">
                                <Input 
                                type="email" 
                                name="email_aos"
                                value={values.email_aos}
                                onBlur={handleBlur('email_aos')}
                                onChange={handleChange('email_aos')}
                                />
                                {errors.email_aos ? (
                                    <text className="txtError">{errors.email_aos}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email HO PIC
                                </text>
                                <div className="col-md-9">
                                <Input 
                                type="email" 
                                name="email_ho_pic" 
                                value={values.email_ho_pic}
                                onBlur={handleBlur('email_ho_pic')}
                                onChange={handleChange('email_ho_pic')}
                                />
                                {errors.email_ho_pic ? (
                                    <text className="txtError">{errors.email_ho_pic}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email BM
                                </text>
                                <div className="col-md-9">
                                <Input 
                                type="email" 
                                name="email_aos" 
                                value={values.email_bm}
                                onBlur={handleBlur('email_bm')}
                                onChange={handleChange('email_bm')}
                                />
                                {errors.email_bm ? (
                                    <text className="txtError">{errors.email_bm}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email GROM
                                </text>
                                <div className="col-md-9">
                                <Input 
                                type="email" 
                                name="email_aos" 
                                value={values.email_grom}
                                onBlur={handleBlur('email_grom')}
                                onChange={handleChange('email_grom')}
                                />
                                {errors.email_grom ? (
                                    <text className="txtError">{errors.email_grom}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email ROM
                                </text>
                                <div className="col-md-9">
                                <Input 
                                type="email" 
                                name="email_aos" 
                                value={values.email_rom}
                                onBlur={handleBlur('email_rom')}
                                onChange={handleChange('email_rom')}
                                />
                                {errors.email_rom ? (
                                    <text className="txtError">{errors.email_rom}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email HO 1
                                </text>
                                <div className="col-md-9">
                                <Input 
                                type="email" 
                                name="email_aos" 
                                value={values.email_ho_1}
                                onBlur={handleBlur('email_ho_1')}
                                onChange={handleChange('email_ho_1')}
                                />
                                {errors.email_ho_1 ? (
                                    <text className="txtError">{errors.email_ho_1}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email HO 2
                                </text>
                                <div className="col-md-9">
                                <Input 
                                type="email" 
                                name="email_aos" 
                                value={values.email_ho_2}
                                onBlur={handleBlur('email_ho_2')}
                                onChange={handleChange('email_ho_2')}
                                />
                                {errors.email_ho_2 ? (
                                    <text className="txtError">{errors.email_ho_2}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email HO 3
                                </text>
                                <div className="col-md-9">
                                <Input 
                                type="email" 
                                name="email_ho_3" 
                                value={values.email_ho_3}
                                onBlur={handleBlur('email_ho_3')}
                                onChange={handleChange('email_ho_3')}
                                />
                                {errors.email_ho_3 ? (
                                    <text className="txtError">{errors.email_ho_3}</text>
                                ) : null}
                                </div>                            
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email HO 4
                                </text>
                                <div className="col-md-9">
                                <Input 
                                type="email" 
                                name="email_ho_4" 
                                value={values.email_ho_4}
                                onBlur={handleBlur('email_ho_4')}
                                onChange={handleChange('email_ho_4')}
                                />
                                {errors.email_ho_4 ? (
                                    <text className="txtError">{errors.email_ho_4}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Tipe
                                </text>
                                <div className="col-md-9">
                                <Input
                                type="select"
                                name="select"
                                value={values.tipe}
                                onBlur={handleBlur('tipe')}
                                onChange={handleChange('tipe')}
                                className="col-md-9">
                                    <option>-Pilih Tipe-</option>
                                    <option value="sa">SA</option>
                                    <option value="kasir">KASIR</option>
                                </Input>
                                {errors.tipe ? (
                                    <text className="txtError">{errors.tipe}</text>
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
                                onBlur={handleBlur('status')}
                                onChange={handleChange('status')}
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
                            <div className="foot">
                                <div></div>
                                <div>
                                    <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                    <Button onClick={this.openModalAdd} className="mr-3">Cancel</Button>
                                </div>
                            </div>
                        </ModalBody>
                        )}
                        </Formik>
                    </Modal>
                        <Modal toggle={this.closeEdit} isOpen={this.state.modalEdit}>
                            <ModalHeader toggle={this.closeEdit}>Edit Master Email</ModalHeader>
                            <Formik
                            initialValues={{
                                nama_depo: detail.kode_plant + "-" + detail.area, 
                                email_sa_kasir: detail.email_sa_kasir,
                                email_bm: detail.email_bm,
                                email_aos: detail.email_aos,
                                email_ho_pic: detail.email_ho_pic,
                                email_grom: detail.email_grom,
                                email_rom: detail.email_rom,
                                email_ho_1: detail.email_ho_1,
                                email_ho_2: detail.email_ho_2,
                                email_ho_3: detail.email_ho_3,
                                email_ho_4: detail.email_ho_4,
                                tipe: detail.tipe,
                                status: detail.status
                            }}
                            validationSchema={emailSchema}
                            onSubmit={(values) => {this.editEmail(values, detail.id)}}>
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                            <ModalBody>
                                <div className="addModalDepo">
                                <text className="col-md-3">
                                    Nama Depo
                                </text>
                                <div className="col-md-9">
                                <Input
                                // defaultValue={detail.kode_plant + "-" + detail.area}
                                type="select" 
                                name="select"
                                value={values.nama_depo}
                                onBlur={handleBlur('nama_depo')}
                                onChange={handleChange('nama_depo')}
                                >
                                    <option>-Pilih Depo-</option>
                                    {dataDepo.length !== 0 && dataDepo.map(item => {
                                        return (
                                            <option value={item.kode_plant + '-' + item.nama_depo}>{item.kode_plant + '-' + item.nama_depo}</option>
                                        )
                                    })}
                                </Input>
                                {errors.nama_depo ? (
                                    <text className="txtError">{errors.nama_depo}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email SA / KASIR
                                </text>
                                <div className="col-md-9">
                                <Input
                                // defaultValue={detail.email_sa_kasir} 
                                type="email" 
                                name="email_sa_kasir" 
                                value={values.email_sa_kasir}
                                onBlur={handleBlur('email_sa_kasir')}
                                onChange={handleChange('email_sa_kasir')}
                                />
                                {errors.email_sa_kasir ? (
                                    <text className="txtError">{errors.email_sa_kasir}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email AOS
                                </text>
                                <div className="col-md-9">
                                <Input 
                                // defaultValue={detail.email_aos}
                                type="email" 
                                name="email_aos" 
                                value={values.email_aos}
                                onBlur={handleBlur('email_aos')}
                                onChange={handleChange('email_aos')}
                                />
                                {errors.email_aos ? (
                                    <text className="txtError">{errors.email_aos}</text>
                                ) : null}
                                </div>                            
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email HO PIC
                                </text>
                                <div className="col-md-9">
                                <Input
                                // defaultValue={detail.email_ho_pic}
                                type="email" 
                                name="email_ho_pic" 
                                value={values.email_ho_pic}
                                onBlur={handleBlur('email_ho_pic')}
                                onChange={handleChange('email_ho_pic')}
                                />
                                {errors.email_ho_pic ? (
                                    <text className="txtError">{errors.email_ho_pic}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email BM
                                </text>
                                <div className="col-md-9">
                                <Input
                                // defaultValue={detail.email_bm}
                                type="email" 
                                name="email_aos" 
                                value={values.email_bm}
                                onBlur={handleBlur('email_bm')}
                                onChange={handleChange('email_bm')}
                                />
                                {errors.email_bm ? (
                                    <text className="txtError">{errors.email_bm}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email GROM
                                </text>
                                <div className="col-md-9">
                                <Input
                                // defaultValue={detail.email_grom}
                                type="email" 
                                name="email_aos" 
                                value={values.email_grom}
                                onBlur={handleBlur('email_grom')}
                                onChange={handleChange('email_grom')}
                                />
                                {errors.email_grom ? (
                                    <text className="txtError">{errors.email_grom}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email ROM
                                </text>
                                <div className="col-md-9">
                                <Input
                                // defaultValue={detail.email_rom}
                                type="email" 
                                name="email_aos" 
                                value={values.email_rom}
                                onBlur={handleBlur('email_rom')}
                                onChange={handleChange('email_rom')}
                                />
                                {errors.email_rom ? (
                                    <text className="txtError">{errors.email_rom}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email HO 1
                                </text>
                                <div className="col-md-9">
                                <Input
                                // defaultValue={detail.email_ho_1}
                                type="email" 
                                name="email_aos" 
                                value={values.email_ho_1}
                                onBlur={handleBlur('email_ho_1')}
                                onChange={handleChange('email_ho_1')}
                                />
                                {errors.email_ho_1 ? (
                                    <text className="txtError">{errors.email_ho_1}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email HO 2
                                </text>
                                <div className="col-md-9">
                                <Input
                                // defaultValue={detail.email_ho_2}
                                type="email" 
                                name="email_aos" 
                                value={values.email_ho_2}
                                onBlur={handleBlur('email_ho_2')}
                                onChange={handleChange('email_ho_2')}
                                />
                                {errors.email_ho_2 ? (
                                    <text className="txtError">{errors.email_ho_2}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email HO 3
                                </text>
                                <div className="col-md-9">
                                <Input
                                // defaultValue={detail.email_ho_3}
                                type="email" 
                                name="email_ho_3" 
                                value={values.email_ho_3}
                                onBlur={handleBlur('email_ho_3')}
                                onChange={handleChange('email_ho_3')}
                                />
                                {errors.email_ho_3 ? (
                                    <text className="txtError">{errors.email_ho_3}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Email HO 4
                                </text>
                                <div className="col-md-9">
                                <Input
                                // defaultValue={detail.email_ho_4}
                                type="email" 
                                name="email_ho_4" 
                                value={values.email_ho_4}
                                onBlur={handleBlur('email_ho_4')}
                                onChange={handleChange('email_ho_4')}
                                />
                                {errors.email_ho_4 ? (
                                    <text className="txtError">{errors.email_ho_4}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Tipe
                                </text>
                                <div className="col-md-9">
                                <Input
                                // defaultValue={detail.tipe}
                                type="select"
                                name="select"
                                value={values.tipe}
                                onBlur={handleBlur('tipe')}
                                onChange={handleChange('tipe')}
                                >
                                    <option>-Pilih Tipe-</option>
                                    <option value="sa">SA</option>
                                    <option value="kasir">KASIR</option>
                                </Input>
                                {errors.tipe ? (
                                    <text className="txtError">{errors.tipe}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-3">
                                    Status
                                </text>
                                <div className="col-md-9">
                                <Input
                                // defaultValue={detail.status}
                                type="select"
                                name="select"
                                value={values.status}
                                onBlur={handleBlur('status')}
                                onChange={handleChange('status')}
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
                            <div className="foot">
                                <div></div>
                                <div>
                                    <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                    <Button onClick={this.closeEdit} className="mr-3">Cancel</Button>
                                </div>
                            </div>
                        </ModalBody>
                        )}
                        </Formik>
                    </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master Email</ModalHeader>
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
                            <Button color="primary" disabled={this.state.fileUpload === "" ? true : false } onClick={this.uploadMasterEmail}>Upload</Button>
                            <Button onClick={this.openModalUpload}>Cancel</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                    <ModalBody>
                        {this.state.confirm === 'edit' ? (
                        <div className="cekUpdate">
                            <AiFillCheckCircle size={80} className="green" />
                            <div className="sucUpdate green">Berhasil Memperbarui User</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Menambahkan User</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Mengupload Master User</div>
                            </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.email.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className="cekUpdate">
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.email.isUpload ? true: false} size="sm">
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
    email: state.email,
    auth: state.auth,
    depo: state.depo
})

const mapDispatchToProps = {
    logout: auth.logout,
    addEmail: email.addEmail,
    updateEmail: email.updateEmail,
    getEmail: email.getEmail,
    getDetailEmail: email.getDetailEmail,
    resetError: email.resetError,
    uploadMaster: email.uploadMaster,
    nextPage: email.nextPage,
    getDepo: depo.getDepo,
    exportMaster: email.exportMaster
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterEmail)
	