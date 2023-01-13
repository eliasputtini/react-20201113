import { useDebounce } from "use-debounce";
import NewsCard from "../components/NewsCard";

import { useState, useEffect } from "react";

const NewsList = ({ searchTerm }: any) => {
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1500);
  const [articles, setArticles] = useState([]);
  const [resultsNumber, setResultsNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [relevance, setRelevance] = useState(false);

  useEffect(() => {
    if (!searchTerm) return;

    setIsLoading(true);
    fetch(
      `https://api.beta.mejorconsalud.com/wp-json/mc/v2/posts?search=${debouncedSearchTerm}&page=${page}${
        relevance ? "&orderby=relevance" : ""
      }`
    )
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.data);
        setResultsNumber(data.size);
        if (data.data.status == 404) {
          setError("Busca não encontrada");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [debouncedSearchTerm, page, relevance]);

  if (isLoading) {
    return <div className="m-6"> Cargando...</div>;
  }

  if (error) {
    return <div className="m-6">{error}</div>;
  }

  if (debouncedSearchTerm && articles.length < 1 && !isLoading) {
    return <div className="m-6">No se han encontrado resultados!</div>;
  }

  return (
    <>
      <ul className="list-none flex flex-col items-center">
        <div className="flex flex-row items-center">
          <button
            disabled={articles.pages >= page}
            onClick={() => setRelevance(!relevance)}
            className={`${
              relevance
                ? "transition ease-in-out bg-teal-500 border-2 border-teal-500 "
                : "transition ease-in-out bg-white border-2 border-teal-500"
            } mx-4 text-black rounded-3xl p-2 hover:text-blue-300`}
          >
            Más vistos
          </button>{" "}
          {debouncedSearchTerm && !isLoading && (
            <p>{resultsNumber} resultados</p>
          )}
        </div>
        {articles.length > 1 ? (
          <>
            {articles?.map((article: any) => (
              <NewsCard key={article.name} article={article} />
            ))}
            <nav className="flex justify-between">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className={`${
                  page <= 0
                    ? "text-gray-500"
                    : "text-blue-500 hover:text-blue-800"
                }  m-6`}
              >
                Anterior
              </button>

              <button
                disabled={articles.pages >= page}
                onClick={() => setPage(page + 1)}
                className={`${
                  articles.pages >= page
                    ? "text-gray-500"
                    : "text-blue-500 hover:text-blue-800"
                } m-6`}
              >
                Próxima
              </button>
            </nav>
          </>
        ) : (
          <div className="m-6">{error && error} </div>
        )}
      </ul>
    </>
  );
};

export default NewsList;
