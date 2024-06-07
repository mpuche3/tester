console.log("Running main.js")

const playbackRate = 0.8
const tracks = get_tracks()
const BXXX = get_BXXX(tracks)
const CXXX = get_CXXX(tracks)
const audios = []
let itracks = 0
let isRepeat = true
let audio = document.createElement('audio'); 
let wantFullScreenMode = true;
update_title(itracks)

function get_BXXX(){
    const BXXX = {}
    for (const track of tracks){
        const ans = track["audioFileFullPath"].split("/").slice(-1)[0].split("_")[0]
        const book = ans.slice(0, 4)
        const chapter = ans.slice(4, 8)
        const sentence = ans.slice(8, 12)
        if (chapter === "C000"){
            if (sentence === "S000"){
                BXXX[book] = track["tran"].replace(".", "")
            }
        }
    }
    return BXXX
}

function get_CXXX(tracks){
    const CXXX = {}
    for (const track of tracks){
        const ans = track["audioFileFullPath"].split("/").slice(-1)[0].split("_")[0]
        const book = ans.slice(0, 4)
        const chapter = ans.slice(4, 8)
        const sentence = ans.slice(8, 12)
        if (sentence === "S000"){
            if (chapter === "C000"){
                CXXX[book + chapter] = "ᵻ̀ntrədʌ́kʃən"
            } else {
                CXXX[book + chapter] = track["tran"].replace(".", "")
            }
        }
    }
    return CXXX
}

function* enumerate(iterable) {
    let index = 0;
    for (const item of iterable) {
      yield [index, item];
      index++;
    }
}

function get_text(url){
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    text = xhr.responseText;
    return text
}

function get_tracks_from_json(url) {
    const text = get_text(url)
    const tracks = JSON.parse(text);
    return tracks
}

function get_tracks_from_text(url) {
    const tracks = []
    const text = get_text(url)
    const sentences = text.replaceAll("\n\n", "\n").split("\n")
    let book = ""
    let chapter = ""
    let first_index_book = 0    
    for (const [index, sentence] of enumerate(sentences)){
        if (sentence.trim() !== ""){
            if(sentence.slice(0, 2) === "B0") {
                book = sentence.slice(0, 4)
                chapter = sentence.slice(4, 8)
                first_index_book = index              
            }
            const sentence_ = `S${Math.floor(index - first_index_book).toString().padStart(3, '0')}`
            const audioFileFullPath =  `./audio/books/${book}/${book}${chapter}${sentence_}_echo.mp3`
            const tran = sentence.slice(0, 2) === "B0"
                ? sentence.slice(10, undefined)
                : sentence
            tracks.push({
                "audioFileFullPath": audioFileFullPath,
                "tran": tran,
            })
        }
    }
    return tracks
}

function get_tracks(){
    const urls = [
        "./transcriptions/books/B001/B001_TRANS_ALL.txt",
        "./transcriptions/books/B002/B002_TRANS_ALL.txt",
        "./transcriptions/books/B009/B009_TRANS_ALL.txt",
    ]
    let tracks = []
    for (const url of urls) {
        const new_tracks = get_tracks_from_text(url)
        tracks = tracks.concat(new_tracks)
    }
    return tracks
}

function update_title() {
    const text = tracks[itracks]["tran"]
    const ans = tracks[itracks]["audioFileFullPath"].split("/").slice(-1)[0].split("_")[0]
    const book = ans.slice(0, 4)
    const chapter = ans.slice(4, 8)
    const sentence = ans.slice(8, 12)
    document.querySelector("#book_title").innerHTML = BXXX[book]
    document.querySelector("#chapter_title").innerHTML = CXXX[book + chapter]
    document.querySelector("#sentence_title").innerHTML = book + "" + chapter + "" + sentence
    document.querySelector("#text").innerHTML = `${text}`
}

function runAfterAudioEnded() {
    setTimeout(function () {
        if (isRepeat === false){
            itracks += 1
        }
        play()
    }, 600)
}

function play(){
    update_title();
    if (document.querySelector("#sound").innerHTML === "🕪") {
        const audioFileFullPath = tracks[itracks]["audioFileFullPath"];
        const audio = new Audio(audioFileFullPath);
        audio.playbackRate = playbackRate;
        audios.map(audio => {
            audio.pause();
        })
        audio.play()
        audios.push(audio)
        audio.addEventListener("ended", runAfterAudioEnded)        
    };
}

function pause_play() {
    document.querySelector("#sound").innerHTML = "🔇"
    audios.map(audio => {
        audio.pause();
    })
}

function getBook(itracks){
    const book = tracks[itracks]["audioFileFullPath"].split("/").slice(-1)[0].split("_")[0].slice(0, 4)
    return book
}

function getChapter(itracks){
    const chapter = tracks[itracks]["audioFileFullPath"].split("/").slice(-1)[0].split("_")[0].slice(4, 8)
    return chapter
}

function getSentence(itracks){
    const sentence = tracks[itracks]["audioFileFullPath"].split("/").slice(-1)[0].split("_")[0].slice(8, 12)
    return sentence
}

function book_up(){
    const current_book = getBook(itracks)
    let next_itracks = itracks
    while (next_itracks < tracks.length - 1){
        next_itracks += 1
        const next_book = getBook(next_itracks)
        const next_chapter = getChapter(next_itracks)
        const next_sentence = getSentence(next_itracks)
        if (current_book !== next_book && "S000" === next_sentence && "C000" === next_chapter){
            itracks = next_itracks
            play()
            return
        }
    }
}

function book_down(){
    const current_book = getBook(itracks)
    let next_itracks = itracks
    while (0 < next_itracks){
        next_itracks -= 1
        const next_book = getBook(next_itracks)
        const next_chapter = getChapter(next_itracks)
        const next_sentence = getSentence(next_itracks)
        if (current_book !== next_book && "S000" === next_sentence && "C000" === next_chapter){
            itracks = next_itracks
            play()
            return
        }
    }
}

function chapter_up(){
    const current_book = getBook(itracks)
    const current_chapter = getChapter(itracks)
    let next_itracks = itracks
    while (itracks < tracks.length - 1){
        next_itracks += 1
        const next_book = getBook(next_itracks)
        const next_chapter = getChapter(next_itracks)
        if (current_book !== next_book){ return }
        if (current_chapter !== next_chapter){
            itracks = next_itracks
            play()
            return
        }
    }
}

function chapter_down(){
    const current_book = getBook(itracks)
    const current_chapter = getChapter(itracks)
    let next_itracks = itracks
    while (0 < next_itracks){
        next_itracks -= 1
        const next_book = getBook(next_itracks)
        const next_chapter = getChapter(next_itracks)
        const next_sentence = getSentence(next_itracks)
        if (current_book !== next_book){ return }
        if (current_chapter !== next_chapter && "S000" === next_sentence){
            itracks = next_itracks
            play()
            return
        }
    }
}

function sentence_up(){
    const current_book = getBook(itracks)
    const current_chapter = getChapter(itracks)
    const current_sentence = getSentence(itracks)
    let next_itracks = itracks
    while (itracks < tracks.length - 1){
        next_itracks += 1
        const next_book = getBook(next_itracks)
        const next_chapter = getChapter(next_itracks)
        const next_sentence = getSentence(next_itracks)
        if (current_book !== next_book){ return }
        if (current_chapter !== next_chapter){ return }
        if (current_sentence !== next_sentence){
            itracks = next_itracks
            play()
            return
        }
    }
}

function sentence_down(){
    const current_book = getBook(itracks)
    const current_chapter = getChapter(itracks)
    const current_sentence = getSentence(itracks)
    let next_itracks = itracks
    while (0 < next_itracks){
        next_itracks -= 1
        const next_book = getBook(next_itracks)
        const next_chapter = getChapter(next_itracks)
        const next_sentence = getSentence(next_itracks)
        if ("S000" === current_sentence){ return }
        if (current_book !== next_book){ return }
        if (current_chapter !== next_chapter){ return }
        if (current_sentence !== next_sentence){
            itracks = next_itracks
            play()
            return
        }
    }
}

function next_track(){
    itracks += 1;
    if (itracks === tracks.length) {
        itracks = tracks.length - 1
    } else {
       play(); 
    };
}

document.querySelector("#text_mode").addEventListener("click", function () {
    if (this.innerHTML === "æ") {
        this.innerHTML = "a";
    } else {
        this.innerHTML = "æ";
    }
})

document.querySelector("#operation_mode").addEventListener("click", function () {
    if (this.innerHTML === "⟲") {
        this.innerHTML = "→";
        isRepeat = false
    } else {
        this.innerHTML = "⟲";
        isRepeat = true
    }
})

document.querySelector("#sound").addEventListener("click", function () {
    if (this.innerHTML === "🕪") {
        this.innerHTML = "🔇";
        pause_play()
    } else {
        this.innerHTML = "🕪";
        isRepeat = true
        play()
    }
})

document.querySelector("#text").addEventListener("click", function () {
    next_track()
})

document.querySelector("#max_min").addEventListener("click", function () {
    if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen();
      }
})

document.addEventListener("fullscreenchange", function () {
    if (document.fullscreenElement) {
      document.querySelector("#max_min").innerHTML = "-"
    } else {
      document.querySelector("#max_min").innerHTML = "⤢"
    }
});

window.addEventListener('resize', () => {
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    for (const id of ["top", "book", "chapter", "sentence"]){
        if (screenWidth > screenHeight * 1.6) {
            document.querySelector(`#${id}-row`).style.display = 'none'; 
        } else {
            document.querySelector(`#${id}-row`).style.display = 'flex';
        }
    }
});

function navegation_functionality(elementId, func){
    let startTime = 0;
    document.querySelector(`#${elementId}`).addEventListener("click", event => {
        func()
        if (startTime === 0) {
            startTime = new Date().getTime();
        } else {
            const endTime = new Date().getTime();
            const timeDiff = endTime - startTime;
            let repeat = 0
            if (timeDiff < 150) {repeat = 19}
            if (timeDiff < 250) {repeat = 9}
            const range = Array.from({ length: repeat })
            for (const _ of range) {
                func()
            }
            startTime  = endTime
        }
    })
}
// navegation_functionality("book_up", book_up)
// navegation_functionality("book_down", book_down)
navegation_functionality("chapter_up", chapter_up)
navegation_functionality("chapter_down", chapter_down)
// navegation_functionality("sentence_up", sentence_up)
// navegation_functionality("sentence_down", sentence_down)
document.querySelector("#book_up").addEventListener("click", book_up)
document.querySelector("#book_down").addEventListener("click", book_up)
document.querySelector("#sentence_up").addEventListener("click", sentence_up)
document.querySelector("#sentence_down").addEventListener("click", sentence_down)

