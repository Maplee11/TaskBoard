// src/Modal.js
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';

const CreateTask = ({ isOpen, onClose, onSubmit }) => {
    const [inputValue, setInputValue] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg">
                <h2 className="text-lg mb-4">请输入字符串</h2>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="border p-2 mb-4 w-full"
                />
                <div className="flex justify-end">
                    <button
                        onClick={() => onSubmit(inputValue)}
                        className="bg-blue-500 text-white p-2 rounded mr-2"
                    >
                        提交
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white p-2 rounded"
                    >
                        关闭
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTask;
