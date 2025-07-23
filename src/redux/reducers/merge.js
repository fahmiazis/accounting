/* eslint-disable import/no-anonymous-default-export */
const depoState = {
    isAdd: false,
    isUpload: false,
    isUpdate: false,
    isGet: false,
    isLog: false,
    isDetail: false,
    isDelete: false,
    token: '',
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataMerge: [],
    dataLog: [],
    detailMerge: {},
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    link: '',
    pageLog: {}
};

export default (state=depoState, action) => {
        switch(action.type){
            case 'EXPORT_MASTER_MERGE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EXPORT_MASTER_MERGE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isExport: true,
                    link: action.payload.data.link,
                    alertMsg: 'success export data'
                };
            }
            case 'EXPORT_MASTER_MERGE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isExport: false,
                    isError: true,
                    alertMsg: 'Failed export data'
                };
            }
            case 'GET_MERGE_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_MERGE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataMerge: action.payload.data.result.rows,
                    alertMsg: 'add depo Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_MERGE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGet: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_LOG_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_LOG_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isLog: true,
                    dataLog: action.payload.data.result.rows,
                    alertMsg: 'add depo Succesfully',
                    pageLog: action.payload.data.pageInfo
                };
            }
            case 'GET_LOG_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isLog: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_MERGE_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_MERGE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataMerge: action.payload.data.result.rows,
                    alertMsg: 'add depo Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_MERGE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_LOG_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_LOG_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isLog: true,
                    dataLog: action.payload.data.result.rows,
                    alertMsg: 'get log Succesfully',
                    pageLog: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_LOG_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_MERGE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    isDetail: false,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_MERGE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDetail: true,
                    detailMerge: action.payload.data.result,
                    alertMsg: 'get detail depo Succesfully'
                };
            }
            case 'GET_DETAIL_MERGE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetail: false,
                    isError: true,
                    alertMsg: action.payload.response.data === undefined ? 'koneksi server sedang bermasalah' : action.payload.response.data.message,
                    alert: action.payload.response.data.error
                };
            }
            case 'UPLOAD_SALESTAX_MERGE_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPLOAD_SALESTAX_MERGE_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    isError: false,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPLOAD_SALESTAX_MERGE_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: false,
                    isError: true,
                    alertMsg: action.payload.response.data === undefined ? 'koneksi server sedang bermasalah' : action.payload.response.data.message,
                    alertUpload: action.payload.response.data === undefined ? 'koneksi server sedang bermasalah' : action.payload.response.data.result
                };
            }
            case 'RESET_MERGE': {
                return {
                    ...state,
                    isError: false,
                    isUpload: false,
                    isGet: false,
                    isExport: false
                }
            }
            default: {
                return state;
            }
        }
    }