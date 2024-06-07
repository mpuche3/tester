console.log("Running main.js")

document.querySelector("#text_mode").addEventListener("click", function () {
    if (this.innerHTML === "æ") {
        this.innerHTML = "a";
        isRepeat = false
    } else {
        this.innerHTML = "æ";
        isRepeat = true
    }
})

document.querySelector("#operation_mode").addEventListener("click", function () {
    if (this.innerHTML === "⟲") {
        this.innerHTML = "⇒";
        isRepeat = false
    } else {
        this.innerHTML = "⟲";
        isRepeat = true
    }
})

document.querySelector("#max_min").addEventListener("click", function () {
    if (this.innerHTML === "⤢") {
        this.innerHTML = "o";
        isRepeat = false
    } else {
        this.innerHTML = "⤢";
        isRepeat = true
    }
})

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