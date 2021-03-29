import React, { Component } from 'react'
import Sidebar from "react-sidebar";

export default class tes extends Component {

      state = {
        sidebarOpen: false
      }
     
      onSetSidebarOpen = () => {
        this.setState({ sidebarOpen: !this.state.sidebarOpen });
      }
     
      render() {
        return (
          <Sidebar
            sidebar={<b>Sidebar content</b>}
            open={this.state.sidebarOpen}
            onSetOpen={this.onSetSidebarOpen}
            styles={{ sidebar: { background: "white" } }}
          >
            <button onClick={() => this.onSetSidebarOpen()}>
              Open sidebar
            </button>
          </Sidebar>
        );
      }
}
