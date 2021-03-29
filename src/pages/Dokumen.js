/* eslint-disable jsx-a11y/anchor-is-valid */
// eslint-disable-next-line jsx-a11y/anchor-is-valid
import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Label, Dropdown} from 'reactstrap'
// import Modals from "../components/Modals"
import Pdf from "../components/Pdf"
import tesPDF from "../assets/img/07 Matematika SMK.pdf"
import logo from "../assets/img/logo.png"
import '../assets/css/style.css'
import {FaSearch} from 'react-icons/fa'
import {AiOutlineCheck, AiOutlineClose, AiOutlineMinus, AiOutlineFilePdf, AiOutlineFileExcel} from 'react-icons/ai'
import {BsCircle, BsDashCircleFill} from 'react-icons/bs'

class Dokumen extends Component {
    state = {
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

    render() {
        const {isOpen, dropOpen, dropOpenNum, openModal, openPdf, openApprove, openReject, drop} = this.state
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
                        <div className="titleDashboard">Verifikasi Dokumen</div>
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
                            <div className="secSearch">
                                <text>Search: </text>
                                <Input className="search"><FaSearch size={20} /></Input>
                            </div>
                        </div>
                        <div className="tableDashboard">
                            <Table bordered responsive hover className="tab">
                                <thead>
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
                                        <th>Action</th>
                                    </tr>
                                </thead>
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
                                        <td>
                                            <Button onClick={this.openModalPdf} color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Anjar</td>
                                        <td>107</td>
                                        <td>Garut</td>
                                        <td>01 Januari 2021</td>
                                        <td>02 Januari 2021</td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineClose className="red" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><BsCircle className="green" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td><AiOutlineMinus className="black" /></td>
                                        <td><AiOutlineCheck className="blue" /></td>
                                        <td>14</td>
                                        <td>80%</td>
                                        <td>Kurang Upload</td>
                                        <td>
                                            <Button onClick={this.openModalPdf} color="primary" outline className='btnProses'>
                                                Download
                                            </Button>
                                        </td>
                                    </tr>
                                </tbody>
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
                            <div className="statusSym">
                                <div><AiOutlineCheck size={20} className="blue" /><text>  Approve</text></div>
                                <div><AiOutlineClose size={20} className="red" /><text>  Reject</text></div>
                                <div><BsCircle size={20} className="green" /><text>  Open</text></div>
                                <div><BsDashCircleFill size={20} className="black" /><text>  Empty</text></div>
                            </div>
                        </div>
                    </div>
                </Container>
                <Modal isOpen={openModal} size="lg" toggle={this.openModalProses}>
                    <ModalHeader toggle={this.openModalProses}>Proses Dokumen Daily</ModalHeader>
                    <ModalBody>
                            <div className="modal-dashboard">
                                <div className="secModal">
                                    <div className="col-md-6">
                                        <text>Laporan Rekonsiliasi Bank Collection</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                            <BsDashCircleFill size={30} className="black cir" />
                                            <AiOutlineFilePdf size={30} className="pdf" />
                                            <input type="file" />
                                        </div>
                                    </div>
                                </div>
                                <div className="secModal">
                                    <div className="col-md-6">
                                        <text>Laporan Rekonsiliasi Bank Collection</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                            <BsDashCircleFill size={28} className="black cir" />
                                            <AiOutlineFilePdf size={28} className="pdf" />
                                            <a href="#" onClick={this.openModalPdf}>Laporan Rekonsiliasi Bank Collection</a>
                                        </div>
                                        <div className="bsCir">
                                            <BsDashCircleFill size={30} className="black cir" />
                                            <AiOutlineFileExcel size={30} className="pdf" />
                                            <input type="file" />
                                        </div>
                                    </div>
                                </div>
                                <div className="secModal">
                                    <div className="col-md-6">
                                        <text>Laporan Rekonsiliasi Bank Collection</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                            <BsDashCircleFill size={30} className="black cir" />
                                            <AiOutlineFilePdf size={30} className="pdf" />
                                            <input type="file" />
                                        </div>
                                        <div className="bsCir">
                                            <BsDashCircleFill size={30} className="black cir" />
                                            <AiOutlineFileExcel size={30} className="pdf" />
                                            <input type="file" />
                                        </div>
                                    </div>
                                </div>
                                <div className="secModal">
                                    <div className="col-md-6">
                                        <text>Laporan Rekonsiliasi Bank Collection</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                            <BsDashCircleFill size={30} className="black cir" />
                                            <AiOutlineFilePdf size={30} className="pdf" />
                                            <input type="file" />
                                        </div>
                                    </div>
                                </div>
                                <div className="secModal">
                                    <div className="col-md-6">
                                        <text>Laporan Rekonsiliasi Bank Collection</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                            <BsDashCircleFill size={30} className="black cir" />
                                            <AiOutlineFilePdf size={30} className="pdf" />
                                            <input type="file" />
                                        </div>
                                    </div>
                                </div>
                                <div className="secModal">
                                    <div className="col-md-6">
                                        <text>Laporan Rekonsiliasi Bank Collection</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                            <BsDashCircleFill size={30} className="black cir" />
                                            <AiOutlineFilePdf size={30} className="pdf" />
                                            <input type="file" />
                                        </div>
                                    </div>
                                </div>
                                <div className="secModal">
                                    <div className="col-md-6">
                                        <text>Laporan Rekonsiliasi Bank Collection</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                            <BsDashCircleFill size={30} className="black cir" />
                                            <AiOutlineFilePdf size={30} className="pdf" />
                                            <input type="file" />
                                        </div>
                                    </div>
                                </div>
                                <div className="secModal">
                                    <div className="col-md-6">
                                        <text>Laporan Rekonsiliasi Bank Collection</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                            <BsDashCircleFill size={30} className="black cir" />
                                            <AiOutlineFilePdf size={30} className="pdf" />
                                            <input type="file" />
                                        </div>
                                    </div>
                                </div>
                                <div className="secModal">
                                    <div className="col-md-6">
                                        <text>Laporan Rekonsiliasi Bank Collection</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                            <BsDashCircleFill size={30} className="black cir" />
                                            <AiOutlineFilePdf size={30} className="pdf" />
                                            <input type="file" />
                                        </div>
                                    </div>
                                </div>
                                <div className="secModal">
                                    <div className="col-md-6">
                                        <text>Laporan Rekonsiliasi Bank Collection</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                            <BsDashCircleFill size={30} className="black cir" />
                                            <AiOutlineFilePdf size={30} className="pdf" />
                                            <input type="file" />
                                        </div>
                                    </div>
                                </div>
                                <div className="secModal">
                                    <div className="col-md-6">
                                        <text>Laporan Rekonsiliasi Bank Collection</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                            <BsDashCircleFill size={30} className="black cir" />
                                            <AiOutlineFilePdf size={30} className="pdf" />
                                            <input type="file" />
                                        </div>
                                        <div className="bsCir">
                                            <BsDashCircleFill size={30} className="black cir" />
                                            <AiOutlineFileExcel size={30} className="pdf" />
                                            <input type="file" />
                                        </div>
                                    </div>
                                </div>
                                <div className="secModal">
                                    <div className="col-md-6">
                                        <text>Laporan Rekonsiliasi Bank Collection</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                            <BsDashCircleFill size={30} className="black cir" />
                                            <AiOutlineFilePdf size={30} className="pdf" />
                                            <input type="file" />
                                        </div>
                                    </div>
                                </div>
                                <div className="secModal">
                                    <div className="col-md-6">
                                        <text>Laporan Rekonsiliasi Bank Collection</text>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="bsCir">
                                            <BsDashCircleFill size={30} className="black cir" />
                                            <AiOutlineFilePdf size={30} className="pdf" />
                                            <input type="file" />
                                        </div>
                                    </div>
                                </div>
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
                </Modal>
                <Modal isOpen={openPdf} size="lg" toggle={this.openModalPdf} centered={true}>
                <ModalHeader toggle={this.openModalPdf}>Dokumen</ModalHeader>
                    <ModalBody>
                        <div className="readPdf">
                            <Pdf pdf={tesPDF} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" onClick={this.openModalReject}>Reject</Button>{' '}
                        <Button color="primary" onClick={this.openModalApprove}>Approve</Button>
                    </ModalFooter>
                </Modal>
                <Modal isOpen={openApprove} toggle={this.openModalApprove} centered={true}>
                    <ModalBody>
                        <div className="modalApprove">
                            <div>
                                <text>
                                    Anda yakin untuk approve 
                                    <text className="verif"> laporan CNDN Outlet </text>
                                    pada tanggal
                                    <text className="verif"> 20 Januari 2021</text> ?
                                </text>
                            </div>
                            <div className="btnApprove">
                                <Button color="primary" onClick={this.openModalApprove}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalApprove}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={openReject} toggle={this.openModalReject} centered={true}>
                    <ModalBody>
                        <div className="modalApprove">
                            <div className="quest">Anda yakin untuk reject form ini ?</div>
                            <div className="alasan">
                                <text className="col-md-3">
                                    Pilih Alasan
                                </text>
                                <Input type="select" name="select" className="col-md-9">
                                    <option>Dokumen tidak jelas</option>
                                    <option>Dokumen kurang lengkap</option>
                                </Input>
                            </div>
                            <div className="btnApprove">
                                <Button color="primary" onClick={this.openModalReject}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalReject}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

export default  Dokumen