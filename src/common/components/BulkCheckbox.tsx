import React,{Dispatch, useState} from 'react'
import { useDispatch } from 'react-redux';
import { handleBulkCheckbox } from '../../store/actions/handleBulkCheckbox.action';

export type BulkCheckboxProps = {
    bulkDeleteApi?: string
    bulkHardDeleteApi ?: string
    id?: number
    renderPageFunction?: (page : number) => Promise<void>
    page ?: number
};

export default function BulkCheckbox(props: BulkCheckboxProps) {
//   console.log("props in bulk delete",props)
  const dispatch: Dispatch<any> = useDispatch();
  
  function handleChange(e : any){
    const { value, checked} = e.target;
    console.log(`${value} checked ${checked}`)

    dispatch(handleBulkCheckbox({
      bulkHardDeleteApi : props.bulkHardDeleteApi ? props.bulkHardDeleteApi : '',
      bulkDeleteApi : props.bulkDeleteApi ? props.bulkDeleteApi : '',
      renderPageFunction : props.renderPageFunction,
      page : props.page ? props.page : 1,
      value : parseInt(value),
      checked
    }));
  }
  return (
    <input type="checkbox" onChange = {handleChange} value = {props.id}/>
  )
}
