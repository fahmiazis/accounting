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
import inventory from '../redux/actions/inventory'
import {connect} from 'react-redux'
import auth from '../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../components/Header";
import MaterialTitlePanel from "../components/material_title_panel";
import SidebarContent from "../components/sidebar_content";
const {REACT_APP_BACKEND_URL} = process.env

const inventorySchema = Yup.object().shape({
    plant: Yup.string().required(),
    area: Yup.string().required(),
    channel: Yup.string().required(),
    profit_center: Yup.string().required(),
    kode_dist: Yup.string().required(),
    pic_inv: Yup.string().required(),
    pic_kasbank: Yup.string().required(),
    status_area: Yup.string().required()
});

class MasterInventory extends Component {
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
            search: '',
            modalDelete: false,
            listInventory: []
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
        const { page } = this.props.inventory
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.inventory
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
            url: `${REACT_APP_BACKEND_URL}/masters/inventory.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "inventory.xlsx");
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
        const {link} = this.props.inventory
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master inventory.xlsx"); //or any other extension
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

    addInventory = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addInventory(token, values)
        this.setState({confirm: 'add'})
        this.openConfirm()
        this.getDataInventory()
        this.openModalAdd()
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

    editInventory = async (values,id) => {
        const token = localStorage.getItem("token")
        await this.props.updateInventory(token, id, values)
        this.setState({confirm: 'edit'})
        this.openConfirm()
        this.getDataInventory()
        this.openModalEdit()
    }

    openModalDelete = () => {
        this.setState({modalDelete: !this.state.modalDelete})
    }

    chekApp = (val) => {
        const { listInventory } = this.state
        const {dataInventory} = this.props.inventory
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataInventory.length; i++) {
                data.push(dataInventory[i].id)
            }
            this.setState({listInventory: data})
        } else {
            listInventory.push(val)
            this.setState({listInventory: listInventory})
        }
    }

    chekRej = (val) => {
        const {listInventory} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listInventory: data})
        } else {
            const data = []
            for (let i = 0; i < listInventory.length; i++) {
                if (listInventory[i] === val) {
                    data.push()
                } else {
                    data.push(listInventory[i])
                }
            }
            this.setState({listInventory: data})
        }
    }

    prosesDelete = async () => {
        const token = localStorage.getItem("token")
        const { listInventory } = this.state
        const data = {
            listId: listInventory
        }
        await this.props.deleteInventory(token, data)
        this.getDataInventory()
        this.openModalDelete()
        this.setState({confirm: 'delete'})
        this.openConfirm()
    }

    componentDidUpdate() {
        const {isError, isUpload, isExport} = this.props.inventory
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            this.props.resetError()
            this.setState({modalUpload: false})
            setTimeout(() => {
                this.getDataInventory()
            }, 100)
        }  else if (isExport) {
            this.props.resetError()
            this.DownloadMaster()
        }
    }

    componentDidMount() {
        this.getDataInventory()
        this.getDataDepo()
        this.getDataDivisi()
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataInventory({limit: 10, search: this.state.search})
        }
    }

    getDataInventory = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.inventory
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getInventory(token, limit, search, page.currentPage)
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
        const {isOpen, dropOpen, dropOpenNum, detail, alert, upload, errMsg, listInventory} = this.state
        const {dataInventory, isGet, alertM, alertMsg, alertUpload, page} = this.props.inventory
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
                                    <div className="titleDashboard col-md-12">Master Inventory</div>
                                </div>
                                <div className="secHeadDashboard">
                                    <div>
                                        <text>Show: </text>
                                        <ButtonDropdown className="drop" isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                        <DropdownItem className="item" onClick={() => this.getDataInventory({limit: 10, search: ''})}>10</DropdownItem>
                                            <DropdownItem className="item" onClick={() => this.getDataInventory({limit: 20, search: ''})}>20</DropdownItem>
                                            <DropdownItem className="item" onClick={() => this.getDataInventory({limit: 50, search: ''})}>50</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                        <text className="textEntries">entries</text>
                                    </div>
                                </div>
                                <div className="secEmail mt-4">
                                    <div className="rowCenter">
                                        <Button onClick={this.openModalAdd} color="primary" size="lg">Add</Button>
                                        <Button className='ml-1' disabled={listInventory.length === 0 ? true : false} onClick={this.openModalDelete} color="danger" size="lg">Delete</Button>
                                        <Button className='ml-1' onClick={this.openModalUpload} color="warning" size="lg">Upload</Button>
                                        <Button className='ml-1' onClick={this.ExportMaster} color="success" size="lg">Download</Button>
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
                                                <th>PLANT</th>
                                                <th>NAMA AREA</th>
                                                <th>CHANNEL</th>
                                                <th>PROFIT CENTER</th>
                                                <th>KODE DIST</th>
                                                <th>PIC INVENTORY</th>
                                                <th>PIC KASBANK</th>
                                                <th>STATUS</th>
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
                                                <th>
                                                    <input  
                                                    className='mr-2'
                                                    type='checkbox'
                                                    checked={listInventory.length === 0 ? false : listInventory.length === dataInventory.length ? true : false}
                                                    onChange={() => listInventory.length === dataInventory.length ? this.chekRej('all') : this.chekApp('all')}
                                                    />
                                                </th>
                                                <th>No</th>
                                                <th>PLANT</th>
                                                <th>NAMA AREA</th>
                                                <th>CHANNEL</th>
                                                <th>PROFIT CENTER</th>
                                                <th>KODE DIST</th>
                                                <th>PIC INVENTORY</th>
                                                <th>PIC KASBANK</th>
                                                <th>STATUS</th>
                                                <th>Opsi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {dataInventory.length !== 0 && dataInventory.map(item => {
                                            return (
                                                <tr>
                                                    <td>
                                                        <input 
                                                        type='checkbox'
                                                        checked={listInventory.find(element => element === item.id) !== undefined ? true : false}
                                                        onChange={listInventory.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                        />
                                                    </td>
                                                    <td>{(dataInventory.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</td>
                                                    <td>{item.plant}</td>
                                                    <td>{item.area}</td>
                                                    <td>{item.channel}</td>
                                                    <td>{item.profit_center}</td>
                                                    <td>{item.kode_dist}</td>
                                                    <td>{item.pic_inv}</td>
                                                    <td>{item.pic_kasbank}</td>
                                                    <td>{item.status_area}</td>
                                                    <td>
                                                        <Button color='success' onClick={() => this.openModalEdit(this.setState({detail: item}))}>
                                                            Detail
                                                        </Button>
                                                    </td>
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
                    <ModalHeader toggle={this.openModalAdd}>Add Master Inventory</ModalHeader>
                    <Formik
                    initialValues={{
                        plant: '',
                        area: '',
                        channel: '',
                        profit_center: '',
                        kode_dist: '',
                        pic_inv: '',
                        pic_kasbank: '',
                        status_area: ''
                    }}
                    validationSchema={inventorySchema}
                    onSubmit={(values) => {this.addInventory(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <ModalBody>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Plant
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="plant"
                                value={values.plant}
                                onBlur={handleBlur("plant")}
                                onChange={handleChange("plant")}
                                />
                                {errors.plant ? (
                                    <text className="txtError">{errors.plant}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Nama Area
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="area" 
                                value={values.area}
                                onChange={handleChange("area")}
                                onBlur={handleBlur("area")}
                                />
                               {errors.area ? (
                                    <text className="txtError">{errors.area}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Channel
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="channel" 
                                value={values.channel}
                                onChange={handleChange("channel")}
                                onBlur={handleBlur("channel")}
                                />
                               {errors.channel ? (
                                    <text className="txtError">{errors.channel}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Profit Center
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="profit_center" 
                                value={values.profit_center}
                                onChange={handleChange("profit_center")}
                                onBlur={handleBlur("profit_center")}
                                />
                               {errors.profit_center ? (
                                    <text className="txtError">{errors.profit_center}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Kode Dist
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="kode_dist" 
                                value={values.kode_dist}
                                onChange={handleChange("kode_dist")}
                                onBlur={handleBlur("kode_dist")}
                                />
                               {errors.kode_dist ? (
                                    <text className="txtError">{errors.kode_dist}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                PIC Inventory
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="pic_inv" 
                                value={values.pic_inv}
                                onChange={handleChange("pic_inv")}
                                onBlur={handleBlur("pic_inv")}
                                />
                               {errors.pic_inv ? (
                                    <text className="txtError">{errors.pic_inv}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                PIC Kasbank
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="pic_kasbank" 
                                value={values.pic_kasbank}
                                onChange={handleChange("pic_kasbank")}
                                onBlur={handleBlur("pic_kasbank")}
                                />
                               {errors.pic_kasbank ? (
                                    <text className="txtError">{errors.pic_kasbank}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Status
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="status_area" 
                                value={values.status_area}
                                onChange={handleChange("status_area")}
                                onBlur={handleBlur("status_area")}
                                />
                               {errors.status_area ? (
                                    <text className="txtError">{errors.status_area}</text>
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
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Inventory</ModalHeader>
                    <Formik
                    initialValues={{
                        plant: detail.plant,
                        area: detail.area,
                        channel: detail.channel,
                        profit_center: detail.profit_center, 
                        kode_dist: detail.kode_dist,
                        pic_inv: detail.pic_inv
                    }}
                    validationSchema={inventorySchema}
                    onSubmit={(values) => {this.editInventory(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <ModalBody>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Plant
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="plant"
                                value={values.plant}
                                onBlur={handleBlur("plant")}
                                onChange={handleChange("plant")}
                                />
                                {errors.plant ? (
                                    <text className="txtError">{errors.plant}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Nama Area
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="area" 
                                value={values.area}
                                onChange={handleChange("area")}
                                onBlur={handleBlur("area")}
                                />
                               {errors.area ? (
                                    <text className="txtError">{errors.area}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Channel
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="channel" 
                                value={values.channel}
                                onChange={handleChange("channel")}
                                onBlur={handleBlur("channel")}
                                />
                               {errors.channel ? (
                                    <text className="txtError">{errors.channel}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Profit Center
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="profit_center" 
                                value={values.profit_center}
                                onChange={handleChange("profit_center")}
                                onBlur={handleBlur("profit_center")}
                                />
                               {errors.profit_center ? (
                                    <text className="txtError">{errors.profit_center}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Kode Dist
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="kode_dist" 
                                value={values.kode_dist}
                                onChange={handleChange("kode_dist")}
                                onBlur={handleBlur("kode_dist")}
                                />
                               {errors.kode_dist ? (
                                    <text className="txtError">{errors.kode_dist}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                PIC Inventory
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="pic_inv" 
                                value={values.pic_inv}
                                onChange={handleChange("pic_inv")}
                                onBlur={handleBlur("pic_inv")}
                                />
                               {errors.pic_inv ? (
                                    <text className="txtError">{errors.pic_inv}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                PIC Kasbank
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="pic_kasbank" 
                                value={values.pic_kasbank}
                                onChange={handleChange("pic_kasbank")}
                                onBlur={handleBlur("pic_kasbank")}
                                />
                               {errors.pic_kasbank ? (
                                    <text className="txtError">{errors.pic_kasbank}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Status
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="status_area" 
                                value={values.status_area}
                                onChange={handleChange("status_area")}
                                onBlur={handleBlur("status_area")}
                                />
                               {errors.status_area ? (
                                    <text className="txtError">{errors.status_area}</text>
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
                    <ModalHeader>Upload Master Inventory</ModalHeader>
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
                            <div className="sucUpdate green">Berhasil Memperbarui Inventory</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Menambahkan Inventory</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Mengupload Master Inventory</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'delete' ?(
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Delete Data Inventory</div>
                            </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.inventory.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className="cekUpdate">
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.inventory.isUpload ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className="cekUpdate">
                                <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Mengupload Master</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalDelete} size="md" toggle={this.openModalDelete} centered={true}>
                    <ModalBody>
                        <div className='modalApprove'>
                            <div>
                                <text>
                                    Anda yakin untuk delete data inventory ?
                                </text>
                            </div>
                            <div className='btnApproveIo'>
                                <Button color="primary" className='mr-2' onClick={this.prosesDelete}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalDelete}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    inventory: state.inventory,
    divisi: state.divisi,
    depo: state.depo
})

const mapDispatchToProps = {
    logout: auth.logout,
    addInventory: inventory.addInventory,
    updateInventory: inventory.updateInventory,
    getInventory: inventory.getInventory,
    resetError: inventory.resetError,
    getDivisi: divisi.getDivisi,
    getDepo: depo.getDepo,
    uploadMaster: inventory.uploadMaster,
    nextPage: inventory.nextPage,
    exportMaster: inventory.exportMaster,
    deleteInventory: inventory.deleteInventory
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterInventory)
	