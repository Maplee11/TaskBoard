import React from "react";

const GetUsrInput = ({ setUsrInput, placeholder }) => {
    const onCloseHandler = (event) => {
        setUsrInput(event.target.value);
        // console.log(`Set input to: ${event.target.value}`);
    }

    return (
        <input
            type="text"
            placeholder={placeholder}
            onBlur={onCloseHandler}
            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
    );
}

export default GetUsrInput;
