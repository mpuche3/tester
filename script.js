console.log("Running Script.js")

function shuffleOptions() {
  // Select the parent container and all option divs except the explanation
  const parent = document.getElementById('question').parentElement;
  const options = Array.from(document.querySelectorAll('.opt_div'));
  const explanation = document.getElementById('explanation');

  // Shuffle the options array using Fisher-Yates algorithm
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }

  // Append the shuffled option divs back to the parent container
  options.forEach(option => parent.appendChild(option));

  // Ensure the explanation div is appended last
  parent.appendChild(explanation);
}

questions = [
    {
        "Question": "What was one significant outcome of the Reform Act of 1832?",
        "RightAnswer": "It abolished pocket and rotten boroughs.",
        "WrongAnswers": ["It granted universal suffrage.", "It allowed women to vote.", "It abolished property ownership as a voting requirement."],
        "Explanation": "The Act also abolished the old pocket and rotten boroughs and more parliamentary seats were given to the towns and cities."
    },
    {
        "Question": "Why were members of the working class still unable to vote after the Reform Act of 1832?",
        "RightAnswer": "Voting was based on ownership of property.",
        "WrongAnswers": ["They were not citizens.", "They lacked education.", "The Act excluded urban areas."],
        "Explanation": "This meant that members of the working class were still unable to vote."
    },
    {
        "Question": "What was the primary goal of the Chartist movement?",
        "RightAnswer": "To demand the vote for the working classes and others without property.",
        "WrongAnswers": ["To support women's suffrage.", "To abolish the monarchy.", "To introduce universal suffrage immediately."],
        "Explanation": "A movement began to demand the vote for the working classes and other people without property. Campaigners, called the Chartists, presented petitions to Parliament."
    },
    {
        "Question": "What change did the Reform Act of 1867 bring?",
        "RightAnswer": "It created more urban seats in Parliament and reduced the property requirements to vote.",
        "WrongAnswers": ["It granted women the right to vote.", "It abolished all property requirements for voting.", "It introduced universal suffrage."],
        "Explanation": "In 1867 there was another Reform Act. This created many more urban seats in Parliament and reduced the amount of property that people needed to have before they could vote."
    },
    {
        "Question": "Why did political parties start creating organizations in the 19th century?",
        "RightAnswer": "To persuade the increased number of voters to vote for them.",
        "WrongAnswers": ["To oppose the suffragettes.", "To implement universal suffrage.", "To reduce property qualifications."],
        "Explanation": "Politicians realised that the increased number of voters meant that they needed to persuade people to vote for them if they were to be sure of being elected to Parliament."
    },
    {
        "Question": "What was a key legal change for married women in Britain in 1870?",
        "RightAnswer": "They gained the right to keep their own earnings and property.",
        "WrongAnswers": ["They gained the right to vote.", "They were allowed to own land.", "They could run for public office."],
        "Explanation": "Acts of Parliament in 1870 and 1882 gave wives the right to keep their own earnings and property."
    },
    {
        "Question": "What was the main focus of the women's suffrage movement in the late 19th and early 20th centuries?",
        "RightAnswer": "To campaign for the right to vote.",
        "WrongAnswers": ["To abolish property ownership requirements.", "To campaign for equal pay.", "To introduce universal suffrage."],
        "Explanation": "In the late 19th and early 20th centuries, an increasing number of women campaigned and demonstrated for greater rights and, in particular, the right to vote."
    },
    {
        "Question": "What term was used to describe women who campaigned for voting rights in Britain?",
        "RightAnswer": "Suffragettes",
        "WrongAnswers": ["Chartists", "Feminists", "Socialists"],
        "Explanation": "They formed the women’s suffrage movement and became known as ‘suffragettes’."
    },
    {
        "Question": "What was a significant limitation of the Reform Act of 1867 regarding voting rights?",
        "RightAnswer": "The majority of men still did not have the right to vote, and no women could vote.",
        "WrongAnswers": ["It excluded urban areas from representation.", "It abolished voting for property owners.", "It limited voting rights to rural landowners."],
        "Explanation": "However, the majority of men still did not have the right to vote and no women could vote."
    },
    {
        "Question": "When did universal suffrage (the right for all adults to vote) become a reality in Britain?",
        "RightAnswer": "In the next century after the 19th century.",
        "WrongAnswers": ["In 1832.", "In 1867.", "By the end of the 19th century."],
        "Explanation": "Universal suffrage (the right of every adult, male or female, to vote) followed in the next century."
    }
]

const STATE = {
    _questions: questions,
    _index: 0,
    voices: [],
    _category: "tools",
    _voice: "echo",
    _isPhonetic: true,
    _isRepeat: true,    
    _isSoftMuted: false,
    _isHardMuted: true,
    _mapVoiceNames: {
            // Edge
            "Ava": "Microsoft Ava Online (Natural) - English (United States)",
            "Andrew": "Microsoft Andrew Online (Natural) - English (United States)",
            "Emma": "Microsoft Emma Online (Natural) - English (United States)",
            "Brian": "Microsoft Brian Online (Natural) - English (United States)",
            "Ana": "Microsoft Ana Online (Natural) - English (United States)",
            "Aria": "Microsoft Aria Online (Natural) - English (United States)",
            "Chris": "Microsoft Christopher Online (Natural) - English (United States)",
            "Eric": "Microsoft Eric Online (Natural) - English (United States)",
            "Guy": "Microsoft Guy Online (Natural) - English (United States)",
            "Jenny": "Microsoft Jenny Online (Natural) - English (United States)",
            "Michelle": "Microsoft Michelle Online (Natural) - English (United States)",
            "Roger": "Microsoft Roger Online (Natural) - English (United States)",
            "Steffan": "Microsoft Steffan Online (Natural) - English (United States)",
            // Chrome
            "UK Male": "Google UK English Male",
            "UK Female": "Google UK English Female",
            "US Female": "Google US English",
    },
    
    get_text_to_read(){
        if (document.querySelector("#explanation").innerHTML.trim() === ""){
            return document.querySelector("#question_text").innerHTML.trim()
        } else {
            return document.querySelector("#explanation_text").innerHTML.trim()
        }
        
    },

    next_question(){
        document.querySelector("#opt01").classList.remove('green_div');
        document.querySelector("#opt02").classList.remove('red_div');
        document.querySelector("#opt03").classList.remove('red_div');
        document.querySelector("#opt04").classList.remove('red_div');
        document.querySelector("#explanation_text").innerHTML = ""
        shuffleOptions()

        if (this._isRepeat === true) {
            this._index = Math.floor(Math.random() * this._questions.length)
        } else {
            this._index = this._index + 1;
            if (this._index === this._questions.length) {
                this._index = 0;
            }
        }


        
        this.refresh_text()
        const question = this._questions[this._index]["Question"]
        play(question)
    },

    show_explanation(){
        const explantion = this._questions[this._index]["Explanation"]
        document.querySelector("#explanation_text").innerHTML = explantion
        play(explantion)
    },

    get_voices(){
        this._voices = window.speechSynthesis.getVoices().filter(voice => {
            return Object.values(this._mapVoiceNames).includes(voice.name)
        });
        return this._voices
    },

    get_voice_obj() {
        const voiceNames = STATE.voices
        for (const voiceName of voiceNames){
            const voices = window.speechSynthesis.getVoices();
            for (let i = 0; i < voices.length; i++) {
                if (voices[i].name.includes(voiceName)) {
                    return voices[i];
                }
            }    
        }
    },

    get voices(){
        return this._voices
    },

    set voices(value){
        this._voices = value
    },

    get voice(){
        return this._voice
    },

    set voice(value){
        this._voice = value
    },

    get isPhonetic(){
        return this._isPhonetic
    },

    set isPhonetic(value){
        this._isPhonetic = !!value
        this.refresh_text()
    },

    get isRepeat(){
        return this._isRepeat
    },

    set isRepeat(value){
        this._isRepeat = !!value
        this.refresh_repeat()
    },

    get isSoftMuted(){
        return this._isSoftMuted
    },

    set isSoftMuted(value){
        this._isSoftMuted = !!value
        this.refresh_SoftMuted()
    },

    get isHardMuted(){
        return this._isHardMuted
    },

    set isHardMuted(value){
        this._isHardMuted = !!value
        this.refresh_HardMuted()
    },

    get_mode_text(){
        if (this._isPhonetic) {
            return "tran"
        } else {
            return "text"
        }
    },

    toggleSpellingMode(){
        this._isPhonetic = !this.isPhonetic;
        this.refresh()
    },

    next_voice() {
        if (this.voices.length !== 0) {
            const index = this.voices.indexOf(this._voice)
            if (index === -1 && this._voice !== "echo") {
                this._voice = "echo"
            } else if (index === -1 ) {
                this._voice = this.voices[0]
            } else if  (index === this.voices.length - 1) {
                this._voice = "echo"
            } else {
                this._voice = this.voices[index + 1]
            }
        } else {
            this._voice = "echo"
        }
        this.refresh_voice()
        // play()
    },

    refresh_voice() {
        if (this._voice === "echo") {
            document.querySelector("#voice").innerHTML = "echo"
        } else {
            document.querySelector("#voice").innerHTML = Object.keys(this._mapVoiceNames).find(key => this._mapVoiceNames[key] === this._voice.name)
        }
    },

    refresh_text() {
        document.querySelector("#question_text").innerHTML = this._questions[this._index]["Question"]
        document.querySelector("#opt01_text").innerHTML = this._questions[this._index]["RightAnswer"]
        document.querySelector("#opt02_text").innerHTML = this._questions[this._index]["WrongAnswers"][0]
        document.querySelector("#opt03_text").innerHTML = this._questions[this._index]["WrongAnswers"][1]
        document.querySelector("#opt04_text").innerHTML = this._questions[this._index]["WrongAnswers"][2]
        // if (this._isPhonetic){
        //     document.querySelector("#text").innerHTML = this.sentence.ipa.replace(":", "<br><br>")
        // } else {
        //     document.querySelector("#text").innerHTML = this.sentence.txt.replace(":", "<br><br>")
        // }
    },

    refresh_repeat(){
        if (this._isRepeat){
            document.querySelector("#repeat").innerHTML = get_ICON("si_repeat")
        } else {
            document.querySelector("#repeat").innerHTML = get_ICON("no_repeat")
        }
    },

    refresh_HardMuted(){
        if (this._isHardMuted){
            document.querySelector("#sound").innerHTML = get_ICON("no_sound")
            pause_play()
        } else {
            document.querySelector("#sound").innerHTML = get_ICON("si_sound")
            // play()
        }
    },

    refresh_SoftMuted(){
        if (this._isSoftMuted){
            document.querySelector("#sound").innerHTML = get_ICON("no_sound")
            pause_play()
        } else {
            document.querySelector("#sound").innerHTML = get_ICON("si_sound")
            // play()
        }
    },

    refresh_text_mode(){
        if (this._isPhonetic){
            document.querySelector("#text_mode").innerHTML = "æ"
        } else {
            document.querySelector("#text_mode").innerHTML = "a"
        }
    },

    refresh_category(){
        document.querySelector("#category").innerHTML = this._category
    },

    refresh(){
        this.refresh_text_mode()
        this.refresh_text()
        this.refresh_repeat()
        this.refresh_HardMuted()
        this.refresh_voice()
        this.refresh_category()
    },

    increase_sentence_score(){
        // score = localStorage.getItem(this.sentence.hash) || this.sentence.score
        // score = Number(score)
        // score = score + (1 - score) / 2
        // this.sentence.score = score
        // localStorage.setItem(this.sentence.hash, score)
    },

    decrease_sentence_score(){
        // score = localStorage.getItem(this.sentence.hash) || this.sentence.score
        // score = Number(score)
        // score = score / 10
        // this.sentence.score = score
        // localStorage.setItem(this.sentence.hash, score)
    },

    next_category(){
        const categories = ["tools", "history", "kitchen", "house", "clothing", "british_history"]
        const index = categories.indexOf(this._category)
        this._category = categories[(index + 1) % categories.length]
        read_data()
    }
}

function trimText(elementSelector) {
    let loop = 0
    const isOverflown = ({ clientWidth, scrollWidth }) => scrollWidth > clientWidth;
    const element = document.querySelector(elementSelector)
    while (isOverflown(element) && element.innerHTML.length > 6 && loop < 500) {
        element.innerHTML = element.innerHTML.slice(0, -5) + " ..."
        loop += 1
    }
}

function trimElementText(element) {
    let loop = 0
    const isOverflown = ({ clientWidth, scrollWidth }) => scrollWidth > clientWidth;
    const tmp = {
        a: element.clientWidth,
        b: element.scrollWidth,
        c: isOverflown(element),
        d: element.innerHTML.length
    }
    while (isOverflown(element) && element.innerHTML.length > 6 && loop < 500) {
        element.innerHTML = element.innerHTML.slice(0, -5) + " ..."
        loop += 1
    }
}

function read_data(){
    // const jsonFilePath = `./data/json/${STATE._category}.json`;
    // fetch(jsonFilePath).then(response => {
    //     if (!response.ok) {
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //     }
    //     return response.json(); // Parse the JSON data
    // }).then(data => {
    //     console.log('JSON data:', data);
    //     STATE.sentences = data;
    //     STATE.refresh();
    //     STATE.next_sentence();
    // }).catch(error => {
    //     console.error('Error loading JSON file:', error);
    // });
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

function* enumerate(iterable) {
    let index = 0;
    for (const item of iterable) {
      yield [index, item];
      index++;
    }
}

function get_text(url) {
    return data[0].txt
}

function play(){
    STATE.refresh_text();
    const text = STATE.get_text_to_read()
    if (!STATE.isHardMuted && !STATE.isSoftMuted) {
        const voice = STATE.voice  
        if (voice === "echo"){
            pause_play()      
            const audioFileFullPath = `./data/audio/${STATE.sentence.hash}`;
            const audio = new Audio(audioFileFullPath);
            audio.playbackRate = playbackRate;
            audios.push(audio)
            audio.addEventListener("ended", function () {
                play()          
            })
            audio.play()
        } else {
            pause_play()
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = STATE.voice
            utterance.rate = 0.85;
            utterance.onend = function(){
                setTimeout(function () {
                    play()        
                }, 600)
            }
            window.speechSynthesis.speak(utterance);                 
        }
    }
}

function pause_play() {
    window.speechSynthesis.cancel()
    audios.map(audio => {
        audio.pause();
    })
}

document.querySelector("#text_mode").addEventListener("click", function () {
    STATE._isPhonetic = !STATE._isPhonetic
    STATE.refresh()
})

document.querySelector("#repeat").addEventListener("click", function () {
    STATE._isRepeat = !STATE._isRepeat
    console.log("click_repeat")
    STATE.refresh_repeat()
})

document.querySelector("#sound").addEventListener("click", function () {
    STATE.isHardMuted = !STATE.isHardMuted
    STATE.refresh_HardMuted()
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
        document.querySelector("#max_min").innerHTML = get_ICON("exit_fullscreen")
    } else {
        document.querySelector("#max_min").innerHTML = get_ICON("enter_fullscreen")
    }
});

document.querySelector("#category").addEventListener("click", function () {
    console.log("click on category")
    STATE.next_category()
});






document.querySelector("#voice").addEventListener('click', function () {
    STATE.next_voice()
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();        
        STATE.next_sentence();
        STATE.refresh();
    } else if (event.key === "r") {
        event.preventDefault();
        document.querySelector("#repeat").click()
    } else if (event.key === "s") {
        event.preventDefault();
        document.querySelector("#sound").click()
    } else if (event.key === "a") {
        event.preventDefault();
        document.querySelector("#text_mode").click()
    } else if (event.key === "v") {
        event.preventDefault();
        document.querySelector("#voice").click()
    }
});

document.querySelector("#explanation").addEventListener("click", function () {
    console.log("click on category")
    STATE.next_question()
});

document.querySelector("#opt01").addEventListener("click", function (){
    document.querySelector("#opt01").classList.add('green_div');
    STATE.show_explanation()
})

document.querySelector("#opt02").addEventListener("click", function (){
    document.querySelector("#opt02").classList.add('red_div');
})

document.querySelector("#opt03").addEventListener("click", function (){
    document.querySelector("#opt03").classList.add('red_div');
})

document.querySelector("#opt04").addEventListener("click", function (){
    document.querySelector("#opt04").classList.add('red_div');
})

///////////////////////////////////////////////
//                                           //
///////////////////////////////////////////////

let startX, startY, endX, endY;
const swipeContainer = document.getElementById('question');

swipeContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].pageX;
    startY = e.touches[0].pageY;
});

swipeContainer.addEventListener('touchend', (e) => {
    const min_delta = 5;
    endX = e.changedTouches[0].pageX;
    endY = e.changedTouches[0].pageY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // horizontal swipe
        if (deltaX > +1 * min_delta) {
            document.getElementById('text-row').click()
            console.log('Swiped right');
        } 
        if (deltaX < -1 * min_delta) {
            console.log('Swiped left');
            document.getElementById('text-row').click()
        }
    } else {
        // vertical swipe
        if (deltaY > +1 * min_delta) {
            console.log('Swiped down');
            document.getElementById('text-row').click()
        }
        if (deltaY < -1 * min_delta) {
            console.log('Swiped up');
            document.getElementById('text-row').click()
        }
    }
});

///////////////////////////////////////////////
//                                           //
///////////////////////////////////////////////

function get_ICON(x){
    const ICON_PATH = {
        start: '<path d="m384-334 96-74 96 74-36-122 90-64H518l-38-124-38 124H330l90 64-36 122ZM233-120l93-304L80-600h304l96-320 96 320h304L634-424l93 304-247-188-247 188Zm247-369Z"/>',
        exit_fullscreen: '<path d="M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z"/>',
        enter_fullscreen: '<path d="M240-120v-120H120v-80h200v200h-80Zm400 0v-200h200v80H720v120h-80ZM120-640v-80h120v-120h80v200H120Zm520 0v-200h80v120h120v80H640Z"/>',
        si_sound: '<path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z"/>',
        no_sound: '<path d="M792-56 671-177q-25 16-53 27.5T560-131v-82q14-5 27.5-10t25.5-12L480-368v208L280-360H120v-240h128L56-792l56-56 736 736-56 56Zm-8-232-58-58q17-31 25.5-65t8.5-70q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 53-14.5 102T784-288ZM650-422l-90-90v-130q47 22 73.5 66t26.5 96q0 15-2.5 29.5T650-422ZM480-592 376-696l104-104v208Zm-80 238v-94l-72-72H200v80h114l86 86Zm-36-130Z"/>',
        si_repeat: '<path d="M280-80 120-240l160-160 56 58-62 62h406v-160h80v240H274l62 62-56 58Zm-80-440v-240h486l-62-62 56-58 160 160-160 160-56-58 62-62H280v160h-80Z"/>',
        no_repeat: '<path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"/>',
    }
    if (ICON_PATH[x] === undefined) {
        console.log("ERROR: Icon not found" + x)
        return ""
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"> ${ICON_PATH[x]} </svg>`
}

document.querySelector("#max_min").innerHTML = get_ICON("enter_fullscreen")
document.querySelector("#sound").innerHTML = get_ICON("no_sound")
document.querySelector("#repeat").innerHTML = get_ICON("no_repeat")

// EXPLAIN
window.speechSynthesis.getVoices()

///////////////////////////////////////////////

const audios = []
const playbackRate = 0.85

setTimeout(_ => {
    STATE.get_voices()
    if (STATE.voices.length !== 0) {
        document.querySelector("#voice").style.display = "flex";
        STATE.next_voice()
    }
    read_data()
    STATE.refresh()
}, 100)

///////////////////////////////////////////////
//                                           //
///////////////////////////////////////////////