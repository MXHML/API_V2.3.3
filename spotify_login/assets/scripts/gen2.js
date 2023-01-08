const name_wrapper = document.getElementById("name-wrapper");
const search_textbox = document.getElementById("search_textbox")
const results_amount_tb = document.getElementById("results_ammount_tb")
const content_wrapper = document.getElementById("content-wrapper");

let apiresponse=[];
let access_token=""

$(document).ready(()=>{
    getauth()
    $("#content-wrapper").hide();
    sleep(1000).then(()=>{
        $("#name-wrapper").fadeOut("slow")
    }).then(()=>{
        sleep(1000).then(()=>{
                $("#content-wrapper").fadeTo(400,1)
        })
    })
})

search_textbox.addEventListener("click",()=>{
    move(document.getElementById("content-wrapper"))
})


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

 //https://stackoverflow.com/questions/54571974/css-keyframe-to-animate-element-to-top-of-page
  function move(e) {
    e.style.top = e.offsetTop + "px";
    e.classList.add('element-up');
  }

search_textbox.addEventListener("keypress",(event)=>{
        if(event.key=="Enter"){
            let temp=search_textbox.value.replace(' ','%20')
            console.log("Starting...")
            APICall(`search?q=${temp}&type=track&limit=${results_amount_tb.value}`,apiresponse,()=>{console.log("Done!")})
        }
    }
)

results_amount_tb.addEventListener("keypress",(event)=>{
    if(event.key=="Enter"){
        console.log("Starting...")
        APICall(`search?q=${search_textbox.value}&type=track&limit=${results_amount_tb.value}`,apiresponse,()=>{responseConversion()})
    }
}
)

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

  function getauth() {
    var str = window.location.href;
    if (str.includes("access_token")) {
      access_token = str.substring(str.indexOf("access_token") + 13);
      access_token = access_token.split("&")[0];
    } else {
      window.open(
        "https://accounts.spotify.com/en/authorize?response_type=token&client_id=f6db8902d1a94c1a854359ab73e38d0d&redirect_uri=http://127.0.0.1:5500/spotify_login/index.html&show_dialog=true&scope=user-top-read%20user-read-private%20user-read-playback-state",
        "_self"
      );
    }
  }

  function responseConversion(){
    for(let x=0;x<apiresponse[0].tracks.items.length;x++){
        content_wrapper.innerHTML+=`
        <div id="1" class="card response-card text-dark" style="width:18rem;">
        <img src="${apiresponse[0].tracks.items[x].album.images[0].url}" class="card-img-top">
        <div class="card-body">
            <h5 class="card-title">${apiresponse[0].tracks.items[x].name}</h5>
            <p class="card-text">Uploaded By: ${apiresponse[0].tracks.items[x].artists[0].name}</p>
            <a href="${apiresponse[0].tracks.items[x].external_urls.spotify}" class="btn btn-light">Link To Song</a>
        </div>
    </div>
        `
    }
  }