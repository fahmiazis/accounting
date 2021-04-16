import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Input, Button, ButtonDropdown,
    } from 'reactstrap'
import logo from "../assets/img/logo.png"
import '../assets/css/style.css'
import auth from '../redux/actions/auth'
import {connect} from 'react-redux'

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
        modalDownload: false,
        type: "Daily",
        openType: false,
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

    componentDidUpdate() {
        console.log(this.state.type === "")
    }

    openTypeFunc = () => {
        this.setState({openType: !this.state.openType})
    }

    render() {
        const {isOpen, dropOpenNum, type} = this.state
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
                            <DropdownToggle nav caret>
                                {level === '1' ? 'Super Admin': level === '2' ? 'SPV': level === '3' ? 'PIC': level === '4' ? 'SA' :level === '5' ? 'Kasir' : 'User'}
                            </DropdownToggle>
                            <DropdownMenu right>
                            <DropdownItem onClick={() => this.props.logout()}>Log Out</DropdownItem>
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
                                <ButtonDropdown isOpen={this.state.openType} toggle={this.openTypeFunc} className="dropButton">
                                    <DropdownToggle caret color="light">
                                        {type}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={() => this.setState({type: 'Daily'})}>
                                            Daily
                                        </DropdownItem>
                                        <DropdownItem onClick={() => this.setState({type: 'Monthly'})}>
                                            Monthly
                                        </DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </div>
                        </div>
                        {type === "Daily" ? (
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
                        ) : type === "Monthly" ?(
                        <div className="headReport">
                            <text className="col-md-2 fontReport">Periode Dokumen</text>
                            <div className="optionType col-md-4">
                                <text className="colon">:</text>
                                <Input type="select" name="select">
                                    <option>-Pilih Period-</option>
                                    <option>Januari</option>
                                    <option>Februari</option>
                                </Input>
                            </div>
                        </div>
                        ): (
                            <div></div>
                        )}
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

const mapStateToProps = state => ({
    auth: state.auth
})

const mapDispatchToProps = {
    logout: auth.logout,
}

export default connect(mapStateToProps, mapDispatchToProps)(Report)
	