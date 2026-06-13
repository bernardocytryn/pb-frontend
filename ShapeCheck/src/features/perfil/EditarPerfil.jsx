import React from "react";
import { useAuth } from "../../hooks/useAuth";
import LabelInput from "../../components/ui/LabelInput";
import BotaoAmarelo from "../../components/ui/BotaoAmarelo";
import { IcoSetaDir } from "./Icones";
import showError from "../../utils/showError";
import styles from "./EditarPerfil.module.css";

export default function EditarPerfil() {
  const { usuario, finalizarCadastroWizard } = useAuth();
  const perfil = usuario?.perfil || {};

  const [nome, setNome] = React.useState(perfil?.nome || "");
  const [email, setEmail] = React.useState(usuario?.email || "");

  const [senhaAtual, setSenhaAtual] = React.useState("");
  const [novaSenha, setNovaSenha] = React.useState("");
  const [confirmarSenha, setConfirmarSenha] = React.useState("");

  const salvarNome = () => {
    if (!nome || nome.trim().length < 3)
      return showError("Nome deve ter ao menos 3 caracteres.");
    const novoPerfil = { ...(perfil || {}), nome: nome.trim() };
    finalizarCadastroWizard(novoPerfil);
  };

  const salvarEmail = () => {
    const re = /^\S+@\S+\.\S+$/;
    if (!re.test(email)) return showError("E-mail inválido.");

    try {
      const usuarios = JSON.parse(
        localStorage.getItem("shapecheck_usuarios") || "[]",
      );
      const idSessao = localStorage.getItem("shapecheck_sessao");
      const idx = usuarios.findIndex((u) => u.id === idSessao);
      if (idx !== -1) {
        usuarios[idx].email = email.toLowerCase();
        localStorage.setItem("shapecheck_usuarios", JSON.stringify(usuarios));
        finalizarCadastroWizard(perfil);
      } else {
        console.log(
          "Não foi possível localizar usuário para atualizar e-mail.",
        );
      }
    } catch (e) {
      console.log("Erro ao salvar e-mail localmente.");
    }
  };

  const alterarSenha = () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha)
      return showError("Preencha todos os campos de senha.");
    if (novaSenha === senhaAtual)
      return showError("A nova senha deve ser diferente da atual.");
    if (novaSenha !== confirmarSenha)
      return showError("A confirmação da senha não confere.");
  };

  const [expanded, setExpanded] = React.useState(null);

  const toggle = (key) => setExpanded((s) => (s === key ? null : key));

  return (
    <div className={styles.containerSmall}>
      <div
        className={styles.row}
        onClick={() => toggle("nome")}
        role="button"
        tabIndex={0}
      >
        <div>
          <div className={styles.sectionTitle}>Alterar Nome</div>
        </div>
        <div className={styles.rowIcon}>
          <IcoSetaDir />
        </div>
      </div>
      {expanded === "nome" && (
        <div className={styles.sectionContent}>
          <div className={styles.sectionSub}>Atual: {perfil?.nome || "—"}</div>
          <LabelInput
            label="Nome"
            valorInput={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <div className={styles.smallBtn}>
            <BotaoAmarelo texto="Salvar" onClick={salvarNome} />
          </div>
        </div>
      )}

      <div
        className={styles.row}
        onClick={() => toggle("email")}
        role="button"
        tabIndex={0}
      >
        <div>
          <div className={styles.sectionTitle}>Alterar E-mail</div>
        </div>
        <div className={styles.rowIcon}>
          <IcoSetaDir />
        </div>
      </div>
      {expanded === "email" && (
        <div className={styles.sectionContent}>
          <div className={styles.sectionSub}>
            Atual: {usuario?.email || "—"}
          </div>
          <LabelInput
            label="E-mail"
            valorInput={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className={styles.smallBtn}>
            <BotaoAmarelo texto="Salvar" onClick={salvarEmail} />
          </div>
        </div>
      )}

      <div
        className={styles.row}
        onClick={() => toggle("senha")}
        role="button"
        tabIndex={0}
      >
        <div>
          <div className={styles.sectionTitle}>Alterar Senha</div>
        </div>
        <div className={styles.rowIcon}>
          <IcoSetaDir />
        </div>
      </div>
      {expanded === "senha" && (
        <div className={styles.sectionContent}>
          <div className={styles.sectionSub}>Mantenha sua senha segura</div>
          <LabelInput
            label="Senha atual"
            type="password"
            valorInput={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
          />
          <LabelInput
            label="Nova senha"
            type="password"
            valorInput={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
          <LabelInput
            label="Confirmar nova senha"
            type="password"
            valorInput={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          <div className={styles.smallBtn}>
            <BotaoAmarelo texto="Alterar senha" onClick={alterarSenha} />
          </div>
        </div>
      )}
    </div>
  );
}
