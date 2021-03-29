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

class MasterDepo extends Component {
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
                            <div className="titleDashboard col-md-12">Master Depo</div>
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
                                        <th>Kode Depo</th>
                                        <th>Nama Depo</th>
                                        <th>Home Town</th>
                                        <th>Channel</th>
                                        <th>Distribution</th>
                                        <th>Status Depo</th>
                                        <th>Kode SAP 1</th>
                                        <th>Kode SAP 2</th>
                                        <th>Kode PLANT</th>
                                        <th>Nama GROM</th>
                                        <th>Nama BM</th>
                                        <th>Nama ASS</th>
                                        <th>Nama PIC 1</th>
                                        <th>Nama PIC 2</th>
                                        <th>Nama PIC 3</th>
                                        <th>Nama PIC 4</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr onClick={this.openModalEdit}>
                                        <th scope="row">1</th>
                                        <td>168</td>
                                        <td>PMA BALIKPAPAN</td>
                                        <td>BALIKPAPAN</td>
                                        <td>GT</td>
                                        <td>PMA</td>
                                        <td>Cabang SAP</td>
                                        <td>1000811</td>
                                        <td>23000380</td>
                                        <td>P238</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>187</td>
                                        <td>PMA BALIKPAPAN MT</td>
                                        <td>BALIKPAPAN</td>
                                        <td>MT</td>
                                        <td>PMA</td>
                                        <td>Cabang Scylla</td>
                                        <td>1000812</td>
                                        <td>23000381</td>
                                        <td>P239</td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>			
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
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd} size="lg">
                    <ModalHeader toggle={this.openModalAdd}>Add Master Depo</ModalHeader>
                    <ModalBody className="addDepo">
                        <div className="col-md-6">
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode Depo
                                </text>
                                <Input type="name" name="nama_pic" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama Depo
                                </text>
                                <Input type="name" name="nama_spv" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Home Town
                                </text>
                                <Input type="name" name="nama_spv" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Channel
                                </text>
                                <Input type="select" name="select" className="col-md-8">
                                    <option>-Pilih Channel-</option>
                                    <option>GT</option>
                                    <option>MT</option>
                                </Input>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Distribution
                                </text>
                                <Input type="select" name="select" className="col-md-8">
                                    <option>-Pilih Distribution-</option>
                                    <option>PMA</option>
                                    <option>SUB</option>
                                </Input>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Status Depo
                                </text>
                                <Input type="select" name="select" className="col-md-8">
                                    <option>-Pilih Status Depo-</option>
                                    <option>Cabang SAP</option>
                                    <option>Cabang Scylla</option>
                                    <option>Depo SAP</option>
                                    <option>Depo Scylla</option>
                                </Input>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode SAP 1
                                </text>
                                <Input type="name" name="nama_spv" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode SAP 2
                                </text>
                                <Input type="name" name="nama_spv" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode Plant
                                </text>
                                <Input type="name" name="nama_spv" className="col-md-8"/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama GROM
                                </text>
                                <Input type="name" name="nama_spv" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama BM
                                </text>
                                <Input type="name" name="nama_spv" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama ASS
                                </text>
                                <Input type="name" name="nama_spv" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama PIC 1
                                </text>
                                <Input type="name" name="nama_spv" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama PIC 2
                                </text>
                                <Input type="name" name="nama_spv" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama PIC 3
                                </text>
                                <Input type="name" name="nama_spv" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama PIC 4
                                </text>
                                <Input type="name" name="nama_spv" className="col-md-8"/>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.openModalAdd} color="primary">Save</Button>
                        <Button onClick={this.openModalAdd}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Modal toggle={this.openModalEdit} isOpen={this.state.modalEdit} size="lg">
                    <ModalHeader toggle={this.openModalEdit}>Edit Master Depo</ModalHeader>
                    <ModalBody className="addDepo">
                    <div className="col-md-6">
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode Depo
                                </text>
                                <Input type="name" name="nama_pic" value="168" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama Depo
                                </text>
                                <Input type="name" name="nama_spv" value="PMA BALIKPAPAN" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Home Town
                                </text>
                                <Input type="name" name="nama_spv" value="BALIKPAPAN" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Channel
                                </text>
                                <Input type="select" name="select" className="col-md-8">
                                    <option>GT</option>
                                    <option>MT</option>
                                </Input>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Distribution
                                </text>
                                <Input type="select" name="select" value="" className="col-md-8">
                                    <option>PMA</option>
                                    <option>SUB</option>
                                </Input>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Status Depo
                                </text>
                                <Input type="select" name="select" value="" className="col-md-8">
                                    <option>Cabang SAP</option>
                                    <option>Cabang Scylla</option>
                                    <option>Depo SAP</option>
                                    <option>Depo Scylla</option>
                                </Input>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode SAP 1
                                </text>
                                <Input type="name" name="nama_spv" value="1000811" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode SAP 2
                                </text>
                                <Input type="name" name="nama_spv" value="23000380" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Kode Plant
                                </text>
                                <Input type="name" name="nama_spv" value="P238" className="col-md-8"/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama GROM
                                </text>
                                <Input type="name" name="nama_spv" value="" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama BM
                                </text>
                                <Input type="name" name="nama_spv" value="" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama ASS
                                </text>
                                <Input type="name" name="nama_spv" value="" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama PIC 1
                                </text>
                                <Input type="name" name="nama_spv" value="" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama PIC 2
                                </text>
                                <Input type="name" name="nama_spv" value="" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama PIC 3
                                </text>
                                <Input type="name" name="nama_spv" value="" className="col-md-8"/>
                            </div>
                            <div className="addModalDepo">
                                <text className="col-md-4">
                                    Nama PIC 4
                                </text>
                                <Input type="name" name="nama_spv" value="" className="col-md-8"/>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.openModalEdit} color="primary">Save</Button>
                        <Button onClick={this.openModalEdit}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} >
                    <ModalHeader>Upload Master Depo</ModalHeader>
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

export default  MasterDepo
	