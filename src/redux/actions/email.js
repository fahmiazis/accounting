/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addEmail: (token, data) => ({
        type: 'ADD_EMAIL',
        payload: http(token).post(`/email/add`, qs.stringify(data))
    }),
    updateEmail: (token, id, data) => ({
        type: 'UPDATE_EMAIL',
        payload: http(token).patch(`/email/update/${id}`, qs.stringify(data)),
    }),
    getEmail: (token) => ({
        type: 'GET_EMAIL',
        payload: http(token).get(`/email/get`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_MASTER',
        payload: http(token).post(`/email/master`, data)
    }),
    getDetailEmail: (token, id) => ({
        type: 'GET_DETAIL_EMAIL',
        payload: http(token).get(`/email/detail/${id}`)
    }),
    deleteEmail: (token, id) => ({
        type: 'DELETE_EMAIL',
        payload: http(token).delete(`/email/delete/${id}`)
    }),
    resetError: () => ({
        type: 'RESET'
    })
}
