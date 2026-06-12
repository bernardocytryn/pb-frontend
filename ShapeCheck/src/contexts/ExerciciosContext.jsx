import { createContext, useContext, useState, useEffect } from "react";

const ExerciciosContext = createContext();

export function ExerciciosProvider({ children }) {
  const [exercicios, setExercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregarCatalogo() {
      try {
        setLoading(true);
        const cacheChave = 'shapecheck_catalogo_base';
        const cacheLocal = localStorage.getItem(cacheChave);

        if (cacheLocal) {
          const { timestamp, data } = JSON.parse(cacheLocal);
          if (Date.now() - timestamp < 3600000 && data.length > 0) {
            setExercicios(data);
            setLoading(false);
            return;
          }
        }

        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
            'x-rapidapi-host': 'edb-with-videos-and-images-by-ascendapi.p.rapidapi.com'
          }
        };

        let todosExercicios = [];
        let proximaPagina = null;
        const delay = (ms) => new Promise(res => setTimeout(res, ms));

        do {
          const url = `https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises?limit=25${proximaPagina ? `&after=${proximaPagina}` : ''}`;
          const res = await fetch(url, options);
          
          if (!res.ok) break;

          const json = await res.json();
          const dados = json.data || [];
          
          if (dados.length === 0) break;

          const dadosMapeados = dados.map(ex => ({
            id: ex.id || ex.exerciseId,
            name: ex.name,
            bodyPart: ex.bodyPart || "",
            equipment: ex.equipment || "",
            imageUrl: ex.imageUrl || ex.gifUrl || (ex.imageUrls?.["360p"]) || null
          }));

          todosExercicios = [...todosExercicios, ...dadosMapeados];
          proximaPagina = json.meta?.hasNextPage ? json.meta.nextCursor : null;

          if (proximaPagina && todosExercicios.length < 200) {
            await delay(800);
          }
        } while (proximaPagina && todosExercicios.length < 200);

        const unicos = Array.from(new Map(todosExercicios.map(item => [item.id, item])).values());

        if (unicos.length > 0) {
          localStorage.setItem(cacheChave, JSON.stringify({ timestamp: Date.now(), data: unicos }));
          setExercicios(unicos);
        } else {
          throw new Error("Falha ao carregar a lista da API");
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    carregarCatalogo();
  }, []);

  const fetchDetalhes = async (idParaBusca) => {
    try {
      const res = await fetch(`https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises/${idParaBusca}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
          'x-rapidapi-host': 'edb-with-videos-and-images-by-ascendapi.p.rapidapi.com'
        }
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch (e) {
      return null;
    }
  };

  return (
    <ExerciciosContext.Provider value={{ exercicios, loading, error, fetchDetalhes }}>
      {children}
    </ExerciciosContext.Provider>
  );
}

export function useExercicios() {
  const context = useContext(ExerciciosContext);
  if (!context) throw new Error("Contexto vazio");
  return context;
}