import { createContext, useContext, useState, useEffect } from "react";
import { dicMusculos, dicEquipamentos } from "../utils/dicionarios";
import { traduzirTexto } from "../utils/tradutor";

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
            bodyPart: dicMusculos[ex.bodyPart?.toLowerCase()] || ex.bodyPart || "",
            equipment: dicEquipamentos[ex.equipment?.toLowerCase()] || ex.equipment || "",
            target: dicMusculos[ex.target?.toLowerCase()] || ex.target || "",
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

  // --- Função fetchDetalhes corrigida e sem duplicações ---
  const fetchDetalhes = async (idParaBusca) => {
    try {
      const cacheChave = `shapecheck_detalhe_${idParaBusca}`;
      const cacheLocal = localStorage.getItem(cacheChave);

      // 1. Verifica o cache
      if (cacheLocal) {
        return JSON.parse(cacheLocal);
      }

      // 2. Busca na API
      const res = await fetch(`https://edb-with-videos-and-images-by-ascendapi.p.rapidapi.com/api/v1/exercises/${idParaBusca}`, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
          'x-rapidapi-host': 'edb-with-videos-and-images-by-ascendapi.p.rapidapi.com'
        }
      });

      if (!res.ok) return null;

      const json = await res.json();
      let dados = json.data;

      if (dados) {
        // 1. Traduz o Nome
        dados.name = await traduzirTexto(dados.name);

        // 2. Traduz o Textão (AQUI ESTAVA O SEGREDO DO OVERVIEW!)
        if (dados.overview) {
          dados.overview = await traduzirTexto(dados.overview);
        }

        // Mantemos description e summary por segurança caso algum exercício use
        if (dados.description) {
          if (Array.isArray(dados.description)) {
            dados.description = await Promise.all(dados.description.map(d => traduzirTexto(d)));
          } else {
            dados.description = await traduzirTexto(dados.description);
          }
        }
        if (dados.summary) {
          dados.summary = await traduzirTexto(dados.summary);
        }

        // 3. Traduz as Instruções (Passo a passo)
        if (dados.instructions && dados.instructions.length > 0) {
          dados.instructions = await Promise.all(
            dados.instructions.map(linha => traduzirTexto(linha))
          );
        }

        // 4. Traduz as Tags lidando com os Arrays (Plural) que o seu CardExercicioModal usa
        if (dados.targetMuscles && dados.targetMuscles.length > 0) {
          dados.targetMuscles[0] = dicMusculos[dados.targetMuscles[0]?.toLowerCase()] || dados.targetMuscles[0];
        }
        if (dados.equipments && dados.equipments.length > 0) {
          dados.equipments[0] = dicEquipamentos[dados.equipments[0]?.toLowerCase()] || dados.equipments[0];
        }
        if (dados.bodyParts && dados.bodyParts.length > 0) {
          dados.bodyParts[0] = dicMusculos[dados.bodyParts[0]?.toLowerCase()] || dados.bodyParts[0];
        }

        // 5. Salva no cache com tudo arrumado!
        localStorage.setItem(cacheChave, JSON.stringify(dados));
      }

      return dados;
    } catch (e) {
      console.error("Erro ao buscar detalhes:", e);
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