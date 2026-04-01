/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    // Report Inventory
    uploadEndstock: (token, data, typeUpload) => ({
        type: 'UPLOAD_DATA_ENDSTOCK',
        payload: http(token).post(`/endstock/report/upload?type_upload=${typeUpload === undefined ? 'single' : typeUpload}`, data)
    }),
    updateEndstock: (token, type, data) => ({
        type: 'UPDATE_DATA_ENDSTOCK',
        payload: http(token).post(`/endstock/report/update?type=${type}`, data)
    }),
    getDetailEndstock: (token, id) => ({
        type: 'GET_DETAIL_ENDSTOCK',
        payload: http(token).get(`/endstock/report/detail/${id}`)
    }),
    deleteEndstock: (token, data) => ({
        type: 'DELETE_ENDSTOCK',
        payload: http(token).patch(`/endstock/report/delete`, data)
    }),
    getEndstock: (token, limit, search, page, date, type) => ({
        type: 'GET_ENDSTOCK',
        payload: http(token).get(`/endstock/report/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}&date=${date}&type=${type}`)
    }),
    generateEndstock: (token, data) => ({
        type: 'GENERATE_ENDSTOCK',
        payload: http(token).patch(`/endstock/report/generate`, data)
    }),
    mergeEndstock: (token, data) => ({
        type: 'MERGE_ENDSTOCK',
        payload: http(token).patch(`/endstock/report/merge`, data)
    }),
    nextPageEndstock: (token, link) => ({
        type: 'NEXT_DATA_ENDSTOCK',
        payload: http(token).get(`${link}`)
    }),
    resetError: () => ({
        type: 'RESET_ENDSTOCK'
    })
}