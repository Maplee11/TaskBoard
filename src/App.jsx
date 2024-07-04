import './App.css'
import React, { useState, useEffect } from 'react';
import './components/TaskBoard.jsx'
import TaskBoard from "./components/TaskBoard.jsx";
import axios from 'axios';

function App() {
    const [message, setMessage] = useState('');

    useEffect(() => {
        axios.get('http://192.168.190.1:7001/api/hello')
            .then(response => {
                setMessage(response.data.message);
                console.log(`${message} is received`);
            })
            .catch(error => {
                console.error('There was an error fetching the data!', error);
            });
    }, []);

    return (
      <>
          <h1 className="text-7xl text-indigo-400 font-bold">Task Manager</h1>
          <h2>{message}</h2>
          <div>
              <TaskBoard />
          </div>
      </>
  )
}

export default App
