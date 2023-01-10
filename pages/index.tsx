import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";

import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (event: any) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `https://api.beta.mejorconsalud.com/wp-json/mc/v2/posts?search=${searchTerm}`
      );
      const data = await response.json();
      console.log(data); // do something with the data, like updating a state variable
    } catch (error) {
      console.error(error);
    }

    console.log(searchTerm);
  };
  return (
    <form onSubmit={handleSearch} className="w-full max-w-sm">
      <div className="flex items-center border-b border-teal-500 py-2">
        <input
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
          type="submit"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default function Home({ data }: any) {
  return (
    <>
      <Head>
        <title>React Test</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-white flex justify-center">
        <SearchBar />
        <h1 className="text-3xl font-bold underline">{data}</h1>
      </main>
    </>
  );
}