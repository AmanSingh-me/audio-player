import { mainContainer, uploadBtn, audioElement, volumeSlider } from "./variables.js";

import { uploadFiles, playAudio, pauseAudio, playPrevious, playNext, rewindAudio, forwardAudio, changeAudioVolume, updateTimline_Bar, showMusic_Playlist } from "./functions.js";


mainContainer.addEventListener('click', getTargeted_Element);

// handle click event from music player
function getTargeted_Element(EVENT) {
    let trgt = EVENT.target;

    switch (trgt.getAttribute('alt')) {
        case "play": playAudio()
            break;
        case "pause": pauseAudio()
            break;
        case "skip-to-previous": playPrevious()
            break;
        case "skip-to-next": playNext()
            break;
        case "rewind-audio": rewindAudio()
            break;
        case "forward-audio": forwardAudio()
            break;
        case 'music-library': showMusic_Playlist();
    }
}

volumeSlider.addEventListener('input', changeAudioVolume)


uploadBtn.addEventListener('change', function () { // with this we can pass arguments to event listeners function
    uploadFiles(uploadBtn.files)
});

audioElement.addEventListener('timeupdate', updateTimline_Bar);
audioElement.addEventListener('ended', playNext)



