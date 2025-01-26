import React from 'react'
import { IRadioGroupProps } from '../types/formData.types'

const RadioGroup: React.FC<IRadioGroupProps> = ({ question, formValue, handleInputChange }) => {
    return (
        <div className="flex items-center space-x-4">
            <label className="flex items-center">
                <input
                    type="radio"
                    name={question.id}
                    value="yes"
                    className="mr-2"
                    checked={formValue[question.id] === 'yes'}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                />
                Yes
            </label>
            <label className="flex items-center">
                <input
                    type="radio"
                    name={question.id}
                    value="no"
                    className="mr-2"
                    checked={formValue[question.id] === 'no'}
                    onChange={(e) => handleInputChange(question.id, e.target.value)}
                />
                No
            </label>
        </div>
    )
}

export default RadioGroup