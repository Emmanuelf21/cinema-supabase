import React, { useEffect, useState } from 'react';
import './css/sessao.css';
import { useParams, useNavigate } from 'react-router-dom';
import BtnCompra from '../components/BtnCompra';
import { supabase } from '../../supabaseClient';

const filmesURL = import.meta.env.VITE_API_MOVIE;
const apiKey = import.meta.env.VITE_API_KEY;
const imageUrl = import.meta.env.VITE_IMG;

const Sessao = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // id = cod_sessao
  const [cadeiras, setCadeiras] = useState([]);
  const [selecionadas, setSelecionadas] = useState([]);
  const [filme, setFilme] = useState(null);
  const [infoSessao, setInfoSessao] = useState(null);

  // 🔹 Buscar informações da sessão (filme + sala + cadeiras)
  const getInfoSessao = async () => {
    const { data, error } = await supabase
      .from('sessao')
      .select(`
        cod_sessao,
        horario,
        sala (
          cod_sala,
          numero_sala
        ),
        filme (
          cod_filme,
          id_tmdb,
          nome_filme,
          descricao,
          classificacao
        ),
        cadeiras_sessao (
          cod_cadeira_sessao,
          status_filme,
          cadeira:cadeiras (
            cod_cadeira,
            fileira,
            assento
          )
        )
      `)
      .eq('cod_sessao', id)
      .single();

    if (error) {
      console.error('Erro ao buscar sessão:', error);
    } else {
      setInfoSessao(data);
      setCadeiras(data.cadeiras_sessao);

      // Buscar info do filme no TMDB
      if (data.filme?.id_tmdb) {
        getFilme(data.filme.id_tmdb);
      }
    }
  };

  // 🔹 Buscar dados do filme no TMDB
  const getFilme = async (tmdbId) => {
    const movieURL = `${filmesURL}${tmdbId}?${apiKey}`;
    const response = await fetch(movieURL);
    const dataMovie = await response.json();
    setFilme(dataMovie);
  };

  // 🔹 Marcar cadeira selecionada
  const toggleSelecionada = (cod) => {
    setSelecionadas((prev) =>
      prev.includes(cod) ? prev.filter((c) => c !== cod) : [...prev, cod]
    );
  };

  // 🔹 Confirmar compra (verifica login e insere em ingresso)
  const confirmarCompra = async () => {
    // Pegar o usuário logado no Supabase Auth
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      alert('Você precisa estar logado para comprar!');
      navigate('/login');
      return;
    }
  
    // Buscar cod_usuario na tabela 'usuario' pelo email do Auth
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuario')
      .select('cod_usuario')
      .eq('email_usuario', user.email)
      .single();
  
    if (usuarioError || !usuarioData) {
      alert('Erro ao encontrar dados do usuário: ' + usuarioError?.message);
      return;
    }
  
    const codUsuario = usuarioData.cod_usuario;
  
    try {
      // 1️⃣ Inserir os ingressos
      const { error: ingressoError } = await supabase.from('ingresso').insert(
        selecionadas.map((cod_cadeira_sessao) => ({
          cod_usuario: codUsuario,
          cod_cadeira_sessao,
          cod_sessao: id,
        }))
      );
  
      if (ingressoError) throw ingressoError;
  
      // 2️⃣ Atualizar o status das cadeiras
      const updates = await Promise.all(
        selecionadas.map((cod_cadeira_sessao) =>
          supabase
            .from('cadeiras_sessao')
            .update({ status_filme: 'Ocupado' })
            .eq('cod_cadeira_sessao', cod_cadeira_sessao)
        )
      );
  
      // 3️⃣ Sucesso
      alert('Compra confirmada!');
      navigate('/');
    } catch (error) {
      alert('Erro ao confirmar compra: ' + error.message);
    }
  };
  

  // 🔹 Renderizar cadeiras
  const renderCadeiras = () => {
    const linhas = ['E', 'D', 'C', 'B', 'A'];
    return linhas.map((linha) => (
      <div className="fileira" key={linha}>
        <p>{linha}</p>
        <div className="linha">
          {cadeiras
            .filter((c) => c.cadeira.fileira === linha)
            .map((c) => (
              <button
                key={c.cod_cadeira_sessao}
                disabled={c.status_filme === 'Ocupado'}
                onClick={() => toggleSelecionada(c.cod_cadeira_sessao)}
                className={`cadeira 
                  ${c.status_filme === 'Ocupado' ? 'Ocupado' : 'Disponível'}
                  ${selecionadas.includes(c.cod_cadeira_sessao)
                    ? 'selecionada'
                    : ''
                  }`}
              >
                {c.cadeira.assento}
              </button>
            ))}
        </div>
      </div>
    ));
  };

  useEffect(() => {
    getInfoSessao();
  }, [id]);

  if (!filme || !infoSessao) return <p>Carregando...</p>;

  return (
    <div className="sessao-container">
      <div className="banner-sessao">
        <img src={imageUrl + filme.poster_path} alt={filme.title} />
      </div>
      <div className="sala-container">
        <h2>Sala {infoSessao.sala.numero_sala}</h2>
        <div className="horario">{infoSessao.horario.slice(0, 5)}</div>

        <div className="grid-cadeiras">{renderCadeiras()}</div>

        <div className="tela">TELA</div>
        <div className="legenda">
          <span>
            <span className="legenda-box selecionada" /> Selecionada
          </span>
          <span>
            <span className="legenda-box ocupada" /> Indisponível
          </span>
          <span>
            <span className="legenda-box disponivel" /> Disponível
          </span>
        </div>
        <BtnCompra confirmarCompra={confirmarCompra} />
      </div>
    </div>
  );
};

export default Sessao;
