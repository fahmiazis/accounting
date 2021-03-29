import React, { Component } from 'react'
import { Route, Redirect } from 'react-router-dom'

class PrivateRoute extends Component {
  render () {
    return (
      <Route render={
        (props) => {
          const childWithProps = React.Children.map(this.props.children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child, props)
            }
            return child
          })
          if (localStorage.getItem('token')) {
            return childWithProps
          } else {
            return <Redirect to={{ pathname: '/' }} />
          }
        }
      }
      />
    )
  }
}

export default PrivateRoute
