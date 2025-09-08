import React, { useEffect, useState } from 'react'
import './css/home.css'
import CardFilme from '../components/CardFilme'
import { supabase } from '../../supabaseClient';

const filmesURL = import.meta.env.VITE_API_MOVIE;
const apiKey = import.meta.env.VITE_API_KEY;

const Home = () => {
  const [filmes, setFilmes] = useState([])

  const getMovies = async () => {
    // 1️⃣ Pegar os filmes da tabela 'filme' no Supabase
    const { data: filmesDB, error } = await supabase
      .from('filme')
      .select('*'); // pega todas as colunas
    
    if (error) {
      console.error('Erro ao buscar filmes:', error);
      return;
    }
  
    // 2️⃣ Buscar informações do TMDB para cada filme
    const movies = [];
    for (let i = 0; i < filmesDB.length; i++) {
      const idTmdb = filmesDB[i].id_tmdb;
      const movieURL = `${filmesURL}${idTmdb}?${apiKey}`;
      const response = await fetch(movieURL);
      const data = await response.json();
      movies.push(data);
    }
    // 3️⃣ Atualizar estado
    setFilmes(movies);
  };

  // ao carregar a página o useEffect será executado por não possuir dependências para modificar no []
  useEffect(() => {
    // const playingMovies = `${filmesURL}?${apiKey}`;
    getMovies();
  }, [])

  return (
    <>
      <section className="banner">
        <img src='../../images/banner2.png' alt="#" />
      </section>

      <section className="em-cartaz">
        <h2>Em Cartaz</h2>
        <div className="filmes">
          {filmes.length > 0 && filmes.map((filme) => <CardFilme key={filme.id} filme={filme} />)}
        </div>
      </section>
    </>
  )
}

export default Home