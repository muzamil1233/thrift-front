import { useQuery } from "@tanstack/react-query";
import React from "react";
import { fetchUsers } from './a_apiCalls';
//Explaing caching in Tanstack React Query

/*
->TanStack React Query automatically caches API responses to improve performance and reduce unnecessary network requests

 Note: Caching is the process of storing copies of files in a cache, or temporary storage location, so that they can be accessed more quickly
*/

const D_Caching = () => {
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"], //used for re-fetching, caching, and sharing data between components.
    queryFn: fetchUsers, //function typically used to call an API.
    staleTime: Infinity, //learn about it from below comments
  });
  /*
  ->React query uses caching via the queryKey, basically it uses this queryKey to create the cache for queryKey which the cache
    is basically the result of the API call, and then its going to show the cache instead of fetching from backend over and over again.
  */

  /*
  Here to see caching behavior, i have added in Button in App.jsx which is going to toggle this component basically unmount and remount
  this component. which is going to recreate it every single query
  What's going to happen:
  ->When you mount the component the loading is happening and data is fetched and if you refresh the component/page the loading is going to
    happen again.
  ->Now if you click on the toggle button the component is unmounted and if click again the component is mounted but this time no loading
    it will show data directly without loading but the API call will be made (see console)
    Basically react query by default will cache your data for this request and it's going to know to cache the data via the
    queryKey "users" here, and then its going to show you its cached data if it has it. So when you load component first time
    its shows loading it fetches data and caches it and when you unmount the component and mounted it again and this time it shows you
    cached data, but react query will make the request even though its showing you the cached data, it will make a request in the
    backgound and then update your data without being visually obvious and you can see this when you mount this component you
    can see "fetching users..." in console
    ->And this behavior react query does by default it will you show you the cached data if it has it and then its going to make a
      API request in backgound and then updates your data
      ->And you can remove this behavior by passing this to useQuery : staleTime:Infinity, this will tell react query that it should never
         consider its data stale, which means the data is still valid and if you do it react query is not going to refetch the data even
         in the background
         after doing this: const { data:users, isLoading, error } = useQuery({
                                                                      queryKey: ["users"],
                                                                      queryFn: fetchUsers,
                                                                      staleTime:Infinity
                                                                    });
        Now if you remount the component you won't see "fetching users..." in the console

        ?check more from docs: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery#usequery
  */

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error:{error.message}</p>;
  // console.log("data fetched:", users);
  return (
    <div>
      <h2>Caching In React Query</h2>
      <h4>Users Fetched:</h4>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            #{user.id} : {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

// export default D_Caching;



import { useQuery,useQueryClient } from "@tanstack/react-query";
import React from "react";
import { fetchUsers } from './a_apiCalls';
/*
(important)
->What Happens When You Fetch Data?
    When you call useQuery(), React Query:
    1- Checks the Cache:
        If the data is already in cache and fresh, it returns cached data (avoiding an API call).
        If the data is stale or not in cache, it fetches from the API.

    2- Stores the Data in the Cache
        The response is saved in memory using a unique queryKey.
        Next time the same queryKey is requested, React Query returns cached data instantly.


->Cache Lifetime & Stale Time (important)
    React Query caches data but follows a lifecycle:
    Phase	                               Behavior
    Fresh	                 Data is served instantly from the cache. No API request.
    Stale (default)	       Data is shown from cache, but a background refetch happens.
    Inactive	             Data is removed from memory after some time (garbage collected).
    Expired	               Data is fully deleted from the cache.
*/

//Note:first see previous code D_Caching.jsx (important)
const E_Caching_2 = () => {
    const queryClient = useQueryClient();
  const { data, isLoading, error,refetch, } = useQuery({
    queryKey: ["users"], //used for re-fetching, caching, and sharing data between components.
    queryFn: fetchUsers, //function typically used to call an API.
    
    //1-> staleTime (Avoid Unnecessary Refetching - Controls how long data is considered "fresh" before React Query refetches it.)
   staleTime: Infinity, //React query will never refetch the data
    //staleTime: 5000, // Data stays fresh for 5 seconds, after 5 seconds if component remounts data is fetched in background
    //staleTime: 5 * 60 * 1000 // 5 minutes : now, within 5 minutes, React Query won't refetch if the same query is used.

    //2-> Refetching & Updating Cache (React Query automatically refetches in these cases:)
    //A: On Window Focus (Default - When you return to a tab, it refetches data) (important)
    //refetchOnWindowFocus: false, //default is true (no when you change the tab/window it won't fetch again)

    //B:On Interval (refetchInterval)
    //refetchInterval: 5000 // 5 seconds (fetches data in every 5 seconds)
  });
   //C:Manually Triggering Refetch (refetch() forces a fresh API request)
    /*const { refetch } = useQuery({ queryKey: ["todos"], queryFn: fetchTodos });
     <button onClick={() => refetch()}>Refetch</button>;*/

     //4-> Query Invalidation (Force Cache Update)
     //If data changes, you can invalidate the cache to force a refetch
     const updateUsers = async () => {
        //await addNewTodo(); // Assume this updates the backend
        queryClient.invalidateQueries(["users"]); // Refetch users
    };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error:{error.message}</p>;
  // console.log("data fetched:", users);
  return (
    <div>
      <h2>Caching In React Query More</h2>
      <h4>Users Fetched:</h4>
      <ul>
        {data.map((user) => (
          <li key={user.id}>
            #{user.id} : {user.name}
          </li>
        ))}
      </ul>
      <button onClick={() => refetch()}>Refetch</button>
      <button onClick={updateUsers}>Invalidate Cache</button>
    </div>
  );
};

export default E_Caching_2;