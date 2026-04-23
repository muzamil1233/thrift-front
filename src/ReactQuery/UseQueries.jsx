import { useQueries } from '@tanstack/react-query'
import React from 'react'
import { fetchUsersID } from './a_apiCalls'
/*
->useQueries is a powerful hook from TanStack Query that allows you to run multiple queries in parallel
->The useQueries hook can also be used to fetch a variable number of queries
  example: fetching multiple users via id
*/
const I_useQueriesHook = () => {
  const userIds=[1,2,3,4,5]
  const result=useQueries({
    queries:userIds.map((id)=>({
      queryKey:['user',id],
      queryFn:()=>fetchUsersID(id),
      
    })),
    //if you want to combine data (or other Query information) from the results into a single value, you can use the combine option
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      }
    },
  })
  // console.log("data:",data)
  return (
    <div>useQueries Hook Example:
      <h4>Users Fetched:</h4>
        <ul>
            {result && result?.data?.map((user)=>(
                <li key={user?.id}>#{user?.id} : {user?.name}</li>
            ))}
        </ul>
    </div>
  )
}

export default I_useQueriesHook


import { useQueries } from "@tanstack/react-query";
import React from "react";
import { fetchTodos, fetchUsers } from "./a_apiCalls";

//docs: https://tanstack.com/query/latest/docs/framework/react/reference/useQueries#usequeries
const J_useQueriesEx2 = () => {
  const result = useQueries({
    queries: [
      { queryKey: ["users"], queryFn: fetchUsers, staleTime: Infinity },
      { queryKey: ["todos"], queryFn: fetchTodos, staleTime: Infinity },
    ],
  });
  console.log("result of useQueries:", result);
  const [ usersQuery, todosQuery ] = result;
  if (usersQuery?.isLoading || todosQuery?.isLoading) return <p>Loading...</p>;
  if (usersQuery?.isError) return <p>Error: {usersQuery.error.message}</p>;
  if (todosQuery?.isError) return <p>Error: {todosQuery.error.message}</p>;
  return (
    <div>
      <h4>useQueries Hook Example Two:</h4>
      {usersQuery && (
        <>
          <h2>Users</h2>
          {usersQuery?.data?.map((user) => (
            <p key={user.id}>{user.name}</p>
          ))}
        </>
      )}

      {todosQuery && (
        <>
          <h2>Posts</h2>
          {todosQuery?.data?.slice(0,10)?.map((todo) => (
            <p key={todo.id}>{todo.title}</p>
          ))}
        </>
      )}
    </div>
  );
};

// export default J_useQueriesEx2;