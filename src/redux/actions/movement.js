/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addMovement: (token, data) => ({
        type: 'ADD_MOVEMENT',
        payload: http(token).post(`/movement/add`, qs.stringify(data))
    }),
    updateMovement: (token, id, data) => ({
        type: 'UPDATE_MOVEMENT',
        payload: http(token).patch(`/movement/update/${id}`, qs.stringify(data)),
    }),
    getMovement: (token, limit, search, page) => ({
        type: 'GET_MOVEMENT',
        payload: http(token).get(`/movement/get?limit=${limit}&search=${search}&page=${page === undefined ? 1 : page}`)
    }),
    uploadMaster: (token, data) => ({
        type: 'UPLOAD_MASTER_MOVEMENT',
        payload: http(token).post(`/movement/master`, data)
    }),
    exportMaster: (token) => ({
        type: 'EXPORT_MASTER_MOVEMENT',
        payload: http(token).get(`/movement/export`)
    }),
    getDetailMovement: (token, id) => ({
        type: 'GET_DETAIL_MOVEMENT',
        payload: http(token).get(`/movement/detail/${id}`)
    }),
    nextPage: (token, link) => ({
        type: 'NEXT_DATA_MOVEMENT',
        payload: http(token).get(`${link}`)
    }),
    deleteMovement: (token, data) => ({
        type: 'DELETE_MOVEMENT',
        payload: http(token).patch(`/movement/delete`, data)
    }),
    resetError: () => ({
        type: 'RESET_MOVEMENT'
    })
}