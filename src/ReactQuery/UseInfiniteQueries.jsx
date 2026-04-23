import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react'


const fetchPost = async (page)=>{
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=5`);
    return res.json()
}
const UseInfiniteQueries = () => {

   const {data ,fetchNextPage,hasNextPage, isFetchingNextPage,status}=useInfiniteQuery({
    queryKey: ["posts"],
    queryFn:fetchPost,
    getNextPageParam:(lastPage , allPage)=>{
           return lastPage.length ? allPage.length +1: undefined
    }

   })
   if (status === "loading") return <p>Loading...</p>;
  if (status === "error") return <p>Error fetching data</p>;

  return (
    <div>
      <h4>useInfiniteQuery Example:</h4>
      {data &&
        data.pages.map((page, i) => (
          <div key={i}>
            {page.map((post) => (
              <p key={post.id}>#{post.id} : {post.title}</p>
            ))}
          </div>
        ))}

     <button onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
        {isFetchingNextPage ? "Loading more..." : "Load More"}
      </button>
    </div>
    
  )
}

export default UseInfiniteQueries
