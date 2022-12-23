import Head from "next/head";
import React from "react";
import { PostCard } from "../components";
import {
  BlogItem,
  PostItem,
  getPostContent,
  getPostList,
} from "../helpers/pull-blog-data";

interface HomeProps {
  postList: Array<PostItem>;
}

const Home = (props: HomeProps) => {
  const { postList } = props;

  return (
    <div>
      <Head>
        <title>Jake&apos;s Blog - home</title>
        <meta name="description" content="Collection of stuff" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {postList.map((postItem: PostItem, index: number) => (
        <PostCard key={index} {...postItem} />
      ))}
    </div>
  );
};

export async function getStaticProps() {
  const contentList: Array<BlogItem> = await getPostList();

  const postList: Array<PostItem> = await Promise.all(
    contentList.map(async (item: BlogItem) => {
      const { slug } = item;
      return getPostContent(slug as string, true);
    })
  );

  return {
    props: { postList } as HomeProps,
  };
}

export default Home;
