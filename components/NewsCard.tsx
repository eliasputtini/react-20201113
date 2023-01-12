import Router from "next/router";
import Image from "next/image";

const NewsCard = ({ article }: any) => {
  const { ["2048x2048"]: imageUrl } = article?.featured_media;

  return (
    <div
      onClick={() => {
        const articleId = article.id;
        Router.push("/articles/" + articleId);
      }}
      className="max-w-[800px] rounded overflow-hidden shadow-lg mt-6 mx-2 cursor-pointer"
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
          Vea mais
        </a>
      </div>
    </div>
  );
};

export default NewsCard;
