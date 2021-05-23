import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Spinner} from 'reactstrap'
import logo from "../assets/img/logo.png"
import '../assets/css/style.css'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle } from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import alasan from '../redux/actions/alasan'
import date from '../redux/actions/date'
import {connect} from 'react-redux'
import auth from '../redux/actions/auth'
import moment from 'moment'
import dashboard from '../redux/actions/dashboard'
import {BsBell, BsFillCircleFill} from 'react-icons/bs'
import { FcDocument } from 'react-icons/fc'
import Sidebar from "../components/Header";
import MaterialTitlePanel from "../components/material_title_panel";
import SidebarContent from "../components/sidebar_content";

const alasanSchema = Yup.object().shape({
    jenis: Yup.string().required('tipe must be filled'),
    day: Yup.string(),
    time: Yup.string()
});

class DateClossing extends Component {

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
            confirm: "",
            isOpen: false,
            dropOpen: false,
            dropOpenNum: false,
            settingOpen: false,
            value: '',
            onChange: new Date(),
            sidebarOpen: false,
            modalAdd: false,
            modalEdit: false,
            modalUpload: false,
            modalDownload: false,
            modalConfirm: false,
            detail: {},
            date: [],
            alert: false,
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 10,
            search: '',
            data: []
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
      }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    dropDown = () => {
        this.setState({dropOpen: !this.state.dropOpen})
    }
    dropOpen = () => {
        this.setState({dropOpenNum: !this.state.dropOpenNum})
    }
    dropSetting = () => {
        this.setState({settingOpen: !this.state.settingOpen})
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

    next = async () => {
        const { page } = this.props.alasan
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.alasan
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.prevLink)
    }

    addAlasan = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addAlasan(token, values)
        const {isAdd} = this.props.alasan
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            this.getDataAlasan()
            this.openModalAdd()
        }
    }

    addDate = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addDate(token, values)
        const {isAdd} = this.props.date
        if (isAdd) {
            this.setState({confirm: 'add'})
            this.openConfirm()
            this.getDataDate()
            this.openModalAdd()
        }
        // console.log(values)
        // const time = new Date(moment(values.time))
        // console.log(time)
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

    uploadMasterAlasan = async () => {
        const token = localStorage.getItem('token')
        const data = new FormData()
        data.append('master', this.state.fileUpload)
        await this.props.uploadMaster(token, data)
    }

    editAlasan = async (values,id) => {
        const token = localStorage.getItem("token")
        await this.props.updateAlasan(token, id, values)
        const {isUpdate} = this.props.alasan
        if (isUpdate) {
            this.setState({confirm: 'edit'})
            this.openConfirm()
            this.getDataAlasan()
            this.openModalEdit()
        }
    }

    componentDidUpdate() {
        const {isError, isUpload} = this.props.alasan
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } else if (isUpload) {
            setTimeout(() => {
                this.props.resetError()
                this.setState({modalUpload: false})
             }, 2000)
             setTimeout(() => {
                this.getDataAlasan()
             }, 2100)
        }
    }

    componentDidMount() {
        this.getDataDate()
        this.prepareDay()
        this.getNotif()
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataAlasan({limit: 10, search: this.state.search})
        }
    }

    prepareDay = () => {
        const date = []
        const num = parseInt(moment().add(1, 'month').endOf('month').format('DD'))
        for (let i = 1; i <= num; i++) {
            date.push(i)
        }
        this.setState({date: date})
    }

    getDataAlasan = async (value) => {
        const token = localStorage.getItem("token")
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getAlasan(token, limit, search)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    getDataDate = async (value) => {
        const token = localStorage.getItem("token")
        await this.props.getDate(token)
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

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, alert, upload, errMsg, date} = this.state
        const {dataAlasan, alertM, alertMsg, alertUpload, page} = this.props.alasan
        const {isGet, dataDate} = this.props.date
        const {notif, notifSa, notifKasir} = this.props.dashboard
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
                                <div className="titleDashboard col-md-12">Setting Date Clossing</div>
                            </div>
                            <div className="secHeadDashboard">
                                <div>
                                    {/* <text>Show: </text>
                                    <ButtonDropdown className="drop" isOpen={dropOpen} toggle={this.dropDown}>
                                    <DropdownToggle caret color="light">
                                        {this.state.limit}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                    <DropdownItem className="item" onClick={() => this.getDataAlasan({limit: 10, search: ''})}>10</DropdownItem>
                                        <DropdownItem className="item" onClick={() => this.getDataAlasan({limit: 20, search: ''})}>20</DropdownItem>
                                        <DropdownItem className="item" onClick={() => this.getDataAlasan({limit: 50, search: ''})}>50</DropdownItem>
                                    </DropdownMenu>
                                    </ButtonDropdown>
                                    <text className="textEntries">entries</text> */}
                                </div>
                            </div>
                            <div className="secEmail">
                                <div className="headEmail">
                                    <Button onClick={this.openModalAdd} color="primary" size="lg">Add</Button>
                                </div>
                                <div className="searchEmail">
                                </div>
                            </div>
                            {isGet === false ? (
                                <div className="tableDashboard">
                                    <Table bordered responsive hover className="tab">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Tipe</th>
                                                <th>Day</th>
                                                <th>Time</th>
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
                                                <th>Tipe</th>
                                                <th>Day</th>
                                                <th>Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {dataDate.length !== 0 && dataDate.map(item => {
                                            return (
                                            <tr>
                                                <th scope="row">{(dataDate.indexOf(item) + 1)}</th>
                                                <td>{item.jenis}</td>
                                                <td>{item.jenis === 'monthly' ? moment(item.day).format('LL') : '-'}</td>
                                                <td>{item.jenis === 'daily' ? moment(item.time).format('HH:mm') : '-'}</td>
                                            </tr>
                                            )})}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                            <div>
                                <div className="infoPageEmail">
                                    <text>Showing 1 of 1 pages</text>
                                    <div className="pageButton">
                                        <button className="btnPrev" color="info" disabled onClick={this.prev}>Prev</button>
                                        <button className="btnPrev" color="info" disabled onClick={this.next}>Next</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    </MaterialTitlePanel>
                </Sidebar>
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd}>
                    <ModalHeader toggle={this.openModalAdd}>Add Master Alasan</ModalHeader>
                    <Formik
                    initialValues={{jenis: "", day: "", time: ""}}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {this.addDate(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <ModalBody>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Tipe
                                </text>
                                <div className="col-md-8">
                                <Input
                                value={values.jenis}
                                type="select" 
                                name="jenis"
                                onBlur={handleBlur('jenis')}
                                onChange={handleChange('jenis')}
                                >   
                                    <option value=''>-Pilih jenis-</option>
                                    <option value="daily">Daily</option>
                                    <option value="monthly">Monthly</option>
                                </Input>
                                {errors.jenis ? (
                                    <text className="txtError">{errors.jenis}</text>
                                ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Day
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="select" 
                                    name="day"
                                    value={values.day}
                                    onBlur={handleBlur('day')}
                                    onChange={handleChange('day')}
                                    disabled={values.jenis === '' || values.jenis === 'daily' ? true : false}
                                    >
                                    <option value=''>-Pilih-</option>
                                    {date.map(item => {
                                        return (
                                            <option value={item}>H + {item}</option>
                                        )
                                    })}
                                    </Input>
                                    {errors.day ? (
                                        <text className="txtError">{errors.day}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Time
                                </text>
                                <div className="col-md-8">
                                <Input
                                value={values.time}
                                type="datetime-local" 
                                name="time"
                                onBlur={handleBlur('time')}
                                onChange={handleChange('time')}
                                disabled={values.jenis === '' || values.jenis === 'monthly' ? true : false}
                                />
                                {errors.time ? (
                                    <text className="txtError">{errors.time}</text>
                                ) : null}
                                </div>
                            </div>
                            <hr />
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
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit}>
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Alasan</ModalHeader>
                    <Formik
                    initialValues={{kode_alasan: detail.kode_alasan, alasan: detail.alasan, status: detail.status}}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {this.editAlasan(values, detail.id)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <ModalBody>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode Alasan
                                </text>
                                <div className="col-md-8">
                                    <Input
                                    value={values.kode_alasan}
                                    type="text" 
                                    name="kode_alasan"
                                    onBlur={handleBlur('kode_alasan')}
                                    onChange={handleChange('kode_alasan')}
                                    />
                                    {errors.kode_alasan ? (
                                        <text className="txtError">{errors.kode_alasan}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Alasan
                                </text>
                                <div className="col-md-8">
                                    <Input 
                                    type="textarea" 
                                    name="alasan"
                                    value={values.alasan}
                                    onBlur={handleBlur('alasan')}
                                    onChange={handleChange('alasan')}
                                    />
                                    {errors.alasan ? (
                                        <text className="txtError">{errors.alasan}</text>
                                    ) : null}
                                </div>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Status
                                </text>
                                <div className="col-md-8">
                                <Input
                                value={values.status}
                                type="select" 
                                name="status"
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
                            <hr />
                            <div className="foot">
                                <div></div>
                                <div>
                                    <Button className="mr-2" onClick={handleSubmit} color="primary">Save</Button>
                                    <Button onClick={this.openModalEdit} className="mr-3">Cancel</Button>
                                </div>
                            </div>
                        </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master Alasan</ModalHeader>
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
                            <Button color="primary" disabled={this.state.fileUpload === "" ? true : false } onClick={this.uploadMasterAlasan}>Upload</Button>
                            <Button onClick={this.openModalUpload}>Cancel</Button>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="sm">
                    <ModalBody>
                        {this.state.confirm === 'edit' ? (
                        <div className="cekUpdate">
                            <AiFillCheckCircle size={80} className="green" />
                            <div className="sucUpdate green">Berhasil Memperbarui Alasan</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Menambah Date</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Mengupload Master Alasan</div>
                            </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.alasan.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className="cekUpdate">
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.props.alasan.isUpload ? true: false} size="sm">
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
    alasan: state.alasan,
    date: state.date,
    dashboard: state.dashboard
})

const mapDispatchToProps = {
    logout: auth.logout,
    addAlasan: alasan.addAlasan,
    updateAlasan: alasan.updateAlasan,
    getAlasan: alasan.getAlasan,
    resetError: alasan.resetError,
    uploadMaster: alasan.uploadMaster,
    nextPage: alasan.nextPage,
    getDate: date.getDate,
    addDate: date.addDate,
    getNotifArea: dashboard.getNotifArea,
    getNotif: dashboard.getNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(DateClossing)
	
	