import React, { useMemo } from 'react';
import styles from './TelaHome.module.css';
import OlaMensagem from '../features/home/OlaMensagem';
import TreinoDoDia from '../features/home/TreinoDoDia';
import CalendarioSemanal from '../features/home/CalendarioSemanal';

// Importando os seus hooks reais

import { useAuth } from "../hooks/useAuth";
import { useStatusTreino } from "../contexts/StatusTreinoContext";

export default function Home() {

  // Pega o usuário com os treinos dele
  const { usuario } = useAuth();
  // Pega o status de conclusão dos treinos
  const { statusSeries } = useStatusTreino();

  // Puxa a lista de séries ou um array vazio se não existir
  const seriesSalvas = usuario?.treinos || [];

  const treinoDados = useMemo(() => {
    // Se o usuário não tem nenhuma ficha criada, retorna null (mostra "Dia de Descanso")
    if (seriesSalvas.length === 0) return null;

    // A MÁGICA AQUI: Procura a primeira série que NÃO está no objeto statusSeries (ou seja, não concluída)
    // Se por acaso todas estiverem concluídas, ele pega a primeira da lista como fallback
    const treinoPendente = seriesSalvas.find(serie => !statusSeries[serie.id]) || seriesSalvas[0];

    // Previne erro caso a série venha sem a array de exercícios
    const exerciciosAtivos = treinoPendente.exercicios || [];

    // Extrai as tags musculares
    const gruposUnicos = [...new Set(exerciciosAtivos.map(ex => ex.bodyPart))].filter(Boolean);

    return {
      id: treinoPendente.id, // Passamos o ID caso precise dele para o botão "Concluir" depois
      nome: treinoPendente.nome || "TREINO",
      gruposMusculares: gruposUnicos,
      exercicios: exerciciosAtivos
    };
  }, [seriesSalvas, statusSeries]); // Recalcula sempre que os treinos ou os status mudarem

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <OlaMensagem />

        {/* Passando os dados reais para o nosso card estilizado! */}
        <TreinoDoDia treinoDados={treinoDados} />

        <CalendarioSemanal />
      </main>
    </div>
  );
}