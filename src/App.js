import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import {connect} from "react-redux"

import auth from './redux/actions/auth'

import PrivateRoute from './components/PrivateRoute'

import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Dokumen from './pages/Dokumen'
import MasterEmail from './pages/MasterEmail'
import MasterPic from './pages/MasterPic'
import MasterDokumen from './pages/MasterDokumen'
import MasterAlasan from './pages/MasterAlasan'
import MasterUser from './pages/MasterUser'
import MasterDepo from './pages/MasterDepo'
import MasterDivisi from './pages/MasterDivisi'
import Report from './pages/Report'
import tes from './pages/tes'

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
            </Switch>
        </BrowserRouter>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
  })
  
  const mapDispatchToProps = {
    setToken: auth.setToken
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(App)
