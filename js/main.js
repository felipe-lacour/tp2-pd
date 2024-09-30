const main = document.getElementById("main")
const songs = [
    {name: "For Whom the Bell Tolls", img:"./img/forwhom.png", song:"hola.mp3"},
    {name: "Ride the Lightning", img:"./img/forwhom.png", song:"hola.mp3"},
    {name: "For Whom the Bell Tolls", img:"./img/forwhom.png", song:"hola.mp3"},
    {name: "For Whom the Bell Tolls", img:"./img/forwhom.png", song:"hola.mp3"}
];

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
        title.innerText = this.getAttribute('title') || 'Default Title';
        
        if(songs.length){
            const ul = document.createElement('ul')
            ul.classList.add('song-ul')
            songs.forEach(song => {
                const li = document.createElement('li')
                li.classList.add('song')
                const figure = document.createElement('figure')
                const img = document.createElement('img')
                img.src = song.img
                const songTitle = document.createElement('h3')
                songTitle.innerText = song.name


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

customElements.define('custom-header', Header);
customElements.define('playlist-section', PlaylistSection);


