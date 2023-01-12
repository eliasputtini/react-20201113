import { useDebounce } from "use-debounce";
import NewsCard from "../components/NewsCard";

import { useState, useEffect } from "react";

const NewsList = ({ searchTerm }: any) => {
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
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
        if (data.data.status == 404) {
          setError("Busca não encontrada");
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, [debouncedSearchTerm, page]);

  if (isLoading) {
    return <div className="m-6"> Loading...</div>;
  }

  if (error) {
    return <div className="m-6">{error}</div>;
  }

  if (debouncedSearchTerm && articles.length < 1 && !isLoading) {
    return <div className="m-6">Nenhum resultado encontrado!</div>;
  }

  return (
    <>
      <ul className="list-none flex flex-col items-center">
        {articles.length > 1 ? (
          <>
            {articles?.map((article: any) => (
              <NewsCard key={article.name} article={article} />
            ))}
            <nav className="flex justify-between">
              <button
                disabled={page <= 0}
                onClick={() => setPage(page - 1)}
                className={`${
                  page <= 0
                    ? "text-gray-500"
                    : "text-blue-500 hover:text-blue-800"
                }  m-6`}
              >
                Previous
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
                Next
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
