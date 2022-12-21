import React from 'react'

export default function TransactionsList(props : any) {
  return (
    <div className="table-responsive portlet">
    <table className="table">
        <thead className="thead-light">
            <tr>
                <th scope="col">ID</th>
                <th scope="col">TRANSACTION NO</th>
                <th scope="col">SCANNER</th>
                <th scope="col">STORE</th>
                <th scope="col">BILL AMOUNT</th>
                <th scope="col">DISCOUNT</th>
                <th scope="col">COUPON DISCOUNT</th>
                <th scope="col">CASHBACK USED</th>
                <th scope="col">DISCOUNTED AMOUNT</th>
                <th scope="col">SETTLEMENT AMOUNT</th>
                <th scope="col">CASHBACK EARNED</th>
                <th scope="col">PAYMENT MODE</th>
                <th scope="col">PAYMENT SUCCESS</th>
                <th scope="col">DATE</th>
                <th scope="col">SETTLEMENT</th>
                <th scope="col">ACTION</th>

            </tr>
        </thead>
        <tbody>
            {props.transactions}
        </tbody>
    </table>
</div>
  )
}
