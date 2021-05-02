/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addAlasan: (token, data) => ({
        type: 'ADD_ALASAN',
        payload: http(token).post(`/alasan/create`, qs.stringify(data))
    }),
    updateAlasan: (token, id, data) => ({
        type: 'UPDATE_ALASAN',
        payload: http(token).patch(`/alasan/update/${id}`, qs.stringify(data)),
    }),
    getAlasan: (token, limit, search) => ({
        type: 'GET_ALASAN',
        payload: http(token).get(`/alasan/get?limit=${limit}&search=${search}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_MASTER',
        payload: http(token).post(`/alasan/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_ALASAN',
        payload: http(token).get(`/alasan/export`)
    }),
    deleteAlasan: (token, id) => ({
        type: 'DELETE_ALASAN',
        payload: http(token).delete(`/alasan/delete/${id}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_ALASAN',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET'
    })
}