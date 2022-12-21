export interface  IBulkCheckBox{
    bulkHardDeleteApi: string;
    bulkDeleteApi: string;
    value: number;
    checked: boolean;
    renderPageFunction?: (page : number) => void;
    page ?: number

}