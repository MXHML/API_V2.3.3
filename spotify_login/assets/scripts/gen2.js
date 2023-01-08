const name_wrapper = document.getElementById("name-wrapper");
const search_textbox = document.getElementById("search_textbox")
const results_amount_tb = document.getElementById("results_ammount_tb")
const content_wrapper = document.getElementById("content-wrapper");

let apiresponse=[];
let access_token=""

$(document).ready(()=>{ //When the document is ready
    getauth() //Gets the authentication token returned from Spotify
    $("#content-wrapper").hide(); //Hiding the main content, so it doesn't overlap with my username fade
    sleep(1000).then(()=>{ //Sleep for 1000ms, see sleep() function
        $("#name-wrapper").fadeOut("slow") //jQuery fadeOut() function
    }).then(()=>{ //Async functions!!!!!!!!
        sleep(1000).then(()=>{ //Sleep for another 1000ms
                $("#content-wrapper").fadeTo(400,1) //Fade in for 400ms to 1 opacity
        })
    })
})

search_textbox.addEventListener("click",()=>{
    move(document.getElementById("content-wrapper")) //Moves the content div to the top when clicked
})


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms)); //Creates a promise for the setTimeout
  }                                                         //(Yes, I could've used a regular setTimeout, but this allows me to use it inside a function, and use .then() after it.)

 //https://stackoverflow.com/questions/54571974/css-keyframe-to-animate-element-to-top-of-page
  function move(e) {
    e.style.top = e.offsetTop + "px"; //Moves element to top of page
    e.classList.add('element-up');
  }

search_textbox.addEventListener("keypress",(event)=>{
        if(event.key=="Enter"){ //Checks for the "enter" keyevent
            let temp=search_textbox.value.replace(' ','%20') //Removes spaces and replaces them for %20, so the API request isn't malformed
            console.log("Starting...") //Debug
            APICall(`search?q=${temp}&type=track&limit=${results_amount_tb.value}`,apiresponse,()=>{console.log("Done!")}) //Call the API, push the response to apiresponse, then log ("Done!")
        }
    }
)

results_amount_tb.addEventListener("keypress",(event)=>{ //Same as the one above, just accounting for people pressing enter on either box
    if(event.key=="Enter"){
        console.log("Starting...")
        APICall(`search?q=${search_textbox.value}&type=track&limit=${results_amount_tb.value}`,apiresponse,()=>{responseConversion().then((data)=>{NameChecker()
        })})
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
        if (response.status === 401) { //If response is good
          window.open(
            "https://accounts.spotify.com/en/authorize?response_type=token&client_id=9bf2e0b5a7284542864ee9109927b0a1&redirect_uri=http://127.0.0.1:5500/spotify_login/index.html&show_dialog=true&scope=user-top-read%20user-read-private%20user-read-playback-state",
            "_self"
          );
        }
        if (response.ok) {
          return response.json();
        } else { //If response is bad
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
    var str = window.location.href; //The window's URL
    if (str.includes("access_token")) { //If it includes "access_token", then continue
      access_token = str.substring(str.indexOf("access_token") + 13); //Get the index of where the token ends
      access_token = access_token.split("&")[0]; //Split the string at "&" (Where the token starts) to the end of the string
    } else {
      window.open( //If "access_token" is not found, reauthorize the user through Spotify
        "https://accounts.spotify.com/en/authorize?response_type=token&client_id=f6db8902d1a94c1a854359ab73e38d0d&redirect_uri=http://127.0.0.1:5500/spotify_login/index.html&show_dialog=true&scope=user-top-read%20user-read-private%20user-read-playback-state",
        "_self"
      );
    }
  }

async function responseConversion(){
    for(let x=0;x<apiresponse[0].tracks.items.length;x++){
        content_wrapper.innerHTML+=`
        <div id="${x}" class="card response-card text-dark" style="width:18rem;">
        <img src="${apiresponse[0].tracks.items[x].album.images[0].url}" class="card-img-top">
        <div class="card-body">
            <h5 id="card_title_${x}"class="card-title">${apiresponse[0].tracks.items[x].name}</h5>
            <p class="card-text">Uploaded By: ${apiresponse[0].tracks.items[x].artists[0].name}</p>
            <a href="${apiresponse[0].tracks.items[x].external_urls.spotify}" class="btn btn-light" target="_self">Link To Song</a>
        </div>
    </div>
        `
    }
    Promise.resolve("done");

}

async function TitleClear(index){ //Async function so ScrollConverter only proceeds when the innerHTML is cleared. 
  let target = document.getElementById(`card_title_${index}`); //Getting the target element
  target.innerHTML=''; //Clear the innerHTML of target
  if(target.innerHTML==''){ 
    Promise.resolve("done") //Rechecking if the element is cleared, and if so, fufilling the promise
  }else{
    console.error(`TitleClear: Title unable to be cleared!: Index ${target}`) //If it's still not cleared, reject the promise and return what is inside of the element.
    Promise.reject(target.innerHTML);
  }
}

function ScrollConverter(index){
  index = index.toString(); //So that you can enter a float instead of a string each time. (Ex. ScrollConverter(6), instead of ScrollConverter("6"))
  let target =document.getElementById(`card_title_${index}`) //Setting the target
  console.log(target) //Debug
  TitleClear(index.toString()).then((value)=>{console.log("Promise Fufilled...");target.innerHTML=`<marquee scrollamount="5" behavior="scroll" direction="left">${apiresponse[0].tracks.items[index].name}</marquee>`},(error)=>{
    console.log(error) //If the promise is fufilled, then change the innerHTML of the element to a <marquee> element. If not, then return the error
  })
}

function NameChecker(){
  for(let x=0;x<apiresponse[0].tracks.items.length;x++){ //Loop through all of the returned items
    if(apiresponse[0].tracks.items[x].name.length>23){ //If the length is greater than 23, convert it to scrolling text.
      ScrollConverter(x)
    }else{
      console.log("Not out of bounds!")
    }
  }
}