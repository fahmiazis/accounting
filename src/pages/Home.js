import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
NavbarToggler, NavbarBrand, NavItem, NavLink,
UncontrolledDropdown, DropdownToggle, DropdownMenu,
DropdownItem, Dropdown} from 'reactstrap'
import auth from '../redux/actions/auth'
import logo from "../assets/img/logo.png"
import '../assets/css/style.css'
import {connect} from 'react-redux'
import dashboard from '../redux/actions/dashboard'
import {BsBell} from 'react-icons/bs'
import { FcDocument } from 'react-icons/fc'
import moment from 'moment'
// import socket from '../helpers/socket'
import {BsFillCircleFill} from 'react-icons/bs'

const {REACT_APP_BACKEND_URL} = process.env


class Home extends Component {

    state = {
        isOpen: false,
        settingOpen: false,
        dropOpenNum: false,
    }

    dropOpen = () => {
        this.setState({dropOpenNum: !this.state.dropOpenNum})
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    dropSetting = () => {
        this.setState({settingOpen: !this.state.settingOpen})
    }

    componentDidMount(){
        this.getNotif()
    }

    componentDidUpdate(){
        // const kode = localStorage.getItem('kode')
        // socket.on(kode, () => {
        //     this.getNotif()
        // })
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
        const {isOpen, dropOpenNum} = this.state
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {notif, notifSa, notifKasir} = this.props.dashboard
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
                            {level === '2' ? (
                                <Dropdown nav isOpen={dropOpenNum} toggle={this.dropOpen}>
                                <DropdownToggle nav caret className="navDoc">
                                    Document
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem href="/dokumen">
                                        Verifikasi Dokumen
                                    </DropdownItem>
                                    <DropdownItem href="/setting/dokumen">
                                        Setting Dokumen
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            ) : (
                            <NavItem>
                                <NavLink href="/dokumen" className="navDoc">Document</NavLink>
                            </NavItem>
                            )}
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
                            {level === '2' ? (
                            <Dropdown nav isOpen={this.state.settingOpen} toggle={this.dropSetting}>
                                <DropdownToggle nav caret className="navDoc">
                                    Setting
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem href="/lock">
                                        Setting Access
                                    </DropdownItem>
                                    <DropdownItem href="/date">
                                        Setting Date Clossing
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            ) : (
                                <div></div>
                            )}
                        </Nav>
                        <UncontrolledDropdown>
                            <DropdownToggle nav caret>
                            {level === '1' ? names + ' - ' + 'Super Admin': level === '2' ? names + ' - ' + 'SPV': level === '3' ? names + ' - ' + 'PIC': level === '4' ? names :level === '5' ? names : 'User'}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem onClick={() => this.props.logout()}>Log Out</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown className="uncon">
                            <DropdownToggle nav>
                                <div className="optionType">
                                    <BsBell size={20} />
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
                                <DropdownMenu right>
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
                                <DropdownMenu right>
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
                    </Collapse>
                </Navbar>
                <Container className="bodyHome">
                    <div className="titleSec">
                        <text className="bigTitle">PT. Pinus Merah Abadi</text>
                        <text className="smallTitle">Distribution Company</text>
                    </div>
                    <div>
                        <img src={logo} alt="logo" className="imgHead" />
                    </div>
                </Container>
            </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    dashboard: state.dashboard
})

const mapDispatchToProps = {
    logout: auth.logout,
    getDashboard: dashboard.getDashboard,
    getNotifArea: dashboard.getNotifArea,
    getNotif: dashboard.getNotif
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)