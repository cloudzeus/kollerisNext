
import {Dropdown} from "primereact/dropdown"

export default function DropdownCustom({
    state,
    label,
    options,
    handleState, 
    optionLabel,
    isEdit = false, 
    required, 
    error,
    placeholder,
    filter = true
}) {



    return (
        <div className="w-full">
            <label className={`custom_label ${error && "text-red-600"}`}>
                {label} 
                {required && <span className="ml-1 font-bold text-red-500">*</span>}
            </label>
            <Dropdown
                showClear
                filter={filter}
                className={`custom_dropdown ${error ? "p-invalid" : null}`}
                value={state}
                onChange={(e) => handleState(e.target.value)}
                options={options}
                optionLabel={optionLabel}
                placeholder={placeholder}
            />
            <p className="text-red-600 mt-1">{error}</p>
        </div>
    )
}