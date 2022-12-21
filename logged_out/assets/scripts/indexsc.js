const htmlsearchresults = document.getElementById("htmlsearchresults");
const coverart_wrapper = document.getElementById("coverart_wrapper");
const user_response = document.getElementById("user_response");
const number_of_results = document.getElementById("number_of_results");
const coverart_image = document.getElementById("coverart");

let api_id='f6db8902d1a94c1a854359ab73e38d0d'
let api_secret='048f681195bc4067af461451afee96bd'
let access_token=''

let apiresponse = [];
//functions
window.addEventListener("load",()=>{
  user_response.style.visibility='visible';
  number_of_results.style.visibility='visible'
})


const authOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': 'Basic ' + btoa(api_id + ':' + api_secret)
  },
  body: 'grant_type=client_credentials'
};

fetch('https://accounts.spotify.com/api/token', authOptions)
  .then(response => response.json())
  .then(function(data){apiresponse.push(data)})
  .then(()=>{access_token=apiresponse[0].access_token})


user_response.addEventListener(
    "keypress",
    (event) => {
      console.log("STAGE 1")
      if (event.key == "Enter") {
        if(window.outerWidth<1020==true){
          if(number_of_results.value>10==true){
            number_of_results.value=10
          }
        }
        if(user_response.value=="top artists"){
          htmlsearchresults.innerHTML=`<li> <div class="red">This feature is unavailable while logged out!</div></li>`
        }
        else if(user_response.value=="top songs"){
          htmlsearchresults.innerHTML=`<li> <div class="red">This feature is unavailable while logged out!</div></li>`
          console.log("IF 2 FIN")
        }
      else{
        console.log("ELSE FIRE")
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
            console.log("STAGE 1")
            if (event.key == "Enter") {
              if(window.outerWidth<1020==true){
                if(number_of_results.value>10==true){
                  number_of_results.value=10
                }
              }
              if(user_response.value=="top artists"){
                htmlsearchresults.innerHTML=`<li> <div class="red">This feature is unavailable while logged out!</div></li>`
              }
              else if(user_response.value=="top songs"){
                htmlsearchresults.innerHTML=`<li> <div class="red">This feature is unavailable while logged out!</div></li>`
                console.log("IF 2 FIN")
              }
            else{
              console.log("ELSE FIRE")
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

function responsetohtml() {
  while (htmlsearchresults.firstChild) {
    htmlsearchresults.removeChild(htmlsearchresults.lastChild);
  }

  for (let x = 0; x < searchresults.length; x++) {
    let y = document.createElement("li");
    let z = document.createElement("audio");

    y.innerHTML = searchresults[x].name;
    y.id = x;

      z.src = searchresults[x].preview_url;
      z.id = "audio_" + x;

    htmlsearchresults.appendChild(z);
    htmlsearchresults.appendChild(y);
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
  })}}

//general api call function
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
//Another native sleep function!?!?!?!? (Check logic_main.js for source)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function typeWriter(target,speed,finalText){
  for(let x=0;x<finalText.length;x++){
      target.innerHTML+=finalText.charAt(x)
      await sleep(speed)
  }
}
function playaudio(index) {
  document.querySelectorAll("audio").forEach((el) => el.pause());
  document.getElementById("audio_" + index).play();
}