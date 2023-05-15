"use client";

import { useState, useEffect } from "react";

import Profile from "@components/Profile";
import { useSearchParams } from "next/navigation";

const ProfilePage = ({ params }) => {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`/api/users/${params.id}/posts`);
      const data = await res.json();
      console.log(data);
      setPosts(data);
    }

    fetchPosts();
  }, []);

  return (
    <Profile
      name={username}
      desc={`Welcome to ${username} profile page`}
      data={posts}
    />
  );
}

export default ProfilePage;

