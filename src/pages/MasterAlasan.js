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

class MasterAlasan extends Component {
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
                            <div className="titleDashboard col-md-12">Master Alasan</div>
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
                                        <th>Alasan</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr onClick={this.openModalEdit}>
                                        <th scope="row">1</th>
                                        <td>Dokumen Tidak Jelas</td>
                                        <td>Active</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Dokumen Salah Kirim</td>
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
                    <ModalHeader toggle={this.openModalAdd}>Add Master Alasan</ModalHeader>
                    <ModalBody>
                        <div className="addModalDepo">
                            <text className="col-md-4">
                                Nama Alasan
                            </text>
                            <Input type="textarea" name="nama_alasan" className="col-md-8"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-4">
                                Status
                            </text>
                            <Input type="select" name="select" className="col-md-8">
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
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Alasan</ModalHeader>
                    <ModalBody>
                    <div className="addModalDepo">
                            <text className="col-md-4">
                                Nama Dokumen
                            </text>
                            <Input type="textarea" name="nama_pic" value="Dokumen Tidak Jelas" className="col-md-8"/>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-4">
                                Status
                            </text>
                            <Input type="select" name="select" className="col-md-8">
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
                    <ModalHeader>Upload Master Alasan</ModalHeader>
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

export default  MasterAlasan
	