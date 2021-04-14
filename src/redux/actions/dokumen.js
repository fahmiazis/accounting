/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addDokumen: (token, data) => ({
        type: 'ADD_DOKUMEN',
        payload: http(token).post(`/dokumen/add`, qs.stringify(data))
    }),
    updateDokumen: (token, id, data) => ({
        type: 'UPDATE_DOKUMEN',
        payload: http(token).patch(`/dokumen/update/${id}`, qs.stringify(data)),
    }),
    getDokumen: (token) => ({
        type: 'GET_DOKUMEN',
        payload: http(token).get(`/dokumen/get`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_MASTER',
        payload: http(token).post(`/dokumen/master`, data)
    }),
    getDetailDokumen: (token, id) => ({
        type: 'GET_DETAIL_DOKUMEN',
        payload: http(token).get(`/dokumen/detail/${id}`)
    }),
    deleteDokumen: (token, id) => ({
        type: 'DELETE_DOKUMEN',
        payload: http(token).delete(`/dokumen/delete/${id}`)
    }),
    resetError: () => ({
        type: 'RESET'
    })
}
