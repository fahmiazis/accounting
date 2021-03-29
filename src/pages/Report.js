import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap'
import logo from "../assets/img/logo.png"
import '../assets/css/style.css'
import {FaSearch} from 'react-icons/fa'
import {AiOutlineMail, AiOutlineMenu, AiOutlineFilePdf, AiOutlineFileExcel} from 'react-icons/ai'

class Report extends Component {
    state = {
        isOpen: false,
        dropOpen: false,
        dropOpenNum: false,
        value: '',
        onChange: new Date(),
        sidebarOpen: false,
        modalAdd: false,
        modalEdit: false,
        modalUpload: false,
        modalDownload: false
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

    render() {
        const {isOpen, dropOpen, dropOpenNum} = this.state
        return (
            <>
                <Navbar color="light" light expand="md" className="navbar">
                    <NavbarBrand href="/home"><img src={logo} alt="logo" className="logo" /></NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem>
                                <NavLink href="/home" className="navHome">Home</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/dashboard" className="navDoc">Dashboard</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink href="/dokumen" className="navDoc">Document</NavLink>
                            </NavItem>
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
                <Container fluid={true}>
                    <div className="titleDashboard col-md-12 titleReport">Report</div>
                    <div>
                        <div className="headReport">
                            <text className="col-md-2 fontReport">Jenis</text>
                            <div className="optionType col-md-4">
                                <text className="colon">:</text>
                                <Input type="select" name="select" className="optionList">
                                    <option>Daily</option>
                                    <option>Monthly</option>
                                </Input>
                            </div>
                        </div>
                        <div className="headReport">
                            <text className="col-md-2 fontReport">Tanggal Dokumen</text>
                            <div className="optionType col-md-4">
                                <text className="colon">:</text>
                                <Input type="date" name="creeatedAt"/>
                                <text className="toColon">To</text>
                                <text className="colon">:</text>
                                <Input type="date" name="creeatedAt"/>
                            </div>
                        </div>
                        <div className="headReport">
                            <text className="col-md-2 fontReport">PIC</text>
                            <div className="optionType col-md-4">
                                <text className="colon">:</text>
                                <Input type="select" name="select">
                                    <option>-Pilih PIC-</option>
                                    <option>Anjar</option>
                                </Input>
                            </div>
                        </div>
                        <div className="headReport">
                            <text className="col-md-2 fontReport">Depo</text>
                            <div className="optionType col-md-4">
                                <text className="colon">:</text>
                                <Input type="select" name="select">
                                    <option>-Pilih Depo-</option>
                                    <option>178 - Kranji</option>
                                </Input>
                            </div>
                        </div>
                    </div>
                    <Button color="primary" size="lg" className="ml-3 mt-3 col-md-1">Download</Button>
                </Container>
            </>
        )
    }
}

export default  Report
	