/* eslint-disable import/no-anonymous-default-export */
import http from '../../helpers/http'
import qs from 'qs'

export default {
    addDate: (token, data) => ({
        type: 'ADD_DATE',
        payload: http(token).post(`/date/create`, qs.stringify(data))
    }),
    getDate: (token, data) => ({
        type: 'GET_DATE',
        payload: http(token).get(`/date/get`, qs.stringify(data))
    }),
    resetError: () => ({
        type: 'RESET'
    })
}