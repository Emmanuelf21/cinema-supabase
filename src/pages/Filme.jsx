import React, { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './css/filme.css'

const filmesURL = import.meta.env.VITE_API_MOVIE;
const apiKey = import.meta.env.VITE_API_KEY;
const imageUrl = import.meta.env.VITE_IMG;

const Filme = () => {
  const { id } = useParams(); // esse id é o id_tmdb
  const [filme, setFilme] = useState(null);
  const [filmeDB, setFilmeDB] = useState(null);

  // 🔹 Buscar filme + sala + sessões no Supabase
  const getFilmeDb = async () => {
    const { data, error } = await supabase
      .from('filme')
      .select(`
        cod_filme,
        id_tmdb,
        nome_filme,
        descricao,
        classificacao,
        sessao (
          cod_sessao,
          horario,
          sala (
            cod_sala,
            numero_sala
          )
        )
      `)
      .eq('id_tmdb', id)
      .single();

    if (error) {
      console.error('Erro ao buscar no Supabase:', error);
    } else {
      setFilmeDB(data);
    }
  };

  // 🔹 Buscar filme no TMDB
  const getFilme = async () => {
    const filmeURL = `${filmesURL}${id}?${apiKey}`;
    const res = await fetch(filmeURL);
    const data = await res.json();
    setFilme(data);
  };

  useEffect(() => {
    getFilmeDb();
    getFilme();
  }, [id]);

  if (!filme) return <p>Carregando...</p>;

  return (
    <div className="filme-card flex">
      <div className="filme-banner">
        <img
          src={imageUrl + filme.poster_path}
          alt={filme.title}
        />
      </div>

      <div className="filme-info flex-column">
        <h1>{filme.title}</h1>

        <h2>Sinopse</h2>
        <p className="synopsis">{filme.overview}</p>

        {filmeDB && filmeDB.sessao.length > 0 && (
          <>
            <h3>Sala {filmeDB.sessao[0].sala.numero_sala}</h3>
            <div className="showtimes flex">
              {filmeDB.sessao.map(sessao => (
                <NavLink
                  key={sessao.cod_sessao}
                  to={`/sessao/${sessao.cod_sessao}`}
                >
                  {sessao.horario.slice(0, 5)} {/* exibe 11:00 */}
                </NavLink>
              ))}
            </div>
          </>
        )}

        <p>Duração: {filme.runtime} min</p>
      </div>
    </div>
  );
};

export default Filme;
