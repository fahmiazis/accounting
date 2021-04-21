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
import dashboard from '../redux/actions/dashboard'
import {BsBell} from 'react-icons/bs'
import depo from '../redux/actions/depo'
import downloadFile from 'js-file-download'
import {default as axios} from 'axios'
import Select from 'react-select'

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
        depo: [],
        kode: '',
        pic: '',
        from: '',
        to: '',
        options: []
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

    chooseFrom = (e) => {
        this.setState({from: e.target.value})
    }

    chooseTo = (e) => {
        this.setState({to: e.target.value})
    }
    
    chooseDepo = (e) => {
        this.setState({kode: e.value})
    }

    choosePic = (e) => {
        this.setState({pic: e.value})
    }

    openTypeFunc = () => {
        this.setState({openType: !this.state.openType})
    }

    componentDidMount() {
        this.getDataDepo()
    }

    createReport = async () => {
        const {kode, pic, from, to} = this.state
        const level = localStorage.getItem('level')
        const token = localStorage.getItem("token")
        let data = {}
        const datas = {
            kode_plant: kode
        }
        if (level === '1' || level === '2') {
            if (kode === '') {
                data = {
                    pic: pic
                }
                await this.props.report(token, from, to, data)
            } else if (pic === '') {
                data = {
                    kode_plant: kode
                }
                await this.props.report(token, from, to, data)
            }
        } else if (level === '4' || level === '5') {
            await this.props.report(token, from, to, data)
        } else if (level === '3') {
            await this.props.report(token, from, to, datas)
        }
    }

    componentDidUpdate(){
        const level = localStorage.getItem('level')
        const { isGet } = this.props.depo
        const { isReport, isDownload } = this.props.dashboard
        if (level === "1" && isGet) {
          this.preparePic()
          this.prepareSelect()
          this.props.resetError()
        } else if (level === "2" && isGet) {
            this.preparePic()
            this.prepareSelect()
            this.props.resetError()
        } else if (level === "3" && isGet) {
            this.preparePic()
            this.prepareSelect()
            this.props.resetError()
        } else if (isReport) {
            this.downloadResultReport()
            this.props.resetErrorReport()
        } else if (isDownload) {
            this.download()
            this.props.resetErrorReport()
        }
    }

    downloadResultReport = async () => {
        const {dataReport} = this.props.dashboard
        // this.props.downloadReport(dataReport)
        axios({
            url: `${dataReport}`,
            method: 'GET',
            responseType: 'blob', // important
          }).then((response) => {
             const url = window.URL.createObjectURL(new Blob([response.data]));
             const link = document.createElement('a');
             link.href = url;
             link.setAttribute('download', 'report.xls'); //or any other extension
             document.body.appendChild(link);
             link.click();
          });
    }

    download = async () => {
        const {dataDownload} = this.props.dashboard
        downloadFile(dataDownload, 'report.xls')
    }

    getDataDepo = async () => {
        const token = localStorage.getItem("token")
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        if (level === "1") {
            await this.props.getDepo(token, 1000, '')
        } else if (level === '2' || level === '3') {
            await this.props.getDepo(token, 1000, names)
        }
    }

    preparePic = () => {
        const { dataDepo } = this.props.depo
        const temp = []
        const data = [
            {value: '', label: '-Pilih PIC-'}
        ]
        if (dataDepo.length !== 0) {
            dataDepo.map(item => {
                return (
                    temp.push(item.nama_pic_1)
                )
            })
            const set = new Set(temp)
            const newData = [...set]
            newData.map(item => {
                return (
                    data.push({value: item, label: item})
                )
            })
            this.setState({depo: data})
        }
    }

    prepareSelect = () => {
        const { dataDepo } = this.props.depo
        const temp = [
            {value: '', label: '-Pilih Depo-'}
        ]
        if (dataDepo.length !== 0) {
            dataDepo.map(item => {
                return (
                    temp.push({value: item.kode_plant, label: item.kode_plant + '-' + item.nama_depo})
                )
            })
            this.setState({options: temp})
        }
    }

    render() {
        const {isOpen, dropOpenNum, type, depo} = this.state
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {dataDepo} = this.props.depo
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
                        </Nav>
                        <UncontrolledDropdown>
                            <DropdownToggle nav caret>
                            {level === '1' ? names + ' - ' + 'Super Admin': level === '2' ? names + ' - ' + 'SPV': level === '3' ? names + ' - ' + 'PIC': level === '4' ? names :level === '5' ? names : 'User'}
                            </DropdownToggle>
                            <DropdownMenu right>
                            <DropdownItem onClick={() => this.props.logout()}>Log Out</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown>
                            <DropdownToggle nav>
                                <BsBell size={20} />
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem >Reject Dokumen</DropdownItem>
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
                                <ButtonDropdown isOpen={this.state.openType} toggle={this.openTypeFunc}>
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
                                <Input type="date" name="creeatedAt" onChange={this.chooseFrom}/>
                                <text className="toColon">To</text>
                                <text className="colon">:</text>
                                <Input type="date" name="creeatedAt" onChange={this.chooseTo} />
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
                        {level === '3' ? (
                        <div>
                            <div className="headReport">
                                <text className="col-md-2 fontReport">Depo</text>
                                <div className="optionType col-md-4">
                                    <text className="colon">:</text>
                                    <Input 
                                        type="select" 
                                        name="select"
                                        onChange={this.chooseDepo}
                                        >
                                        <option value=''>-Pilih Depo-</option>
                                        {dataDepo.length !== 0 && dataDepo.map(item => {
                                        return (
                                            <option value={item.kode_plant}>{item.kode_plant + '-' + item.nama_depo}</option>
                                        )
                                        })}
                                    </Input>
                                </div>
                            </div>
                            <Button
                            onClick={this.createReport}
                                color="primary" 
                                size="lg" 
                                className="ml-3 mt-3 col-md-1"
                                disabled={this.state.from === '' || this.state.to === '' ? true : this.state.kode === '' ? true : false }
                                >
                                    Download
                                </Button>
                        </div>   
                        ) : level === '4' || level === '5' ? (
                                <Button
                                onClick={this.createReport}
                                color="primary" 
                                size="lg" 
                                className="ml-3 mt-3 col-md-1"
                                disabled={this.state.from === '' || this.state.to === '' ? true : false }
                                >
                                    Download
                                </Button>
                        ) : (
                            <div>
                                <div className="headReport">
                                    <text className="col-md-2 fontReport">PIC</text>
                                    <div className="optionType col-md-4">
                                        <text className="colons">:</text>
                                        <Select
                                            className="col-md-12"
                                            options={this.state.depo}
                                            onChange={this.choosePic}
                                            isDisabled={this.state.kode === '' ? false : true}
                                        />
                                    </div>
                                </div>
                                <div className="headReport">
                                    <text className="col-md-2 fontReport">Depo</text>
                                    <div className="optionType col-md-4">
                                        <text className="colons">:</text>
                                        <Select
                                            className="col-md-12"
                                            options={this.state.options}
                                            onChange={this.chooseDepo}
                                            isDisabled={this.state.pic === '' ? false : true}
                                        />
                                    </div>
                                </div>
                                <Button
                                onClick={this.createReport}
                                color="primary" 
                                size="lg" 
                                className="ml-3 mt-3 col-md-1"
                                disabled={this.state.from === '' || this.state.to === '' ? true : this.state.pic === '' && this.state.kode !== '' ? false : this.state.pic !== '' && this.state.kode === '' ? false : true }
                                >
                                    Download
                                </Button>
                            </div>
                        )}
                    </div>
                </Container>
            </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    depo: state.depo,
    dashboard: state.dashboard
})

const mapDispatchToProps = {
    logout: auth.logout,
    getDepo: depo.getDepo,
    resetError: depo.resetError,
    report: dashboard.report,
    resetErrorReport: dashboard.resetErrorReport,
    downloadReport: dashboard.downloadReport
}

export default connect(mapStateToProps, mapDispatchToProps)(Report)
	