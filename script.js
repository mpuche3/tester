console.log("Running main.js")
// Todo: Button toggle spelling/transcription
// Todo: Button help
// Todo: Button Choose a Book | Choose a Chapter | Choose a Sentence

const playbackRate = 0.8
const filters = get_filters()
const tracks = get_tracks()
const iBXXX = get_iBXXX(tracks)
const iBXXXCXXX = get_iBXXXCXXX(tracks)
const numOfSentences = get_numOfSentences()
const iBXXXCXXXSXXX = get_iBXXXCXXXSXXX(tracks)


const audios = []
let itracks = 0
let isRepeat = true
let audio = document.createElement('audio'); 
let wantFullScreenMode = true;
update_title(itracks)

function get_numOfSentences(){
    const numOfSentences = {}
    for (const track of tracks){
        const ans = track["audioFileFullPath"].split("/").slice(-1)[0].split("_")[0]
        const book = ans.slice(0, 4)
        const chapter = ans.slice(4, 8)
        numOfSentences[book + chapter] = numOfSentences[book + chapter] ?? 0
        numOfSentences[book + chapter] += 1
    }
    return numOfSentences
}

function openInNewTab(url) {
    let newTab = document.createElement('a');
    newTab.href = url;
    newTab.target = "_blank";
    newTab.click();
}

function get_filters(){
    const url = "./filters/filters.txt"
    const filters_text = get_text(url)
    return filters_text.split("\n").filter(line => {
        return line.slice(0, 3) === "[o]"
    }).reduce((acc, line) => {
        const BXXXCXXX = line.slice(4, 12)
        acc[BXXXCXXX] = line
        return acc
    }, {})
}

function get_iBXXX(){
    const iBXXX = {}
    for (const [iTrack, track] of enumerate(tracks)){
        const ans = track["audioFileFullPath"].split("/").slice(-1)[0].split("_")[0]
        const book = ans.slice(0, 4)
        const chapter = ans.slice(4, 8)
        const sentence = ans.slice(8, 12)
        if (chapter === "C000"){
            if (sentence === "S000"){
                iBXXX[book] = iTrack
            }
        }
    }
    return iBXXX
}

function get_iBXXXCXXX(tracks){
    const iBXXXCXXX = {}
    for (const [iTrack, track] of enumerate(tracks)){
        const ans = track["audioFileFullPath"].split("/").slice(-1)[0].split("_")[0]
        const book = ans.slice(0, 4)
        const chapter = ans.slice(4, 8)
        const sentence = ans.slice(8, 12)
        if (sentence === "S000"){
            iBXXXCXXX[book + chapter] = iTrack
        }
    }
    return iBXXXCXXX
}

function get_iBXXXCXXXSXXX(tracks){
    const iBXXXCXXXSXXX = {}
    for (const [iTrack, track] of enumerate(tracks)){
        const ans = track["audioFileFullPath"].split("/").slice(-1)[0].split("_")[0]
        const book = ans.slice(0, 4)
        const chapter = ans.slice(4, 8)
        const sentence = ans.slice(8, 12)
        iBXXXCXXXSXXX[book + chapter + sentence] = iTrack
    }
    return iBXXXCXXXSXXX
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
            if (filters[book + chapter] !== undefined){
                tracks.push({
                    "audioFileFullPath": audioFileFullPath,
                    "tran": tran,
                })
            }

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

function addOneToNumber(numStr) {
    let num = parseInt(numStr);
    num++;
    if (num < 10) {
        return '0' + num;
    } else {
        return num.toString();
    }
}

function update_title() {
    const text = tracks[itracks]["tran"]
    const ans = tracks[itracks]["audioFileFullPath"].split("/").slice(-1)[0].split("_")[0]
    const book = ans.slice(0, 4)
    const chapter = ans.slice(4, 8)
    const sentence = ans.slice(8, 12)
    document.querySelector("#book_title").innerHTML = tracks[iBXXX[book]].tran.replace(".", "")
    document.querySelector("#chapter_title").innerHTML = tracks[iBXXXCXXX[book + chapter]].tran.replace(".", "")
    document.querySelector("#sentence_number").innerHTML = addOneToNumber(sentence.slice(-2, undefined))
    document.querySelector("#sentence_total_number").innerHTML = numOfSentences[book + chapter]
    document.querySelector("#text").innerHTML = `${text}`
    if (chapter === "C000") {
        document.querySelector("#chapter_title").innerHTML = "ᵻ̀ntrədʌ́kʃən"
    }
}

function runAfterAudioEnded() {
    setTimeout(function () {
        if (document.querySelector("#operation_mode").innerHTML !== "⟲"){
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
        this.innerHTML = "æ";
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
        this.style.filter = 'grayscale(20%)'
        pause_play()
    } else {
        this.innerHTML = "🕪";
        this.style.filter = 'grayscale(100%)'
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
navegation_functionality("chapter_up", chapter_up)
navegation_functionality("chapter_down", chapter_down)
document.querySelector("#book_up").addEventListener("click", book_up)
document.querySelector("#book_down").addEventListener("click", book_down)
document.querySelector("#sentence_up").addEventListener("click", sentence_up)
document.querySelector("#sentence_down").addEventListener("click", sentence_down)

document.querySelector("#kindle").addEventListener("click", function () {
    const url = "https://www.amazon.co.uk/brief-history-Artificial-Intelligence-ebook/dp/B0C5DWF7LL/ref=sr_1_3?crid=JZR2GY582PLP&dib=eyJ2IjoiMSJ9.JnBwUikzDVNNbEBB3gsQGVjRNSPLyT3gYzaAVz44pMZkinZ2mpvIvTDbTUKt9ivXrs5HR4ckDZpTCX1nC9R06LN5_NIUbWEeNuYFwLwgLoDSLHiCNc5Taowts64SYdidzUzgagp5r7FpcDgTGH_r3LUhYqZEFh9ZRFjASlfAOqW30o0jdtelu9-22fMh9u5zon1m3MFhXafZ_JsirOTh5Y4czrNsONOzbnLKSJulIFI.nFU77SXnHOo00pTQW5pVrVxoCGclOMu0-I1M0x3GWf4&dib_tag=se&keywords=kindle+a+brief+history+of+artificial+intelligence&qid=1717773263&sprefix=kindle+a+brief+history+of+artificial+intelligence%2Caps%2C91&sr=8-3"
    openInNewTab(url)
})

function deleteElementAndChildren(elementId) {
    const parent = document.getElementById(elementId);
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    parent.remove()
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();        
        next_track();
    }



});

document.querySelector("#book").addEventListener("click", function (){

    pause_play()

    if (document.querySelector("#list") !== null) {
        deleteElementAndChildren("list")
        document.querySelector("#chapter-row").style.display = "flex"
        document.querySelector("#sentence-row").style.display = "flex"
        document.querySelector("#text-row").style.display = "flex"
        document.querySelector("#sound").innerHTML = "🕪"
        play()  
        return
    }

    //
    document.querySelector("#chapter-row").style.display = "none"
    document.querySelector("#sentence-row").style.display = "none"
    document.querySelector("#text-row").style.display = "none"

    //
    const div = document.createElement("div");
    div.id = "list"
    div.className = "column list";
    document.querySelector("#app").appendChild(div);

    //
    document.querySelector("#book_title").innerHTML = "Choose a book:"
    for (book in iBXXX){
        createListElementBook(book)
    }
})

document.querySelector("#chapter").addEventListener("click", function (){

    pause_play()

    if (document.querySelector("#list") !== null) {
        deleteElementAndChildren("list")
        document.querySelector("#chapter-row").style.display = "flex"
        document.querySelector("#sentence-row").style.display = "flex"
        document.querySelector("#text-row").style.display = "flex"
        document.querySelector("#sound").innerHTML = "🕪"
        play()  
        return
    }

    //
    document.querySelector("#sentence-row").style.display = "none"
    document.querySelector("#text-row").style.display = "none"

    //
    const div = document.createElement("div");
    div.id = "list"
    div.className = "column list";
    document.querySelector("#app").appendChild(div);

    //
    document.querySelector("#chapter_title").innerHTML = "Choose a chapter:"
    for (const BXXXCXXX in iBXXXCXXX){
        const ans = tracks[itracks]["audioFileFullPath"].split("/").slice(-1)[0].split("_")[0]
        const currrent_BXXX = ans.slice(0, 4)
        const BXXX = BXXXCXXX.slice(0, 4)
        if (currrent_BXXX === BXXX)
        createListElementChapter(BXXXCXXX)
    }
})

function createListElementBook(book){
    const div = document.createElement("div");
    div.className = "row list-element";
    div.innerHTML = tracks[iBXXX[book]].tran.replace(".", "");
    div.addEventListener("click", function(){
        deleteElementAndChildren("list")
        document.querySelector("#chapter-row").style.display = "flex"
        document.querySelector("#sentence-row").style.display = "flex"
        document.querySelector("#text-row").style.display = "flex"
        itracks = iBXXX[book]
        document.querySelector("#sound").innerHTML = "🕪"
        play()        
    });
    document.querySelector("#list").appendChild(div);
}

function createListElementChapter(chapter){
    const div = document.createElement("div");
    div.className = "row list-element";
    div.innerHTML = tracks[iBXXXCXXX[chapter]].tran.replace(".", "");
    div.addEventListener("click", function(){
        deleteElementAndChildren("list")
        document.querySelector("#sentence-row").style.display = "flex"
        document.querySelector("#text-row").style.display = "flex"
        itracks = iBXXXCXXX[chapter]
        document.querySelector("#sound").innerHTML = "🕪"
        play()        
    });
    document.querySelector("#list").appendChild(div);
}



