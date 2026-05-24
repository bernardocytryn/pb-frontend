import { createContext, useContext, useState, useEffect } from "react";

const ExerciciosContext = createContext();

export function ExerciciosProvider({ children }) {
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchExercicios() {
      try {
        setLoading(true);
        
        const url = 'https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises?limit=10';
        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
            'x-rapidapi-host': 'edb-with-videos-and-images-by-ascendapi.p.rapidapi.com'
          }
        };

        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error("Erro ao buscar os exercícios da API.");
        }
        
        const result = await response.json();
        setExercicios(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchExercicios();
  }, []);

  return (
    <ExerciciosContext.Provider value={{ exercicios, loading, error }}>
      {children}
    </ExerciciosContext.Provider>
  );
}

export function useExercicios() {
  const context = useContext(ExerciciosContext);
  if (!context) {
    throw new Error("useExercicios deve ser usado dentro de um ExerciciosProvider");
  }
  return context;
}