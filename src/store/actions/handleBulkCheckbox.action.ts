import { IBulkCheckBox } from "../models/bulkcheckbox.interface"

export const HANDLE_BULK_CHECKBOX: string = "HANDLE_BULK_CHECKBOX";

export function handleBulkCheckbox(data: IBulkCheckBox): IHandleBulkCheckBox {
    return { type: HANDLE_BULK_CHECKBOX, data: data };
}

interface IHandleBulkCheckBox { type: string, data: IBulkCheckBox };
