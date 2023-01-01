import React from 'react'
import { useSelector } from 'react-redux'

export type ButtonProps ={
    label?: string
    type?: string
    class?: string
    search?: () => void
}

export default function CommonButton(props : ButtonProps) : JSX.Element {
    const bulkIds: [] = useSelector((state: any) => state.users)
    function buttonClik(){
        if(props.type === 'bulkEdit' || props.type === 'bulkDelete'){
            console.log("bulk ids", bulkIds)
        }else if(props.type === 'commonSearch'){
          // console.log("props", props)
            if(props.search){
              props.search();
            }
        }
    }
  return (
    <button className={`btn btn-${props.class ? props.class : 'primary'}`} onClick={() => { buttonClik() }}>{props.label ? props.label : ''}</button>
  )
}
