import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Header from './components/Header.jsx'
import Filme from './pages/Filme.jsx'
import Footer from './components/Footer.jsx'
import Login from './pages/Login.jsx'
import Sessao from './pages/Sessao.jsx'
import Ingressos from './pages/Ingressos.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route element={<App/>}/>
        <Route path='/' element={<Home/>}/>
        <Route path='/filme/:id' element={<Filme/>}/>
        <Route path='/sessao/:id' element={<Sessao/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/ingressos' element={<Ingressos/>}/>
      </Routes>
      <Footer/>
    </BrowserRouter>
  </StrictMode>,
)
