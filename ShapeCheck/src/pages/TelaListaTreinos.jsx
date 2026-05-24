import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import {CardExercicioModal} from "../features/treinos/components/CardExercicio";
import styles from "./TelaListaTreinos.module.css";

export default function DetalheSerie() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [exercicioAberto, setExercicioAberto] = useState(null);

  const serieExemplo = {
    id: id,
    nome: "Treino A - Peito e Tríceps",
    exercicios: [
      {
        exerciseId: "exr_1",
        name: "Bench Press",
        imageUrl: "https://placehold.co/300x300/2c2c2e/f2f2f2?text=Bench+Press",
        bodyParts: ["CHEST"],
        equipments: ["BARBELL"],
        instructions: [
          "Deite no banco e segure a barra.",
          "Desça a barra até o peito de forma controlada.",
          "Empurre a barra para cima limpando os cotovelos."
        ]
      },
      {
        exerciseId: "exr_4",
        name: "Dumbbell Curl",
        imageUrl: "https://placehold.co/300x300/2c2c2e/f2f2f2?text=Dumbbell+Curl",
        bodyParts: ["ARMS"],
        equipments: ["DUMBBELL"],
        instructions: ["Mantenha os cotovelos fixos.", "Eleve os halteres contraindo o bíceps."]
      }
    ]
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.botaoVoltar}>
          <FiArrowLeft size={18} /> Voltar
        </button>
        <h1 className={styles.titulo}>{serieExemplo.nome}</h1>
      </div>

      <div className={styles.gridLista}>
        {serieExemplo.exercicios.map((ex) => (
          <div 
            key={ex.exerciseId} 
            className={styles.cardGrid}
            onClick={() => setExercicioAberto(ex)}
          >
            <img 
              src={ex.imageUrl} 
              alt={ex.name} 
              className={styles.imagemGrid}
            />
            <div className={styles.infoGrid}>
              <h2 className={styles.nomeGrid}>{ex.name}</h2>
            </div>
          </div>
        ))}
      </div>

      <CardExercicioModal 
        exercicio={exercicioAberto} 
        handleClose={() => setExercicioAberto(null)} 
      />
    </div>
  );
}