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

    render() {
        const {isOpen, dropOpen, dropOpenNum, drop} = this.state
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
                                    </tr>
                                </thead>
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
            </>
        )
    }
}

export default  Dashboard