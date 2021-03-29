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

class MasterEmail extends Component {
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
                <Container fluid={true} className="background-logo">
                    <div className="bodyDashboard">
                        <div className="headMaster">
                            <div className="titleDashboard col-md-12">Master Email</div>
                        </div>
                        <div className="secHeadDashboard">
                            <div>
                                <text>Show: </text>
                                <ButtonDropdown className="drop" isOpen={dropOpen} toggle={this.dropDown}>
                                <DropdownToggle caret color="light">
                                    10
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem>20</DropdownItem>
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
                                <Input className="search"><FaSearch size={20} /></Input>
                            </div>
                        </div>
                        <div className="tableDashboard">
                            <Table bordered responsive hover className="tab">
                                <thead>
                                    <tr>
                                        <th>No</th>
                                        <th>Kode Plant</th>
                                        <th>AREA</th>
                                        <th>Email AOS</th>
                                        <th>Email HO PIC</th>
                                        <th>Email BM</th>
                                        <th>Email GROM</th>
                                        <th>Email ROM</th>
                                        <th>Email HO 1</th>
                                        <th>Email HO 2</th>
                                        <th>Email HO 3</th>
                                        <th>Email HO 4</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr onClick={this.openModalEdit}>
                                        <th scope="row">1</th>
                                        <td>P161</td>
                                        <td>MEDAN TIMUR MT</td>
                                        <td>mariance_bukit@pinusmerahabadi.co.id</td>
                                        <td>pmaho_gl3@pinusmerahabadi.co.id</td>
                                        <td>hendry_chandra@pinusmerahabadi.co.id</td>
                                        <td>hafid_fauzi@pinusmerahabadi.co.id</td>
                                        <td>joni_thio@pinusmerahabadi.co.id</td>
                                        <td>grace_avianny@pinusmerahabadi.co.id</td>
                                        <td>hardiyansah@pinusmerahabadi.co.id</td>
                                        <td>lulu_istiqomah@pinusmerahabadi.co.id</td>
                                        <td></td>
                                        <td>Active</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>P217</td>
                                        <td>PONTIANAK TIMUR MT</td>
                                        <td>ferbiyan_grafiani@pinusmerahabadi.co.id</td>
                                        <td>pmaho_gl11@pinusmerahabadi.co.id</td>
                                        <td>hendry_chandra@pinusmerahabadi.co.id</td>
                                        <td>hafid_fauzi@pinusmerahabadi.co.id</td>
                                        <td>kim_lan@pinusmerahabadi.co.id</td>
                                        <td>grace_avianny@pinusmerahabadi.co.id</td>
                                        <td>hardiyansah@pinusmerahabadi.co.id</td>
                                        <td>lulu_istiqomah@pinusmerahabadi.co.id</td>
                                        <td></td>
                                        <td>Active</td>			
                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        <div>
                            <div className="infoPageEmail">
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
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd}>
                    <ModalHeader toggle={this.openModalAdd}>Add Master Email</ModalHeader>
                    <ModalBody>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Nama Depo
                            </text>
                            <Input type="select" name="select" className="col-md-9">
                                <option>-Pilih Depo-</option>
                                <option>178 - KRANJI</option>
                            </Input>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email AOS
                            </text>
                            <Input type="email" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email HO PIC
                            </text>
                            <Input type="email" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email BM
                            </text>
                            <Input type="email" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email GROM
                            </text>
                            <Input type="email" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email ROM
                            </text>
                            <Input type="email" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email HO 1
                            </text>
                            <Input type="email" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email HO 2
                            </text>
                            <Input type="email" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email HO 3
                            </text>
                            <Input type="email" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email HO 4
                            </text>
                            <Input type="email" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Status
                            </text>
                            <Input type="select" name="select" className="col-md-9">
                                <option>Active</option>
                                <option>Inactive</option>
                            </Input>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.openModalAdd} color="primary">Save</Button>
                        <Button onClick={this.openModalAdd}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit}>
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Email</ModalHeader>
                    <ModalBody>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Nama Depo
                            </text>
                            <Input type="select" name="select" className="col-md-9">
                                <option>P161 - MEDAN TIMUR MT</option>
                                <option>178 - KRANJI</option>
                            </Input>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email AOS
                            </text>
                            <Input type="email" value="mariance_bukit@pinusmerahabadi.co.id" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email HO PIC
                            </text>
                            <Input type="email" value="pmaho_gl3@pinusmerahabadi.co.id" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email BM
                            </text>
                            <Input type="email" value="hendry_chandra@pinusmerahabadi.co.id" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email GROM
                            </text>
                            <Input type="email" value="hafid_fauzi@pinusmerahabadi.co.id" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email ROM
                            </text>
                            <Input type="email" value="joni_thio@pinusmerahabadi.co.id" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email HO 1
                            </text>
                            <Input type="email" value="grace_avianny@pinusmerahabadi.co.id" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email HO 2
                            </text>
                            <Input type="email" value="hardiyansah@pinusmerahabadi.co.id" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email HO 3
                            </text>
                            <Input type="email" value="lulu_istiqomah@pinusmerahabadi.co.id" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Email HO 4
                            </text>
                            <Input type="email" value="" name="email_aos" className="col-md-9"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Status
                            </text>
                            <Input type="select" name="select" className="col-md-9">
                                <option>Active</option>
                                <option>Inactive</option>
                            </Input>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.openModalEdit} color="primary">Save</Button>
                        <Button onClick={this.openModalEdit}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master Email</ModalHeader>
                    <ModalBody className="modalUpload">
                        <div className="titleModalUpload">
                            <text>Upload File: </text>
                            <div className="uploadFileInput ml-4">
                                <AiOutlineFilePdf size={35} />
                                <Input type="file" name="file" className="ml-3" />
                            </div>
                        </div>
                        <div className="btnUpload">
                            <Button color="info">Download Template</Button>
                            <Button color="primary">Upload</Button>
                            <Button onClick={this.openModalUpload}>Cancel</Button>
                        </div>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

export default  MasterEmail
	