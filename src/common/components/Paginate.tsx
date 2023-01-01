import React from 'react'
import ReactPaginate from "react-paginate";

export default function Paginate(props : any): JSX.Element {
  return (
    <ReactPaginate
    previousLabel={"previous"}
    nextLabel={"next"}
    breakLabel={"..."}
    pageCount={props.pageCount}
    marginPagesDisplayed={1}
    pageRangeDisplayed={3}
    onPageChange={props.handlePageClick}
    containerClassName={"pagination justify-content-center"}
    pageClassName={"page-item"}
    pageLinkClassName={"page-link"}
    previousClassName={"page-item"}
    previousLinkClassName={"page-link"}
    nextClassName={"page-item"}
    nextLinkClassName={"page-link"}
    breakClassName={"page-item"}
    breakLinkClassName={"page-link"}
    activeClassName={"active"}
  />
  )
}
