import React from 'react'

export type ResetBuuttonProps = {
    refresh?: () => void;
};

export default function ResetButton(props : ResetBuuttonProps): JSX.Element {
    function reset() {
        if(props.refresh) props.refresh();
    }
  return (
    <button className="btn btn-success" onClick = {() => {reset()}}>Reset</button>
  )
}
