import React from 'react'
import { InputTextProps } from '../types/formData.types'

const InputText:  React.FC<InputTextProps> = ({ question, formValue, handleInputChange }) =>  {
  return (
    <label className="block font-light">{question.label}
    {question.type === 'text' && (
      <input
        type="text"
        name={question.id}
        className="w-full p-2 border rounded"
        placeholder={question.placeholder}
        value={formValue[question.id] as string || ''}
        onChange={(e) =>
          handleInputChange(question.id, e.target.value)
        }
      />
    )}
  </label>
  )
}

export default InputText