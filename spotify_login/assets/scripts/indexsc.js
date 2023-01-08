

//Variables & constants

const time = new Date();
let access_token = "";
let apiresponse = [];
let searchresults = [];
let numberofsearches = 1;
let userdata = [];
let topartsits = [];
let topsongs = [];
let templist = []; //used for testing API calls
let explicitSongs = [];

window.addEventListener("load", () => {
  getauth();
  APICall("me",userdata,()=>{
    title();
  });
  if(window.innerWidth<1020==true){
    coverart_image.style.position="absolute";
    coverart_image.style.left=window.outerWidth/4+"px"
    htmlsearchresults.style.top=number_of_results.getBoundingClientRect().y+90+"px"
  }
});
window.addEventListener('resize',()=>{
  if(window.innerWidth<1020==true){
    coverart_image.style.position="absolute";
    coverart_image.style.left=window.outerWidth/4+"px"
    coverart_image.style.top=htmlsearchresults.getBoundingClientRect().height+200+"px"
    pauseBtn.style.left=coverart_image.getBoundingClientRect().x+117+"px";
    pauseBtn.style.top=coverart_image.getBoundingClientRect().y+270+"px"
  }
    else{
      coverart_image.style="visibility:visible;"
      pauseBtn.style.left=coverart_image.getBoundingClientRect().x+117+"px";
      pauseBtn.style.top=coverart_image.getBoundingClientRect().y+270+"px"
    }
})

user_response.addEventListener(
  "keypress",
  (event) => {
    if (event.key == "Enter") {
      if(window.outerWidth<1020==true){
        if(number_of_results.value>10==true){
          number_of_results.value=10
        }
      }
      if(user_response.value=="top artists"){
        topartsits=[];
        APICall(`me/top/artists?&limit=${number_of_results.value}`,topartsits,()=>{
          topartiststohtml();
        })
      }
      else if(user_response.value=="top songs"){
        topsongs=[];
        APICall(`me/top/tracks?&limit=${number_of_results.value}`,topsongs,()=>{
          topsongstohtml();
        })
      }
    else{
      apiresponse = [];
      let searchentry = user_response.value.replace(" ", "%20");
      console.log(searchentry);
      APICall(
        `search?q=${searchentry}&type=track&limit=${number_of_results.value}`,apiresponse,()=>{
            searchresults = apiresponse[0].tracks.items;
            responsetohtml();
          })
        }
      }})

number_of_results.addEventListener(
  "keypress",
  (event) => {
    if (event.key == "Enter") {
      if(window.innerWidth<1020==true){
        if(number_of_results.value>10){
          number_of_results.value=10
        }
      }
      if(user_response.value=="top artists"){
        topartsits=[];
        APICall(`me/top/artists?&limit=${number_of_results.value}`,topartsits,()=>{
          topartiststohtml();
        })
      }
      else if(user_response.value=="top songs"){
        topsongs=[];
        APICall(`me/top/tracks?&limit=${number_of_results.value}`,topsongs,()=>{
          topsongstohtml();
        })
      }
    else{
      apiresponse = [];
      let searchentry = user_response.value.replace(" ", "%20");
      console.log(searchentry);
      APICall(
        `search?q=${searchentry}&type=track&limit=${number_of_results.value}`,apiresponse,()=>{
          searchresults = apiresponse[0].tracks.items;
          responsetohtml();
        })
      }}})
//Functions

function getauth() {
  var str = window.location.href;
  if (str.includes("access_token")) {
    access_token = str.substring(str.indexOf("access_token") + 13);
    access_token = access_token.split("&")[0];
    title();
  } else {
    window.open(
      "https://accounts.spotify.com/en/authorize?response_type=token&client_id=f6db8902d1a94c1a854359ab73e38d0d&redirect_uri=http://127.0.0.1:5500/spotify_login/index.html&show_dialog=true&scope=user-top-read%20user-read-private%20user-read-playback-state",
      "_self"
    );
  }
}

function title() {
  li1.innerText =
    months[time.getMonth()] +
    "_" +
    time.getDate() +
    "_" +
    time.getFullYear() +
    "_";
  setTimeout(() => {
    li1.innerText = `WELCOME, ${userdata[0].display_name}!`;
    setTimeout(() => {
      li2.innerText = "PLEASE ENTER YOUR DESIRED CATEGORY: (search for an artist, 'top songs', or 'top artists')";
      setTimeout(() => {
      user_response.style.visibility="visible"
      number_of_results.style.visibility="visible"
      }, 1000);
    }, 2000);
  }, 2000);
}

function responsetohtml() {
  while (htmlsearchresults.firstChild) {
    htmlsearchresults.removeChild(htmlsearchresults.lastChild);
  }

  for (let x = 0; x < searchresults.length; x++) {
    let y = document.createElement("li");
    let z = document.createElement("audio");

    y.innerHTML = searchresults[x].name;
    y.id = x;
    if(userdata[0].explicit_content.filter_enabled==true){
      if(searchresults[x].explicit==true){
      y.innerHTML=`<div class=disabled>${searchresults[x].name}</div> <div class=red>EXPLICIT SONG</div>`
    }}
    if(userdata[0].explicit_content.filter_enabled==false){
    z.src = searchresults[x].preview_url;
    z.id = "audio_" + x;
    }
    htmlsearchresults.appendChild(z);
    htmlsearchresults.appendChild(y);
    if(userdata[0].explicit_content.filter_enabled==false){
    y.addEventListener("click", () => {
      let temp = x;
      let pauseBtn = document.getElementById("pauseBtn")
      coverart_wrapper.href=searchresults[temp].album.external_urls.spotify; coverart_wrapper.style.visibility="visible";
      coverart_image.src=searchresults[temp].album.images[0].url; coverart_image.style.visibility="visible"
      pauseBtn.style.visibility="visible"
      if(window.innerWidth<1020==true){coverart_image.style.top=htmlsearchresults.getBoundingClientRect().height+200+"px"}

      pauseBtn.style.left=coverart_image.getBoundingClientRect().x+117+"px";
      pauseBtn.style.top=coverart_image.getBoundingClientRect().y+270+"px"
      console.log(temp);
      playaudio(temp);
    })}
  }
}

function playaudio(index) {
  document.querySelectorAll("audio").forEach((el) => el.pause());
  document.getElementById("audio_" + index).play();
}

function topartiststohtml(){
  let parent = document.getElementById("htmlsearchresults");
  while(parent.firstChild){
    parent.removeChild(parent.lastChild);
  }
  for(let x=0;x<topartsits[0].items.length;x++){
    console.warn(`TOP ARTISTS INDEX: ${x}`);
    let y = document.createElement("li");
    y.innerHTML=`${x+1}) ${topartsits[0].items[x].name}`
    htmlsearchresults.appendChild(y);
    y.addEventListener("click",()=>{
      coverart_image.style.visibility="visible"
      coverart_wrapper.style.visibility="visible";
      pauseBtn.style.visibility="visible"
      coverart_wrapper.href=topartsits[0].items[x].external_urls.spotify
      coverart_image.src=topartsits[0].items[x].images[0].url
      if(window.innerWidth<1020==true){coverart_image.style.top=htmlsearchresults.getBoundingClientRect().height+200+"px"}
      pauseBtn.style.left=coverart_image.getBoundingClientRect().x+117+"px";
      pauseBtn.style.top=coverart_image.getBoundingClientRect().y+270+"px"
    })
  }
}

function topsongstohtml(){
  let parent = document.getElementById("htmlsearchresults");
  while(parent.firstChild){
    parent.removeChild(parent.lastChild);
  }
  for(let x=0;x<topsongs[0].items.length;x++){
    let y = document.createElement("li");
    let z = document.createElement("audio");
    z.src = topsongs[0].items[x].preview_url;
    z.id = `audio_`+x;
    y.innerHTML=`${x+1}) ${topsongs[0].items[x].name} (${topsongs[0].items[x].artists[0].name})`
    if(topsongs[0].items[x].preview_url==null){
      y.innerHTML = y.innerHTML + `<div class="red"> (Preview not availavle)</div>`
    }
    htmlsearchresults.appendChild(y);
    htmlsearchresults.appendChild(z);
    y.addEventListener("click",()=>{
      let temp =x;
      coverart_image.style.visibility="visible"
      coverart_wrapper.style.visibility="visible";
      pauseBtn.style.visibility="visible"
      coverart_wrapper.href=topsongs[0].items[x].album.external_urls.spotify
      coverart_image.src=topsongs[0].items[x].album.images[0].url
      if(window.innerWidth<1020==true){coverart_image.style.top=htmlsearchresults.getBoundingClientRect().height+200+"px"}
      pauseBtn.style.left=coverart_image.getBoundingClientRect().x+117+"px";
      pauseBtn.style.top=coverart_image.getBoundingClientRect().y+270+"px"
      playaudio(temp);
    })
  }
}

function APICall (query,outputlist,callback){
  console.warn(`CALLING:https://api.spotify.com/v1/${query}, AND PUSHING TO ${toString(outputlist)}`);
  fetch(
    `https://api.spotify.com/v1/${query}`,
    {
      headers: new Headers({
        Authorization: "Bearer " + access_token,
      }),
      method: "GET",
    }
  )
    .then(function (response) {
      apiresponseCode=response.status;
      if (response.status === 401) {
        window.open(
          "https://accounts.spotify.com/en/authorize?response_type=token&client_id=9bf2e0b5a7284542864ee9109927b0a1&redirect_uri=http://127.0.0.1:5500/spotify_login/index.html&show_dialog=true&scope=user-top-read%20user-read-private%20user-read-playback-state",
          "_self"
        );
      }
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject(response);
      }
    })
    .then(function (data) {
      outputlist.push(data);
    })
    .catch(function (err) {
      console.warn("Something went wrong.", err);
    }).then(()=>{
      callback();
    })
}
