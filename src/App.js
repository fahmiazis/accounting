import React, { Component } from 'react'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import {connect} from "react-redux"
import dashboard from './redux/actions/dashboard'
import auth from './redux/actions/auth'

import PrivateRoute from './components/PrivateRoute'

// Main
import Login from './pages/Main/Login'
import Home from './pages/Main/Home'
import Dashboard from './pages/Main/Dashboard'
import Trial from './pages/Main/Trial'
import tes from './pages/Main/tes'

// Dokumen
import Dokumen from './pages/dokumen/Dokumen'
import DownloadDocument from './pages/dokumen/DownloadDocument'
import Report from './pages/dokumen/Report'
import ReportDokumen from './pages/dokumen/ReportDokumen'

// Master Data
import MasterEmail from './pages/Master/MasterEmail'
import MasterPic from './pages/Master/MasterPic'
import MasterDokumen from './pages/Master/MasterDokumen'
import MasterAlasan from './pages/Master/MasterAlasan'
import MasterUser from './pages/Master/MasterUser'
import MasterDepo from './pages/Master/MasterDepo'
import MasterDivisi from './pages/Master/MasterDivisi'

// Setting Page
import SettingDokumen from './pages/Setting/SettingDokumen'
import LockDepo from './pages/Setting/LockDepo'
import DateClossing from './pages/Setting/DateClossing'

// Upload Sales Tax
import UploadSales from './pages/Sales/UploadSales'
import LogUpload from './pages/Sales/LogUpload'

// Inventory
import MasterMovement from './pages/Inventory/MasterMovement'
import MasterAreaInventory from './pages/Inventory/MasterAreaInventory'
import ReportInventory from './pages/Inventory/ReportInventory'

// End Stock
import ReportEndstock from './pages/endstock/ReportEndstock'

// Sales Console
import SalesConsole from './pages/salesConsole/ReportSalesConsole'

class App extends Component {

    componentDidMount(){
        if (localStorage.getItem('token')) {
            this.props.setToken(localStorage.getItem('token'))  
        }
    }

    render() {
        return (
        <BrowserRouter>
            <Switch>
                <Route path='/login' exact component={Login} />
                <Route path='/tes' exact component={tes} />
                <PrivateRoute path='/' exact>
                    <Home />
                </PrivateRoute>
                <PrivateRoute path='/dashboard'>
                    <Dashboard />
                </PrivateRoute>
                <PrivateRoute path='/dokumen'>
                    <Dokumen />
                </PrivateRoute>
                <PrivateRoute path='/download'>
                    <DownloadDocument />
                </PrivateRoute>
                <PrivateRoute path="/email">
                    <MasterEmail />
                </PrivateRoute>
                <PrivateRoute path="/pic">
                    <MasterPic />
                </PrivateRoute>
                <PrivateRoute path="/master/dokumen">
                    <MasterDokumen />
                </PrivateRoute>
                <PrivateRoute path="/alasan">
                    <MasterAlasan />
                </PrivateRoute>
                <PrivateRoute path="/user">
                    <MasterUser />
                </PrivateRoute>
                <PrivateRoute path="/depo">
                    <MasterDepo />
                </PrivateRoute>
                <PrivateRoute path="/divisi">
                    <MasterDivisi />
                </PrivateRoute>
                <PrivateRoute path="/report">
                    <Report />
                </PrivateRoute>
                <PrivateRoute path="/report-dokumen">
                    <ReportDokumen />
                </PrivateRoute>
                <PrivateRoute path="/setting/dokumen">
                    <SettingDokumen />
                </PrivateRoute>
                <PrivateRoute path="/lock">
                    <LockDepo />
                </PrivateRoute>
                <PrivateRoute path="/date">
                    <DateClossing />
                </PrivateRoute>
                <PrivateRoute path="/coba">
                    <Trial />
                </PrivateRoute>
                <PrivateRoute path="/uploadsales">
                    <UploadSales />
                </PrivateRoute>
                <PrivateRoute path="/logupload">
                    <LogUpload />
                </PrivateRoute>
                <PrivateRoute path="/movement">
                    <MasterMovement />
                </PrivateRoute>
                <PrivateRoute path="/inventory">
                    <MasterAreaInventory />
                </PrivateRoute>
                <PrivateRoute path="/report-inventory">
                    <ReportInventory />
                </PrivateRoute>
                <PrivateRoute path="/report-endstock">
                    <ReportEndstock />
                </PrivateRoute>

                <PrivateRoute path="/sales-console">
                    <SalesConsole />
                </PrivateRoute>
            </Switch>
        </BrowserRouter>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    dashboard: state.dashboard
  })
  
  const mapDispatchToProps = {
    setToken: auth.setToken,
    getDashboard: dashboard.getDashboard,
    getDashboardPic: dashboard.getDashboardPic
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(App)
