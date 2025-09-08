import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Filme from './pages/Filme'
import Sessao from './pages/Sessao'
import Login from './pages/Login'
import Ingressos from './pages/Ingressos'


function App() {

  return (
    <div className="app-container">
      {/* <Outlet /> */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/filme/:id' element={<Filme />} />
        <Route path='/sessao/:id' element={<Sessao />} />
        <Route path='/login' element={<Login />} />
        <Route path='/ingressos' element={<Ingressos />} />
      </Routes>
    </div>
  )
}

export default App
