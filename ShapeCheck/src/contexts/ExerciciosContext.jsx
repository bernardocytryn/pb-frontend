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
        let proximoCursor = null;
        let temMaisPaginas = true;

        const delay = (ms) => new Promise(res => setTimeout(res, ms));

        while (temMaisPaginas && todosExercicios.length < 200) {
          let url = 'https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises?limit=25';
          if (proximoCursor) {
            url += `&after=${proximoCursor}`;
          }

          const res = await fetch(url, options);
          if (!res.ok) break;

          const json = await res.json();
          const dados = json.data || [];
          const meta = json.meta || {};

          if (dados.length === 0) break;

          const dadosCompletos = dados.map(ex => ({
            id: ex.id || ex.exerciseId,
            name: ex.name,
            bodyPart: ex.bodyPart || "",
            equipment: ex.equipment || "",
            imageUrl: ex.imageUrl || ex.gifUrl || (ex.imageUrls ? ex.imageUrls["360p"] : null) || null
          }));

          todosExercicios = [...todosExercicios, ...dadosCompletos];

          temMaisPaginas = meta.hasNextPage;
          proximoCursor = meta.nextCursor;

          if (temMaisPaginas) {
            await delay(800);
          }
        }

        const unicos = Array.from(new Map(todosExercicios.map(item => [item.id, item])).values());

        if (unicos.length > 0) {
          localStorage.setItem(cacheChave, JSON.stringify({
            timestamp: Date.now(),
            data: unicos
          }));
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
      const url = `https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises/${idParaBusca}`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
          'x-rapidapi-host': 'edb-with-videos-and-images-by-ascendapi.p.rapidapi.com'
        }
      };
      const res = await fetch(url, options);
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