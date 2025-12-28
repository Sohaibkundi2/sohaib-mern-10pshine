import { Route,Routes } from "react-router"
import './App.css'
import Register from "./pages/signup"
import Login from "./pages/Login"

function App() {

  return (
    <>
    <div className="min-h-screen bg-gray-900">
    <Routes>
      <Route path="/dashboard" element={<h1>Dashboard</h1>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/login" element={<Login/>}/>
    </Routes>
    </div>
    </>
  )
}

export default App
