/* eslint-disable import/no-anonymous-default-export */
const inventoryState = {
    isAdd: false,
    isUpload: false,
    isUpdate: false,
    isGet: false,
    isDetail: false,
    isDelete: false,
    token: '',
    isLoading: false,
    isError: false,
    alertMsg: '',
    dataEndstock: [],
    detailEndstock: {},
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    link: '',
    isGenerate: null,
    isMerge: null,
    isUpdateEndstock: null,
};

export default (state=inventoryState, action) => {
        switch(action.type){
            case 'UPLOAD_DATA_ENDSTOCK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPLOAD_DATA_ENDSTOCK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    isError: false,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPLOAD_DATA_ENDSTOCK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertUpload: action.payload.response.data.result
                };
            }
            case 'UPDATE_DATA_ENDSTOCK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPDATE_DATA_ENDSTOCK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdateEndstock: true,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPDATE_DATA_ENDSTOCK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdateEndstock: false,
                };
            }
            case 'GET_ENDSTOCK_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_ENDSTOCK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataEndstock: action.payload.data.result.rows,
                    alertMsg: 'get pic Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_ENDSTOCK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_ENDSTOCK_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_ENDSTOCK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataEndstock: action.payload.data.result.rows,
                    alertMsg: 'get pic Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_ENDSTOCK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_ENDSTOCK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    isDetail: false,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_ENDSTOCK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDetail: true,
                    detailEndstock: action.payload.data.result,
                    alertMsg: 'get detail pic Succesfully'
                };
            }
            case 'GET_DETAIL_ENDSTOCK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetail: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alert: action.payload.response.data.error
                };
            }
            case 'GENERATE_ENDSTOCK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'GENERATE_ENDSTOCK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGenerate: true,
                    isError: false,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'GENERATE_ENDSTOCK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGenerate: false,
                };
            }
            case 'MERGE_ENDSTOCK_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'MERGE_ENDSTOCK_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isMerge: true,
                    isError: false,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'MERGE_ENDSTOCK_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isMerge: false,
                };
            }
            case 'RESET_ENDSTOCK': {
                return {
                    ...state,
                    isError: false,
                    isUpload: false,
                    isExport: false,
                    isGenerate: null,
                    isMerge: null,
                    isUpdateEndstock: null,
                }
            }
            default: {
                return state;
            }
        }
    }