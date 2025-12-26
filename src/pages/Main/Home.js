import React, { Component } from 'react'
import { Container, Collapse, Nav, Navbar,
NavbarToggler, NavbarBrand, NavItem, NavLink,
UncontrolledDropdown, DropdownToggle, DropdownMenu,
DropdownItem, Dropdown} from 'reactstrap'
import auth from '../../redux/actions/auth'
import logo from "../../assets/img/logo.png"
import '../../assets/css/style.css'
import {connect} from 'react-redux'
import {FaSearch, FaUserCircle, FaBars} from 'react-icons/fa'
import dashboard from '../../redux/actions/dashboard'
import {BsBell} from 'react-icons/bs'
import { FcDocument } from 'react-icons/fc'
import moment from 'moment'
import {BsFillCircleFill} from 'react-icons/bs'
import Sidebar from "../../components/Header"
import MaterialTitlePanel from "../../components/material_title_panel"
import SidebarContent from "../../components/sidebar_content"
import NewNavbar from '../../components/NewNavbar'
import styleTrans from '../../assets/css/transaksi.module.css'

// Import Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
)

const {REACT_APP_BACKEND_URL} = process.env

class Home extends Component {

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
            isOpen: false,
            settingOpen: false,
            dropOpenNum: false,
            chartData: [],
            chartType: 'bar' // 'bar', 'line', 'doughnut'
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

    dropOpen = () => {
        this.setState({dropOpenNum: !this.state.dropOpenNum})
    }

    toggle = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    dropSetting = () => {
        this.setState({settingOpen: !this.state.settingOpen})
    }

    componentDidMount(){
        this.getNotif()
        this.getChartData()
    }

    componentDidUpdate(){
        // const kode = localStorage.getItem('kode')
        // socket.on(kode, () => {
        //     this.getNotif()
        // })
    }

    getNotif = async () => {
        const token = localStorage.getItem('token')
        const level = localStorage.getItem('level')
        if (level === '2' || level === '3') {
            await this.props.getNotif(token)
        } else if (level === '4' || level === '5') {
            await this.props.getNotifArea(token)
        }
    }

    getChartData = async () => {
        const token = localStorage.getItem('token')
        try {
            const res = await this.props.getStatistics(token)
            const {dataStat} = this.props.dashboard
            this.setState({ chartData: dataStat })
        } catch (error) {
            console.log(error)
        }
    }

    menuButtonClick(ev) {
        ev.preventDefault();
        this.onSetOpen(!this.state.open);
    }

    onSetOpen(open) {
        this.setState({ open });
    }

    // Prepare data untuk Bar Chart
    getBarChartData = () => {
        const { chartData } = this.state
        
        return {
            labels: chartData.map(item => moment(item.month, 'YYYY-MM').format('MMM YYYY')),
            datasets: [
                {
                    label: 'Uploaded',
                    data: chartData.map(item => parseInt(item.uploaded)),
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Approved',
                    data: chartData.map(item => parseInt(item.approved)),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
                {
                    label: 'Rejected',
                    data: chartData.map(item => parseInt(item.rejected)),
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1,
                }
            ]
        }
    }

    // Prepare data untuk Line Chart
    getLineChartData = () => {
        const { chartData } = this.state
        
        return {
            labels: chartData.map(item => moment(item.month, 'YYYY-MM').format('MMM YYYY')),
            datasets: [
                {
                    label: 'Uploaded',
                    data: chartData.map(item => parseInt(item.uploaded)),
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.4,
                    fill: true,
                },
                {
                    label: 'Approved',
                    data: chartData.map(item => parseInt(item.approved)),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4,
                    fill: true,
                },
                {
                    label: 'Rejected',
                    data: chartData.map(item => parseInt(item.rejected)),
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.4,
                    fill: true,
                }
            ]
        }
    }

    // Prepare data untuk Doughnut Chart (Total per status)
    getDoughnutChartData = () => {
        const { chartData } = this.state
        
        const totalUploaded = chartData.reduce((sum, item) => sum + parseInt(item.uploaded), 0)
        const totalApproved = chartData.reduce((sum, item) => sum + parseInt(item.approved), 0)
        const totalRejected = chartData.reduce((sum, item) => sum + parseInt(item.rejected), 0)
        
        return {
            labels: ['Uploaded', 'Approved', 'Rejected'],
            datasets: [
                {
                    data: [totalUploaded, totalApproved, totalRejected],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)',
                    ],
                    borderWidth: 2,
                }
            ]
        }
    }

    // Chart options - sangat mudah di-custom!
    getBarOptions = () => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            size: 12,
                            family: 'Arial'
                        },
                        padding: 15
                    }
                },
                title: {
                    display: true,
                    text: 'Statistik Upload Dokumen per Bulan',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        font: {
                            size: 11
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    }

    getLineOptions = () => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Trend Upload Dokumen',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    }

    getDoughnutOptions = () => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 20,
                        font: {
                            size: 13
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Total Dokumen per Status (6 Bulan Terakhir)',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    padding: 20
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    }

    changeChartType = (type) => {
        this.setState({ chartType: type })
    }

    render() {
        const {isOpen, dropOpenNum, chartData, chartType} = this.state
        const level = localStorage.getItem('level')
        const names = localStorage.getItem('name')
        const {notif, notifSa, notifKasir} = this.props.dashboard
        
        return (
            <>
            <div className={styleTrans.app}>
                <NewNavbar handleSidebar={this.prosesSidebar} handleRoute={this.goRoute} />

                <div className={`${styleTrans.mainContent} ${this.state.sidebarOpen ? styleTrans.collapsedContent : ''}`}>
                    {/* <div className="rowAround">
                        <div className="titleSec">
                            <text className="bigTitle">PT. Pinus Merah Abadi</text>
                            <text className="smallTitle">Distribution Company</text>
                        </div>
                        <div>
                            <img src={logo} alt="logo" className="imgHead" />
                        </div>  
                    </div> */}

                    {/* Chart Section */}
                    {/* {chartData.length > 0 && (
                        
                    )} */}
                    <div style={{ 
                        marginTop: '30px', 
                        padding: '25px', 
                        backgroundColor: '#fff', 
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}>
                        {/* Chart Type Selector */}
                        <div style={{ 
                            marginBottom: '20px', 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h3 style={{ margin: 0 }}>Dashboard Statistik</h3>
                            <div>
                                <button 
                                    onClick={() => this.changeChartType('bar')}
                                    style={{
                                        padding: '8px 16px',
                                        marginRight: '10px',
                                        backgroundColor: chartType === 'bar' ? '#007bff' : '#f0f0f0',
                                        color: chartType === 'bar' ? '#fff' : '#333',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Bar Chart
                                </button>
                                <button 
                                    onClick={() => this.changeChartType('line')}
                                    style={{
                                        padding: '8px 16px',
                                        marginRight: '10px',
                                        backgroundColor: chartType === 'line' ? '#007bff' : '#f0f0f0',
                                        color: chartType === 'line' ? '#fff' : '#333',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Line Chart
                                </button>
                                <button 
                                    onClick={() => this.changeChartType('doughnut')}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: chartType === 'doughnut' ? '#007bff' : '#f0f0f0',
                                        color: chartType === 'doughnut' ? '#fff' : '#333',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Doughnut Chart
                                </button>
                            </div>
                        </div>

                        {/* Chart Container */}
                        <div style={{ height: '400px' }}>
                            {chartType === 'bar' && (
                                <Bar data={this.getBarChartData()} options={this.getBarOptions()} />
                            )}
                            {chartType === 'line' && (
                                <Line data={this.getLineChartData()} options={this.getLineOptions()} />
                            )}
                            {chartType === 'doughnut' && (
                                <Doughnut data={this.getDoughnutChartData()} options={this.getDoughnutOptions()} />
                            )}
                        </div>

                        {/* Summary Stats */}
                        <div style={{ 
                            marginTop: '30px', 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(3, 1fr)', 
                            gap: '20px' 
                        }}>
                            <div style={{ 
                                padding: '20px', 
                                backgroundColor: '#e3f2fd', 
                                borderRadius: '8px',
                                textAlign: 'center'
                            }}>
                                <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>Total Uploaded</h4>
                                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#1565c0' }}>
                                    {chartData.reduce((sum, item) => sum + parseInt(item.uploaded), 0)}
                                </p>
                            </div>
                            <div style={{ 
                                padding: '20px', 
                                backgroundColor: '#e0f2f1', 
                                borderRadius: '8px',
                                textAlign: 'center'
                            }}>
                                <h4 style={{ margin: '0 0 10px 0', color: '#00897b' }}>Total Approved</h4>
                                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#00695c' }}>
                                    {chartData.reduce((sum, item) => sum + parseInt(item.approved), 0)}
                                </p>
                            </div>
                            <div style={{ 
                                padding: '20px', 
                                backgroundColor: '#ffebee', 
                                borderRadius: '8px',
                                textAlign: 'center'
                            }}>
                                <h4 style={{ margin: '0 0 10px 0', color: '#d32f2f' }}>Total Rejected</h4>
                                <p style={{ fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#c62828' }}>
                                    {chartData.reduce((sum, item) => sum + parseInt(item.rejected), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    dashboard: state.dashboard
})

const mapDispatchToProps = {
    logout: auth.logout,
    getDashboard: dashboard.getDashboard,
    getNotifArea: dashboard.getNotifArea,
    getNotif: dashboard.getNotif,
    getStatistics: dashboard.getStatistics
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)