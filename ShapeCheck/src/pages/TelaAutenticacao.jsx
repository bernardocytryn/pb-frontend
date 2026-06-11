import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import LabelInput from "../components/ui/LabelInput";
import styles from "./TelaAutenticacao.module.css";

export default function TelaAutenticacao() {
  const { logarComEmail, cadastrarComEmail } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();

    const novosErros = {};

    if (!email) novosErros.email = "O e-mail é obrigatório.";
    if (!senha) novosErros.senha = "A senha é obrigatória.";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      novosErros.email = "Digite um e-mail válido.";
    }

    if (!isLogin && senha && senha.length < 6) {
      novosErros.senha = "A senha deve ter no mínimo 6 caracteres.";
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    let respostaBanco;
    if (isLogin) {
      respostaBanco = logarComEmail(email, senha);
    } else {
      respostaBanco = cadastrarComEmail(email, senha);
    }

    if (!respostaBanco.sucesso) {
      setErros({ senha: respostaBanco.erro });
    } else {
      setErros({});
    }
  };

  const trocarAba = (modoLogin) => {
    setIsLogin(modoLogin);
    setErros({});
    setEmail("");
    setSenha("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.abas}>
          <button
            type="button"
            className={isLogin ? styles.abaAtiva : styles.aba}
            onClick={() => trocarAba(true)}
          >
            Entrar
          </button>
          <button
            type="button"
            className={!isLogin ? styles.abaAtiva : styles.aba}
            onClick={() => trocarAba(false)}
          >
            Cadastrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.formulario}>
          <h2>{isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}</h2>

          <LabelInput
            label="E-mail"
            placeholder="Digite seu e-mail"
            valorInput={email}
            taVazio={erros.email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />

          <LabelInput
            label="Senha"
            placeholder="Digite sua senha"
            valorInput={senha}
            taVazio={erros.senha}
            onChange={(e) => setSenha(e.target.value)}
            type="password"
          />

          <button type="submit" className={styles.btnEnviar}>
            {isLogin ? "Entrar" : "Criar conta"}
          </button>
        </form>
      </div>
    </div>
  );
}
