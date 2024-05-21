console.log("Lets write Javascript");
let currentSong = new Audio();
let songs;
let currfolder;

async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`/${folder}/`);
  //currfolder = folder;
  let response = await a.text();
  console.log(response);

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");

  songs = [];

  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".m4a")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  //play the first song
  

  let songUl = document.querySelector(".song_list").getElementsByTagName("ul")[0];
  songUl.innerHTML = ""
  for (const song of songs) {
    songUl.innerHTML = songUl.innerHTML + `<li><img class="invert" src="img/music.svg" height="17px" width="17px">
      <div class="info">
          <div>${decodeURI(song).replace("m4a", ' ')}</div>
          <div>Song Artist</div>
      </div>
      <div class ="playnow">
      <span>Play Now</span>
      <img class="invert" src="img/play.svg" alt="" srcset="" height="17px" width="17px">
      </div></li>`;
  }

  //Attach an event listener to each song
  Array.from(document.querySelector(".song_list").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      PlayMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
  })

}



function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}


const PlayMusic = (track, pause = false) => {
  currentSong.src = `/${currfolder}/` + track;
  if (!pause) {
    currentSong.play();
  }
  play.src = "img/pause.svg"
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";

}

async function displayAlbums() {

  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer")

  let  array = Array.from(anchors);
  
    for (let index = 0; index < array.length; index++) {
      const e = array[index];
      
    
    if (e.href.includes("/songs")&&!(e.href.includes(".htaccess"))) {
      let folder = (e.href.split("/").slice(-2)[1]);
      //Get the meta data of the folder
      let a = await fetch(`/songs/${folder}/info.json`)
      let response = await a.json();
      console.log(response)
      cardContainer.innerHTML = cardContainer.innerHTML + `
      <div class="card" data-folder="${folder}">
                        <div class="play"
                            style="width: 32px; height: 32px; background-color: #1fdf64; border-radius: 50%; display: flex;justify-content: center;  align-items: center;">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
                                style="width: 30px; height: 30px;">
                                <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license /free Copyright 2024 Fonticons, Inc.-->
                                <path
                                    d="M464 256A208 208 0 1 0 48 256a208 208 0 1 0 416 0zM0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c7.6-4.2 16.8-4.1 24.3 .5l144 88c7.1 4.4 11.5 12.1 11.5 20.5s-4.4 16.1-11.5 20.5l-144 88c-7.4 4.5-16.7 4.7-24.3 .5s-12.3-12.2-12.3-20.9V168c0-8.7 4.7-16.7 12.3-20.9z" />
                            </svg>
                        </div>
                        <img src="songs/${folder}/cover.png">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>
`

    }
  }

  Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item =>{
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      
    })
  })


}

async function main() {

  //get the list of all songs
  await getSongs("songs/cs");
  PlayMusic(songs[0], true)
  console.log(songs);

  //display all the albums on the page
  displayAlbums();

  //Attach event listener to play , next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    }
    else {
      currentSong.pause()
      play.src = "img/play.svg";
    }
  })

  //listen for time update
  currentSong.addEventListener("timeupdate", () => {
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML = secondsToMinutes(currentSong.currentTime, currentSong.duration);
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  })

  //add an event listner to seekbar
  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100;
  })

  //Add an event listener for Hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
    document.querySelector(".close").style.display = "block";
  })

  //add event listener for close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-550px";
  })

  //add an event listner for previous and next

  previous.addEventListener("click", () => {
    console.log("Previous Clicked")
    // console.log(currentSong);
    console.log(songs);

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])

    if ((index - 1) >= 0) {
      PlayMusic(songs[index - 1]);
    }
  })

  next.addEventListener("click", () => {
    console.log("Next Clicked")

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
      PlayMusic(songs[index + 1]);
    }
  })

  //add an event to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log(e, e.target.value);//out of 100
    currentSong.volume = parseInt(e.target.value) / 100;

  })

  //load the playlist whenever chard is clicked
  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      //PlayMusic(songs[0]);

    })
  })

  //add event listner to mute the tag
  document.querySelector(".volume>img").addEventListener("click",e=>{
    //console.log(e.target);
    if(e.target.src.includes("img/volume.svg")){
     e.target.src= e.target.src.replace("img/volume.svg","img/mute.svg");
      currentSong.volume =0;
      document.querySelector(".range").getElementsByTagName("input")[0].value =0;
    }
    else{
     e.target.src= e.target.src.replace("img/mute.svg","img/volume.svg");
      currentSong.volume = 0.10;
      document.querySelector(".range").getElementsByTagName("input")[0].value =10;
    }

  })

}

main()
