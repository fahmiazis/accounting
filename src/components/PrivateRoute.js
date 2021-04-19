import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'
import {connect} from "react-redux"
import dashboard from '../redux/actions/dashboard'
import auth from '../redux/actions/auth'

class PrivateRoute extends Component {
  componentDidMount(){
      this.getDashboard()
  }

  getDashboard = async () =>  {
    const level = localStorage.getItem('level')
    const token = localStorage.getItem('token')
    if (level === '1' || level === '2' || level === '3') {
        this.props.getDashboardPic(token, 'daily')
    } else {
        this.props.getDashboard(token, 'daily')
    }
  }

  componentDidUpdate() {
      const {isError, alertM} = this.props.dashboard
      if (isError && alertM === 'jwt expired') {
        this.props.resetError()
        this.props.logout()
      }
  }

  render () {
    const {alertM, isError} = this.props.dashboard
    return (
      <Route render={
        (props) => {
          const childWithProps = React.Children.map(this.props.children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, props)
            }
            return child
          })
          if (localStorage.getItem('token') && alertM !== 'jwt expired') {
            return childWithProps
          } else {
            return <Redirect to={{ pathname: '/login' }} />
          }
        }
      }
      />
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  dashboard: state.dashboard
})

const mapDispatchToProps = {
  logout: auth.logout,
  setToken: auth.setToken,
  getDashboard: dashboard.getDashboard,
  getDashboardPic: dashboard.getDashboardPic,
  resetError: dashboard.resetError

}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute)
