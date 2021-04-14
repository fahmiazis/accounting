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
import auth from '../redux/actions/auth'
import logo from "../assets/img/logo.png"
import '../assets/css/style.css'
import {FaSearch} from 'react-icons/fa'
import {AiOutlineCheck, AiFillCheckCircle, AiOutlineClose, AiOutlineMinus, AiOutlineFilePdf, AiOutlineFileExcel} from 'react-icons/ai'
import {BsCircle, BsDashCircleFill} from 'react-icons/bs'
import {MdWatchLater} from 'react-icons/md'
import dashboard from '../redux/actions/dashboard'
import moment from 'moment'
import {connect} from 'react-redux'
import {Formik} from 'formik'
import * as Yup from 'yup'
import alasan from '../redux/actions/alasan'

const {REACT_APP_BACKEND_URL} = process.env

const alasanSchema = Yup.object().shape({
    alasan: Yup.string().required()
});

class Dokumen extends Component {
    state = {
        alert: false,
        isOpen: false,
        openModal: false,
        drop: false,
        dropOpen: false,
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
        tipe: '',
        appAct: {}
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
        const {isShow} = this.props.dashboard
        if (isShow) {
            this.openModalPdf()
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
    }

    showDok = async (value) => {
        const token = localStorage.getItem('token')
        this.setState({fileName: value.path, appAct: value.active})
        await this.props.showDokumen(token, value.path.id)
        const {isShow} = this.props.dashboard
        if (isShow) {
            this.openModalPdf()
        }
    }

    getDataDashboard = async () => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        if (level === '4' || level === '5') {
            await this.props.getDashboard(token)
            await this.props.getActivity(token)   
        } else if (level === '3' || level === '1' || level === '2') {
            await this.props.getDashboardPic(token)
        }
    }

    prepareDokumen = () => {
        const {dataSa, dataKasir} = this.props.dashboard
        const data = []
        dataSa.map(x => {
            return (
                data.push(x.dokumen.length)
            )
        })
        dataKasir.map(x => {
            return (
                data.push(x.dokumen.length)
            )
        })
        const res = []
        for (let i = 0; i <= Math.max(...data)-1; i++) {
            res.push(i)
        }
        this.setState({totalDoc: res})
    }

    componentDidUpdate() {
        const {isError, isUpload, isGetPic, isApprove, isReject} = this.props.dashboard
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
        } else if (isGetPic) {
            this.prepareDokumen()
            this.props.resetError()
        } else if (isApprove) {
            this.getDataDashboard()
            this.setState({openModal: false, openPdf: false, openApprove: false})
            this.props.resetError()
        } else if (isReject) {
            this.getDataDashboard()
            this.setState({openModal: false, openPdf: false, openReject: false})
            this.props.resetError()
        }
    }


    render() {
        const {isOpen, dropOpen, act, errMsg, dropOpenNum, doc, openModal, openPdf, openApprove, openReject, drop, upload, totalDoc} = this.state
        const level = localStorage.getItem('level')
        const {dataDash, dataActive, active, alertMsg, alertM, dataShow, dataSa, dataKasir, dataDepo} = this.props.dashboard
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
                            <NavItem>
                                <NavLink href="/dokumen" className="navDoc">Document</NavLink>
                            </NavItem>
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
                        </Nav>
                        <UncontrolledDropdown>
                            <DropdownToggle nav caret>
                                {level === '1' ? 'Super Admin': level === '2' ? 'SPV': level === '3' ? 'PIC': level === '4' ? 'SA' :level === '5' ? 'Kasir' : 'User'}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => this.props.logout()}>Log Out</DropdownItem>
                            </DropdownMenu>
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
                        <div className="titleDashboard">Dashboard</div>
                        <div className="headDashboard">
                            <div>
                                <text>Jenis: </text>
                                <ButtonDropdown className="drop" isOpen={dropOpenNum} toggle={this.dropOpenN}>
                                <DropdownToggle caret color="light">
                                    Daily
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem>Monthly</DropdownItem>
                                </DropdownMenu>
                                </ButtonDropdown>
                            </div>
                            <div className="dateDash">
                                <div>Tanggal Dokumen: </div>
                                <div className="inputCalendar">
                                    <Input  type="date"/>
                                </div>
                                {/* <div><FaCalendarAlt size={22} /></div> */}
                                {/* <Calendar
                                value={this.state.value}
                                onChange={this.state.onChange}
                                /> */}
                            </div>
                        </div>
                        <div className="secHeadDashboard">
                            <div className="searchDash">
                                <div className="secSearch mr-4">
                                    <text className="mr-2">
                                        Show: 
                                    </text>
                                    <Input
                                    className=""
                                    type="select"
                                    name="select"
                                    >   
                                    <option>10</option>
                                    <option>25</option>
                                    <option>50</option>
                                </Input>
                                </div>
                                <div className="secSearch">
                                    <text>Search: </text>
                                    <Input className="search"><FaSearch size={20} /></Input>
                                </div>
                            </div>
                            <div className="statusSym">
                                <div><AiOutlineCheck size={20} className="blue" /><text>  Approve</text></div>
                                <div><AiOutlineClose size={20} className="red" /><text>  Reject</text></div>
                                <div><BsCircle size={20} className="green" /><text>  Open</text></div>
                                <div><BsDashCircleFill size={20} className="black" /><text>  Empty</text></div>
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
                                            <th>Uploaded By</th>
                                        </tr>
                                        ): (
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
                                            <tr className="danger" onClick={() => this.openModalProses(this.setState({doc: active[active.indexOf(x)].doc, aktif: active[active.indexOf(x)]}))}>
                                                <th scope="row">{(active.indexOf(x) + 1)}</th>
                                                <td>{moment(x.createdAt).subtract(1, 'day').format('DD MMMM, YYYY')}</td>
                                                <td>{moment(x.createdAt).format('DD MMMM, YYYY')}</td>
                                                {dataDash !== undefined && dataDash.map(y => {
                                                    return (
                                                    <td>
                                                        {x.doc.length === 0 ? (
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
                                                                    ) : (
                                                                        <div></div>
                                                                    )
                                                                )
                                                            })
                                                        )}
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
                                                    <td>{Math.round((x.progress/dataDash.length) * 100) === 100 ? 'Done' : Math.round((x.progress/dataDash.length) * 100) === 0 ? 'Belum Upload' : 'Kurang Upload' }</td>
                                                ):(
                                                    <td>Belum Upload</td>
                                                )}
                                            </tr>
                                            )
                                        })}
                                </tbody>
                                ): level === '6' || level === '3' || level === '2' || level === '1' ? (
                                <tbody>
                                        {dataSa !== undefined && dataSa.map(x => {
                                            return (
                                            <tr className="danger" onClick={() => this.openModalProses(this.setState({doc: dataSa[dataSa.indexOf(x)].dokumen, act: dataSa[dataSa.indexOf(x)].active}))}>
                                                <th scope="row">{(dataSa.indexOf(x) + 1)}</th>
                                                <td>{x.kode_plant}</td>
                                                <td>{x.nama_depo}</td>
                                                {x.active.length > 0 ? (
                                                    <td>{moment(x.active[0].createdAt).subtract(1, 'day').format('DD MMMM, YYYY')}</td>
                                                ):(
                                                    <td>{moment(x.dokumen[0].postDokumen).format('DD MMMM, YYYY')}</td>
                                                )}
                                                {x.active.length > 0 ? (
                                                    <td>{moment(x.active[0].createdAt).format('DD MMMM, YYYY')}</td>
                                                ):(
                                                    <td>-</td>
                                                )}
                                                {x.active.length > 0 ? (
                                                    x.active[0].doc.length > 0 ? (
                                                        x.active[0].doc.length < totalDoc.length ? (
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
                                                    <td>{Math.round((x.active[0].progress/x.dokumen.length) * 100) === 100 ? 'Done' : Math.round((x.active[0].progress/x.dokumen.length) * 100) === 0 ? 'Belum Upload' : 'Kurang Upload' }</td>
                                                ):(
                                                    <td>Belum Upload</td>
                                                )}
                                                <td>SA</td>
                                            </tr>
                                            )
                                        })}
                                        {dataKasir !== undefined && dataKasir.map(x => {
                                            return (
                                            <tr className="danger" onClick={() => this.openModalProses(this.setState({doc: dataKasir[dataKasir.indexOf(x)].dokumen, act: dataKasir[dataKasir.indexOf(x)].active}))}>
                                                <th scope="row">{(dataKasir.indexOf(x) + dataSa.length + 1)}</th>
                                                <td>{x.kode_plant}</td>
                                                <td>{x.nama_depo}</td>
                                                {x.active.length > 0 ? (
                                                    <td>{moment(x.active[0].createdAt).subtract(1, 'day').format('DD MMMM, YYYY')}</td>
                                                ):(
                                                    <td>{moment(x.dokumen[0].postDokumen).format('DD MMMM, YYYY')}</td>
                                                )}
                                                {x.active.length > 0 ? (
                                                    <td>{moment(x.active[0].createdAt).format('DD MMMM, YYYY')}</td>
                                                ):(
                                                    <td>-</td>
                                                )}
                                                {x.active.length > 0 ? (
                                                    x.active[0].doc.length > 0 ? (
                                                        x.active[0].doc.length < totalDoc.length ? (
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
                                                    <td>{Math.round((x.active[0].progress/x.dokumen.length) * 100) === 100 ? 'Done' : Math.round((x.active[0].progress/x.dokumen.length) * 100) === 0 ? 'Belum Upload' : 'Kurang Upload' }</td>
                                                ):(
                                                    <td>Belum Upload</td>
                                                )}
                                                <td>Kasir</td>
                                            </tr>
                                            )
                                        })}
                                </tbody>
                                ): (
                                    <tbody>
                                    <tr className="danger" onClick={this.openModalProses}>
                                        <th scope="row">1</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
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
                                        <td>14</td>
                                        <td>100%</td>
                                        <td>Done</td>
                                    </tr>
                                    </tbody>
                                )}
                            </Table>
                        </div>
                        <div>
                            <div className="infoPage">
                                <text>Showing 1 to 3 of entries</text>
                                <div className="pageButton">
                                    <button className="btnPrev">Previous</button>
                                    <text>1</text>
                                    <text>....</text>
                                    <text>10</text>
                                    <button className="btnPrev">Next</button>
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
                                                <BsDashCircleFill size={25} className="black cir" />
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
                <Modal isOpen={openPdf} size="lg" toggle={this.openModalPdf} centered={true}>
                <ModalHeader toggle={this.openModalPdf}>Dokumen</ModalHeader>
                    <ModalBody>
                        <div className="readPdf">
                            <Pdf pdf={REACT_APP_BACKEND_URL + dataShow} />
                        </div>
                    </ModalBody>
                    {level === '1' || level === '2' || level === '3' ? (
                    <ModalFooter>
                        <Button color="danger" onClick={this.openModalReject}>Reject</Button>
                        <Button color="primary" onClick={this.openModalApprove}>Approve</Button>
                    </ModalFooter>
                    ) : (
                    <ModalFooter>
                        <Button color="primary" onClick={() => this.setState({openPdf: false})}>Close</Button>
                    </ModalFooter>)}
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
                                    <option value="Report Tidak Sesuai" >Report Tidak Sesuai</option>
                                    <option value="Report Tidak Update">Report Tidak Update</option>
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
                <Modal isOpen={this.props.dashboard.isUpload ? true: false} size="sm">
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
    dashboard: state.dashboard
})

const mapDispatchToProps = {
    logout: auth.logout,
    getDashboard: dashboard.getDashboard,
    getActivity: dashboard.getActivity,
    uploadDocument: dashboard.uploadDokumen,
    resetError: dashboard.resetError,
    approve: dashboard.approve,
    reject: dashboard.reject,
    showDokumen: dashboard.showDokumen,
    getDashboardPic: dashboard.getDashboardPic,
    sendEmail: dashboard.sendEmail
}

export default connect(mapStateToProps, mapDispatchToProps)(Dokumen)