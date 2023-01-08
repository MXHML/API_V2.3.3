const title_ul = document.getElementById("title_ul");
const welcome_msg = document.getElementById("welcome_msg");
const warning_msg = document.getElementById("info-warning1");
const user_response = document.getElementById("user_response");
const number_of_results = document.getElementById("number_of_results");

document.addEventListener("load",()=>{

})

async function pageLoad(){
    typeWriter(welcome_msg,100,"Welcome!").then(()=>{
        sleep(1000).then(()=>{
            typeWriter(warning_msg,100,"Warning: Being signed out leaves limited functionality. Sign in for more options.").then(()=>{
                sleep(1000).then(()=>{
                    user_response.style.visibility="visible";number_of_results.style.visibility="visible"
                })
            })
        })
    })
}

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