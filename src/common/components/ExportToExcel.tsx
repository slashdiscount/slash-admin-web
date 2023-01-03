import React from 'react'
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import moment from 'moment';
import { ExportExcelProps} from "../types/ExportExcel.type"
import { toast } from 'react-toastify';
import Axios, { AxiosError } from 'axios';
import { config } from '../tokenConfig';
const API_URL = process.env.REACT_APP_API_URL;

export const ExportToExcel = (props: ExportExcelProps): JSX.Element => {
    console.log("exportToExcel called", props);
    const { startDate, endDate,api, type } = props

    console.log('check', startDate <= endDate)
  const exportToCSV = async () => {
    console.log("exportToCSV called")
    if(endDate === '' ||  startDate === ''){
        toast.error('Enter Proper Date', {
            position: toast.POSITION.TOP_RIGHT
        });
        return ;
    } else {
        try{

            if(startDate <= endDate){
                
                let searchDate = {startDate, endDate}
                let date = moment(moment(new Date(), 'DD-MM-YYYY')).format('YYYY-MM-DD');
                let fetchedResults = null;
                if(type === 'transactionsByUserId' && props.otherData !== undefined ){
                    let extraData : any = props.otherData ?  props.otherData : {};
                    let searchDateById = {...searchDate, userId : parseInt(extraData.id)};
                    console.log("searchDateById", searchDateById)
                    fetchedResults = await Axios.post(`${API_URL}/${api}`,searchDateById,config)
                } else {
    
                    fetchedResults = await Axios.post(`${API_URL}/${api}`,searchDate,config)
                }
                console.log("fetchedResults", fetchedResults)
                if(fetchedResults && fetchedResults.data.status === 200){
                    if(fetchedResults.data.length > 0){
        
                        let apiData: [] = [];
                        if(type === 'transactionsByUserId'){
                            apiData = fetchedResults.data.data.transactions
                        } else {
                            apiData =  fetchedResults.data.data.users
                        }
                        let fileName: string = '';
                        if(type === 'transactionsByUserId'){
                            fileName = `transations_list _${date}`
                        } else {
                            fileName = `${type}_list_${date}`
                        }
                        const fileType =
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
                        const fileExtension = ".xlsx";
                        const ws = XLSX.utils.json_to_sheet(apiData);
                        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
                        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
                        const data = new Blob([excelBuffer], { type: fileType });
                        FileSaver.saveAs(data, fileName + fileExtension);
                    } else {
                        toast.success('No data found for specified date', {
                            position: toast.POSITION.TOP_RIGHT
                        });
                        return ;
                    }
                }
            } else {
                toast.error('End date cannot be less than start date', {
                    position: toast.POSITION.TOP_RIGHT
                });
                return ;
            }
        } catch (error) {
            const err = error as AxiosError
            toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    }
  };

  return (
    <button className = "btn btn-primary" onClick={(e) => exportToCSV()}>Download</button>
  );
};