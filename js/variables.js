const body = document.querySelector('body');
const mainContainer = document.querySelector('.main');
const musicTitle = document.querySelector('.music-title')
const music_CoverImage = document.querySelector('.music-cover-image')
const uploadBtn = document.getElementById('upload-btn');
const musicTimeline_Bar = document.querySelector('.music-timeline > progress');
const music_CurrentTime = document.querySelector('.current-time');
const music_TotalTime = document.querySelector('.total-time');
const volumeSlider = document.querySelector('.volume-slider')

const audioFiles_Uploaded = []; // contains file object
const allAudio_Name_Id = [];

//--- Contains all details of currently playing Audio
const currently_PlayingAudio = {
    id: -1,
    _name: undefined,
    playState: 'pause', // default play state

    
    get audioId(){
        return this.id
    },

    get audioName(){
        return this._name
    },

    changeName_Id: function(ID){
        this.id = ID;
        this._name = audioFiles_Uploaded[ID].name;
    },

    changePlayState: function (STATE, ICON) {
        this.playState = STATE;
        let btn = document.querySelector('.media-player-btns img:nth-child(3)');
        btn.setAttribute('src', `/assets/${ICON}-btn.svg`);
        btn.setAttribute('alt', ICON);
    },

    update_MusicCover_Anim: function () {
        if (this.playState === 'play') {
            music_CoverImage.classList.replace('audio-pause', 'audio-play')
        } else {
            music_CoverImage.classList.replace('audio-play', 'audio-pause')
        }
    }
    
}

const audioElement = new Audio();

// --------------------------------------------------------------------------------------------------

export { body, mainContainer, musicTitle, uploadBtn, audioFiles_Uploaded, allAudio_Name_Id, audioElement, currently_PlayingAudio, musicTimeline_Bar, music_CurrentTime, music_TotalTime, volumeSlider  }