import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../../styles/article.module.css";

export default function Article() {
  const router = useRouter();
  const [article, setArticle] = useState(null as any);
  const [error, setError] = useState("");

  const { articleId } = router.query;

  console.log(
    `https://api.beta.mejorconsalud.com/wp-json/mc/v2/posts/${articleId}`
  );

  useEffect(() => {
    if (articleId != undefined) {
      fetch(
        `https://api.beta.mejorconsalud.com/wp-json/mc/v2/posts/${articleId}`
      )
        .then((res) => res.json())
        .then((data) => {
          setArticle(data);
          console.log(data);
          if (data?.status == 404) {
            setError("Busca não encontrada");
          }
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [articleId]);

  if (error != "") {
    return <div className="m-6">{error}</div>;
  }

  const { ["2048x2048"]: imageUrl } = article?.featured_media ?? {};
  return (
    <>
      <Head>
        <title>React Test</title>
        <meta
          name="description"
          content="Dicas e artigos sobre nutrição e saúde."
        />
        <meta name="keywords" content="my,nutricion,salud" />
        <meta property="og:title" content="Mejor Con Salud" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://example.com" />
        <meta property="og:image" content="https://example.com/image.jpg" />
        <meta
          property="og:description"
          content="Dicas e artigos sobre nutrição e saúde"
        />
      </Head>
      {article ? (
        <div className="flex flex-col items-start justify-start mx-2 sm:ml-16 sm:mr-[40%]">
          <div className="py-6">
            <div className="font-bold text-4xl text-cyan-600 mb-6">
              {article.title}
            </div>
            <p className="text-gray-700 text-xl border-l-2 border-pink-300 pl-3 pt-1 pb-2">
              {article.headline}
            </p>
          </div>

          <Image width={800} height={800} src={imageUrl} alt={article.title} />

          <div
            className={styles.container}
            dangerouslySetInnerHTML={{ __html: article.content }}
          ></div>

          <div className="w-[90%] py-4 flex justify-evenly">
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
              Vea mais
            </a>
          </div>
        </div>
      ) : (
        <div className="m-6">Cargando..</div>
      )}
    </>
  );
}
