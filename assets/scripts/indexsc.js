
//Variables & constants
let li1 = document.getElementById("li1");
let li2 = document.getElementById("li2");
let create_input = document.createElement("input");
let create_input2 = document.createElement("input");
let title_ul = document.getElementById("title_ul");
let coverart_frame = document.getElementById("coverart_frame");
// eslint-disable-next-line no-unused-vars
let coverart_div = document.getElementById("coverart_div");
let htmlsearchresults = document.getElementById("htmlsearchresults");
let createbr = document.createElement("br");

const time = new Date();
let access_token = "";
let apiresponse = [];
let searchresults = [];
let numberofsearches = 1;

window.addEventListener("load", () => {
  getauth();
});

create_input.addEventListener(
  "keypress",
  (event) => {
    if (event.key == "Enter") {
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
              "https://accounts.spotify.com/en/authorize?response_type=token&client_id=9bf2e0b5a7284542864ee9109927b0a1&redirect_uri=https://projectstorage.xyz&show_dialog=true&scope=user-top-read%20user-read-private%20user-read-playback-state",
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
    }
  },
  false
);

create_input2.addEventListener(
  "keypress",
  (event) => {
    if (event.key == "Enter") {
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
              "https://accounts.spotify.com/en/authorize?response_type=token&client_id=9bf2e0b5a7284542864ee9109927b0a1&redirect_uri=https://projectstorage.xyz&show_dialog=true&scope=user-top-read%20user-read-private%20user-read-playback-state",
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
    }
  },
  false
);
//Functions
create_input.placeholder = "<ENTER RESPONSE HERE>";
create_input.id = "user_response";
create_input.type = "text";
create_input.formMethod = "GET";

create_input2.placeholder = "NUMBER OF RESULTS";
create_input2.id = "number_of_results";
create_input2.type = "text";

function getauth() {
  var str = window.location.href;
  if (str.includes("access_token")) {
    access_token = str.substring(str.indexOf("access_token") + 13);
    access_token = access_token.split("&")[0];
    title();
  } else {
    window.open(
      "https://accounts.spotify.com/en/authorize?response_type=token&client_id=9bf2e0b5a7284542864ee9109927b0a1&redirect_uri=https://projectstorage.xyz&show_dialog=true&scope=user-top-read%20user-read-private%20user-read-playback-state",
      "_self"
    );
  }
}

function title() {
  li1.innerText =
    // eslint-disable-next-line no-undef
    months[time.getMonth()] +
    "_" +
    time.getDay() +
    "_" +
    time.getFullYear() +
    "_";
  setTimeout(() => {
    li1.innerText = "WELCOME, [USER]";
    setTimeout(() => {
      li2.innerText = "PLEASE ENTER YOUR DESIRED ARTIST: ";
      setTimeout(() => {
        title_ul.appendChild(create_input);
        title_ul.appendChild(create_input2);
      }, 1000);
    }, 2000);
  }, 2000);
}

function responsetohtml() {
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
      coverart_frame.src = searchresults[temp].album.images[0].url;
      coverart_frame.style.visibility = "visible";
      // eslint-disable-next-line no-undef
      $("#coverart_frame").wrap(
        "<a href=" +
          "'" +
          searchresults[temp].external_urls.spotify +
          "'" +
          " target='_blank'" +
          "</a>"
      );

      console.log(temp);
      playaudio(temp);
    });
  }
}

function playaudio(index) {
  document.querySelectorAll("audio").forEach((el) => el.pause());
  document.getElementById("audio_" + index).play();
}

function APICall (query){
  apiresponse = [];
  console.warn(query);
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
          "https://accounts.spotify.com/en/authorize?response_type=token&client_id=9bf2e0b5a7284542864ee9109927b0a1&redirect_uri=https://projectstorage.xyz&show_dialog=true&scope=user-top-read%20user-read-private%20user-read-playback-state",
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
    })
    .catch(function (err) {
      console.warn("Something went wrong.", err);
    });
}