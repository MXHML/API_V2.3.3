fetch(`https://accounts.spotify.com/api/token`,
{
  headers:new Headers({
    'Authorization':'Basic'+ btoa(api_id+":"+api_secret)}),
  method:"POST",
  form:{
    grant_type:'client_credentials'
  },
  json:true,
}
  ).then((data)=>{
    access_token=data;
  }).catch((err)=>{
    console.error("Something went wrong.",err)
  })