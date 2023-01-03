export type TextInputProps = {
    required: boolean,
    onChange: Function,
    id: string,
    label: string,
    placeholder: string,
    value: string,
    type?: string,
    maxLength: number,
    minLength?: number,
    inputClass?: string,
    field: string
    disabled ?: boolean
};