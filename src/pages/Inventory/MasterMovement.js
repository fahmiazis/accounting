import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Spinner} from 'reactstrap'
import logo from "../../assets/img/logo.png"
import '../../assets/css/style.css'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle, AiOutlineInbox} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import divisi from '../../redux/actions/divisi'
import depo from '../../redux/actions/depo'
import movement from '../../redux/actions/movement'
import {connect} from 'react-redux'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import NewNavbar from '../../components/NewNavbar'
import styleTrans from '../../assets/css/transaksi.module.css'
import style from '../../assets/css/public.module.css'
const {REACT_APP_BACKEND_URL} = process.env

const movementSchema = Yup.object().shape({
    mv_type: Yup.string().required(),
    mv_text: Yup.string().required(),
    mv_grouping: Yup.string().required(),
    comp_grouping: Yup.string().required(), 
    storage_loc: Yup.string().required(),
    saldo: Yup.string().required()
});

class MasterMovement extends Component {
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
            listMovement: []
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


    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    next = async () => {
        const { page } = this.props.movement
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.movement
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
            url: `${REACT_APP_BACKEND_URL}/masters/movement.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "movement.xlsx");
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
        const {link} = this.props.movement
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master movement.xlsx"); //or any other extension
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

    addMovement = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addMovement(token, values)
        this.setState({confirm: 'add'})
        this.openConfirm()
        this.getDataMovement()
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

    editMovement = async (values,id) => {
        const token = localStorage.getItem("token")
        await this.props.updateMovement(token, id, values)
        this.setState({confirm: 'edit'})
        this.openConfirm()
        this.getDataMovement()
        this.openModalEdit()
    }

    openModalDelete = () => {
        this.setState({modalDelete: !this.state.modalDelete})
    }

    chekApp = (val) => {
        const { listMovement } = this.state
        const {dataMovement} = this.props.movement
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataMovement.length; i++) {
                data.push(dataMovement[i].id)
            }
            this.setState({listMovement: data})
        } else {
            listMovement.push(val)
            this.setState({listMovement: listMovement})
        }
    }

    chekRej = (val) => {
        const {listMovement} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listMovement: data})
        } else {
            const data = []
            for (let i = 0; i < listMovement.length; i++) {
                if (listMovement[i] === val) {
                    data.push()
                } else {
                    data.push(listMovement[i])
                }
            }
            this.setState({listMovement: data})
        }
    }

    prosesDelete = async () => {
        const token = localStorage.getItem("token")
        const { listMovement } = this.state
        const data = {
            listId: listMovement
        }
        await this.props.deleteMovement(token, data)
        this.getDataMovement()
        this.openModalDelete()
        this.setState({confirm: 'delete'})
        this.openConfirm()
    }

    componentDidUpdate() {
        const {isError, isUpload, isExport} = this.props.movement
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            this.props.resetError()
            this.setState({modalUpload: false})
            setTimeout(() => {
                this.getDataMovement()
            }, 100)
        }  else if (isExport) {
            this.props.resetError()
            this.DownloadMaster()
        }
    }

    componentDidMount() {
        this.getDataMovement()
        this.getDataDepo()
        this.getDataDivisi()
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataMovement({limit: 10, search: this.state.search})
        }
    }

    getDataMovement = async (value) => {
        const token = localStorage.getItem("token")
        const { page } = this.props.movement
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getMovement(token, limit, search, page.currentPage)
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
        const {isOpen, dropOpen, dropOpenNum, detail, alert, upload, errMsg, listMovement} = this.state
        const {dataMovement, isGet, alertM, alertMsg, alertUpload, page} = this.props.movement
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
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>

                        <h2 className={styleTrans.pageTitle}>Master Movement</h2>
                            
                        <div className={styleTrans.searchContainer}>
                            <div>
                                <text>Show: </text>
                                <ButtonDropdown className={style.drop} isOpen={dropOpen} toggle={this.dropDown}>
                                <DropdownToggle caret color="light">
                                    {this.state.limit}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem className={style.item} onClick={() =>this.getDataMovement({limit: 10, search: ''})}>10</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() =>this.getDataMovement({limit: 20, search: ''})}>20</DropdownItem>
                                    <DropdownItem className={style.item} onClick={() =>this.getDataMovement({limit: 50, search: ''})}>50</DropdownItem>
                                </DropdownMenu>
                                </ButtonDropdown>
                                <text className={style.textEntries}>entries</text>
                            </div>
                        </div>
                        <div className={styleTrans.searchContainer}>
                            <div className='rowCenter'>
                                <Button onClick={this.openModalAdd} color="primary" size="lg" className='mr-1'>Add</Button>
                                <Button className='mr-1' disabled={listMovement.length === 0 ? true : false} onClick={this.openModalDelete} color="danger" size="lg">Delete</Button>
                                <Button onClick={this.openModalUpload} color="warning" size="lg" className='mr-1'>Upload</Button>
                                <Button color="success" size="lg" onClick={this.ExportMaster}>Download</Button>
                            </div>
                            <div className={style.searchEmail2}>
                                <text>Search: </text>
                                <Input 
                                className={style.search}
                                onChange={this.onSearch}
                                value={this.state.search}
                                onKeyPress={this.onSearch}
                                >
                                    <FaSearch size={20} />
                                </Input>
                            </div>
                        </div>

                        <table className={`${styleTrans.table} ${dataMovement.length > 0 ? styleTrans.tableFull : ''}`}>
                            <thead>
                                <tr>
                                    <th>
                                        <input  
                                        className='mr-2'
                                        type='checkbox'
                                        checked={listMovement.length === 0 ? false : listMovement.length === dataMovement.length ? true : false}
                                        onChange={() => listMovement.length === dataMovement.length ? this.chekRej('all') : this.chekApp('all')}
                                        />
                                    </th>
                                    <th>No</th>
                                    <th>Movement type</th>
                                    <th>Movement Type Text</th>
                                    <th>Grouping Arus Barang</th>
                                    <th>Grouping Compare</th>
                                    <th>Storage location</th>
                                    <th>Saldo</th>
                                    <th>Opsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataMovement.length !== 0 && dataMovement.map(item => {
                                    return (
                                        <tr>
                                            <td>
                                                <input 
                                                type='checkbox'
                                                checked={listMovement.find(element => element === item.id) !== undefined ? true : false}
                                                onChange={listMovement.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                />
                                            </td>
                                            <td className={styleTrans.colNo}>{(dataMovement.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</td>
                                            <td>{item.mv_type}</td>
                                            <td>{item.mv_text}</td>
                                            <td>{item.mv_grouping}</td>
                                            <td>{item.comp_grouping}</td>
                                            <td>{item.storage_loc}</td>
                                            <td>{item.saldo}</td>
                                            <td>
                                                <Button color='success' onClick={() => this.openModalEdit(this.setState({detail: item}))}>
                                                    Detail
                                                </Button>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                        </table>
                        {dataMovement.length === 0 && (
                            <div className={style.spinCol}>
                                <AiOutlineInbox size={50} className='mb-4' />
                                <div className='textInfo'>Data movement tidak ditemukan</div>
                            </div>
                        )}
                        <div>
                            <div className={style.infoPageEmail1}>
                                <text>Showing {page.currentPage} of {page.pages} pages</text>
                                <div className={style.pageButton}>
                                    <button className={style.btnPrev} color="info" disabled={page.prevLink === null ? true : false} onClick={this.prev}>Prev</button>
                                    <button className={style.btnPrev} color="info" disabled={page.nextLink === null ? true : false} onClick={this.next}>Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <Sidebar {...sidebarProps}>
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
                                    <div className="titleDashboard col-md-12">Master Movement</div>
                                </div>
                                <div className="secHeadDashboard">
                                    <div>
                                        <text>Show: </text>
                                        <ButtonDropdown className="drop" isOpen={dropOpen} toggle={this.dropDown}>
                                        <DropdownToggle caret color="light">
                                            {this.state.limit}
                                        </DropdownToggle>
                                        <DropdownMenu>
                                        <DropdownItem className="item" onClick={() => this.getDataMovement({limit: 10, search: ''})}>10</DropdownItem>
                                            <DropdownItem className="item" onClick={() => this.getDataMovement({limit: 20, search: ''})}>20</DropdownItem>
                                            <DropdownItem className="item" onClick={() => this.getDataMovement({limit: 50, search: ''})}>50</DropdownItem>
                                        </DropdownMenu>
                                        </ButtonDropdown>
                                        <text className="textEntries">entries</text>
                                    </div>
                                </div>
                                <div className="secEmail mt-4">
                                    <div className="rowCenter">
                                        <Button onClick={this.openModalAdd} color="primary" size="lg">Add</Button>
                                        <Button className='ml-1' disabled={listMovement.length === 0 ? true : false} onClick={this.openModalDelete} color="danger" size="lg">Delete</Button>
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
                                                <th>Movement type</th>
                                                <th>Movement Type Text</th>
                                                <th>Grouping Arus Barang</th>
                                                <th>Grouping Compare</th>
                                                <th>Storage location</th>
                                                <th>Saldo</th>
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
                                                    checked={listMovement.length === 0 ? false : listMovement.length === dataMovement.length ? true : false}
                                                    onChange={() => listMovement.length === dataMovement.length ? this.chekRej('all') : this.chekApp('all')}
                                                    />
                                                </th>
                                                <th>No</th>
                                                <th>Movement type</th>
                                                <th>Movement Type Text</th>
                                                <th>Grouping Arus Barang</th>
                                                <th>Grouping Compare</th>
                                                <th>Storage location</th>
                                                <th>Saldo</th>
                                                <th>Opsi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {dataMovement.length !== 0 && dataMovement.map(item => {
                                            return (
                                                <tr>
                                                    <td>
                                                        <input 
                                                        type='checkbox'
                                                        checked={listMovement.find(element => element === item.id) !== undefined ? true : false}
                                                        onChange={listMovement.find(element => element === item.id) === undefined ? () => this.chekApp(item.id) : () => this.chekRej(item.id)}
                                                        />
                                                    </td>
                                                    <td>{(dataMovement.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</td>
                                                    <td>{item.mv_type}</td>
                                                    <td>{item.mv_text}</td>
                                                    <td>{item.mv_grouping}</td>
                                                    <td>{item.comp_grouping}</td>
                                                    <td>{item.storage_loc}</td>
                                                    <td>{item.saldo}</td>
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
                </Sidebar> */}
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd}>
                    <ModalHeader toggle={this.openModalAdd}>Add Master Movement</ModalHeader>
                    <Formik
                    initialValues={{
                        mv_type: "",
                        mv_text: "",
                        mv_grouping: "",
                        comp_grouping: "", 
                        storage_loc: "",
                        saldo: ""
                    }}
                    validationSchema={movementSchema}
                    onSubmit={(values) => {this.addMovement(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <ModalBody>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Movement type
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="mv_type"
                                value={values.mv_type}
                                onBlur={handleBlur("mv_type")}
                                onChange={handleChange("mv_type")}
                                />
                                {errors.mv_type ? (
                                    <text className="txtError">{errors.mv_type}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Movement Type Text
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="mv_text" 
                                value={values.mv_text}
                                onChange={handleChange("mv_text")}
                                onBlur={handleBlur("mv_text")}
                                />
                               {errors.mv_text ? (
                                    <text className="txtError">{errors.mv_text}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Grouping Arus Barang
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="mv_grouping" 
                                value={values.mv_grouping}
                                onChange={handleChange("mv_grouping")}
                                onBlur={handleBlur("mv_grouping")}
                                />
                               {errors.mv_grouping ? (
                                    <text className="txtError">{errors.mv_grouping}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Grouping Compare
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="comp_grouping" 
                                value={values.comp_grouping}
                                onChange={handleChange("comp_grouping")}
                                onBlur={handleBlur("comp_grouping")}
                                />
                               {errors.comp_grouping ? (
                                    <text className="txtError">{errors.comp_grouping}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Storage location
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="storage_loc" 
                                value={values.storage_loc}
                                onChange={handleChange("storage_loc")}
                                onBlur={handleBlur("storage_loc")}
                                />
                               {errors.storage_loc ? (
                                    <text className="txtError">{errors.storage_loc}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Saldo
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="saldo" 
                                value={values.saldo}
                                onChange={handleChange("saldo")}
                                onBlur={handleBlur("saldo")}
                                />
                               {errors.saldo ? (
                                    <text className="txtError">{errors.saldo}</text>
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
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Movement</ModalHeader>
                    <Formik
                    initialValues={{
                        mv_type: detail.mv_type,
                        mv_text: detail.mv_text,
                        mv_grouping: detail.mv_grouping,
                        comp_grouping: detail.comp_grouping, 
                        storage_loc: detail.storage_loc,
                        saldo: detail.saldo
                    }}
                    validationSchema={movementSchema}
                    onSubmit={(values) => {this.editMovement(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <ModalBody>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Movement type
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="mv_type"
                                value={values.mv_type}
                                onBlur={handleBlur("mv_type")}
                                onChange={handleChange("mv_type")}
                                />
                                {errors.mv_type ? (
                                    <text className="txtError">{errors.mv_type}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Movement Type Text
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="mv_text" 
                                value={values.mv_text}
                                onChange={handleChange("mv_text")}
                                onBlur={handleBlur("mv_text")}
                                />
                               {errors.mv_text ? (
                                    <text className="txtError">{errors.mv_text}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Grouping Arus Barang
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="mv_grouping" 
                                value={values.mv_grouping}
                                onChange={handleChange("mv_grouping")}
                                onBlur={handleBlur("mv_grouping")}
                                />
                               {errors.mv_grouping ? (
                                    <text className="txtError">{errors.mv_grouping}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Grouping Compare
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="comp_grouping" 
                                value={values.comp_grouping}
                                onChange={handleChange("comp_grouping")}
                                onBlur={handleBlur("comp_grouping")}
                                />
                               {errors.comp_grouping ? (
                                    <text className="txtError">{errors.comp_grouping}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Storage location
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="storage_loc" 
                                value={values.storage_loc}
                                onChange={handleChange("storage_loc")}
                                onBlur={handleBlur("storage_loc")}
                                />
                               {errors.storage_loc ? (
                                    <text className="txtError">{errors.storage_loc}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Saldo
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="saldo" 
                                value={values.saldo}
                                onChange={handleChange("saldo")}
                                onBlur={handleBlur("saldo")}
                                />
                               {errors.saldo ? (
                                    <text className="txtError">{errors.saldo}</text>
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
                    <ModalHeader>Upload Master Movement</ModalHeader>
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
                            <div className="sucUpdate green">Berhasil Memperbarui Movement</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Menambahkan Movement</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Mengupload Master Movement</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'delete' ?(
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Delete Data Movement</div>
                            </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.movement.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className="cekUpdate">
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.movement.isUpload ? true: false} size="sm">
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
                                    Anda yakin untuk delete data movement ?
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
    movement: state.movement,
    divisi: state.divisi,
    depo: state.depo
})

const mapDispatchToProps = {
    logout: auth.logout,
    addMovement: movement.addMovement,
    updateMovement: movement.updateMovement,
    getMovement: movement.getMovement,
    resetError: movement.resetError,
    getDivisi: divisi.getDivisi,
    getDepo: depo.getDepo,
    uploadMaster: movement.uploadMaster,
    nextPage: movement.nextPage,
    exportMaster: movement.exportMaster,
    deleteMovement: movement.deleteMovement
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterMovement)
	