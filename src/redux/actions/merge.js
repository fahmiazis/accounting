/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    getMerge: (token, limit, search, page, typeSort) => ({
        type: 'GET_MERGE',
        payload: http(token).get(`/datamerge/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}&typeSort=${typeSort === undefined ? 'ASC' : typeSort}`)
    }),
    getLog: (token, limit, search, page, typeSort) => ({
        type: 'GET_LOG',
        payload: http(token).get(`/datamerge/log?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}&typeSort=${typeSort === undefined ? 'ASC' : typeSort}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_SALESTAX_MERGE',
        payload: http(token).post(`/datamerge/excel`, data),
        setTimeout: 14400000
    }),
    getDetailMerge: (token, id) => ({
        type: 'GET_DETAIL_MERGE',
        payload: http(token).get(`/datamerge/detail/${id}`)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_MERGE',
        payload: http(token).get(`/datamerge/export`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_MERGE',
        payload: http(token).get(`${link}`)
    }),
    nextLog: (token, link) => ({
        type: 'NEXT_DATA_LOG',
        payload: http(token).get(`${link}`)
    }),
    deleteMerge: (token, id) => ({
        type: 'DELETE_MERGE',
        payload: http(token).delete(`/datamerge/delete/${id}`)
    }),
    resetError: () => ({
        type: 'RESET_MERGE'
    })
}
