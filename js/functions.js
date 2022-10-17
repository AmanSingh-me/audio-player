import { body, musicTitle, audioFiles_Uploaded, allAudio_Name_Id, currently_PlayingAudio, audioElement, musicTimeline_Bar, music_CurrentTime, music_TotalTime } from "./variables.js";

let audioFiles_Not_Uploaded = 0;


// It handles the files uploaded by user
function uploadFiles(FILES) {
    let files = FILES;
    let totalFiles = audioFiles_Uploaded.length
    for (const key in files) {
        if (files.hasOwnProperty(key)) {
            let fileName = files[key].name;
            let fileExt = fileName.slice(fileName.lastIndexOf('.'), fileName.length); // audio format

            // filtered the supported extension
            if (fileExt === '.mp3' || fileExt === '.m4a' || fileExt === '.wav') {
                audioFiles_Uploaded.push(files[key]);
                allAudio_Name_Id.push({ audioName: files[key].name, id: audioFiles_Uploaded.length - 1 }); // id is set to length - 1 to get the updated audio Id, even when audio is uploaded again
            } else {
                audioFiles_Not_Uploaded++;
            }
        }
    }
    if (totalFiles === 0) {
        musicTitle.textContent = audioFiles_Uploaded[0].name
    }
    showMusic_Playlist();
}

// play audio
function playAudio(AUDIO_ID) {
    if (have_Error()) return;

    function setAudio_Detail(ID) {
        audioElement.src = createAudio_Url(ID);
        currently_PlayingAudio.changeName_Id(ID);
        musicTitle.textContent = currently_PlayingAudio.audioName;
        audioElement.onloadeddata = () => { music_TotalTime.textContent = readable_AudioTime(audioElement.duration) }
    }

    // If audioId is not changed then it's skipped
    if (currently_PlayingAudio.audioId !== AUDIO_ID && AUDIO_ID !== undefined) {
        AUDIO_ID === undefined ? setAudio_Detail(0) : setAudio_Detail(AUDIO_ID)
    } else if (currently_PlayingAudio.audioId === -1){ // for very first time default audio
        setAudio_Detail(0)
    }
    
    audioElement.play();
    currently_PlayingAudio.changePlayState("play", "pause");
    currently_PlayingAudio.update_MusicCover_Anim();
}

// pause audio
function pauseAudio() {
    audioElement.pause();
    currently_PlayingAudio.changePlayState("pause", "play");
    currently_PlayingAudio.update_MusicCover_Anim();
}

// rewind audio
function rewindAudio(TIME = 15) {
    if (have_Error()) return;

    audioElement.currentTime -= TIME;
}

// forward audio
function forwardAudio(TIME = 15) {
    if (have_Error()) return;
    audioElement.currentTime += TIME;

}

// play previous audio
function playPrevious() {
    if (have_Error()) return;

    let previous_AudioId = currently_PlayingAudio.audioId - 1;
    if (previous_AudioId <= 0) {
        playAudio(0);
    } else {
        playAudio(previous_AudioId);
    }
}

// play next audio
function playNext() {
    if (have_Error()) return;

    let next_AudioId = currently_PlayingAudio.audioId + 1;
    if (next_AudioId > audioFiles_Uploaded.length - 1) { // played all files & restarting it from 0
        currently_PlayingAudio.id = -1;
        playAudio(0);
    } else {
        playAudio(next_AudioId);
    }
}

// create audio URL of provided audio file
function createAudio_Url(AUDIO_ID) {
    let audioUrl = URL.createObjectURL(audioFiles_Uploaded[AUDIO_ID])
    return audioUrl;
}

// updates current audio duration & timeline bar
function updateTimline_Bar() {
    try {
        music_CurrentTime.textContent = readable_AudioTime(audioElement.currentTime);
        musicTimeline_Bar.value = Math.trunc(audioElement.currentTime) * (100 / audioElement.duration);
    } catch (error) {
        audioElement.play()
    }
}

//change volume
function changeAudioVolume(event) {
    let sliderValue = Number(event.target.value);
    audioElement.volume = sliderValue / 10; // max value of volume-slider is 10
}

//--- Create Readable time of currently playing Audio
function readable_AudioTime(TIME) {
    let timeIn_Sec = Math.trunc(TIME);
    let min = Math.trunc(timeIn_Sec / 60);
    let sec = Math.abs((min * 60) - timeIn_Sec);

    // for seconds
    if (sec < 10) {
        sec = `0${sec}`
    }
    // for minutes
    if (min < 10) {
        min = `0${min}`
    }

    return `${min}:${sec}`
}

function showMusic_Playlist() {
    if (have_Error()) return;
    let div = document.createElement('div');
    div.classList.add('popup-layer')

    let child_Div1 = document.createElement('ul');
    child_Div1.classList.add('list');
    div.append(child_Div1);

    body.addEventListener('click', getActionFrom_MusicPlaylist)

    allAudio_Name_Id.forEach((data, index) => {
        let li = document.createElement('li');
        li.setAttribute('audioId', data.id)
        li.textContent = data.audioName;
        child_Div1.append(li);
        if (currently_PlayingAudio.audioId === data.id) {
            li.style.cssText = `background: #2f3255; border-style: solid;`
        }

    })
    body.append(div)
}

// changes the audio from playlist
function getActionFrom_MusicPlaylist(event) {
    let trgt = event.target;
    if (trgt.classList.contains('popup-layer')) {
        trgt.remove();
    } else if (trgt.getAttribute('audioId') !== null) {
        let id = Number(trgt.getAttribute('audioId'));
        playAudio(id);
        document.querySelector('.popup-layer').remove();
    }
}

// return true if error else false
function have_Error() {
    if (audioFiles_Uploaded.length > 0) {
        musicTitle.style.cssText = `transform: translateX(100%);
  animation: scroll-left 18s linear infinite;`
        return false
    } else {
        swal("Oops!", "No Audio File Exists", "error")
        return true
    }
}

export { uploadFiles, playAudio, pauseAudio, playPrevious, playNext, rewindAudio, forwardAudio, changeAudioVolume, updateTimline_Bar, showMusic_Playlist }
