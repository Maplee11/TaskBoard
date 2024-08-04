import './App.css'
import React, { useState, useEffect } from 'react';
import './components/TaskBoard.jsx'
import TaskBoard from "./components/TaskBoard.jsx";
import axios from 'axios';

function App() {
    return (
      <div>
          <h1 className="text-7xl text-indigo-400 font-bold">Task Manager</h1>
          <div>
              <TaskBoard />
          </div>
      </div>
  )
}

export default App
