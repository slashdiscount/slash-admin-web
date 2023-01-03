import Axios, { AxiosError } from 'axios';
import React, { Dispatch, Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link,useHistory,useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Popup from 'reactjs-popup';
import BulkCheckbox from '../../common/components/BulkCheckbox';
import CommonButton from '../../common/components/CommonButton';
import { ExportToExcel } from '../../common/components/ExportToExcel';
import Paginate from '../../common/components/Paginate';
import ResetButton from '../../common/components/ResetButton';
import { timeStamp } from '../../common/timeStamp';
import { logout } from '../../store/actions/account.actions';
import { commonSearch } from '../../store/actions/commonSearch.actions';
import { updateCurrentPath } from '../../store/actions/root.actions';
import TransactionsList from './TransactionsList';
const API_URL = process.env.REACT_APP_API_URL;

export default function Transactions(props : any): JSX.Element {
    // const { id }: any = useParams()
    const history = useHistory();
    const searchLocation = useLocation().search;
    const userId = new URLSearchParams(searchLocation).get('userId');

    const id  = userId !== null ? JSON.parse(userId) : null;

    const [transactions, setTransactions] = useState([])
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [search, setSearch] = useState('')
    const [pageCount, setpageCount] = useState(0);
    const [popup, setPopup] = useState(false);
    const [deletId, setDeleteId] = useState(0);
    const [deleteUrl, setDeleteUrl] = useState('');
    const [page,setPage] = useState(1)


    const dispatch: Dispatch<any> = useDispatch();
    id && id !== null  ? dispatch(updateCurrentPath("Users", "Transactions")) : dispatch(updateCurrentPath("Transactions","List")) ;

    let searchResults = useSelector((state: any) => state.searchResult);

    const config = {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    let limit: number = 20;
    const getTransactions = async (page : number) => {
        try {
            let transactions;
            if(id && id !== null) {
                if(search && search !== ''){
                    transactions = await Axios.post(`${API_URL}/search-transactions?search=${search}&page=${page}`, { "userId": parseInt(id) }, config);
                } else {

                    transactions = await Axios.post(`${API_URL}/transactions?page=${page}`, { "userId": parseInt(id) }, config);
                }
            } else {
                console.log("search transaction", search)
                if(search && search !== ''){
                    transactions = await Axios.post(`${API_URL}/search-transactions?search=${search}&page=${page}`,{}, config);
                } else {

                    transactions = await Axios.post(`${API_URL}/transactions?page=${page}`,{}, config);
                }
            }
            if (transactions && transactions.data.status === 200) {
                setTransactions(transactions.data.data.transactions.transactions)
                setpageCount(Math.ceil(transactions.data.data.transactions.size / limit));
            }
        } catch (error) {
            const err = error as AxiosError
            if (err && err.response && err.response.data.statusCode === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                dispatch(logout())
                history.push('/login')
                toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {

                toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        }
    };
    useEffect(() => {
        setSearch('');
        Object.keys(searchResults).forEach(k => delete searchResults[k]);
        getTransactions(page);
    }, [id,userId]);

    const fetchSkipTransactions = async (page: number) => {
        try {
            if(id && id !== null && id !== undefined) {

                if (search && search !== '' && searchResults && Object.keys(searchResults).length > 0) {
                    let transactions = await Axios.post(`${API_URL}/search-transactions?search=${search}&page=${page}`, { "userId": parseInt(id) }, config)
                    return transactions.data.data.transactions.transactions;
                } else {
    
                    let skippedTransactions = await Axios.post(`${API_URL}/transactions?page=${page}`, { "userId": parseInt(id) }, config);
                    return skippedTransactions.data.data.transactions.transactions
                }
            } else {
                if (search && search !== '' && searchResults && Object.keys(searchResults).length > 0) {
                    let transactions = await Axios.post(`${API_URL}/search-transactions?search=${search}&page=${page}`, {}, config)
                    return transactions.data.data.transactions.transactions;
                } else {
    
                    let skippedTransactions = await Axios.post(`${API_URL}/transactions?page=${page}`, { }, config);
                    return skippedTransactions.data.data.transactions.transactions
                }
            }
        } catch (error) {
            const err = error as AxiosError
            toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
    };

    const handlePageClick = async (data: any) => {
        setPage(data.selected + 1);
        const transactions = await fetchSkipTransactions(data.selected + 1);
        setTransactions(transactions);

    };

    function searchTransactions(): void {
        setPage(1)
        if(id && id !== null && id !== undefined){

            if (search == '') {
                Object.keys(searchResults).forEach(k => delete searchResults[k]);
                getTransactions(page)
    
            } else {
                dispatch(commonSearch(`${API_URL}/search-transactions?search=${search}`, { type: 'transactionsByUserId', id }));
    
            }
        } else {
            if (search == '') {
                Object.keys(searchResults).forEach(k => delete searchResults[k]);
                getTransactions(page)
    
            } else {
                dispatch(commonSearch(`${API_URL}/search-transactions?search=${search}`, { type: 'transactions' }));
    
            }
        }
    }

    useEffect(() => {
        if ((searchResults !== null || searchResults !== undefined) && Object.keys(searchResults).length > 0) {

            setTransactions(searchResults.data.transactions.transactions);
            setpageCount(Math.ceil(searchResults.data.transactions.size / limit));
        }
    }, [searchResults])

    const resetPage = () => {
        window.location.reload();
    }

    const confirmDelete = (id: number, url: string) => {
        setPopup(true);
        setDeleteId(id)
        setDeleteUrl(url)
    }

    const deleteTransaction = async (id: any) => {
        try {
            let deleteTransactions = null;
            if (deleteUrl === 'update-transaction-status') {

                deleteTransactions = await Axios.put(`${API_URL}/${deleteUrl}`, {id : [id]}, config);
            } else {
                deleteTransactions = await Axios.delete(`${API_URL}/${deleteUrl}`, {headers : config.headers,data : {id : [id]}});

            }
            if (deleteTransactions.data.status === 200 && deleteTransactions.statusText === "OK") {

                toast.success(deleteTransactions.data.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
                getTransactions(page);
            } else {
                toast.error('Something Went Wrong !!!', {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        } catch (error) {
            const err = error as AxiosError
            toast.error(err.response ? err.response.data.message : 'Something went wrong !!!', {
                position: toast.POSITION.TOP_RIGHT
            });
        }
        setPopup(false);
    }

    let transactionsList;
    if (transactions && transactions.length > 0) {
        transactionsList = transactions.map((transaction, ind) => {
            return (
                <tr className={`table-row`}
                    key={`transaction_${transaction['transactionno']}`}>
                    <th scope="row">{ind + 1}</th>
                    <td>{transaction['transactionno']}</td>
                    <td>{transaction['scanner'] && transaction['scannerId'] ? `${transaction['scanner']}(${transaction['scannerId']})` : ''}</td>
                    <td>{transaction['store'] && transaction['userId']? `${transaction['store']}(${transaction['userId']})` : ''}</td>
                    <td>{transaction['billAmount'] ? transaction['billAmount'] : 0}</td>
                    <td>{transaction['discount'] ? transaction['discount'] : 0}</td>
                    <td>{transaction['couponDiscount'] ? transaction['couponDiscount'] : 0}</td>
                    <td>{transaction['cashBackUsed'] ? transaction['cashBackUsed'] : 0}</td>
                    <td>{transaction['discountedAmount'] ? transaction['discountedAmount'] : 0}</td>
                    <td>{parseInt(transaction['cashBackUsed']) && parseInt(transaction['discountedAmount']) ? parseInt(transaction['cashBackUsed']) + parseInt(transaction['discountedAmount']) : parseInt(transaction['cashBackUsed']) ? parseInt(transaction['cashBackUsed']) : parseInt(transaction['discountedAmount']) ? parseInt(transaction['discountedAmount']) : 0}</td>
                    <td>{transaction['cashBackUsed'] ? transaction['cashBackUsed'] : 0}</td>
                    <td>{transaction['modeName'] ? transaction['modeName'] : ''}</td>
                    <td>{transaction['paymentStatus'] ? transaction['paymentStatus'] : 'SUCCESS'}</td>
                    <td>{timeStamp(transaction['createdAt'])}</td>
                    <td>{transaction['settlementStatus'] ? transaction['settlementStatus'] : ''}</td>
                    <td>
                        <BulkCheckbox id={transaction['transactionno']} bulkDeleteApi={'update-transaction-status'} bulkHardDeleteApi={'delete-transactions'} renderPageFunction = {getTransactions} page = {page}/>
                        <Link to={`/edit-transaction/${transaction['transactionno']}`}>
                            <button className="btn btn-primary ml-2 btn-sm" ><i className="fas fa-edit"></i></button>
                        </Link>
                        <button className="btn btn-success ml-2 btn-sm" onClick={() => confirmDelete(transaction['transactionno'], 'update-transaction-status')}><i className="fas fa-trash"></i></button>
                        <button className="btn btn-danger ml-2 btn-sm" onClick={() => confirmDelete(transaction['transactionno'], 'delete-transactions')}><i className="fas fa-trash"></i></button>
                    </td>
                </tr>);
        });
    } else {
        transactionsList = <tr className={`table-row align-items-center`}>No Transactions Found</tr>
    }

    return (
        <Fragment>
            <div className="row">
                <div className="col-sm col-lg-2 mb-2 col-sm-6 col-xs-6 col-6">
                    <input type="text" className="form-control " placeholder='Search here' onChange={(e) => { setSearch(e.target.value) }} value={search} />
                </div>
                <div className="col-sm col-lg-1 col-sm-3 col-xs-3 col-3">

                    <CommonButton label="Search" type="commonSearch" class="primary" search={searchTransactions} />

                </div>
                <div className="col-sm col-lg-1 col-sm-3 col-xs-3 col-3">
                    <ResetButton refresh={resetPage} />
                </div>
                <div className="col-sm col-lg-2 col-6">
                    <div className="form-group" >
                        <input
                            className="form-control"
                            type="date"
                            name="duedate"
                            placeholder="Start date"
                            onChange={(e: any) => setStartDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-sm col-lg-2 col-6">
                    <div className="form-group" >
                        <input
                            className="form-control"
                            type="date"
                            name="duedate"
                            placeholder="End date"
                            onChange={(e: any) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
                <div className="col-sm col-lg-1 col-3">
                    <ExportToExcel startDate = {startDate} endDate = {endDate} api = {'search-transactions-by-date'} type = {'transactionsByUserId'} otherData = {{id}}/>

                </div>
                <div className="col-sm col-lg-1 col-4">
                    <CommonButton label="Delete" type="bulkDelete" class="success" />
                </div>
                <div className="col-sm col-lg-2 col-5">
                    <CommonButton label="Hard Delete" type="bulkHardDelete" class="danger" />
                </div>
            </div>
            <div className="row">
                <div className="col-xl-12 col-lg-12">
                    <div className="card shadow mb-4">
                        <div className="card-header py-3">
                            <h6 className="m-0 font-weight-bold text-green">{id && id !== null ? 'User Transaction History ' : 'Transaction History'}</h6>
                        </div>
                        <div className="card-body">
                            <TransactionsList transactions={transactionsList} />
                        </div>
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className="col-xl-12 col-lg-12">
                    <Paginate pageCount={pageCount} handlePageClick={handlePageClick} />
                </div>
            </div>
            <Popup
                className="popup-modal"
                open={popup}
                onClose={() => setPopup(false)}
                closeOnDocumentClick
            >
                <div className="popup-modal">
                    <div className="popup-title">
                        Are you sure?
                    </div>
                    <div className="popup-content">
                        <button type="button"
                            className="btn btn-success mr-2"
                            onClick={() => setPopup(false)}>Cancel
                        </button>
                        <button type="button"
                            className="btn btn-danger"
                            onClick={() => deleteTransaction(deletId)}>Remove
                        </button>
                    </div>
                </div>
            </Popup>
        </Fragment>
    )
}
