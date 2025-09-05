import React, { useEffect, useState } from 'react';
import CardIngresso from '../components/CardIngresso';
import './css/ingressos.css';
import { supabase } from '../../supabaseClient';

const Ingressos = () => {
  const [ingressos, setIngressos] = useState([]);

  const getIngressos = async () => {
    // 1️⃣ Pegar usuário logado no Supabase Auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Usuário não logado:', authError);
      setIngressos([]);
      return;
    }

    // 2️⃣ Buscar cod_usuario na tabela 'usuario'
    const { data: usuarioData, error: usuarioError } = await supabase
      .from('usuario')
      .select('cod_usuario')
      .eq('email_usuario', user.email) // ajusta conforme sua coluna
      .single();

    if (usuarioError || !usuarioData) {
      console.error('Erro ao buscar usuário:', usuarioError);
      setIngressos([]);
      return;
    }

    const codUsuario = usuarioData.cod_usuario;

    // 3️⃣ Buscar ingressos do usuário
    const { data: ingressosData, error: ingressosError } = await supabase
      .from('ingresso')
      .select(`
        cod_ingresso,
        cod_sessao,
        cadeiras_sessao (
          cod_cadeira_sessao,
          cadeira:cadeiras (
            fileira,
            assento
          )
        ),
        sessao (
          horario,
          sala (
            numero_sala
          ),
          filme (
            nome_filme,
            id_tmdb
          )
        )
      `)
      .eq('cod_usuario', codUsuario);

    if (ingressosError) {
      console.error('Erro ao buscar ingressos:', ingressosError);
      setIngressos([]);
    } else {
      setIngressos(ingressosData || []);
    }
  };

  useEffect(() => {
    getIngressos();
  }, []);

  return (
    <div className="ingressos-container flex-column">
      <h1>Ingressos</h1>
      {ingressos.length > 0 ? (
        ingressos.map((ingresso) => (
          <CardIngresso key={ingresso.cod_ingresso} ingresso={ingresso} />
        ))
      ) : (
        <p>Nenhum ingresso encontrado.</p>
      )}
    </div>
  );
};

export default Ingressos;
