import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { useDebounce } from "use-debounce";
import Router from "next/router";

import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

const SearchBar = ({ searchTerm, setSearchTerm }: any) => {
  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center border-b border-teal-500 py-2">
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Digite para buscar.."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};

const NewsCard = ({ article }: any) => {
  const { ["2048x2048"]: imageUrl } = article.featured_media;

  return (
    <div
      onClick={() => {
        const articleId = article.id;
        Router.push("/articles/" + articleId);
      }}
      className="w-[800px] rounded overflow-hidden shadow-lg mt-6 cursor-pointer"
    >
      <Image width={800} height={800} src={imageUrl} alt={article.title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{article.title}</div>
        <p className="text-gray-700 text-base">{article.headline}</p>
      </div>
      <div className="px-6 py-4 flex justify-between">
        {article.categories.map((category: any) => {
          return (
            <span
              key={category.name}
              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
            >
              {category.name}
            </span>
          );
        })}

        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-readmore text-blue-600"
        >
          Saiba mais
        </a>
      </div>
    </div>
  );
};

const NewsList = ({ searchTerm }: any) => {
  const [debouncedSearchTerm] = useDebounce(searchTerm, 1000);
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!searchTerm) return;

    setIsLoading(true);
    fetch(
      `https://api.beta.mejorconsalud.com/wp-json/mc/v2/posts?search=${debouncedSearchTerm}`
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
  }, [debouncedSearchTerm]);

  if (isLoading) {
    return <div className="m-6"> Loading...</div>;
  }

  if (error) {
    return <div className="m-6">{error}</div>;
  }

  if (searchTerm != "" && articles.length < 1 && !isLoading) {
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
          </>
        ) : (
          <div className="m-6">{error && error} </div>
        )}
      </ul>
    </>
  );
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  return (
    <>
      <Head>
        <title>React Test</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-white h-full pt-6 flex flex-col items-center justify-start">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <NewsList searchTerm={searchTerm} />
      </main>
    </>
  );
}
