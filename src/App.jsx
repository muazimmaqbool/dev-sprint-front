import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'

//called from main.jsx
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
    </Routes>
  )
}

export default App