import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  if (!localStorage.getItem("shapecheck_usuarios")) {
    localStorage.setItem("shapecheck_usuarios", JSON.stringify([]));
  }

  const [idSessao, setIdSessao] = useState(localStorage.getItem("shapecheck_sessao"));
  const [estaAutenticado, setEstaAutenticado] = useState(!!idSessao);
  const [completouWizard, setCompletouWizard] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    if (idSessao) {
      const usuarios = JSON.parse(localStorage.getItem("shapecheck_usuarios"));
      const user = usuarios.find((u) => u.id === idSessao);
      if (user) {
        setUsuario(user);
        setCompletouWizard(!!user.perfil);
      }
    }
  }, [idSessao]);

  const atualizarUsuario = (novosDados) => {
    const usuarios = JSON.parse(localStorage.getItem("shapecheck_usuarios"));
    const index = usuarios.findIndex((u) => u.id === idSessao);

    if (index !== -1) {
      usuarios[index] = {
        ...usuarios[index],
        ...novosDados,
        perfil: {
          ...usuarios[index].perfil,
          ...(novosDados.perfil || {})
        }
      };

      localStorage.setItem("shapecheck_usuarios", JSON.stringify(usuarios));
      setUsuario(usuarios[index]);
    }
  };

  const cadastrarComEmail = (email, senha) => {
    const usuarios = JSON.parse(localStorage.getItem("shapecheck_usuarios"));
    if (usuarios.some((u) => u.email === email.toLowerCase())) {
      return { sucesso: false, erro: "Este e-mail já está cadastrado!" };
    }
    const novoUsuario = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      email: email.toLowerCase(),
      senha: senha,
      perfil: null,
      treinos: [],
      planoSemanal: [],
    };
    usuarios.push(novoUsuario);
    localStorage.setItem("shapecheck_usuarios", JSON.stringify(usuarios));
    localStorage.setItem("shapecheck_sessao", novoUsuario.id);
    setIdSessao(novoUsuario.id);
    setEstaAutenticado(true);
    return { sucesso: true };
  };

  const logarComEmail = (email, senha) => {
    const usuarios = JSON.parse(localStorage.getItem("shapecheck_usuarios"));
    const user = usuarios.find((u) => u.email === email.toLowerCase() && u.senha === senha);
    if (!user) return { sucesso: false, erro: "E-mail ou senha incorretos!" };
    localStorage.setItem("shapecheck_sessao", user.id);
    setIdSessao(user.id);
    setEstaAutenticado(true);
    setCompletouWizard(!!user.perfil);
    return { sucesso: true };
  };

  const finalizarCadastroWizard = (dadosPerfil, treinos, plano) => {
    atualizarUsuario({
      perfil: dadosPerfil,
      treinos: treinos || usuario?.treinos || [],
      planoSemanal: plano || usuario?.planoSemanal || []
    });
    setCompletouWizard(true);
  };

  const sairDaConta = () => {
    localStorage.removeItem("shapecheck_sessao");
    setIdSessao(null);
    setEstaAutenticado(false);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{
      estaAutenticado, completouWizard, usuario,
      logarComEmail, cadastrarComEmail, finalizarCadastroWizard,
      atualizarUsuario, sairDaConta
    }}>
      {children}
    </AuthContext.Provider>
  );
};