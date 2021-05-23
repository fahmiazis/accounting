import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
NavbarToggler, NavbarBrand, NavItem, NavLink,
UncontrolledDropdown, DropdownToggle, DropdownMenu,
DropdownItem, Dropdown} from 'reactstrap'
import auth from '../redux/actions/auth'
import logo from "../assets/img/logo.png"
import '../assets/css/style.css'
import {connect} from 'react-redux'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import dashboard from '../redux/actions/dashboard'
import {BsBell} from 'react-icons/bs'
import { FcDocument } from 'react-icons/fc'
import moment from 'moment'
// import socket from '../helpers/socket'
import {BsFillCircleFill} from 'react-icons/bs'
import Sidebar from "../components/Header";
import MaterialTitlePanel from "../components/material_title_panel";
import SidebarContent from "../components/sidebar_content";

const {REACT_APP_BACKEND_URL} = process.env


class Home extends Component {

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
            isOpen: false,
            settingOpen: false,
            dropOpenNum: false,
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
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

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
      }

    render() {
        const {isOpen, dropOpenNum} = this.state
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {notif, notifSa, notifKasir} = this.props.dashboard

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
                        <div className="bodyHome">
                            <div className="titleSec">
                                <text className="bigTitle">PT. Pinus Merah Abadi</text>
                                <text className="smallTitle">Distribution Company</text>
                            </div>
                            <div>
                                <img src={logo} alt="logo" className="imgHead" />
                            </div>  
                        </div>
                    </MaterialTitlePanel>
                </Sidebar>
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