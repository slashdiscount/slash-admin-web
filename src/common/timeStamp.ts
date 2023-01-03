import moment from 'moment';

export function timeStamp(date : object) : string{
    return moment(date).utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
} 