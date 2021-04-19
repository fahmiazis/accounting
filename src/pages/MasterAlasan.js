import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Spinner} from 'reactstrap'
import logo from "../assets/img/logo.png"
import '../assets/css/style.css'
import {FaSearch} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle } from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import alasan from '../redux/actions/alasan'
import {connect} from 'react-redux'
import auth from '../redux/actions/auth'

const alasanSchema = Yup.object().shape({
    kode_alasan: Yup.string().required('must be filled'),
    alasan: Yup.string().required('must be filled'),
    status: Yup.string().required()
});

class MasterAlasan extends Component {
    state = {
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
        alert: false,
        upload: false,
        errMsg: '',
        fileUpload: '',
        limit: 10,
        search: ''
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
        this.getDataAlasan()
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            this.getDataAlasan({limit: 10, search: this.state.search})
        }
    }

    getDataAlasan = async (value) => {
        const token = localStorage.getItem("token")
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getAlasan(token, limit, search)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, detail, alert, upload, errMsg} = this.state
        const {dataAlasan, isGet, alertM, alertMsg, alertUpload, page} = this.props.alasan
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
                            {level === '1' ? (
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
                            <div className="titleDashboard col-md-12">Master Alasan</div>
                        </div>
                        <div className="secHeadDashboard">
                            <div>
                                <text>Show: </text>
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
                                            <th>Kode Alasan</th>
                                            <th>Alasan</th>
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
                                            <th>Kode Alasan</th>
                                            <th>Alasan</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {dataAlasan.length !== 0 && dataAlasan.map(item => {
                                        return (
                                        <tr onClick={() => this.openModalEdit(this.setState({detail: item}))}>
                                            <th scope="row">{(dataAlasan.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</th>
                                            <td>{item.kode_alasan}</td>
                                            <td>{item.alasan}</td>
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
                </Container>
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd}>
                    <ModalHeader toggle={this.openModalAdd}>Add Master Alasan</ModalHeader>
                    <Formik
                    initialValues={{kode_alasan: "", alasan: "", status: ""}}
                    validationSchema={alasanSchema}
                    onSubmit={(values) => {this.addAlasan(values)}}
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
                                    placeholder="ex: AL001"
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
                                <div className="sucUpdate green">Berhasil Menambah Alasan</div>
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
    alasan: state.alasan
})

const mapDispatchToProps = {
    logout: auth.logout,
    addAlasan: alasan.addAlasan,
    updateAlasan: alasan.updateAlasan,
    getAlasan: alasan.getAlasan,
    resetError: alasan.resetError,
    uploadMaster: alasan.uploadMaster,
    nextPage: alasan.nextPage
}

export default connect(mapStateToProps, mapDispatchToProps)(MasterAlasan)
	
	