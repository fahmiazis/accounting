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
    getDokumen: (token, limit, search, page) => ({
        type: 'GET_DOKUMEN',
        payload: http(token).get(`/dokumen/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_MASTER',
        payload: http(token).post(`/dokumen/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_DOKUMEN',
        payload: http(token).get(`/dokumen/export`)
    }),
    getDetailDokumen: (token, id) => ({
        type: 'GET_DETAIL_DOKUMEN',
        payload: http(token).get(`/dokumen/detail/${id}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_DOKUMEN',
        payload: http(token).get(`${link}`)
    }),
    deleteDokumen: (token, data) => ({
        type: 'DELETE_DOKUMEN',
        payload: http(token).patch(`/dokumen/delete`, data)
    }),
    resetError: () => ({
        type: 'RESET'
    })
}
