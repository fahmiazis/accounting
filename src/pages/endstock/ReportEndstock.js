import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
    NavbarToggler, NavbarBrand, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, Dropdown,
    DropdownItem, Table, ButtonDropdown, Input, Button,
    Modal, ModalHeader, ModalBody, ModalFooter, Alert, Spinner} from 'reactstrap'
import logo from "../../assets/img/logo.png"
import '../../assets/css/style.css'
import {FaSearch, FaUserCircle, FaBars, FaSortAlphaDown, FaSortAlphaUpAlt} from 'react-icons/fa'
import {AiOutlineFileExcel, AiFillCheckCircle, AiOutlineClose, AiOutlineInbox} from 'react-icons/ai'
import {Formik} from 'formik'
import * as Yup from 'yup'
import divisi from '../../redux/actions/divisi'
import depo from '../../redux/actions/depo'
import inventory from '../../redux/actions/inventory'
import {connect} from 'react-redux'
import auth from '../../redux/actions/auth'
import {default as axios} from 'axios'
import Sidebar from "../../components/Header";
import MaterialTitlePanel from "../../components/material_title_panel";
import SidebarContent from "../../components/sidebar_content";
import moment from 'moment'
import NewNavbar from '../../components/NewNavbar'
import styleTrans from '../../assets/css/transaksi.module.css'
import style from '../../assets/css/public.module.css'
const {REACT_APP_BACKEND_URL} = process.env
const dataType = ['mb52', 'eds']
// const dataType = ['saldo_awal', 'saldo_awal_mb5b', 'mb52', 'eds']

class ReportEndStock extends Component {
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
            alert: false,
            confirm: "",
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
            modalConfirm: false,
            detail: {},
            upload: false,
            errMsg: '',
            fileUpload: '',
            limit: 10,
            search: '',
            modalDelete: false,
            modalGenerate: false,
            listInventory: [],
            stateInv: [],
            baseInv: [],
            selectMonth: moment().month() + 1,
            selectYear: moment().year(),
            modalUpdate: false,
            typeReport: 1,
            detailInv: {},
            typeModal: '',
            detailData: {},
            listReport: [],
            idDelete: null,
            sortType: 'asc',
            sortTypePic: 'asc',
            cameraSource: '',
        }
        this.onSetOpen = this.onSetOpen.bind(this);
        this.menuButtonClick = this.menuButtonClick.bind(this);
    }

    prosesSidebar = (val) => {
        this.setState({sidebarOpen: val})
    }
    
    goRoute = (val) => {
        this.props.history.push(`/${val}`)
    }

    showAlert = () => {
        this.setState({alert: true, modalEdit: false, modalAdd: false, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                alert: false
            })
         }, 10000)
    }

    next = async () => {
        const { page } = this.props.inventory
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.nextLink)
    }

    prev = async () => {
        const { page } = this.props.inventory
        const token = localStorage.getItem('token')
        await this.props.nextPage(token, page.prevLink)
    }

    uploadAlert = () => {
        this.setState({upload: true, modalUpload: false })
       
         setTimeout(() => {
            this.setState({
                upload: false
            })
         }, 10000)
    }

    DownloadTemplate = () => {
        axios({
            url: `${REACT_APP_BACKEND_URL}/masters/inventory.xlsx`,
            method: 'GET',
            responseType: 'blob',
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "inventory.xlsx");
            document.body.appendChild(link);
            link.click();
        });
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    openConfirm = () => {
        this.setState({modalConfirm: !this.state.modalConfirm})
    }

    DownloadMaster = () => {
        const {link} = this.props.inventory
        axios({
            url: `${link}`,
            method: 'GET',
            responseType: 'blob', // important
        }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "master inventory.xlsx"); //or any other extension
            document.body.appendChild(link);
            link.click();
        });
    }

    ExportMaster = () => {
        const token = localStorage.getItem('token')
        this.props.exportMaster(token)
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
    openModalUpdate = () => {
        this.setState({ modalUpdate: !this.state.modalUpdate })
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

    prosesOpen = (val, type) => {
        if (type === 'add') {
            this.setState({detailInv: val, typeModal: type})
        } else {
            this.setState({detailData: val, typeModal: type})
        }
        this.openModalAdd()
    }

    prosesOpenUpdate = (val) => {
        this.setState({detailInv: val})
        this.openModalUpdate()
    }

    addInventory = async (values) => {
        const token = localStorage.getItem("token")
        await this.props.addInventory(token, values)
        this.setState({confirm: 'add'})
        this.openConfirm()
        this.getDataRepinv()
        this.openModalAdd()
    }

    onChangeHandler = e => {
        const {size, type} = e.target.files[0]
        if (size >= 100000000) {
            this.setState({errMsg: "Maximum upload size 100 MB"})
            this.uploadAlert()
        } else if (type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' && type !== 'application/vnd.ms-excel' ){
            this.setState({errMsg: 'Invalid file type. Only excel files are allowed.'})
            this.uploadAlert()
        } else {
            this.setState({fileUpload: e.target.files[0]})
        }
    }

    uploadBulkRepinv = async (val) => {
        const { listInventory } = this.state
        const token = localStorage.getItem('token')
        const data = new FormData()
        data.append('master', this.state.fileUpload)
        data.append('name', val.name)
        data.append('type', val.type)
        data.append('plant', listInventory[0])
        data.append('list', listInventory.toString())
        data.append('date_report', val.date_report)
        const typeUpload = 'bulk'
        await this.props.uploadRepinv(token, data, typeUpload)
        this.setState({confirm: 'upload', fileUpload: ''})
        this.openConfirm()
        this.getDataRepinv()
        this.openModalUpload()
    }

    uploadRepinv = async (val) => {
        const token = localStorage.getItem('token')
        const data = new FormData()
        data.append('master', this.state.fileUpload)
        data.append('name', val.name)
        data.append('type', val.type)
        data.append('plant', val.plant)
        data.append('date_report', val.date_report)
        await this.props.uploadRepinv(token, data)
        this.setState({confirm: 'upload', fileUpload: ''})
        this.openConfirm()
        this.getDataRepinv()
        this.openModalAdd()
    }

    updateRepinv = async (val) => {
        const token = localStorage.getItem('token')
        const { detailData } = this.state

        if (this.state.fileUpload === '') {
            const data = {
                id: detailData.id,
                name: val.name,
                type: val.type,
                plant: val.plant,
                date_report: val.date_report
            }
            await this.props.updateRepinv(token, 'update', data)
        } else {
            const data = new FormData()
            data.append('id', detailData.id)
            data.append('name', val.name)
            data.append('type', val.type)
            data.append('plant', val.plant)
            data.append('date_report', val.date_report)
            data.append('master', this.state.fileUpload)
            await this.props.updateRepinv(token, 'upload', data)
        }

        this.setState({confirm: 'update', fileUpload: ''})
        this.openConfirm()
        this.getDataRepinv()
        this.openModalAdd()
        this.openModalUpdate()
    }

    editInventory = async (values,id) => {
        const token = localStorage.getItem("token")
        await this.props.updateInventory(token, id, values)
        this.setState({confirm: 'edit'})
        this.openConfirm()
        this.getDataRepinv()
        this.openModalEdit()
    }

    openModalDelete = () => {
        this.setState({modalDelete: !this.state.modalDelete})
    }

    openModalGenerate = () => {
        this.setState({modalGenerate: !this.state.modalGenerate})
    }

    chekApp = (val) => {
        const { listInventory, stateInv } = this.state
        if (val === 'all') {
            const data = []
            for (let i = 0; i < stateInv.length; i++) {
                data.push(stateInv[i].plant)
            }
            this.setState({listInventory: data})
        } else {
            listInventory.push(val)
            this.setState({listInventory: listInventory})
        }
    }

    chekRej = (val) => {
        const {listInventory} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listInventory: data})
        } else {
            const data = []
            for (let i = 0; i < listInventory.length; i++) {
                if (listInventory[i] === val) {
                    data.push()
                } else {
                    data.push(listInventory[i])
                }
            }
            this.setState({listInventory: data})
        }
    }

    reportApp = (val) => {
        const { listReport, stateInv } = this.state
        const { dataRepinv } = this.props.inventory
        if (val === 'all') {
            const data = []
            for (let i = 0; i < dataRepinv.length; i++) {
                data.push(dataRepinv[i].id)
            }
            this.setState({listReport: data})
        } else {
            listReport.push(val)
            this.setState({listReport: listReport})
        }
    }

    reportRej = (val) => {
        const {listReport} = this.state
        if (val === 'all') {
            const data = []
            this.setState({listReport: data})
        } else {
            const data = []
            for (let i = 0; i < listReport.length; i++) {
                if (listReport[i] === val) {
                    data.push()
                } else {
                    data.push(listReport[i])
                }
            }
            this.setState({listReport: data})
        }
    }

    prosesDelete = async () => {
        const token = localStorage.getItem("token")
        const { listReport } = this.state
        const data = {
            listId: listReport
        }
        await this.props.deleteRepinv(token, data)
        this.getDataRepinv()
        this.openModalDelete()
        this.setState({confirm: 'delete'})
        this.openConfirm()
    }

    deletePartial = async () => {
        const token = localStorage.getItem("token")
        const { idDelete } = this.state
        console.log(idDelete)
        const data = {
            listId: [idDelete]
        }
        await this.props.deleteRepinv(token, data)
        this.getDataRepinv()
        this.openModalDelete()
        this.openModalUpdate()
        this.setState({confirm: 'delete'})
        this.openConfirm()
    }

    prosesDeletePartial = (val) => {
        console.log(val)
        this.setState({idDelete: val.id})
        this.openModalDelete()
    }

    prosesReport = () => {
        const { listInventory, typeReport, listReport } = this.state
        const {dataRepinv} = this.props.inventory
        if (parseInt(typeReport) === 1) {
            const cek = []
            for (let i = 0; i < listInventory.length; i++) {
                const cekPlant = this.getStatus(listInventory[i])
                if (cekPlant === 'Full Upload') {
                    cek.push(cekPlant)
                }
            }
            if (cek.length === listInventory.length) {
                this.prosesGenerate()
            } else {
                this.setState({confirm: 'failGenerate'})
                this.openConfirm()
            }
        } else if (parseInt(typeReport) === 2) {
            if (listReport.length > 1) {
                this.prosesMerge()
            } else {
                this.setState({confirm: 'failMerge'})
                this.openConfirm()
            }
        } else {
            this.setState({confirm: 'failReport'})
            this.openConfirm()
        }
    }

    prosesGenerate = async () => {
        const token = localStorage.getItem("token")
        const { listInventory, selectMonth } = this.state
        const year = moment().year(); // misalnya 2025
        const startOfMonth = moment(`${year}-${selectMonth}-01`, "YYYY-M-DD").startOf("month");
        const data = {
            listPlant: listInventory,
            date: startOfMonth.format('YYYY-MM-DD')
        }
        await this.props.generateRepinv(token, data)
        this.getDataRepinv()
        this.openModalGenerate()
        this.setState({confirm: 'generate'})
        this.openConfirm()
    }

    prosesMerge = async () => {
        const token = localStorage.getItem("token")
        const { listReport, selectMonth } = this.state
        const year = moment().year(); // misalnya 2025
        const startOfMonth = moment(`${year}-${selectMonth}-01`, "YYYY-M-DD").startOf("month");
        const data = {
            listIds: listReport,
            date: startOfMonth.format('YYYY-MM-DD')
        }
        await this.props.mergeRepinv(token, data)
        this.getDataRepinv()
        this.openModalGenerate()
        this.setState({confirm: 'merge'})
        this.openConfirm()
    }

    downloadFile = async (val) => {
        try {
          this.setState({isLoading: true})
          const path = val.path.split(/[\\/]/)[2]
          const url = `${REACT_APP_BACKEND_URL}/${val.status === 1 ? 'masters' : 'exports'}/${path}`;
          const res = await axios.get(url, {
            responseType: "blob",
            // headers: { Authorization: 'Bearer ' + token }
          });
    
          // dapat filename jika server set header
          const disposition = res.headers["content-disposition"];
          let filename = `${val.name}.xlsx`;
          if (disposition && disposition.includes("filename=")) {
            filename = disposition.split("filename=")[1].replace(/['"]/g, "").trim();
          }
    
          const blob = new Blob([res.data]);
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(blobUrl);
          this.setState({isLoading: false})
        } catch (err) {
          console.error(err);
          alert("Download gagal: " + err.message);
        }
      };

    componentDidUpdate() {
        const {isError, isUpload, isExport} = this.props.inventory
        if (isError) {
            this.props.resetError()
            this.showAlert()
        } 
        // else if (isUpload) {
        //     this.props.resetError()
        //     this.setState({modalUpload: false})
        //     setTimeout(() => {
        //         this.getDataRepinv()
        //     }, 100)
        // }  
        else if (isExport) {
            this.props.resetError()
            this.DownloadMaster()
        }
    }

    componentDidMount() {
        this.getDataRepinv()
        this.getDataInventory()
        // this.getDataDepo()
        this.getDataDivisi()
    }

    onSearch = (e) => {
        this.setState({search: e.target.value})
        if(e.key === 'Enter'){
            console.log('panggil search inv')
            this.searchInv()
        }
    }

    searchInv = () => {
        console.log('masuk search inv')
        const {search, baseInv} = this.state
        const cekFilter = baseInv.filter(x =>
            (x.plant.toLowerCase().includes(search.toLowerCase())) ||
            (x.area.toLowerCase().includes(search.toLowerCase())) ||
            (x.pic_kasbank.toLowerCase().includes(search.toLowerCase())) ||
            (x.profit_center.toLowerCase().includes(search.toLowerCase())) ||
            (x.kode_dist.toLowerCase().includes(search.toLowerCase())) 
        );
        this.setState({stateInv: search === '' ? baseInv : cekFilter});
    }

    sortData = (key, order) => {
        const {search, baseInv} = this.state
        const sort = baseInv.sort((a, b) => {
            const valA = String(a[key] ?? "").toUpperCase();
            const valB = String(b[key] ?? "").toUpperCase();
            if (order === "asc") {
                return valA.localeCompare(valB);
            } else {
                return valB.localeCompare(valA);
            }
        });
        if (key === 'plant') {
            this.setState({sortType: order})
        } else {
            this.setState({sortTypePic: order})
        }
        this.setState({stateInv: sort})
    };


    getDataInventory = async () => {
        const token = localStorage.getItem("token")
        const level = localStorage.getItem("level")
        const name = localStorage.getItem("name")
        await this.props.getInventory(token, 1000, '', 1)
        const { dataInventory } = this.props.inventory
        if (level === '3') {
            const cek = dataInventory.filter(x => x.pic_kasbank.toString().toLowerCase() === name.toString().toLowerCase())
            this.setState({stateInv: cek, baseInv: cek})
        } else {
            this.setState({stateInv: dataInventory, baseInv: dataInventory})
        }
    }

    getDataRepinv = async (value) => {
        this.setState({})
        const token = localStorage.getItem("token")
        const { page } = this.props.inventory
        const { selectMonth, typeReport, selectYear } = this.state
        const startOfMonth = moment(`${selectYear}-${selectMonth}-01`, "YYYY-M-DD").startOf("month");
        const search = value === undefined ? '' : this.state.search
        const limit = value === undefined ? this.state.limit : value.limit
        await this.props.getRepinv(token, limit, search, page.currentPage, startOfMonth.format('YYYY-MM-DD'), typeReport)
        this.setState({limit: value === undefined ? 10 : value.limit})
    }

    handleMonth = (e) => {
        console.log(e.target.value)
        this.setState({ selectMonth: e.target.value });
        setTimeout(() => {
            this.getDataRepinv()
        }, 100)
    };

    handleYear = (e) => {
        console.log(e.target.value)
        this.setState({ selectYear: e.target.value });
        setTimeout(() => {
            this.getDataRepinv()
        }, 100)
    };

    handleType = (e) => {
        this.setState({ typeReport: e.target.value, listReport: [], listInventory: [] });
        setTimeout(() => {
            this.getDataRepinv()
        }, 100)
    }

    getDataDepo = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDepo(token, 1000, '')
    }

    getDataDivisi = async () => {
        const token = localStorage.getItem("token")
        await this.props.getDivisi(token, 1000, '')
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    getStatus = (plant) => {
        const {dataRepinv} = this.props.inventory
        const filesForPlant = dataRepinv.filter(x => x.plant === plant);
        
        if (filesForPlant.length === 0) return 'Belum Upload';

        // cek apakah semua type ada
        const uploadedTypes = filesForPlant.map(x => x.type);
        const missing = dataType.filter(type => !uploadedTypes.includes(type));

        if (missing.length === 0) return 'Full Upload';
        return 'Kurang Upload';
    }

    render() {
        const {detailData, detail, alert, upload, errMsg, listInventory, stateInv, detailInv, typeModal, listReport} = this.state
        const {dataRepinv, isGet, alertM, alertMsg, alertUpload, page} = this.props.inventory
        const {dataDivisi} = this.props.divisi
        const {dataDepo} = this.props.depo
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const months = moment.locale("id") && moment.months();
        const currentYear = moment().year(); 
        const years = [];

        for (let year = 2000; year <= currentYear; year++) {
            years.push(year);
        }

        // const dataType = ['saldo_awal', 'saldo_awal_mb5b', 'mb52', 'eds']
        const startOfMonth = moment(`${currentYear}-${this.state.selectMonth}-01`, "YYYY-M-DD").startOf("month")
        const dataStatus = [
            { status: 1, text: 'File Upload' },
            { status: 2, text: 'Output Report' },
            { status: 3, text: 'Merge Output Report' },
        ]
        return (
            <>
                <div className={styleTrans.app}>
                    <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                    <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>

                        <h2 className={styleTrans.pageTitle}>Report End Stock</h2>
                            
                        <div className={styleTrans.searchContainer}>
                            <div className='rowCenter'>
                                <Input
                                    type="select"
                                    name="month"
                                    value={this.state.selectMonth}
                                    onChange={this.handleMonth}
                                >
                                    <option value="">Pilih Bulan</option>
                                    {months.map((month, index) => (
                                        <option key={index} value={index + 1}>
                                            {month}
                                        </option>
                                    ))}
                                </Input>
                                <Input
                                    type="select"
                                    className='ml-2'
                                    name="month"
                                    value={this.state.selectYear}
                                    onChange={this.handleYear}
                                >
                                    <option value="">Pilih Tahun</option>
                                    {years.map((item, index) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </Input>
                            </div>
                            <div>
                                <Input
                                    type="select"
                                    name="month"
                                    value={this.state.typeReport}
                                    onChange={this.handleType}
                                >
                                    <option value="">Pilih Tipe Report</option>
                                    {dataStatus.map((item, index) => (
                                        <option key={index} value={item.status}>
                                            {item.text}
                                        </option>
                                    ))}
                                </Input>
                            </div>
                        </div>
                        <div className={styleTrans.searchContainer}>
                            <div className='rowCenter'>
                                <Button className='ml-1' disabled={(listInventory.length === 0 && listReport.length === 0) ? true : false} onClick={this.openModalGenerate} color="success" size="lg">Generate</Button>
                                {parseInt(this.state.typeReport) === 1 && (
                                    <Button className='ml-1'  onClick={this.openModalUpload} color="warning" size="lg">Bulk Upload</Button>
                                )}
                                {parseInt(this.state.typeReport) !== 1 && (
                                    <Button className='ml-1' disabled={listReport.length === 0 ? true : false} onClick={this.openModalDelete} color="danger" size="lg">Delete</Button>
                                )}
                            </div>
                            <div className={style.searchEmail2}>
                                <text>Search: </text>
                                <Input 
                                className={style.search}
                                onChange={this.onSearch}
                                value={this.state.search}
                                onKeyPress={this.onSearch}
                                >
                                    <FaSearch size={20} />
                                </Input>
                            </div>
                        </div>
                        {parseInt(this.state.typeReport) === 1 ? (
                            <>
                                <table className={`${styleTrans.table} ${stateInv.length > 0 ? styleTrans.tableFull : ''}`}>
                                    <thead>
                                        <tr>
                                            <th>
                                                <input  
                                                className='mr-2'
                                                type='checkbox'
                                                checked={listInventory.length === 0 ? false : listInventory.length === stateInv.length ? true : false}
                                                onChange={() => listInventory.length === stateInv.length ? this.chekRej('all') : this.chekApp('all')}
                                                />
                                            </th>
                                            <th>No</th>
                                            <th> 
                                                {this.state.sortType === 'desc' ? (
                                                    <FaSortAlphaDown onClick={() => this.sortData('plant', 'asc')} className='mr-1' size={20} />
                                                ) : (
                                                    <FaSortAlphaUpAlt onClick={() => this.sortData('plant', 'desc')} className='mr-1' size={20} />
                                                )}
                                                PLANT
                                            </th>
                                            <th>
                                                {this.state.sortTypePic === 'desc' ? (
                                                    <FaSortAlphaDown onClick={() => this.sortData('pic_kasbank', 'asc')} className='mr-1' size={20} />
                                                ) : (
                                                    <FaSortAlphaUpAlt onClick={() => this.sortData('pic_kasbank', 'desc')} className='mr-1' size={20} />
                                                )}
                                                PIC
                                            </th>
                                            {dataType.map(type => {
                                                return (
                                                    <th>file {type}</th>
                                                )
                                            })}
                                            <th>PERIODE REPORT</th>
                                            <th>STATUS</th>
                                            <th>Opsi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {stateInv.length > 0 && stateInv.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>
                                                    <input 
                                                    type='checkbox'
                                                    checked={listInventory.find(element => element === item.plant) !== undefined ? true : false}
                                                    onChange={listInventory.find(element => element === item.plant) === undefined ? () => this.chekApp(item.plant) : () => this.chekRej(item.plant)}
                                                    />
                                                </td>
                                                {/* <td>{(stateInv.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</td> */}
                                                <td className={styleTrans.colNo}>{index + 1}</td>
                                                <td className={styleTrans.colPlant}>{item.plant}</td>
                                                <td>{item.pic_kasbank}</td>
                                                {dataType.map(type => {
                                                    return (
                                                        <td className={styleTrans.colFile}>{dataRepinv.length === 0 ? '-' : dataRepinv.find(x => (x.plant === item.plant && x.type === type)) === undefined ? '-' : `V - ${moment(dataRepinv.find(x => (x.plant === item.plant && x.type === type)).createdAt).format('DD/MM/YYYY')} - upload by ${dataRepinv.find(x => (x.plant === item.plant && x.type === type)).user_upload}`}</td>
                                                    )
                                                })}
                                                <td >{startOfMonth.format('MMMM YYYY')}</td>
                                                <td>{this.getStatus(item.plant)}</td>
                                                <td className={styleTrans.colOpsi}>
                                                    <Button onClick={() => this.prosesOpen(item, 'add')} color='success' className='ml-1 mt-1'>Upload</Button>
                                                    {this.getStatus(item.plant) !== 'Belum Upload' && (
                                                        <Button onClick={() => this.prosesOpenUpdate(item)} color='primary' className='mt-1 ml-1'>Update</Button>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                                {stateInv.length === 0 && (
                                    <div className={style.spinCol}>
                                        <AiOutlineInbox size={50} className='mb-4' />
                                        <div className='textInfo'>Data tidak ditemukan</div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <table className={`${styleTrans.table} ${(parseInt(this.state.typeReport) === 2 ? dataRepinv.filter(x => stateInv.find(y => y.plant === x.plant) !== undefined) : dataRepinv).length > 0 ? styleTrans.tableFull : ''}`}>
                                    <thead>
                                        <tr>
                                            <th>
                                                <input  
                                                className='mr-2'
                                                type='checkbox'
                                                checked={listReport.length === 0 ? false : listReport.length === dataRepinv.length ? true : false}
                                                onChange={() => listReport.length === dataRepinv.length ? this.reportRej('all') : this.reportApp('all')}
                                                />
                                            </th>
                                            <th>No</th>
                                            {parseInt(this.state.typeReport) === 2 && (
                                                <>
                                                    <th> 
                                                        {this.state.sortType === 'desc' ? (
                                                            <FaSortAlphaDown onClick={() => this.sortData('plant', 'asc')} className='mr-1' size={20} />
                                                        ) : (
                                                            <FaSortAlphaUpAlt onClick={() => this.sortData('plant', 'desc')} className='mr-1' size={20} />
                                                        )}
                                                        PLANT
                                                    </th>
                                                    <th>
                                                        {this.state.sortTypePic === 'desc' ? (
                                                            <FaSortAlphaDown onClick={() => this.sortData('pic_kasbank', 'asc')} className='mr-1' size={20} />
                                                        ) : (
                                                            <FaSortAlphaUpAlt onClick={() => this.sortData('pic_kasbank', 'desc')} className='mr-1' size={20} />
                                                        )}
                                                        PIC
                                                    </th>
                                                </>
                                            )}
                                            <th>NAMA</th>
                                            <th>TYPE</th>
                                            <th>PERIODE REPORT</th>
                                            <th>STATUS</th>
                                            <th>Opsi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {dataRepinv.length > 0 && (parseInt(this.state.typeReport) === 2 ? dataRepinv.filter(x => stateInv.find(y => y.plant === x.plant) !== undefined) : dataRepinv).map((item, index) => {
                                        return (
                                            <tr>
                                                <td>
                                                    <input 
                                                    type='checkbox'
                                                    checked={listReport.find(element => element === item.id) !== undefined ? true : false}
                                                    onChange={listReport.find(element => element === item.id) === undefined ? () => this.reportApp(item.id) : () => this.reportRej(item.id)}
                                                    />
                                                </td>
                                                {/* <td>{(stateInv.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</td> */}
                                                <td className={styleTrans.colNo}>{index + 1}</td>
                                                {parseInt(this.state.typeReport) === 2 && (
                                                    <>
                                                        <td className={styleTrans.colPlant}>{item.plant}</td>
                                                        <td>{stateInv.find(y => y.plant === item.plant) !== undefined ? stateInv.find(y => y.plant === item.plant).pic_kasbank : '-'}</td>
                                                    </>
                                                )}
                                                <td>{item.name}</td>
                                                <td>{dataStatus.find(x => x.status === item.status).text}</td>
                                                <td>{startOfMonth.format('MMMM YYYY')}</td>
                                                <td>
                                                    {parseInt(this.state.typeReport) === 2 ? (
                                                        'Success Generate'
                                                    ) : (
                                                        item.info
                                                    )}
                                                </td>
                                                <td>
                                                    <Button color='warning' onClick={() => this.downloadFile(item)}>Download</Button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                                {(parseInt(this.state.typeReport) === 2 ? dataRepinv.filter(x => stateInv.find(y => y.plant === x.plant) !== undefined) : dataRepinv).length === 0 && (
                                    <div className={style.spinCol}>
                                        <AiOutlineInbox size={50} className='mb-4' />
                                        <div className='textInfo'>Data tidak ditemukan</div>
                                    </div>
                                )}
                            </>
                        ) }
                        
                        <div>
                            <div className={style.infoPageEmail1}>
                                {/* <text>Showing {page.currentPage} of {page.pages} pages</text> */}
                                <text>Showing 1 of 1 pages</text>
                                <div className={style.pageButton}>
                                    {/* <button className={style.btnPrev} color="info" disabled={page.prevLink === null ? true : false} onClick={this.prev}>Prev</button> */}
                                    <button className={style.btnPrev} color="info" disabled onClick={this.prev}>Prev</button>
                                    {/* <button className={style.btnPrev} color="info" disabled={page.nextLink === null ? true : false} onClick={this.next}>Next</button> */}
                                    <button className={style.btnPrev} color="info" disabled onClick={this.next}>Next</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal toggle={this.openModalAdd} isOpen={this.state.modalAdd} size='lg'>
                    <ModalHeader toggle={this.openModalAdd}>{typeModal === 'add' ? 'Upload' : 'Update'} File</ModalHeader>
                    <Formik
                    initialValues={{
                        plant: detailInv.plant,
                        name: typeModal === 'add' ? '' : detailData.name,
                        type: typeModal === 'add' ? '' : detailData.type,
                        date_report: typeModal === 'add' ? '' : moment(detailData.date_report).format('YYYY-MM-DD'),
                    }}
                    onSubmit={(values) => { typeModal === 'add' ? this.uploadRepinv(values) : this.updateRepinv(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <ModalBody>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Plant
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="text" 
                                name="plant"
                                disabled
                                value={values.plant}
                                onBlur={handleBlur("plant")}
                                onChange={handleChange("plant")}
                                />
                                {values.plant === '' ? (
                                    <text className="txtError">{errors.plant}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Nama File
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="name"
                                value={values.name}
                                onBlur={handleBlur("name")}
                                onChange={handleChange("name")}
                                />
                                {values.name === '' ? (
                                    <text className="txtError">{errors.name}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Type File
                            </text>
                            <div className="col-md-9">
                                <Input 
                                    type="select" 
                                    name="select"
                                    value={values.type}
                                    disabled={typeModal === 'add' ? false : true}
                                    onChange={handleChange("type")}
                                    onBlur={handleBlur("type")}
                                >
                                    <option>-Pilih Type File-</option>
                                    {dataType.length !== 0 && dataType.map(item => {
                                        return (
                                            <option value={item}>{item}</option>
                                        )
                                    })}
                                </Input>
                                {values.type === '' ? (
                                    <text className="txtError">{errors.type}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Periode Report
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="date" 
                                name="date_report"
                                value={values.date_report}
                                onBlur={handleBlur("date_report")}
                                onChange={handleChange("date_report")}
                                />
                                {values.date_report === '' ? (
                                    <text className="txtError">{errors.date_report}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Upload
                            </text>
                            <div className="col-md-9">
                                {typeModal === 'add' ? '' : values.name}
                                <Input
                                    type="file"
                                    name="file"
                                    accept=".xls,.xlsx"
                                    onChange={this.onChangeHandler}
                                />
                                {this.state.fileUpload === '' && typeModal === 'add' ? (
                                    <text className="txtError">{errors.type}</text>
                                ) : null}
                            </div>
                        </div>
                        <hr/>
                        <div className="foot">
                            <div></div>
                            <div>
                                <Button 
                                    disabled={values.name === '' || values.type === '' || (this.state.fileUpload === '' && typeModal === 'add')} 
                                    className="mr-2" 
                                    onClick={handleSubmit} 
                                    color="primary"
                                >
                                    Save
                                </Button>
                                <Button 
                                    className="mr-3"
                                    onClick={this.openModalAdd}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal toggle={this.openModalUpdate} isOpen={this.state.modalUpdate} size='lg'>
                    <ModalHeader>Update File Upload</ModalHeader>
                    <ModalBody>
                        <Table>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Nama File</th>
                                    <th>Type File</th>
                                    <th>Tgl Upload</th>
                                    <th>Opsi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataRepinv.length > 0 && dataRepinv.filter(x => x.plant === detailInv.plant).map((item, index) => {
                                    return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.type}</td>
                                        <td>{moment(item.createdAt).format('DD MMMM YYYY hh:mm')}</td>
                                        <td>
                                            <Button className='ml-1 mt-1' onClick={() => this.prosesOpen(item, 'update')} color='success'>Update</Button>
                                            <Button className='ml-1 mt-1' onClick={() => this.downloadFile(item)} color='primary'>Download</Button>
                                            <Button className='ml-1 mt-1' onClick={() => this.prosesDeletePartial(item)} color='danger'>Delete</Button>
                                        </td>
                                    </tr>
                                    )
                                })}
                                
                            </tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button color='danger' onClick={this.openModalUpdate}>Close</Button>
                    </ModalFooter>
                </Modal>
                <Modal toggle={this.openModalUpload} isOpen={this.state.modalUpload} size='xl'>
                    <ModalHeader toggle={this.openModalUpload}>Bulk upload file MB51</ModalHeader>
                    <Formik
                    initialValues={{
                        name: '',
                        type: '',
                        date_report: '',
                    }}
                    onSubmit={(values) => { this.uploadBulkRepinv(values)}}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched,}) => (
                        <ModalBody>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Nama File
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="name" 
                                name="name"
                                value={values.name}
                                onBlur={handleBlur("name")}
                                onChange={handleChange("name")}
                                />
                                {values.name === '' ? (
                                    <text className="txtError">{errors.name}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Type File
                            </text>
                            <div className="col-md-9">
                                <Input 
                                    type="select" 
                                    name="select"
                                    value={values.type}
                                    onChange={handleChange("type")}
                                    onBlur={handleBlur("type")}
                                >
                                    <option>-Pilih Type File-</option>
                                    {dataType.length !== 0 && dataType.filter(x => x === 'mb52').map(item => {
                                        return (
                                            <option value={item}>{item}</option>
                                        )
                                    })}
                                </Input>
                                {values.type === '' ? (
                                    <text className="txtError">{errors.type}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Periode Report
                            </text>
                            <div className="col-md-9">
                                <Input 
                                type="date" 
                                name="date_report"
                                value={values.date_report}
                                onBlur={handleBlur("date_report")}
                                onChange={handleChange("date_report")}
                                />
                                {values.date_report === '' ? (
                                    <text className="txtError">{errors.date_report}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Upload
                            </text>
                            <div className="col-md-9">
                                {typeModal === 'add' ? '' : values.name}
                                <Input
                                    type="file"
                                    name="file"
                                    accept=".xls,.xlsx"
                                    onChange={this.onChangeHandler}
                                />
                                {this.state.fileUpload === '' && typeModal === 'add' ? (
                                    <text className="txtError">{errors.type}</text>
                                ) : null}
                            </div>
                        </div>
                        <div className="addModalDepo">
                            <text className="col-md-3">
                                Plant
                            </text>
                        </div>
                        <div className="addModalDepo">
                            <Table bordered responsive hover className="tab">
                                <thead>
                                    <tr>
                                        <th>
                                            <input  
                                            className='mr-2'
                                            type='checkbox'
                                            checked={listInventory.length === 0 ? false : listInventory.length === stateInv.length ? true : false}
                                            onChange={() => listInventory.length === stateInv.length ? this.chekRej('all') : this.chekApp('all')}
                                            />
                                        </th>
                                        <th>No</th>
                                        <th> 
                                            {this.state.sortType === 'desc' ? (
                                                <FaSortAlphaDown onClick={() => this.sortData('plant', 'asc')} className='mr-1' size={20} />
                                            ) : (
                                                <FaSortAlphaUpAlt onClick={() => this.sortData('plant', 'desc')} className='mr-1' size={20} />
                                            )}
                                            PLANT
                                        </th>
                                        <th>
                                            {this.state.sortTypePic === 'desc' ? (
                                                <FaSortAlphaDown onClick={() => this.sortData('pic_kasbank', 'asc')} className='mr-1' size={20} />
                                            ) : (
                                                <FaSortAlphaUpAlt onClick={() => this.sortData('pic_kasbank', 'desc')} className='mr-1' size={20} />
                                            )}
                                            PIC
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                {stateInv.length > 0 && stateInv.map((item, index) => {
                                    return (
                                        <tr>
                                            <td>
                                                <input 
                                                type='checkbox'
                                                checked={listInventory.find(element => element === item.plant) !== undefined ? true : false}
                                                onChange={listInventory.find(element => element === item.plant) === undefined ? () => this.chekApp(item.plant) : () => this.chekRej(item.plant)}
                                                />
                                            </td>
                                            {/* <td>{(stateInv.indexOf(item) + (((page.currentPage - 1) * page.limitPerPage) + 1))}</td> */}
                                            <td>{index + 1}</td>
                                            <td>{item.plant}</td>
                                            <td>{item.pic_kasbank}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </Table>
                        </div>
                        <hr/>
                        <div className="foot">
                            <div></div>
                            <div>
                                <Button 
                                    disabled={values.name === '' || values.type === '' || this.state.fileUpload === '' || this.state.listInventory.length === 0} 
                                    className="mr-2" 
                                    onClick={handleSubmit} 
                                    color="primary"
                                >
                                    Save
                                </Button>
                                <Button 
                                    className="mr-3"
                                    onClick={this.openModalUpload}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </ModalBody>
                        )}
                    </Formik>
                </Modal>
                <Modal isOpen={this.state.modalConfirm} toggle={this.openConfirm} size="md">
                    <ModalBody>
                        {this.state.confirm === 'update' ? (
                        <div className="cekUpdate">
                            <AiFillCheckCircle size={80} className="green" />
                            <div className="sucUpdate green">Berhasil Mengupdate File</div>
                        </div>
                        ) : this.state.confirm === 'add' ? (
                            <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Menambahkan Inventory</div>
                            </div>
                        ) : this.state.confirm === 'upload' ?(
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Mengupload File</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'delete' ?(
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                <div className="sucUpdate green">Berhasil Delete Data Inventory</div>
                            </div>
                            </div>
                        ) : this.state.confirm === 'generate' ?(
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                    <div className="sucUpdate green">Berhasil Generate Report Inventory</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'merge' ?(
                            <div>
                                <div className="cekUpdate">
                                    <AiFillCheckCircle size={80} className="green" />
                                    <div className="sucUpdate green">Berhasil Merge Report Inventory</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'failReport' ? (
                            <div>
                                <div className="cekUpdate">
                                    <AiOutlineClose size={80} className="red" />
                                    <div className="sucUpdate red">Gagal Proses Report</div>
                                    <div className="sucUpdate red">Pastikan memilih file dengan benar</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'failGenerate' ? (
                            <div>
                                <div className="cekUpdate">
                                    <AiOutlineClose size={80} className="red" />
                                    <div className="sucUpdate red">Gagal Generate Report</div>
                                    <div className="sucUpdate red">Pastikan report yang dipilih sudah memiliki status full upload</div>
                                </div>
                            </div>
                        ) : this.state.confirm === 'failMerge' ? (
                            <div>
                                <div className="cekUpdate">
                                    <AiOutlineClose size={80} className="red" />
                                    <div className="sucUpdate red">Gagal Merge Report</div>
                                    <div className="sucUpdate red">Pastikan telah memilih lebih dari 1 output report</div>
                                </div>
                            </div>
                        ) : (
                            <div></div>
                        )}
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.props.inventory.isLoading ? true: false} size="sm">
                        <ModalBody>
                        <div>
                            <div className="cekUpdate">
                                <Spinner />
                                <div sucUpdate>Waiting....</div>
                            </div>
                        </div>
                        </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalDelete} size="md" toggle={this.openModalDelete} centered={true}>
                    <ModalBody>
                        <div className='modalApprove'>
                            <div>
                                <text>
                                    Anda yakin untuk delete data inventory ?
                                </text>
                            </div>
                            <div className='btnApproveIo'>
                                <Button color="primary" className='mr-2' onClick={this.state.modalUpdate ? this.deletePartial : this.prosesDelete}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalDelete}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
                <Modal isOpen={this.state.modalGenerate} size="md" toggle={this.openModalGenerate} centered={true}>
                    <ModalBody>
                        <div className='modalApprove'>
                            <div>
                                <text>
                                    Anda yakin untuk proses report inventory ?
                                </text>
                            </div>
                            <div className='btnApproveIo'>
                                <Button color="primary" className='mr-2' onClick={this.prosesReport}>Ya</Button>
                                <Button color="secondary" onClick={this.openModalGenerate}>Tidak</Button>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => ({
    inventory: state.inventory,
    divisi: state.divisi,
    depo: state.depo
})

const mapDispatchToProps = {
    logout: auth.logout,
    addInventory: inventory.addInventory,
    updateInventory: inventory.updateInventory,
    getRepinv: inventory.getRepinv,
    resetError: inventory.resetError,
    getInventory: inventory.getInventory,
    getDivisi: divisi.getDivisi,
    getDepo: depo.getDepo,
    uploadRepinv: inventory.uploadRepinv,
    updateRepinv: inventory.updateRepinv,
    nextPage: inventory.nextPage,
    exportMaster: inventory.exportMaster,
    deleteRepinv: inventory.deleteRepinv,
    generateRepinv: inventory.generateRepinv,
    mergeRepinv: inventory.mergeRepinv
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportEndStock)
	