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
import divisi from '../redux/actions/divisi'
import depo from '../redux/actions/depo'
import pic from '../redux/actions/pic'
import {connect} from 'react-redux'
import auth from '../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../components/Header";
import MaterialTitlePanel from "../components/material_title_panel";
import SidebarContent from "../components/sidebar_content";
const {REACT_APP_BACKEND_URL} = process.env

const picSchema = Yup.object().shape({
    pic: Yup.string().required(),
    spv: Yup.string().required(),
    divisi: Yup.string().required(),
    nama_depo: Yup.string().required(),
    status: Yup.string().required()
});

class MasterPic extends Component {
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
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 10,
            search: ''
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
        const { page } = this.props.pic
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.pic
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

    DownloadTemplate = () => {
        axios({
            url: `${REACT_APP_BACKEND_URL}/masters/pic.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "pic.xlsx");
            document.body.appendChild(link);
            link.click();
        });
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    DownloadMaster = () => {
        const {link} = this.props.pic
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master pic.xlsx"); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    ExportMaster = () => {
        const token = localStorage.getItem('token')
        this.props.exportMaster(token)
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

    addPic = async (values) => {
        const token = localStorage.getItem("token")
        const destruct = values.nama_depo.split('-')
        const data = {
            pic: values.pic,
            spv: values.spv,
            divisi: values.divisi,
            kode_depo: destruct[0],
            nama_depo: destruct[1],
            status: values.status
        }
        await this.props.addPic(token, data)
        const {isAdd} = this.props.pic
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            this.getDataPic()
            this.openModalAdd()
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

    uploadMaster = async () => {
        const token = localStorage.getItem('token')
        const data = new FormData()
        data.append('master', this.state.fileUpload)
        await this.props.uploadMaster(token, data)
    }

    editPic = async (values,id) => {
        const token = localStorage.getItem("token")
        const destruct = values.nama_depo.split('-')
        const data = {
            pic: values.pic,
            spv: values.spv,
            divisi: values.divisi,
            kode_depo: destruct[0],
            nama_depo: destruct[1],
            status: values.status
        }
        await this.props.updatePic(token, id, data)
        const {isUpdate} = this.props.pic
        if (isUpdate) {
            this.setState({confirm: 'edit'})
            this.openConfirm()
            this.getDataPic()
            this.openModalEdit()
        }
    }

    componentDidUpdate() {
        const {isError, isUpload, isExport} = this.props.pic
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.getDataPic()
             }, 2100)
        }  else if (isExport) {
            this.props.resetError()
            this.DownloadMaster()
        }
    }

    componentDidMount() {
        this.getDataPic()
        this.getDataDepo()
        this.getDataDivisi()
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataPic({limit: 10, search: this.state.search})
        }
    }

    getDataPic = async (value) => {
        const token = localStorage.getItem("token")
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getPic(token, limit, search)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    getDataDepo = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token, 1000, '')
    }

    getDataDivisi = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDivisi(token, 1000, '')
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
        const {dataPic, isGet, alertM, alertMsg, alertUpload, page} = this.props.pic
        const {dataDivisi} = this.props.divisi
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
                                    <div className="titleDashboard col-md-12">Master PIC</div>
                                </div>
                                <div className="secHeadDashboard">
                                    <div>
                                        <text>Show: </text>
                                        <ButtonDropdown className="drop" isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                        <DropdownItem className="item" onClick={() => this.getDataPic({limit: 10, search: ''})}>10</DropdownItem>
                                            <DropdownItem className="item" onClick={() => this.getDataPic({limit: 20, search: ''})}>20</DropdownItem>
                                            <DropdownItem className="item" onClick={() => this.getDataPic({limit: 50, search: ''})}>50</DropdownItem>
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
                                {isGet === false ? (
                                    <div className="tableDashboard">
                                    <Table bordered responsive hover className="tab">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>PIC</th>
                                                <th>SPV</th>
                                                <th>Divisi</th>
                                                <th>Kode Depo</th>
                                                <th>Nama Depo</th>
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
                                <div className="tableDashboard">
                                    <Table bordered responsive hover className="tab">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>PIC</th>
                                                <th>SPV</th>
                                                <th>Divisi</th>
                                                <th>Kode Depo</th>
                                                <th>Nama Depo</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {dataPic.length !== 0 && dataPic.map(item => {
                                                return (
                                                <tr onClick={() => this.openModalEdit(this.setState({detail: item}))}>
                                                    <th scope="row">{(dataPic.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                                    <td>{item.pic}</td>
                                                    <td>{item.spv}</td>
                                                    <td>{item.divisi}</td>
                                                    <td>{item.kode_depo}</td>
                                                    <td>{item.nama_depo}</td>
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
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd}>
                    <ModalHeader toggle={this.openModalAdd}>Add Master PIC</ModalHeader>
                    <Formik
                    initialValues={{
                    pic: "",
                    spv: "",
                    divisi: "",
                    nama_depo: "", 
                    status: ""
                    }}
                    validationSchema={picSchema}
                    onSubmit={(values) => {this.addPic(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <ModalBody>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Nama PIC
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="nama_pic"
                                value={values.pic}
                                onBlur={handleBlur("pic")}
                                onChange={handleChange("pic")}
                                />
                                {errors.pic ? (
                                    <text className="txtError">{errors.pic}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Nama SPV
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="nama_spv" 
                                value={values.spv}
                                onChange={handleChange("spv")}
                                onBlur={handleBlur("spv")}
                                />
                               {errors.spv ? (
                                    <text className="txtError">{errors.spv}</text>
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
                                Nama Depo
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="select"
                                value={values.nama_depo}
                                onChange={handleChange("nama_depo")}
                                onBlur={handleBlur("nama_depo")}
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
                        <hr/>
                        <div className="foot">
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-3" onClick={this.openModalAdd}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit}>
                    <ModalHeader toggle={this.openModalEdit}>Edit Master PIC</ModalHeader>
                    <Formik
                    initialValues={{
                    pic: detail.pic,
                    spv: detail.spv,
                    divisi: detail.divisi,
                    nama_depo: detail.kode_depo + "-" + detail.nama_depo, 
                    status: detail.status
                    }}
                    validationSchema={picSchema}
                    onSubmit={(values) => {this.editPic(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <ModalBody>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Nama PIC
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="nama_pic"
                                value={values.pic}
                                onBlur={handleBlur("pic")}
                                onChange={handleChange("pic")}
                                />
                                {errors.pic ? (
                                    <text className="txtError">{errors.pic}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Nama SPV
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="nama_spv" 
                                value={values.spv}
                                onChange={handleChange("spv")}
                                onBlur={handleBlur("spv")}
                                />
                               {errors.spv ? (
                                    <text className="txtError">{errors.spv}</text>
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
                                Nama Depo
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="select" 
                                name="select"
                                value={values.nama_depo}
                                onChange={handleChange("nama_depo")}
                                onBlur={handleBlur("nama_depo")}
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
                        <hr/>
                        <div className="foot">
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-3" onClick={this.openModalEdit}>Cancel</Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master PIC</ModalHeader>
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
                            <div className="sucUpdate green">Berhasil Memperbarui PIC</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Menambahkan PIC</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Mengupload Master PIC</div>
                            </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.pic.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className="cekUpdate">
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.pic.isUpload ? true: false} size="sm">
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
    pic: state.pic,
    divisi: state.divisi,
    depo: state.depo
})

const mapDispatchToProps = {
    logout: auth.logout,
    addPic: pic.addPic,
    updatePic: pic.updatePic,
    getPic: pic.getPic,
    resetError: pic.resetError,
    getDivisi: divisi.getDivisi,
    getDepo: depo.getDepo,
    uploadMaster: pic.uploadMaster,
    nextPage: pic.nextPage,
    exportMaster: pic.exportMaster
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterPic)
	