// import { config } from '../../common/tokenConfig';
import Axios, { AxiosError } from 'axios'
import { toast } from 'react-toastify';
import {IOtherData } from '../models/otherData.interface'
export const COMMON_SEARCH: string = "COMMON_SEARCH";
export function commonSearch(searchUrl: string,otherData : IOtherData): any {
    return async (dispatch: any) => {
        try{
            const config = {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }
            if(otherData.type === 'user'){

                const users = await Axios.post(searchUrl,{},config);
                console.log("action in commonSearch", users);
                toast.success( users.data.message? users.data.message  : 'Fetched Successfully', {
                    position: toast.POSITION.TOP_RIGHT
                });
                dispatch({
                    type: COMMON_SEARCH,
                    data: users.data
                });
            }

            if(otherData.type === 'transactionsByUserId'){
                const id : any = otherData.id;
                const transactions = await Axios.post(searchUrl,{'userId' : parseInt(id)},config);
                console.log("action in commonSearch", transactions);
                toast.success( transactions.data.message? transactions.data.message  : 'Fetched Successfully', {
                    position: toast.POSITION.TOP_RIGHT
                });
                dispatch({
                    type: COMMON_SEARCH,
                    data: transactions.data
                });
            }

            if(otherData.type === 'transactions'){
                const transactions = await Axios.post(searchUrl,{},config);
                console.log("action in commonSearch", transactions);
                toast.success( transactions.data.message? transactions.data.message  : 'Fetched Successfully', {
                    position: toast.POSITION.TOP_RIGHT
                });
                dispatch({
                    type: COMMON_SEARCH,
                    data: transactions.data
                });
            }
        } catch(error) {
            const err = error as AxiosError
            toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }
}

interface CommonSearch { type: string, data: string };
