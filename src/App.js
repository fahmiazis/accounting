import React, { Component } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import {connect} from "react-redux"

import auth from './redux/actions/auth'

import PrivateRoute from './components/PrivateRoute'

import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Dokumen from './pages/Dokumen'
import tes from './pages/tes'
import MasterEmail from './pages/MasterEmail'
import MasterPic from './pages/MasterPic'
import MasterDokumen from './pages/MasterDokumen'
import MasterAlasan from './pages/MasterAlasan'
import MasterUser from './pages/MasterUser'
import MasterDepo from './pages/MasterDepo'
import MasterDivisi from './pages/MasterDivisi'
import Report from './pages/Report'

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
                <Route path='/' exact component={Login} />
                <Route path='/home' exact component={Home} />
                <Route path='/dashboard' component={Dashboard} />
                <Route path='/dokumen' component={Dokumen} />
                <Route path="/tes" component={tes} />
                <Route path="/email" component={MasterEmail} />
                <Route path="/pic" component={MasterPic} />
                <Route path="/master/dokumen" component={MasterDokumen} />
                <Route path="/alasan" component={MasterAlasan} />
                <Route path="/user" component={MasterUser} />
                <Route path="/depo" component={MasterDepo} />
                <Route path="/divisi" component={MasterDivisi} />
                <Route path="/report" component={Report} />
                {/* <PrivateRoute path='/dokumen'>
                    <Dokumen />
                </PrivateRoute> */}
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
