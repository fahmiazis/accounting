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

class Home extends Component {

    state = {
        isOpen: false,
        dropOpenNum: false,
    }

    dropOpen = () => {
        this.setState({dropOpenNum: !this.state.dropOpenNum})
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    render() {
        const {isOpen, dropOpenNum} = this.state
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
    auth: state.auth
})

const mapDispatchToProps = {
    logout: auth.logout,
    getDashboard: dashboard.getDashboard
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)