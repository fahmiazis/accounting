import { Button } from 'reactstrap'
import styleTrans from '../assets/css/transaksi.module.css' // Import module CSS
import logo from '../assets/img/logo.png'
import React, { Component } from "react";
import { Collapse } from 'reactstrap';
import { FaUserCircle, FaBell, FaBars, FaMobileAlt } from "react-icons/fa";
import {
  BsFillHouseDoorFill,
  BsGearFill,
  BsFileTextFill,
  BsFillFileEarmarkTextFill,
  BsTable,
  BsDownload
} from "react-icons/bs";
import {AiFillHome, AiOutlineUnlock, AiOutlineClockCircle} from 'react-icons/ai'
import { FaDatabase, FaHome, FaFileArchive, FaCartPlus, FaRecycle, FaTasks, } from 'react-icons/fa'
import { RiArrowLeftRightFill, RiMoneyDollarCircleFill } from 'react-icons/ri'
import { HiDocumentReport } from 'react-icons/hi'
import {FiLogOut, FiUser, FiUsers, FiMail, FiEye} from 'react-icons/fi'
import { BsClipboardData, BsHouseDoor, BsFileCheck } from 'react-icons/bs'
import { GiFamilyTree } from 'react-icons/gi'
import { MdKeyboardArrowLeft, MdKeyboardArrowDown, MdCompareArrows } from 'react-icons/md'
import { AiOutlineMenu } from 'react-icons/ai'
import { FaArchive } from 'react-icons/fa'
import { RiDashboardFill, RiFileUnknowLine, RiFileSettingsLine } from 'react-icons/ri'
import Bell from './Bell'
import Account from './Account'

import {FiSend, FiTruck} from 'react-icons/fi'
import {BiRevision} from 'react-icons/bi'
import {MdAssignment, MdVerifiedUser, MdOutlineVerifiedUser, MdMonetizationOn, MdDomainVerification} from 'react-icons/md'
import {HiOutlineDocumentReport} from 'react-icons/hi'
import {RiDraftFill} from 'react-icons/ri'
import {FaFileSignature} from 'react-icons/fa'
import {BsBell, BsFillCircleFill} from 'react-icons/bs'

class NewNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      searchQuery: '',
      filterStatus: 'Semua Status',
      isLogo: false,
      sidebarOpen: true, // Untuk expand/collapse di mode web
      mobileSidebarVisible: false, // Untuk hidden/show di mode mobile
      isMobile: window.innerWidth <= 768, // Mendeteksi apakah di mode mobile
      openDokumen: false,
      openSetting: false,
      openInv: false,
      openMut: false,
      openEndStock: false,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize); // Tambahkan event listener untuk resize
    setTimeout(() => {
      const {sidebarOpen} = this.state
      this.props.handleSidebar(sidebarOpen)
    }, 100)
  }

  getProfile = async () => {
    
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize); // Bersihkan event listener saat komponen di-unmount
  }

  handleResize = () => {
    this.setState({ isMobile: window.innerWidth <= 768 }); // Perbarui status isMobile saat ukuran layar berubah
  };

  // Toggle sidebar untuk mode web (expand/collapse)
  toggleSidebar = (val) => {
    console.log('section 1')
    console.log(this.state.isLogo)
    this.setState(() => ({
      isLogo: val === 'logo' ? !this.state.isLogo : this.state.isLogo
    }))

    setTimeout(() => {
      console.log('section 2')
      console.log(this.state.isLogo)
      const valState = val === 'open' ? false : val === 'close' ? true : !this.state.sidebarOpen
      this.setState((prevState) => ({
        sidebarOpen: this.state.isLogo === true ? false : val === 'logo' && this.state.isLogo === false ? true : valState,
      }))
    }, 100)

    setTimeout(() => {
      console.log('section 3')
      console.log(this.state.isLogo)
      const {sidebarOpen} = this.state
      if (sidebarOpen === true) {
        this.setState({isOpen: false, openDokumen: false, openSetting: false, openMut: false, openInv: false, openEndStock: false})
        this.props.handleSidebar(sidebarOpen)
      } else {
        this.props.handleSidebar(sidebarOpen)
      }
    }, 200)
  }

  // Toggle sidebar untuk mode mobile (hidden/show)
  toggleMobileSidebar = () => {
    this.setState((prevState) => ({
      mobileSidebarVisible: !prevState.mobileSidebarVisible,
    }));
  };
  

  goRoute = (val) => {
    this.props.handleRoute(val)
  }

  toggleMaster = () => {
    this.setState({isOpen: !this.state.isOpen})
  }

  toggleDokumen = () => {
    this.setState({openDokumen: !this.state.openDokumen})
  }

  toggleSetting = () => {
    console.log('setting')
    this.setState({openSetting: !this.state.openSetting})
  }

  toggleInv = () => {
      this.setState({openInv: !this.state.openInv})
  }

  toggleEndStock = () => {
      this.setState({openEndStock: !this.state.openEndStock})
  }

  toggleMut = () => {
      this.setState({openMut: !this.state.openMut})
  }

  render() {
    const level = localStorage.getItem('level')
    const { sidebarOpen, mobileSidebarVisible, isMobile, searchQuery, isOpen } = this.state;

    const allowSet = ['1','17','20', '21', '22', '23', '24', '25', '32']
    return (
      <>
        <div
          className={`${styleTrans.sidebar} ${sidebarOpen && !isMobile ? styleTrans.collapsed : ""} ${
            mobileSidebarVisible && isMobile ? styleTrans.mobileVisible : ""
          }`}
          onMouseEnter={() => this.toggleSidebar('open')}
          onMouseLeave={() => this.toggleSidebar('close')}
        >
          {/* Bagian Logo Perusahaan */}
          <div
            className={styleTrans.logoContainer}
            onClick={isMobile ? this.toggleMobileSidebar : () => this.toggleSidebar('logo')}
          >
            <img
              src={logo} // Ganti dengan path logo yang sesuai
              alt="Logo"
              className={styleTrans.logo}
            />
          </div>

          {/* Menu di Sidebar */}
          <div className={styleTrans.menuItems}>
            <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('')} >
              <BsFillHouseDoorFill className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Home</span>}
            </div>

            {/* <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('dashboard')} >
              <RiDashboardFill className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Dashboard</span>}
            </div> */}

            <div href="#" className={styleTrans.menuLink} 
            onClick={() => (level === '2' || level === '1') ? this.toggleDokumen() : this.goRoute('dokumen')}
            >
              <HiDocumentReport className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Document</span>}
            </div>
            <Collapse isOpen={this.state.openDokumen} className="ml-3 mt-2">
              {(level === '2' || level === '1') && (
                  <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('download')} >
                    <BsDownload className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Download Document</span>}
                </div>
              )}

              {(level === '2') && (
                  <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('setting/dokumen')} >
                    <RiFileSettingsLine className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Setting Document</span>}
                </div>
              )}

              {(level === '2' || level === '1') && (
                  <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('dokumen')} >
                    <BsFileCheck className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Verifikasi Document</span>}
                </div>
              )}
            </Collapse>

             {(level === '2' || level === '1' || level === '3') && (
              <div href="#" className={styleTrans.menuLink} 
                onClick={this.toggleEndStock}
              >
                <FaTasks className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>End Stock</span>}
              </div>
            )}

            <Collapse isOpen={this.state.openEndStock} className="ml-3 mt-2">
              <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('report-endstock')} >
                <FaFileArchive className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>Report End Stock</span>}
              </div>
            </Collapse>
          
            {(level === '2' || level === '1' || level === '3') && (
              <div href="#" className={styleTrans.menuLink} 
                onClick={this.toggleInv}
              >
                <FaTasks className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>Inventory</span>}
              </div>
            )}
            
            <Collapse isOpen={this.state.openInv} className="ml-3 mt-2">
              {(level === '2' || level === '1') && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('inventory')} >
                    <FaArchive className={styleTrans.icon} size={sidebarOpen && 20} /> 
                    {(!sidebarOpen || isMobile) &&  <span>Master Depo Inventory</span>}
                </div>
              )}
              {(level === '2' || level === '1') && (
                <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('movement')} >
                  <MdCompareArrows className={styleTrans.icon} size={sidebarOpen && 20} /> 
                  {(!sidebarOpen || isMobile) &&  <span>Master Movement</span>}
                </div>
              )}
              <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('report-inventory')} >
                <FaFileArchive className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>Report Inventory</span>}
              </div>
            </Collapse>


            {level === '1' && (
              <div href="#" className={styleTrans.menuLink}  onClick={this.toggleMaster}>
                <FaDatabase className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>Master Data</span>}
              </div>
            )}
            <Collapse isOpen={isOpen} className="ml-3 mt-2">
              <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('alasan')} >
                <RiFileUnknowLine className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>Master Alasan</span>}
              </div>
              <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('depo')} >
                <BsHouseDoor className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>Master Depo</span>}
              </div>
              <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('divisi')} >
                <GiFamilyTree className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>Master Divisi</span>}
              </div>
              <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('master/dokumen')} >
                <BsClipboardData className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>Master Document</span>}
              </div>
              <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('email')} >
                <FiMail className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>Master Email</span>}
              </div>
              <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('pic')} >
                <FiUsers className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>Master PIC</span>}
              </div>
              <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('user')} >
                <FiUser className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>Master User</span>}
              </div>
            </Collapse>
            {(level === '2' || level === '1') && (
              <div href="#" className={styleTrans.menuLink} 
                onClick={this.toggleSetting}
              >
                <HiDocumentReport className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>Setting</span>}
              </div>
            )}
            <Collapse isOpen={this.state.openSetting} className="ml-3 mt-2">
              <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('lock')} >
                <AiOutlineUnlock className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>Setting Access</span>}
              </div>
              <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('date')} >
                <AiOutlineClockCircle className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>Setting Date Clossing</span>}
              </div>
            </Collapse>

            <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('report')} >
              <FaFileArchive className={styleTrans.icon} size={sidebarOpen && 20} /> 
              {(!sidebarOpen || isMobile) &&  <span>Report</span>}
            </div>

            {(level === '2' || level === '1') && (
              <div href="#" className={styleTrans.menuLink} onClick={() => this.goRoute('uploadsales')} >
                <FaFileArchive className={styleTrans.icon} size={sidebarOpen && 20} /> 
                {(!sidebarOpen || isMobile) &&  <span>Upload Sales Tax</span>}
              </div>
            )}
            
          </div>
        </div>
        <div className={styleTrans.navbar}>
            <div className={styleTrans.burgerIcon} onClick={this.toggleMobileSidebar}>
              <FaBars />
            </div>
            <div className={styleTrans.navTitle}>
              <marquee>WEB ACCOUNTING</marquee>
            </div>
            <div className={styleTrans.navIcons}>
              {/* <FaBell className={styleTrans.navIcon} />
              <FaUserCircle className={styleTrans.navIcon} /> */}
              <Bell dataNotif={[]} color={"white"}/>
              <Account color={"white"} handleRoute={this.goRoute} />
            </div>
        </div>
      </>
    );
  }
}

export default NewNavbar;
