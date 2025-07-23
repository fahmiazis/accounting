import React, { useState } from "react";
import PropTypes from "prop-types";
import MaterialTitlePanel from "./material_title_panel";
import { Collapse } from 'reactstrap';
import logo from '../assets/img/logo.png'
import { FaDatabase, FaHome, FaFileArchive } from 'react-icons/fa'
import { RiDashboardFill, RiFileUnknowLine, RiFileSettingsLine } from 'react-icons/ri'
import { HiDocumentReport } from 'react-icons/hi'
import {FiLogOut, FiUser, FiUsers, FiMail} from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import { BsClipboardData, BsHouseDoor, BsFileCheck } from 'react-icons/bs'
import { GiFamilyTree } from 'react-icons/gi'
import { MdKeyboardArrowLeft, MdKeyboardArrowDown } from 'react-icons/md'
import { AiFillSetting, AiOutlineClockCircle, AiOutlineUnlock } from 'react-icons/ai'
import { GrDocumentVerified } from 'react-icons/gr'
import { useDispatch } from 'react-redux'
import logoutAction from '../redux/actions/auth'

const styles = {
  sidebar: {
    width: 350,
    height: "100%"
  },
  sidebarLink: {
    display: "block",
    padding: "16px 0px",
    color: "white",
    textDecoration: "none",
    fontSize: "15px"
  },
  divider: {
    margin: "8px 0",
    height: 1,
    backgroundColor: "#757575"
  },
  content: {
    padding: "16px",
    // height: "60%",
    backgroundColor: "#A01E2A"
  }
};

const SidebarContent = props => {
  const style = props.style
    ? { ...styles.sidebar, ...props.style }
    : styles.sidebar;

  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false);
  const [openDoc, setOpenDoc] = useState(false);
  const [openSet, setOpenSet] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  const modalOpen = () => setOpenDoc(!openDoc)
  const modalSet = () => setOpenSet(!openSet)

  const history = useHistory()

  function goHome(route) {
    history.push(`/${route}`)
  }

  function logout() {
    dispatch(logoutAction.logout())
    history.push('/login')
  }

  const level = localStorage.getItem('level')

  return (
    <MaterialTitlePanel title="" style={style}>
      <div className="div-side">
        <img src={logo} className="img-side"/>
      </div>
      <div style={styles.content}>
        <button onClick={() => goHome('')} className="btn-side">
            <FaHome size={20} className="mr-2"/>
            <text className="txtSide">Home</text>
        </button>
        <button onClick={() => goHome('dashboard')} className="btn-side">
            <RiDashboardFill size={20} className="mr-2"/> Dashboard
        </button>
        {level === '2' ? (
          <button onClick={modalOpen} className="btn-side1">
            <div>
              <HiDocumentReport size={22} className="mr-2"/> Document
            </div>
            {openDoc === true ? (
              <MdKeyboardArrowDown size={20} />
            ) : (
              <MdKeyboardArrowLeft size={20} />
            )}
        </button>
        ) : (
          <button onClick={() => goHome('dokumen')} className="btn-side">
            <HiDocumentReport size={22} className="mr-2"/> Document
          </button>
        )}
        <Collapse isOpen={openDoc} className="ml-4">
          <button onClick={() => goHome('dokumen')} className="btn-side">
              <BsFileCheck size={22} className="mr-2 white" /> Verifikasi Dokumen
          </button>
          <button onClick={() => goHome('setting/dokumen')} className="btn-side">
            <RiFileSettingsLine size={22} className="mr-2"/> Setting Dokumen
          </button>
        </Collapse>
        {level === '1' ? (
          <button className="btn-side1" onClick={toggle}>
            <div>
              <FaDatabase size={20} className="mr-2"/> Masterdata
            </div>
            {isOpen === true ? (
              <MdKeyboardArrowDown size={20} />
            ) : (
              <MdKeyboardArrowLeft size={20} />
            )}
          </button>
        ) : (
          <div></div>
        )}
        <Collapse isOpen={isOpen} className="ml-4">
          <button onClick={() => goHome('alasan')} className="btn-side">
            <RiFileUnknowLine size={20} className="mr-2"/>
             Masterdata Alasan
          </button>
          <button onClick={() => goHome('depo')} className="btn-side">
            <BsHouseDoor size={20} className="mr-2"/>
             Masterdata Depo
          </button>
          <button onClick={() => goHome('email')} className="btn-side">
            <FiMail size={20} className="mr-2"/>
             Masterdata Email
          </button>
          <button onClick={() => goHome('user')} className="btn-side">
            <FiUser size={20} className="mr-2"/>
             Masterdata User
          </button>
          <button onClick={() => goHome('divisi')} className="btn-side">
            <GiFamilyTree size={20} className="mr-2"/>
             Masterdata Divisi
          </button>
          <button onClick={() => goHome('master/dokumen')} className="btn-side">
            <BsClipboardData size={20} className="mr-2"/>
             Masterdata Document
          </button>
          <button onClick={() => goHome('pic')} className="btn-side">
            <FiUsers size={20} className="mr-2"/>
             Masterdata PIC
          </button>
        </Collapse>
        {level === '2' || level === '1' ? (
          <button onClick={modalSet} className="btn-side1">
            <div>
              <AiFillSetting size={22} className="mr-2"/> Setting
            </div>
            {openSet === true ? (
                <MdKeyboardArrowDown size={20} />
              ) : (
                <MdKeyboardArrowLeft size={20} />
              )}
          </button>
        ) : (
          <div></div>
        )}
        <Collapse isOpen={openSet} className="ml-4">
          <button onClick={() => goHome('lock')} className="btn-side">
              <AiOutlineUnlock size={22} className="mr-2 white" /> Setting Access
          </button>
          <button onClick={() => goHome('date')} className="btn-side">
            <AiOutlineClockCircle size={22} className="mr-2"/> Setting Date Clossing
          </button>
        </Collapse>
        {(level === '2' || level === '1') && (
          <button onClick={() => goHome('uploadsales')} className="btn-side">
              <FaFileArchive size={20} className="mr-2"/> Upload Sales Tax
          </button>
        )}
        <button onClick={() => goHome('report')} className={level === '1' ? "btn-side margin-side" : level === '2' ? "btn-side margin-side1" : "btn-side margin-side2"}>
            <FaFileArchive size={20} className="mr-2"/> Report
        </button>
        <button onClick={() => logout()} className="btn-side">
            <FiLogOut size={20} className="mr-2"/> Logout
        </button>
      </div>
    </MaterialTitlePanel>
  );
};

SidebarContent.propTypes = {
  style: PropTypes.object
};

export default SidebarContent;