export function getTicketsCategory(){
    const result=fetch('http://localhost:8080/ticket-categories',{
        method:'GET',
        headers:{
            'Content-Type':'application/json',
        },
    }). then(response=> response.json())
        .then(data=>{
        return [...data];
    });
    return result
}