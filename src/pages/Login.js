import React, { Component } from 'react'
import {Formik} from 'formik'
import * as Yup from 'yup'
import auth from '../redux/actions/auth'
import {connect} from 'react-redux'
import { Input, Container, Form } from 'reactstrap'
import logo from '../assets/img/logo.png'
import '../assets/css/style.css'
import { AiOutlineCopyrightCircle } from "react-icons/ai"

const loginSchema = Yup.object().shape({
    email: Yup.string().required('must be filled'),
    password: Yup.string().required('must be filled'),
  });

class Login extends Component {

    login = async () => {
        await this.props.history.push('/home')
    }

    render() {
        return (
            <>
            <Form className='bodyLogin' onSubmit={this.login}>
                <div className='imgLogin'>
                    <img src={logo} alt='logo' className='imgBig' />
                </div>
                    <div className="form">
                        <div className="textLogin">Please login with your account</div>
                        <div>
                          <input className='input1' placeholder='User Name' type='name' name='email' />
                        </div>
                        <div>
                          <input className="input2" placeholder='Password' type='password' name='password' />
                        </div>
                        <button onclick={this.login} className="button">LOGIN</button>
                    </div>
                    <div className='icon mt-4'><AiOutlineCopyrightCircle size={18} className="mr-3" />IT-PMA 2019</div>
            </Form>
            </>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth
})

const mapDispatchToProps = {
    login: auth.login
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)