import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Dropdown} from 'reactstrap'
import logo from "../assets/img/logo.png"
import '../assets/css/style.css'
import {FaSearch} from 'react-icons/fa'
import {AiOutlineCheck, AiOutlineClose, AiOutlineMinus} from 'react-icons/ai'
import {BsCircle, BsDashCircleFill} from 'react-icons/bs'
import {connect} from 'react-redux'
import dashboard from '../redux/actions/dashboard'
import moment from 'moment'

class Dashboard extends Component {
    state = {
        isOpen: false,
        dropOpen: false,
        dropOpenNum: false,
        value: '',
        onChange: new Date(),
        drop: false
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
    dropOpenNum = () => {
        this.setState({dropOpenNum: !this.state.dropOpenNum})
    }

    componentDidMount(){
        this.getDataDashboard()
    }

    getDataDashboard = async () => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        if (level === '4' || level === '5') {
            await this.props.getDashboard(token)
            await this.props.getActivity(token)   
        } else if (level === '3') {
            await this.props.getDashboardPic(token)
        }
    }

    render() {
        const {isOpen, dropOpen, dropOpenNum, drop} = this.state
        const {dataDash, dataActive, active} = this.props.dashboard
        const level = localStorage.getItem('level')
        return (
            <>
                <Navbar color="light" light expand="md" className="navbar">
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
                            <DropdownToggle nav caret>Super Admin</DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem>Log Out</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Collapse>
                </Navbar>
                <Container fluid={true} className="background-logo">
                    {/* <div className="background-logo">
                        <img src={background} alt="background" className="imgBackground" />
                    </div> */}
                    <div className="bodyDashboard">
                        <div className="titleDashboard">Dashboard</div>
                        <div className="headDashboard">
                            <div>
                                <text>Jenis: </text>
                                <ButtonDropdown className="drop" isOpen={dropOpenNum} toggle={this.dropOpenNum}>
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
                            <div className="statusSym">
                                <div><AiOutlineCheck size={20} className="blue" /><text>  Approve</text></div>
                                <div><AiOutlineClose size={20} className="red" /><text>  Reject</text></div>
                                <div><BsCircle size={20} className="green" /><text>  Open</text></div>
                                <div><BsDashCircleFill size={20} className="black" /><text>  Empty</text></div>
                            </div>
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
                                        ): level === '6' || level === '3' ? (
                                        <tr>
                                            <th>No</th>
                                            <th>Kode Depo</th>
                                            <th>Nama Depo</th>
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
                                        ): (
                                        <tr>
                                            <th>No</th>
                                            <th>PIC</th>
                                            <th>Kode Depo</th>
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
                                            <tr>
                                                <th scope="row">{(active.indexOf(x) + 1)}</th>
                                                <td>{moment(dataDash[0].createdAt).format('DD MMMM, YYYY')}</td>
                                                <td>{moment(x.createdAt).format('DD MMMM, YYYY')}</td>
                                                {dataDash !== undefined && dataDash.map(item => {
                                                    return (
                                                    <td>
                                                        {x.doc.length === 0 ? (
                                                            <AiOutlineMinus className="black" />
                                                        ): (
                                                            <div></div>
                                                        )}
                                                    </td>
                                                    )
                                                })}
                                                <td>{dataDash.length}</td>
                                                <td>{(x.doc.length/dataDash.length) * 100} %</td>
                                                <td>{x.status}</td>
                                            </tr>
                                            )
                                        })}
                                </tbody>
                                ): level === '6' || level === '3' ? (
                                <tbody>
                                        {active !== undefined && active.map(x => {
                                            return (
                                            <tr>
                                                <th scope="row">{(active.indexOf(x) + 1)}</th>
                                                <td>P238</td>
                                                <td>PMA BALIKPAPAN</td>
                                                <td>{moment(dataDash[0].createdAt).format('DD MMMM, YYYY')}</td>
                                                <td>{moment(x.createdAt).format('DD MMMM, YYYY')}</td>
                                                {dataDash !== undefined && dataDash.map(item => {
                                                    return (
                                                    <td>
                                                        {x.doc.length === 0 ? (
                                                            <AiOutlineMinus className="black" />
                                                        ): (
                                                            <div></div>
                                                        )}
                                                    </td>
                                                    )
                                                })}
                                                <td>{dataDash.length}</td>
                                                <td>{(x.doc.length/dataDash.length) * 100} %</td>
                                                <td>{x.status}</td>
                                            </tr>
                                            )
                                        })}
                                </tbody>
                                ): (
                                    <tbody>
                                    <tr>
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
            </>
        )
    }
}

const mapStateToProps = state => ({
    dashboard: state.dashboard
})

const mapDispatchToProps = {
    getDashboard: dashboard.getDashboard,
    getActivity: dashboard.getActivity,
    getDashboardPic: dashboard.getDashboardPic
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)