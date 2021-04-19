/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addDepo: (token, data) => ({
        type: 'ADD_DEPO',
        payload: http(token).post(`/depo/add`, qs.stringify(data))
    }),
    updateDepo: (token, id, data) => ({
        type: 'UPDATE_DEPO',
        payload: http(token).patch(`/depo/update/${id}`, qs.stringify(data)),
    }),
    getDepo: (token, limit, search) => ({
        type: 'GET_DEPO',
        payload: http(token).get(`/depo/get?limit=${limit}&search=${search}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_MASTER',
        payload: http(token).post(`/depo/master`, data)
    }),
    getDetailDepo: (token, id) => ({
        type: 'GET_DETAIL_DEPO',
        payload: http(token).get(`/depo/detail/${id}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_DEPO',
        payload: http(token).get(`${link}`)
    }),
    deleteDepo: (token, id) => ({
        type: 'DELETE_DEPO',
        payload: http(token).delete(`/depo/delete/${id}`)
    }),
    resetError: () => ({
        type: 'RESET'
    })
}
