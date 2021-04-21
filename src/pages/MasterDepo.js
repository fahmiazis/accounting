import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Spinner} from 'reactstrap'
import logo from "../assets/img/logo.png"
import '../assets/css/style.css'
import {FaSearch} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import depo from '../redux/actions/depo'
import {connect} from 'react-redux'
import auth from '../redux/actions/auth'

const depoSchema = Yup.object().shape({
    kode_depo: Yup.string().required(),
    nama_depo: Yup.string().required('must be filled'),
    home_town: Yup.string().required('must be filled'),
    channel: Yup.string().required('must be filled'),
    distribution: Yup.string().required('must be filled'),
    status_depo: Yup.string().required('must be filled'),
    profit_center: Yup.string().required('must be filled'),
    kode_sap_1: Yup.string().required('must be filled'),
    kode_sap_2: Yup.string().required('must be filled'),
    kode_plant: Yup.string().required('must be filled'),
    nama_grom: Yup.string().required('must be filled'),
    nama_bm: Yup.string().required('must be filled'),
    nama_ass: Yup.string(),
    nama_pic_1: Yup.string(),
    nama_pic_2: Yup.string(),
    nama_pic_3: Yup.string(),
    nama_pic_4: Yup.string()
});

class MasterDepo extends Component {
    state = {
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

    next = async () => {
        const { page } = this.props.depo
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.depo
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.prevLink)
    }

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
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

    addDepo = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addDepo(token, values)
        const {isAdd} = this.props.depo
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            this.openModalAdd()
            setTimeout(() => {
                this.getDataDepo()
            }, 500)
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

    editDepo = async (values, id) => {
        const token = localStorage.getItem("token")
        await this.props.updateDepo(token, id, values)
        const {isUpdate} = this.props.depo
        if (isUpdate) {
            this.setState({confirm: 'edit'})
            this.openConfirm()
            this.getDataDepo()
            this.openModalEdit()
        }
    }

    componentDidUpdate() {
        const {isError, isUpload} = this.props.depo
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.getDataDepo()
             }, 2100)
        }
    }

    componentDidMount() {
        this.getDataDepo()
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataDepo({limit: 10, search: this.state.search})
        }
    }

    getDataDepo = async (value) => {
        const token = localStorage.getItem("token")
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getDepo(token, limit, search)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, alert, upload, errMsg} = this.state
        const {dataDepo, isGet, alertM, alertMsg, alertUpload, page} = this.props.depo
        const level = localStorage.getItem('level')
        return (
            <>
                <Navbar color="light" light expand="md" className="navbar">
                    <NavbarBrand href="/"><img src={logo} alt="logo" className="logo" /></NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="/" className="navHome">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/dashboard" className="navDoc">Dashboard</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/dokumen" className="navDoc">Document</NavLink>
                            </NavItem>
                            {level === "1" ? (
                            <Dropdown nav isOpen={dropOpenNum} toggle={this.dropOpen}>
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
                        </Nav>
                        <UncontrolledDropdown>
                            <DropdownToggle nav caret>Super Admin</DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem onClick={() => this.props.logout()}>Log Out</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Collapse>
                </Navbar>
                <Container fluid={true} className="background-logo">
                    <Alert color="danger" className="alertWrong" isOpen={this.state.alert}>
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
                            <div className="titleDashboard col-md-12">Master Depo</div>
                        </div>
                        <div className="secHeadDashboard">
                            <div>
                                <text>Show: </text>
                                <ButtonDropdown className="drop" isOpen={dropOpen} toggle={this.dropDown}>
                                <DropdownToggle caret color="light">
                                    {this.state.limit}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem className="item" onClick={() => this.getDataDepo({limit: 10, search: ''})}>10</DropdownItem>
                                    <DropdownItem className="item" onClick={() => this.getDataDepo({limit: 20, search: ''})}>20</DropdownItem>
                                    <DropdownItem className="item" onClick={() => this.getDataDepo({limit: 50, search: ''})}>50</DropdownItem>
                                </DropdownMenu>
                                </ButtonDropdown>
                                <text className="textEntries">entries</text>
                            </div>
                        </div>
                        <div className="secEmail">
                            <div className="headEmail">
                                <Button onClick={this.openModalAdd} color="primary" size="lg">Add</Button>
                                <Button onClick={this.openModalUpload} color="warning" size="lg">Upload</Button>
                                <Button color="success" size="lg">Download</Button>
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
                                        <th>Kode Depo</th>
                                        <th>Nama Depo</th>
                                        <th>Home Town</th>
                                        <th>Channel</th>
                                        <th>Distribution</th>
                                        <th>Status Depo</th>
                                        <th>Profit Center</th>
                                        <th>Kode PLANT</th>
                                        <th>Kode SAP 1</th>
                                        <th>Kode SAP 2</th>
                                        <th>Nama GROM</th>
                                        <th>Nama BM</th>
                                        <th>Nama ASS</th>
                                        <th>Nama PIC 1</th>
                                        <th>Nama PIC 2</th>
                                        <th>Nama PIC 3</th>
                                        <th>Nama PIC 4</th>
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
                                        <th>Kode Depo</th>
                                        <th>Nama Depo</th>
                                        <th>Home Town</th>
                                        <th>Channel</th>
                                        <th>Distribution</th>
                                        <th>Status Depo</th>
                                        <th>Profit Center</th>
                                        <th>Kode PLANT</th>
                                        <th>Kode SAP 1</th>
                                        <th>Kode SAP 2</th>
                                        <th>Nama GROM</th>
                                        <th>Nama BM</th>
                                        <th>Nama ASS</th>
                                        <th>Nama PIC 1</th>
                                        <th>Nama PIC 2</th>
                                        <th>Nama PIC 3</th>
                                        <th>Nama PIC 4</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataDepo.length !== 0 && dataDepo.map(item => {
                                        return (
                                        <tr onClick={() => this.openModalEdit(this.setState({detail: item}))}>
                                            <th scope="row">{(dataDepo.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                            <td>{item.kode_depo}</td>
                                            <td>{item.nama_depo}</td>
                                            <td>{item.home_town}</td>
                                            <td>{item.channel}</td>
                                            <td>{item.distribution}</td>
                                            <td>{item.status_depo}</td>
                                            <td>{item.profit_center}</td>
                                            <td>{item.kode_plant}</td>
                                            <td>{item.kode_sap_1}</td>
                                            <td>{item.kode_sap_2}</td>
                                            <td>{item.nama_grom}</td>
                                            <td>{item.nama_bm}</td>
                                            <td>{item.nama_ass}</td>
                                            <td>{item.nama_pic_1}</td>
                                            <td>{item.nama_pic_2}</td>
                                            <td>{item.nama_pic_3}</td>
                                            <td>{item.nama_pic_4}</td>
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
                </Container>
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd} size="lg">
                    <ModalHeader toggle={this.openModalAdd}>Add Master Depo</ModalHeader>
                    <Formik
                    initialValues={{
                        kode_depo: "",
                        nama_depo: "",
                        home_town: "",
                        channel: "",
                        distribution: "",
                        status_depo: "",
                        profit_center: "",
                        kode_sap_1: "",
                        kode_sap_2: "",
                        kode_plant: "",
                        nama_grom: "",
                        nama_bm: "",
                        nama_ass: "",
                        nama_pic_1: "",
                        nama_pic_2: "",
                        nama_pic_3: "",
                        nama_pic_4: ""
                    }}
                    validationSchema={depoSchema}
                    onSubmit={(values) => {this.addDepo(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                    <div className="bodyDepo">
                    <ModalBody className="addDepo">
                        <div className="col-md-6">
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode Depo
                                </text>
                                <div className="col-md-8">
                                    <Input
                                    type="text" 
                                    name="kode_depo"
                                    value={values.kode_depo}
                                    onBlur={handleBlur("kode_depo")}
                                    onChange={handleChange("kode_depo")}
                                    />
                                    {errors.kode_depo ? (
                                        <text className="txtError">{errors.kode_depo}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama Depo
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_depo"
                                value={values.nama_depo}
                                onBlur={handleBlur("nama_depo")}
                                onChange={handleChange("nama_depo")}
                                />
                                {errors.nama_depo ? (
                                    <text className="txtError">{errors.nama_depo}</text>
                                ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Home Town
                                </text>
                                <div className="col-md-8">
                                    <Input
                                    type="text" 
                                    name="home_town"
                                    value={values.home_town}
                                    onBlur={handleBlur("home_town")}
                                    onChange={handleChange("home_town")}
                                    />
                                    {errors.home_town ? (
                                        <text className="txtError">{errors.home_town}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Channel
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.channel}
                                    onChange={handleChange("channel")}
                                    onBlur={handleBlur("channel")}
                                    >
                                        <option>-Pilih Channel-</option>
                                        <option value="GT">GT</option>
                                        <option value="MT">MT</option>
                                    </Input>
                                    {errors.channel ? (
                                        <text className="txtError">{errors.channel}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Distribution
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.distribution}
                                    onChange={handleChange("distribution")}
                                    onBlur={handleBlur("distribution")}
                                    >
                                        <option>-Pilih Distribution-</option>
                                        <option value="PMA">PMA</option>
                                        <option value="SUB">SUB</option>
                                    </Input>
                                    {errors.distribution ? (
                                        <text className="txtError">{errors.distribution}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Status Depo
                                </text>
                                <div className="col-md-8">
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
                                <text className="col-md-4">
                                    Profit Center
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="name" 
                                    name="nama_spv"
                                    value={values.profit_center}
                                    onBlur={handleBlur("profit_center")}
                                    onChange={handleChange("profit_center")}
                                    />
                                    {errors.profit_center ? (
                                        <text className="txtError">{errors.profit_center}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode Plant
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name"
                                name="nama_spv"
                                value={values.kode_plant}
                                onBlur={handleBlur("kode_plant")}
                                onChange={handleChange("kode_plant")}
                                />
                                   {errors.kode_plant ? (
                                        <text className="txtError">{errors.kode_plant}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode SAP 1
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.kode_sap_1}
                                onBlur={handleBlur("kode_sap_1")}
                                onChange={handleChange("kode_sap_1")}
                                />
                                   {errors.kode_sap_1 ? (
                                        <text className="txtError">{errors.kode_sap_1}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode SAP 2
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.kode_sap_2}
                                onBlur={handleBlur("kode_sap_2")}
                                onChange={handleChange("kode_sap_2")}
                                />
                                   {errors.kode_sap_2 ? (
                                        <text className="txtError">{errors.kode_sap_2}</text>
                                    ) : null}
                                </div>    
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama GROM
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_grom}
                                onBlur={handleBlur("nama_grom")}
                                onChange={handleChange("nama_grom")}
                                />
                                   {errors.nama_grom ? (
                                        <text className="txtError">{errors.nama_grom}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama BM
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_bm}
                                onBlur={handleBlur("nama_bm")}
                                onChange={handleChange("nama_bm")}
                                />
                                    {errors.nama_bm ? (
                                        <text className="txtError">{errors.nama_bm}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama ASS
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_ass}
                                onBlur={handleBlur("nama_ass")}
                                onChange={handleChange("nama_ass")}
                                />
                                    {errors.nama_ass ? (
                                        <text className="txtError">{errors.nama_ass}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama PIC 1
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_pic_1}
                                onBlur={handleBlur("nama_pic_1")}
                                onChange={handleChange("nama_pic_1")}
                                />
                                    {errors.nama_pic_1 ? (
                                        <text className="txtError">{errors.nama_pic_1}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama PIC 2
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_pic_2}
                                onBlur={handleBlur("nama_pic_2")}
                                onChange={handleChange("nama_pic_2")}
                                />
                                    {errors.nama_pic_2 ? (
                                        <text className="txtError">{errors.nama_pic_2}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama PIC 3
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_pic_3}
                                onBlur={handleBlur("nama_pic_3")}
                                onChange={handleChange("nama_pic_3")}
                                />
                                    {errors.nama_pic_3 ? (
                                        <text className="txtError">{errors.nama_pic_3}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama PIC 4
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_pic_4}
                                onBlur={handleBlur("nama_pic_4")}
                                onChange={handleChange("nama_pic_4")}
                                />
                                    {errors.nama_pic_4 ? (
                                        <text className="txtError">{errors.nama_pic_4}</text>
                                    ) : null}
                                </div>    
                            </div>
                        </div>
                    </ModalBody>
                        <hr/>
                        <div className="foot mb-3">
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-5" onClick={this.openModalAdd}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                    )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit} size="lg">
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Depo</ModalHeader>
                    <Formik
                    initialValues={{
                        kode_depo: detail.kode_depo,
                        nama_depo: detail.nama_depo,
                        home_town: detail.home_town,
                        channel: detail.channel,
                        distribution: detail.distribution,
                        status_depo: detail.status_depo,
                        profit_center: detail.profit_center,
                        kode_sap_1: detail.kode_sap_1,
                        kode_sap_2: detail.kode_sap_2,
                        kode_plant: detail.kode_plant,
                        nama_grom: detail.nama_grom,
                        nama_bm: detail.nama_bm,
                        nama_ass: detail.nama_ass,
                        nama_pic_1: detail.nama_pic_1,
                        nama_pic_2: detail.nama_pic_2,
                        nama_pic_3: detail.nama_pic_3,
                        nama_pic_4: detail.nama_pic_4
                    }}
                    validationSchema={depoSchema}
                    onSubmit={(values) => {this.editDepo(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <div className="bodyDepo">
                        <ModalBody className="addDepo">
                        <div className="col-md-6">
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode Depo
                                </text>
                                <div className="col-md-8">
                                    <Input
                                    type="text" 
                                    name="kode_depo"
                                    value={values.kode_depo}
                                    onBlur={handleChange("kode_depo")}
                                    onChange={handleBlur("kode_depo")}
                                    />
                                    {errors.kode_depo ? (
                                        <text className="txtError">{errors.kode_depo}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama Depo
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_depo"
                                value={values.nama_depo}
                                onBlur={handleChange("nama_depo")}
                                onChange={handleBlur("nama_depo")}
                                />
                                {errors.nama_depo ? (
                                    <text className="txtError">{errors.nama_depo}</text>
                                ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Home Town
                                </text>
                                <div className="col-md-8">
                                    <Input
                                    type="text" 
                                    name="home_town"
                                    value={values.home_town}
                                    onBlur={handleBlur("home_town")}
                                    onChange={handleChange("home_town")}
                                    />
                                    {errors.home_town ? (
                                        <text className="txtError">{errors.home_town}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Channel
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.channel}
                                    onChange={handleChange("channel")}
                                    onBlur={handleBlur("channel")}
                                    >
                                        <option>-Pilih Channel-</option>
                                        <option value="GT">GT</option>
                                        <option value="MT">MT</option>
                                    </Input>
                                    {errors.channel ? (
                                        <text className="txtError">{errors.channel}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Distribution
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="select"
                                    value={values.distribution}
                                    onChange={handleChange("distribution")}
                                    onBlur={handleBlur("distribution")}
                                    >
                                        <option>-Pilih Distribution-</option>
                                        <option value="PMA">PMA</option>
                                        <option value="SUB">SUB</option>
                                    </Input>
                                    {errors.distribution ? (
                                        <text className="txtError">{errors.distribution}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Status Depo
                                </text>
                                <div className="col-md-8">
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
                                <text className="col-md-4">
                                    Profit Center
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="name" 
                                    name="nama_spv"
                                    value={values.profit_center}
                                    onBlur={handleBlur("profit_center")}
                                    onChange={handleChange("profit_center")}
                                    />
                                    {errors.profit_center ? (
                                        <text className="txtError">{errors.profit_center}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode Plant
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name"
                                name="nama_spv"
                                value={values.kode_plant}
                                onBlur={handleBlur("kode_plant")}
                                onChange={handleChange("kode_plant")}
                                />
                                   {errors.kode_plant ? (
                                        <text className="txtError">{errors.kode_plant}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode SAP 1
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.kode_sap_1}
                                onBlur={handleBlur("kode_sap_1")}
                                onChange={handleChange("kode_sap_1")}
                                />
                                   {errors.kode_sap_1 ? (
                                        <text className="txtError">{errors.kode_sap_1}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode SAP 2
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.kode_sap_2}
                                onBlur={handleBlur("kode_sap_2")}
                                onChange={handleChange("kode_sap_2")}
                                />
                                   {errors.kode_sap_2 ? (
                                        <text className="txtError">{errors.kode_sap_2}</text>
                                    ) : null}
                                </div>    
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama GROM
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_grom}
                                onBlur={handleBlur("nama_grom")}
                                onChange={handleChange("nama_grom")}
                                />
                                   {errors.nama_grom ? (
                                        <text className="txtError">{errors.nama_grom}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama BM
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_bm}
                                onBlur={handleBlur("nama_bm")}
                                onChange={handleChange("nama_bm")}
                                />
                                    {errors.nama_bm ? (
                                        <text className="txtError">{errors.nama_bm}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama ASS
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_ass}
                                onBlur={handleBlur("nama_ass")}
                                onChange={handleChange("nama_ass")}
                                />
                                    {errors.nama_ass ? (
                                        <text className="txtError">{errors.nama_ass}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama PIC 1
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_pic_1}
                                onBlur={handleBlur("nama_pic_1")}
                                onChange={handleChange("nama_pic_1")}
                                />
                                    {errors.nama_pic_1 ? (
                                        <text className="txtError">{errors.nama_pic_1}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama PIC 2
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_pic_2}
                                onBlur={handleBlur("nama_pic_2")}
                                onChange={handleChange("nama_pic_2")}
                                />
                                    {errors.nama_pic_2 ? (
                                        <text className="txtError">{errors.nama_pic_2}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama PIC 3
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_pic_3}
                                onBlur={handleBlur("nama_pic_3")}
                                onChange={handleChange("nama_pic_3")}
                                />
                                    {errors.nama_pic_3 ? (
                                        <text className="txtError">{errors.nama_pic_3}</text>
                                    ) : null}
                                </div>    
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama PIC 4
                                </text>
                                <div className="col-md-8">
                                <Input 
                                type="name" 
                                name="nama_spv"
                                value={values.nama_pic_4}
                                onBlur={handleBlur("nama_pic_4")}
                                onChange={handleChange("nama_pic_4")}
                                />
                                    {errors.nama_pic_4 ? (
                                        <text className="txtError">{errors.nama_pic_4}</text>
                                    ) : null}
                                </div>    
                            </div>
                        </div>
                    </ModalBody>
                    <hr/>
                        <div className="foot mb-3">
                            <div></div>
                            <div>
                                <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                <Button className="mr-5" onClick={this.openModalEdit}>Cancel</Button>
                            </div>
                        </div>
                    </div>
                    )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master Depo</ModalHeader>
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
                            <Button color="info">Download Template</Button>
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
                            <div className="sucUpdate green">Berhasil Memperbarui Depo</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Menambahkan Depo</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Mengupload Master Depo</div>
                            </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.depo.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className="cekUpdate">
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.depo.isUpload ? true: false} size="sm">
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
    depo: state.depo
})

const mapDispatchToProps = {
    logout: auth.logout,
    addDepo: depo.addDepo,
    updateDepo: depo.updateDepo,
    getDepo: depo.getDepo,
    resetError: depo.resetError,
    uploadMaster: depo.uploadMaster,
    nextPage: depo.nextPage
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterDepo)
	
