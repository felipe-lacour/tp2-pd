const main = document.getElementById("main")
const songs = [
    {name: "For Whom the Bell Tolls", img:"./res/img/forwhom.png", song:"./res/audio/fwtbt.mp3"},
    {name: "The Four Horsemen", img:"./res/img/killem.png", song:"./res/audio/tfhm.mp3"},
    {name: "The Unforgiven", img:"./res/img/black.png", song:"./res/audio/unforgiven.mp3"},
    {name: "Happy Together", img:"./res/img/happytogether.png", song:"./res/audio/happy.mp3"},
    {name: "Knocking on Heaven's Door", img:"./res/img/knocking.png", song:"./res/audio/knock.mp3"},
    {name: "Somewhere Over the Rainbow", img:"./res/img/somewhere.png", song:"./res/audio/rainbow.mp3"},
    {name: "Billie Jean", img:"./res/img/billie.png", song:"./res/audio/billie.mp3"},
    {name: "Money", img:"./res/img/money.png", song:"./res/audio/money.mp3"},
    {name: "Forever Young", img:"./res/img/forever.png", song:"./res/audio/forever.mp3"},
    {name: "Comfortably Numb", img:"./res/img/comfort.png", song:"./res/audio/comfort.mp3"},
    {name: "Still Loving You", img:"./res/img/still.png", song:"./res/audio/still.mp3"},
    {name: "Toxicity", img:"./res/img/toxi.png", song:"./res/audio/toxi.mp3"}
];

let audio = document.createElement('audio');
let source = document.createElement('source');
source.type = 'audio/mp3';
audio.append(source);
audio.hidden = true;
main.appendChild(audio);

let currentSongIndex = 0;

class Header extends HTMLElement {
    constructor() {
        super();
        const header = document.createElement('header');
        header.classList.add("navbar")

        const heading = document.createElement('h1');
        heading.innerText = this.getAttribute('title') || 'Default Title';
        heading.classList.add("logo")

        const input = document.createElement("input")
        input.type = "text"
        input.classList.add("search")
        input.placeholder = "Search..."

        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterPlaylist(searchTerm);
        })

        header.appendChild(heading);
        header.append(input)

        this.innerHTML = '';
        this.appendChild(header);
    }
}

class PlaylistSection extends HTMLElement{
    constructor(){
        super();
        const container = document.createElement('section')
        container.classList.add('playlist')
        const title = document.createElement('h2')
        title.innerText = this.getAttribute('title') || 'Default playlist';
        
        if(songs.length){
            const ul = document.createElement('ul')
            ul.classList.add('song-ul')
            songs.forEach((song, index) => {
                const li = document.createElement('li')
                li.classList.add('song')
                const figure = document.createElement('figure')
                const img = document.createElement('img')
                img.src = song.img
                const songTitle = document.createElement('h3')
                songTitle.innerText = song.name

                li.addEventListener('click', () => {
                    console.log(index)
                    loadSong(index);
                })

                figure.append(img)
                li.append(figure)
                li.append(songTitle)
                ul.append(li)
            });
            container.append(title)
            container.append(ul)
        } else {

        }

        this.innerHTML = ''
        this.appendChild(container)
    }
}

class PlayBar extends HTMLElement {
    constructor() {
        super(); 
    }

    connectedCallback() {
        const container = document.createElement('section');
        const title = document.createElement('h2');
        title.innerText = this.getAttribute('title');
        const img = document.createElement('img')
        img.src = this.getAttribute('src')
        img.classList.add('img-barra')

        const controls = document.createElement('div');
        const [prev, play, next] = [
            document.createElement('button'),
            document.createElement('button'),
            document.createElement('button')
        ];

        play.classList.add('control-button')
        prev.classList.add('control-button')
        next.classList.add('control-button')

        const [imgprev, imgplay, imgnext] = [
            document.createElement('img'),
            document.createElement('img'),
            document.createElement('img')
        ];

        imgplay.src = './res/img/pause.svg'
        play.innerHTML = '';
        play.append(imgplay)

        imgprev.src = './res/img/prev.svg'
        prev.innerHTML = '';
        prev.append(imgprev)

        imgnext.src = './res/img/next.svg'
        next.innerHTML = '';
        next.append(imgnext)

        play.addEventListener('click', () => {
            if (audio.paused) {
                imgplay.src = './res/img/pause.svg'
                play.innerHTML = '';
                play.append(imgplay)
                audio.play();
            } else {
                imgplay.src = './res/img/play.svg'
                play.innerHTML = '';
                play.append(imgplay)
                audio.pause();
            }
        });

        next.addEventListener('click', () => {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            loadSong(currentSongIndex);
        });

        prev.addEventListener('click', () => {
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length; 
            loadSong(currentSongIndex);
        });

        const progressBar = document.createElement('input');
        progressBar.type = 'range';
        progressBar.min = 0;
        progressBar.max = 100;
        progressBar.value = 0;
        progressBar.classList.add('progress-bar');

        const timeDisplay = document.createElement('span');
        timeDisplay.classList.add('time-display');
        timeDisplay.innerText = '00:00';

        audio.addEventListener('timeupdate', () => {
            if(audio.currentTime == audio.duration){
                currentSongIndex = (currentSongIndex + 1) % songs.length;
                loadSong(currentSongIndex);
            }

            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.value = progressPercent || 0;

            // Update time display
            const currentMinutes = Math.floor(audio.currentTime / 60);
            const currentSeconds = Math.floor(audio.currentTime % 60);
            timeDisplay.innerText = `${String(currentMinutes).padStart(2, '0')}:${String(currentSeconds).padStart(2, '0')}`;
        });

        progressBar.addEventListener('input', () => {
            const newTime = (progressBar.value / 100) * audio.duration;
            audio.currentTime = newTime;
        });

        controls.append(prev, play, next);
        container.append(img, title, controls , progressBar, timeDisplay); // Add the slider and time display
        this.appendChild(container); 
    }
}


customElements.define('custom-header', Header);
customElements.define('playlist-section', PlaylistSection);
customElements.define('play-bar', PlayBar)


const loadSong = (index) => {
    currentSongIndex = index;
    source.src = songs[index].song;
    audio.load();
    audio.play();

    let barraExistente = document.querySelector('play-bar');
    if(barraExistente){
        barraExistente.remove();
    }

    const bar = document.createElement('play-bar');
    bar.setAttribute('title', songs[index].name);
    bar.setAttribute('src', songs[index].img)
    bar.classList.add('barra')
    main.appendChild(bar);
}

const filterPlaylist = (searchTerm) => {
    const songElements = document.querySelectorAll('.song');
    songs.forEach((song, index) => {
        const songName = song.name.toLowerCase();
        const songElement = songElements[index];

        if (songName.includes(searchTerm)) {
            songElement.style.display = "flex";
        } else {
            songElement.style.display = "none";
        }
    });
};