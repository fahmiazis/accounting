/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addDivisi: (token, data) => ({
        type: 'ADD_DIVISI',
        payload: http(token).post(`/divisi/create`, qs.stringify(data))
    }),
    updateDivisi: (token, id, data) => ({
        type: 'UPDATE_DIVISI',
        payload: http(token).patch(`/divisi/update/${id}`, qs.stringify(data)),
    }),
    getDivisi: (token) => ({
        type: 'GET_DIVISI',
        payload: http(token).get(`/divisi/get`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_MASTER',
        payload: http(token).post(`/divisi/master`, data)
    }),
    deleteDivisi: (token, id) => ({
        type: 'DELETE_DIVISI',
        payload: http(token).delete(`/divisi/delete/${id}`)
    }),
    resetError: () => ({
        type: 'RESET'
    })
}