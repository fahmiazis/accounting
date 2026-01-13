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
    dataInventory: [],
    detailInventory: {},
    dataRepinv: [],
    detailRepinv: {},
    alertM: '',
    alertUpload: [],
    page: {},
    isExport: false,
    link: '',
    isGenerate: null,
    isMerge: null,
    isUpdateRepinv: null,
};

export default (state=inventoryState, action) => {
        switch(action.type){
            case 'EXPORT_MASTER_INVENTORY_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'EXPORT_MASTER_INVENTORY_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isExport: true,
                    link: action.payload.data.link,
                    alertMsg: 'success export data'
                };
            }
            case 'EXPORT_MASTER_INVENTORY_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isExport: false,
                    isError: true,
                    alertMsg: 'Failed export data'
                };
            }
            case 'ADD_INVENTORY_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'ADD_INVENTORY_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: true,
                    isError: false,
                    alertMsg: 'add pic Succesfully'
                };
            }
            case 'ADD_INVENTORY_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'GET_INVENTORY_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_INVENTORY_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataInventory: action.payload.data.result.rows,
                    alertMsg: 'get pic Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_INVENTORY_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_INVENTORY_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_INVENTORY_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataInventory: action.payload.data.result.rows,
                    alertMsg: 'get pic Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_INVENTORY_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_INVENTORY_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    isDetail: false,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_INVENTORY_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDetail: true,
                    detailInventory: action.payload.data.result,
                    alertMsg: 'get detail pic Succesfully'
                };
            }
            case 'GET_DETAIL_INVENTORY_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetail: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alert: action.payload.response.data.error
                };
            }
            case 'UPDATE_INVENTORY_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Login in ....'
                };
            }
            case 'UPDATE_INVENTORY_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: true,
                    isError: false,
                    alertMsg: 'update pic Succesfully'
                };
            }
            case 'UPDATE_INVENTORY_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdate: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertM: action.payload.response.data.error
                };
            }
            case 'UPLOAD_MASTER_INVENTORY_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPLOAD_MASTER_INVENTORY_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    isError: false,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPLOAD_MASTER_INVENTORY_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertUpload: action.payload.response.data.result
                };
            }
            case 'UPLOAD_DATA_REPINV_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPLOAD_DATA_REPINV_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: true,
                    isError: false,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPLOAD_DATA_REPINV_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpload: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alertUpload: action.payload.response.data.result
                };
            }
            case 'UPDATE_DATA_REPINV_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'UPDATE_DATA_REPINV_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdateRepinv: true,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'UPDATE_DATA_REPINV_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isUpdateRepinv: false,
                };
            }
            case 'GET_REPINV_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_REPINV_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataRepinv: action.payload.data.result.rows,
                    alertMsg: 'get pic Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'GET_REPINV_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'NEXT_DATA_REPINV_PENDING': {
                return {
                    ...state,
                    isGet: false,
                    isLoading: true,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'NEXT_DATA_REPINV_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isGet: true,
                    dataRepinv: action.payload.data.result.rows,
                    alertMsg: 'get pic Succesfully',
                    page: action.payload.data.pageInfo
                };
            }
            case 'NEXT_DATA_REPINV_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isAdd: false,
                    isError: true,
                    alertMsg: "Unable connect to server"
                };
            }
            case 'GET_DETAIL_REPINV_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    isDetail: false,
                    alertMsg: 'Waiting ...'
                };
            }
            case 'GET_DETAIL_REPINV_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isError: false,
                    isDetail: true,
                    detailRepinv: action.payload.data.result,
                    alertMsg: 'get detail pic Succesfully'
                };
            }
            case 'GET_DETAIL_REPINV_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isDetail: false,
                    isError: true,
                    alertMsg: action.payload.response.data.message,
                    alert: action.payload.response.data.error
                };
            }
            case 'GENERATE_REPINV_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'GENERATE_REPINV_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isGenerate: true,
                    isError: false,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'GENERATE_REPINV_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isGenerate: false,
                };
            }
            case 'MERGE_REPINV_PENDING': {
                return {
                    ...state,
                    isLoading: true,
                    alertMsg: 'Waiting....'
                };
            }
            case 'MERGE_REPINV_FULFILLED': {
                return {
                    ...state,
                    isLoading: false,
                    isMerge: true,
                    isError: false,
                    alertMsg: 'upload master Succesfully'
                };
            }
            case 'MERGE_REPINV_REJECTED': {
                return {
                    ...state,
                    isLoading: false,
                    isMerge: false,
                };
            }
            case 'RESET_INVENTORY': {
                return {
                    ...state,
                    isError: false,
                    isUpload: false,
                    isExport: false,
                    isGenerate: null,
                    isMerge: null,
                    isUpdateRepinv: null,
                }
            }
            default: {
                return state;
            }
        }
    }