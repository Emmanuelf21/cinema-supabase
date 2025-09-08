import React, { useState } from 'react';
import './css/login.css';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ login_usuario: '', senha_usuario: '' });
  const [cadastroData, setCadastroData] = useState({
    nome_usuario: '',
    login_usuario: '',
    email_usuario: '',
    telefone: '',
    data_nascimento: '',
    cpf: '',
    senha_usuario: '',
    confirmar_senha: ''
  });

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    const { login_usuario, senha_usuario } = loginData;

    try {
      // Autenticação Supabase (email ou login_usuario)
      let email = login_usuario;
      // Tenta achar o email correspondente se for login_usuario
      if (!login_usuario.includes('@')) {
        const { data: userRecord, error } = await supabase
          .from('usuario')
          .select('email_usuario')
          .eq('login_usuario', login_usuario)
          .single();
        if (error || !userRecord) {
          alert('Usuário ou senha incorretos');
          return;
        }
        email = userRecord.email_usuario;
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: senha_usuario
      });

      if (authError || !authData.user) {
        alert('Usuário ou senha incorretos');
        return;
      }

      // Busca dados extras do usuário
      const { data: userExtra } = await supabase
        .from('usuario')
        .select('*')
        .eq('email_usuario', email)
        .single();

      Cookies.set('usuario_logado', JSON.stringify(userExtra));
      navigate('/');
      window.location.reload();
    } catch (error) {
      alert('Erro ao tentar logar: ' + error.message);
    }
  };

  // CADASTRO
  const handleCadastro = async (e) => {
    e.preventDefault();
    if (cadastroData.senha_usuario !== cadastroData.confirmar_senha) {
      alert('As senhas não coincidem!');
      return;
    }

    const { confirmar_senha, ...cadastroPayload } = cadastroData;

    try {
      // Cria usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: cadastroPayload.email_usuario,
        password: cadastroPayload.senha_usuario
      });

      if (authError) throw authError;

      // Salva dados extras na tabela usuario
      const { data, error } = await supabase
        .from('usuario')
        .insert([cadastroPayload]);

      if (error) throw error;

      alert('Cadastro realizado com sucesso, verifique seu email antes de fazer login!');
      setCadastroData({
        nome_usuario: '',
        login_usuario: '',
        email_usuario: '',
        telefone: '',
        data_nascimento: '',
        cpf: '',
        senha_usuario: '',
        confirmar_senha: ''
      });
    } catch (error) {
      alert('Erro ao cadastrar: ' + error.message);
    }
  };

  const handleChange = (e, setFunc, state) => {
    const { name, value } = e.target;
    setFunc({ ...state, [name]: value });
  };

  return (
    <div className="container">
      {/* Login */}
      <div className="form-section flex-column">
        <h2>Entrar</h2>
        <button className="social-btn">Google</button>
        <button className="social-btn">Apple</button>
        <button className="social-btn">Facebook</button>
        <div className="divider">OU</div>
        <form className='flex-column' onSubmit={handleLogin}>
          <input
            name="login_usuario"
            placeholder="Email / Nome de usuário"
            value={loginData.login_usuario}
            onChange={(e) => handleChange(e, setLoginData, loginData)}
            required
          />
          <input
            name="senha_usuario"
            type="password"
            placeholder="SENHA"
            value={loginData.senha_usuario}
            onChange={(e) => handleChange(e, setLoginData, loginData)}
            required
          />
          <button type="submit" className="btn">Entrar</button>
        </form>
      </div>

      {/* Cadastro */}
      <div className="form-section flex-column">
        <h2>Cadastre-se</h2>
        <form className='form-cadastro flex-column' onSubmit={handleCadastro}>
          <div className="row">
            <input
              name="nome_usuario"
              placeholder="Nome"
              value={cadastroData.nome_usuario}
              onChange={(e) => handleChange(e, setCadastroData, cadastroData)}
              required
            />
            <input
              name="login_usuario"
              placeholder="Nome de usuário"
              value={cadastroData.login_usuario}
              onChange={(e) => handleChange(e, setCadastroData, cadastroData)}
              required
            />
          </div>
          <div className='row'>
            <input
              name="email_usuario"
              placeholder="Email"
              value={cadastroData.email_usuario}
              onChange={(e) => handleChange(e, setCadastroData, cadastroData)}
              required
            />
            <input
              type='tel'
              name="telefone"
              placeholder="(00) 00000-0000"
              value={cadastroData.telefone}
              onChange={(e) => handleChange(e, setCadastroData, cadastroData)}
            />
          </div>
          <div className="row">
            <input
              type='date'
              name="data_nascimento"
              placeholder="00/00/0000"
              value={cadastroData.data_nascimento}
              onChange={(e) => handleChange(e, setCadastroData, cadastroData)}
            />
            <input
              name="cpf"
              placeholder="CPF"
              value={cadastroData.cpf}
              onChange={(e) => handleChange(e, setCadastroData, cadastroData)}
            />
          </div>
          <div className="row">
            <input
              name="senha_usuario"
              type="password"
              placeholder="SENHA"
              value={cadastroData.senha_usuario}
              onChange={(e) => handleChange(e, setCadastroData, cadastroData)}
              required
            />
            <input
              name="confirmar_senha"
              type="password"
              placeholder="CONFIRME A SENHA"
              value={cadastroData.confirmar_senha}
              onChange={(e) => handleChange(e, setCadastroData, cadastroData)}
              required
            />
          </div>
          <button type="submit" className="btn">Cadastrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
