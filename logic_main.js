const welcomeMsg = document.getElementById("welcomeMsg");
const welcomeMsg2 = document.getElementById("welcomeMsg2");
const spotify_btn = document.getElementById("option_spotify");
const logged_out_btn = document.getElementById("option_logged_out");
window.addEventListener("load", () => {
  typeWriter(welcomeMsg, 100, "Welcome!");
  sleep(3000)
    .then(() => {
      typeWriter(welcomeMsg2, 100, "Please select a mode:");
    })
    .then(() => {
      sleep(3000)
        .then(() => {
          typeWriter(spotify_btn, 100, "Spotify");
        })
        .then(() => {
          sleep(3000).then(() => {
            typeWriter(logged_out_btn, 100, "Spotify (Logged out, limited functionality)");
          });
        });
    });
});

async function typeWriter(target,speed,finalText){
    for(let x=0;x<finalText.length;x++){
        target.innerHTML+=finalText.charAt(x)
        await sleep(speed)
    }
}


//Native sleep function !?!?!?!?!? (Code from https://www.sitepoint.com/delay-sleep-pause-wait/)
//Yes, I could've just used setTimeout(), but this allows me to use it inside an async function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
