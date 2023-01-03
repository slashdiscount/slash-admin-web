import React from 'react'

export default function ContentsList(props : any): JSX.Element {
  return (
    <div className="table-responsive portlet" style = {{maxHeight : 700}}>
    <table className="table">
        <thead className="thead-light">
            <tr>
                <th scope="col">Id</th>
                <th scope="col">ABOUT US</th>
                <th scope="col">TERMS & CONDITION</th>
                <th scope="col">PRIVACY POLICY</th>
                <th scope="col">FAQ's</th>
                <th scope="col">ACTION</th>
            </tr>
        </thead>
        <tbody>
            {props.content}
        </tbody>
    </table>
</div>
  )
}
