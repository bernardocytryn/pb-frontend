import React from 'react';
import styles from './OlaMensagem.module.css';
import { useAuth } from '../../hooks/useAuth';

export default function OlaMensagem() {
  const { usuario } = useAuth();

  const perfil = usuario?.perfil || {};
  const nomeCompleto = perfil?.nome || "Atleta";
  const primeiroNome = nomeCompleto.split(' ')[0];

  return (
    <header className={styles.header}>
      <div>
        <span className={styles.label}>Home</span>
        <h1 className={styles.title}>Olá, {primeiroNome}</h1>
      </div>
    </header>
  );
}