import './App.css'
import React from 'react';
import './components/TaskBoard.jsx'
import TaskBoard from "./components/TaskBoard.jsx";

function App() {

  return (
      <>
          <h1 className="text-7xl text-indigo-400 font-bold">Task Manager</h1>
          <div>
              <TaskBoard />
          </div>
      </>
  )
}

export default App
