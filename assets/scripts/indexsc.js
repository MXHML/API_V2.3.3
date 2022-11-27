
//Variables & constants
let li1 = document.getElementById("li1");
let li2 = document.getElementById("li2");
let create_input = document.createElement("input");
let create_input2 = document.createElement("input");
let title_ul = document.getElementById("title_ul");
// eslint-disable-next-line no-unused-vars
let coverart_div = document.getElementById("coverart_div");
let htmlsearchresults = document.getElementById("htmlsearchresults");

const time = new Date();
let access_token = "";
let apiresponse = [];
let searchresults = [];
let numberofsearches = 1;
let userdata = [];
let topartsits = [];
let topsongs = [];

window.addEventListener("load", () => {
  getauth();
  APICall("me",userdata,()=>{
    title();
  });
});

create_input.addEventListener(
  "keypress",
  (event) => {
    if (event.key == "Enter") {
      if(create_input.value=="top artists"){
        topartsits=[];
        APICall(`me/top/artists?&limit=${create_input2.value}`,topartsits,()=>{
          topartiststohtml();
        })
      }
      else if(create_input.value=="top songs"){
        topsongs=[];
        APICall(`me/top/tracks?&limit=${create_input2.value}`,topsongs,()=>{
          topsongstohtml();
        })
      }
    else{
      apiresponse = [];
      let searchentry = create_input.value.replace("", "%20");
      fetch(
        "https://api.spotify.com/v1/search?q=" +
          searchentry +
          "&type=track" +
          "&limit=" +
          create_input2.value,
        {
          headers: new Headers({
            Authorization: "Bearer " + access_token,
          }),
          method: "GET",
        }
      )
        .then(function (response) {
          if (response.status === 401) {
            window.open(
              "https://accounts.spotify.com/en/authorize?response_type=token&client_id=f6db8902d1a94c1a854359ab73e38d0d&redirect_uri=https://mxhml.github.io/API_V2.3.3/&show_dialog=true&scope=user-top-read%20user-read-private%20user-read-playback-state",
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
          apiresponse.push(data);
          searchresults = apiresponse[0].tracks.items;
          if (numberofsearches > 1) {
            while (htmlsearchresults.firstChild) {
              htmlsearchresults.removeChild(htmlsearchresults.lastChild);
            }
          }
          numberofsearches = numberofsearches + 1;
          responsetohtml();
        })
        .catch(function (err) {
          console.warn("Something went wrong.", err);
        });
    }}
  },
  false
);

create_input2.addEventListener(
  "keypress",
  (event) => {
    if (event.key == "Enter") {
      if(create_input.value=="top artists"){
        topartsits=[];
        APICall(`me/top/artists?&limit=${create_input2.value}`,topartsits,()=>{
          topartiststohtml();
        })
      }
      else if(create_input.value=="top songs"){
        topsongs=[];
        APICall(`me/top/tracks?&limit=${create_input2.value}`,topsongs,()=>{
          topsongstohtml();
        })
      }
    else{
      apiresponse = [];
      let searchentry = create_input.value.replace("", "%20");
      fetch(
        "https://api.spotify.com/v1/search?q=" +
          searchentry +
          "&type=track" +
          "&limit=" +
          create_input2.value,
        {
          headers: new Headers({
            Authorization: "Bearer " + access_token,
          }),
          method: "GET",
        }
      )
        .then(function (response) {
          if (response.status === 401) {
            window.open(
              "https://accounts.spotify.com/en/authorize?response_type=token&client_id=f6db8902d1a94c1a854359ab73e38d0d&redirect_uri=https://mxhml.github.io/API_V2.3.3/&show_dialog=true&scope=user-top-read%20user-read-private%20user-read-playback-state",
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

          if(userdata[0].explicit_content.filter_enabled == true){
            for(let i = 0; i < data.tracks.items.length; i++){
              if(data.tracks.items[i].explicit == true){
                data.tracks.items.splice(i,1);
                document.getElementById("htmlsearchresults").innerHTML = `
                <li>Explicit content is disabled in your account settings.</li>
                `;
              }
            }
          }
        else if(userdata[0].explicit_content.filter_enabled != true){
          apiresponse.push(data);
          searchresults = apiresponse[0].tracks.items;
          numberofsearches = numberofsearches + 1;
          responsetohtml();
        }})
        .catch(function (err) {
          console.warn("Something went wrong.", err);
        });
    }}
  },
  false
);
//Functions
create_input.placeholder = "<ENTER RESPONSE HERE>";
create_input.id = "user_response";
create_input.type = "text";
create_input.setAttribute('class', 'responseBox')
create_input.style.display="inline-block";

create_input2.placeholder = "NUMBER OF RESULTS";
create_input2.id = "number_of_results";
create_input2.type = "text";
create_input2.setAttribute('class', 'responseBox')
create_input2.style.display="inline-block";

function getauth() {
  var str = window.location.href;
  if (str.includes("access_token")) {
    access_token = str.substring(str.indexOf("access_token") + 13);
    access_token = access_token.split("&")[0];
    title();
  } else {
    window.open(
      "https://accounts.spotify.com/en/authorize?response_type=token&client_id=f6db8902d1a94c1a854359ab73e38d0d&redirect_uri=https://mxhml.github.io/API_V2.3.3/&show_dialog=true&scope=user-top-read%20user-read-private%20user-read-playback-state",
      "_self"
    );
  }
}

function title() {
  li1.innerText =
    // eslint-disable-next-line no-undef
    months[time.getMonth()] +
    "_" +
    time.getDate() +
    "_" +
    time.getFullYear() +
    "_";
  setTimeout(() => {
    li1.innerText = `WELCOME, ${userdata[0].display_name}!`;
    setTimeout(() => {
      li2.innerText = "PLEASE ENTER YOUR DESIRED CATEGORY: (search for an artist, 'top songs', or 'top artists'";
      setTimeout(() => {
        title_ul.appendChild(create_input);
        title_ul.appendChild(create_input2);
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

    z.src = searchresults[x].preview_url;
    z.id = "audio_" + x;

    htmlsearchresults.appendChild(z);
    htmlsearchresults.appendChild(y);
    y.addEventListener("click", () => {
      let temp = x;
      document.getElementById("coverart_div").style.visibility = "visible";
      document.getElementById("coverart_div").innerHTML=`
      <a href="${searchresults[temp].album.external_urls.spotify}" target="_blank"><img src="${searchresults[temp].album.images[0].url}" alt="cover art" id="coverart" height="250" width="250"></a>
      <a class="pauseBtn" onclick="document.querySelectorAll('audio').forEach((el) => el.pause());">&#10073;&#10073;</a>
      `
      
      console.log(temp);
      playaudio(temp);
    });
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
      document.getElementById("coverart_div").innerHTML=`
      <a href="${topartsits[0].items[x].external_urls.spotify}" target="_blank"><img src="${topartsits[0].items[x].images[0].url}" height="250" width="250"></a>
      `
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
      document.getElementById("coverart_div").innerHTML=`
      <a href="${topsongs[0].items[x].album.external_urls.spotify}" target="_blank"><img src="${topsongs[0].items[x].album.images[0].url}" height="250" width="250"></a>
      <a class="pauseBtn" onclick="document.querySelectorAll('audio').forEach((el) => el.pause());">&#10073;&#10073;</a>
      `
      playaudio(temp);
    })
  }
}

function APICall (query,outputlist,callback){
  apiresponse = [];
  console.warn(`CALLING:https://api.spotify.com/v1/${query}, AND PUSHING TO ${outputlist}`);
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
      if (response.status === 401) {
        window.open(
          "https://accounts.spotify.com/en/authorize?response_type=token&client_id=9bf2e0b5a7284542864ee9109927b0a1&redirect_uri=https://mxhml.github.io/API_V2.3.3/&show_dialog=true&scope=user-top-read%20user-read-private%20user-read-playback-state",
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
    .then(()=>{
      callback();
    })
    .catch(function (err) {
      console.warn("Something went wrong.", err);
    });
}