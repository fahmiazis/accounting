import {default as axios} from 'axios'

const {REACT_APP_SALES_URL} = process.env

const http = (token=false)=>{
  return axios.create({
    baseURL: REACT_APP_SALES_URL,
    headers: {
      'Authorization': token? `Bearer ${token}` : undefined
    }
  })
}

export default http