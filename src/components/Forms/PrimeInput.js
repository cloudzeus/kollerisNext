import React from "react";
import {InputText} from "primereact/inputtext";
import {Controller} from "react-hook-form";
import {classNames} from "primereact/utils";
import {InputTextarea} from "primereact/inputtextarea";

const Input = ({
                   label,
                   name,
                   id,
                   control,
                   required,
                   error,
                   type,
                   disabled,
               }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) => (

                <div className="w-full">
                    <label
                        htmlFor={id}
                        className={`mb-1 block ${error && 'text-red-600'}`}
                    >
                        {label} {required && <span className="required">*</span>}
                    </label>
                    <span>
            <InputText
                name={name}
                type={type}
                id={field.name}
                value={field.value}
                disabled={disabled}
                className={`w-full ${classNames({"p-invalid": fieldState.error})}`}
                onChange={(e) => field.onChange(e.target.value)}
            />
          </span>
                    <div className="mt-2">
                        {error && <span className="text-red-600">{error.message}</span>}
                    </div>
                </div>
            )}
        />
    );
};

export const TextAreaInput = ({
                                  label,
                                  name,
                                  control,
                                  error,
                                  autoResize,
                                  rows,
                                  cols,
                                  disabled,
                                  required,
                              }) => {
    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) => (
                <div>
                    <label
                        htmlFor={name}
                        className={`mb-1 block ${classNames({"p-invalid": fieldState.error})}`}
                    >
                        {label} {required && <span className="required">*</span>}
                    </label>
                    <span>
              <InputTextarea
                  rows={rows}
                  cols={cols}
                  row={1}
                  disabled={disabled}
                  autoResize={autoResize}
                  id={field.name}
                  value={field.value}
                  className={classNames({"p-invalid": fieldState.error})}
                  onChange={(e) => field.onChange(e.target.value)}
              />
            </span>
                    <div className="error-div">
                        {error && <span className="error-text">{error.message}</span>}
                    </div>
                </div>
            )}
        />
    );
};

export default Input;
