/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addUser: (token, data) => ({
        type: 'ADD_USER',
        payload: http(token).post(`/user/add`, qs.stringify(data))
    }),
    updateUser: (token, id, data) => ({
        type: 'UPDATE_USER',
        payload: http(token).patch(`/user/update/${id}`, qs.stringify(data)),
    }),
    getUser: (token) => ({
        type: 'GET_USER',
        payload: http(token).get(`/user/get`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_MASTER',
        payload: http(token).post(`/user/master`, data)
    }),
    getDetailUser: (token, id) => ({
        type: 'GET_DETAIL_USER',
        payload: http(token).get(`/user/detail/${id}`)
    }),
    deleteUser: (token, id) => ({
        type: 'DELETE_USER',
        payload: http(token).delete(`/user/delete/${id}`)
    }),
    resetError: () => ({
        type: 'RESET'
    })
}