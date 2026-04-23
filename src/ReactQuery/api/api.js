const fetchData = async ()=>{
    const response = await fetch(`http://localhost:3000/posts?_sort=-id`)
    if(!response.ok){
       throw new Error(`Failed to fetch posts. Status: ${response.status}`);
    }
    const data = await response.json();
    return data 
}

const fetchPost = async (post)=>{
    try {
          const response = fetch("http://localhost:3000/posts",{
        method : "post",
        headers:{
            "content-type" : "application/json"
        },
        body : json.stringify(post)

    })
    const data = response.json();
    return data;
    } catch (error) {
        console.log("error occured not found content ")
    }
  
}

export {
     fetchData,
     fetchPost
}
