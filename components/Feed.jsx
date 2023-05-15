"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

import PromptCard from "./PromptCard";

const PromptCardList = ({ data }) => {
  return (
    <div className="mt-16 prompt_layout">
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
        />
      ))}
    </div>
  )
}

const Feed = () => {
  const params = useSearchParams();
  const router = useRouter();
  const searchQuery = params.get("search") || "";
  const [posts, setPosts] = useState([]);
  const searchInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  const handleSearchChange = useCallback(() => {
    clearTimeout(searchTimeoutRef.current);

    searchTimeoutRef.current = setTimeout(() => {
      let curQuery = {};

      if (params) {
        curQuery = qs.parse(params.toString());
      };

      const updatedQuery = {
        ...curQuery,
        search: searchInputRef.current.value,
      };

      if (searchInputRef.current.value === "") delete updatedQuery.search;

      const url = qs.stringifyUrl({
        url: "/",
        query: updatedQuery,
      }, { skipNull: true });

      router.replace(url);
    }, 300);
  }, [params, router, searchInputRef]);

  const filteredPosts = useMemo(() => {
    const regex = new RegExp(searchQuery, "i");
    return posts.filter((post) =>
    regex.test(post.creator.username.toLowerCase()) ||
    regex.test(post.tag.toLowerCase()) ||
    regex.test(post.prompt.toLowerCase()));
  }, [posts, searchQuery]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/prompt");
      const data = await res.json();

      setPosts(data);
    }

    fetchPosts();
  }, []);

  useEffect(() => {
    searchInputRef.current.value = searchQuery;
  }, [searchQuery]);

  return (
    <section className="feed">
      <form className="relative w-full flex-center ">
        <input
          ref={searchInputRef}
          onChange={handleSearchChange}
          type="text"
          placeholder="Search for a tag or a username"
          required
          className="search_input peer"
        />
      </form>

      <PromptCardList
        data={filteredPosts}
      />
    </section>
  );
}

export default Feed;
