/*
    1. Create an array of Strings from which text will be displayed for user
    2. Set Timer  = 60s
    3. Create event listener for input focus handle
    4. Display the text in the text-box
    5. Compare the event target value to each character with the text displayed
    6. If character are not same highlight the particular character in the text-box
    7. Calculate Accuracy with right characters and wrong characters count
    8. Once a text is completed, store the wordCount, charactersCount and accuracyLevel in a global state
    9. When timer exhausts, add the wpm and cpm cards and update the text in the text-box. Also display the restart button
    10. On Button click event, handle and restart the game from step 1
*/
const timerLimit = 60

const displayQuotes = [
    "There is nothing impossible to they who will try.",
    "Keep your face always toward the sunshine, and shadows will fall behind you.",
    "You are never too old to set another goal or to dream a new dream.",
    "Silence is the last thing the world will ever hear from me.",
    "Try to be a rainbow in someone's cloud.",
    "When it comes to luck, you make your own.",
    "We are not our best intentions. We are what we do.",
    "Out of the mountain of despair, a stone of hope.",
    "You have to be where you are to get where you need to go.",
    "Being vulnerable is a strength, not a weakness.",
    "The power of imagination makes us infinite.",
    "Embrace the glorious mess that you are.",
    "You must find the place inside yourself where nothing is impossible.",
    "Faith is love taking the form of aspiration.",
    "Live your beliefs and you can turn the world around.",
]

const randomisedIndexes = () =>
    Array.from(Array(displayQuotes.length).keys()).sort(
        () => Math.random() - 0.5
    )

randomisedIndexes()

const defaultElementValues = {
    timeLeft: timerLimit,
    timeElapsed: 0,
    timer: null,
    errors: 0,
    totalErrors: 0,
    accuracy: 0,
    totalAccuracy: 0,
    characterTyped: 0,
    currentQuote: "",
    quoteNo: 0,
    isGameActive: false,
    isGamePaused: false,
    indexesOfDisplayQuotes: randomisedIndexes(),
}

let state = {
    ...defaultElementValues,
}

const elements = {
    wpmText: document.getElementById("wpm-text"),
    cpmText: document.getElementById("cpm-text"),
    errorsText: document.getElementById("errors-text"),
    timerText: document.getElementById("timer-text"),
    accuracyText: document.getElementById("accuracy-text"),
    quoteText: document.getElementById("quote-text"),
    textInput: document.getElementById("text-input"),
    restartBtn: document.getElementById("restart-btn"),
    wpmBox: document.getElementById("wpm-box"),
    cpmBox: document.getElementById("cpm-box"),
    alertBox: document.getElementById("alert-box"),
}

const styleElement = (element, styleProperty, value) =>
    (element.style[styleProperty] = value)
const updateElement = (element, property, value) => (element[property] = value)

const resetTimer = () => clearInterval(state.timer)

const updateTimerClock = () => {
    if (state.timeLeft > 0) {
        state.timeLeft--
        state.timeElapsed++
        updateElement(elements.timerText, "textContent", state.timeLeft)
    } else finishGame()
}

const updateTimer = () => {
    resetTimer()
    state.timer = setInterval(updateTimerClock, 1000)
}

const updateAlertBox = (show = true) => {
    const alert = state.isGameActive
        ? !state.isGamePaused
            ? "Click outside the input box to Pause the Game!"
            : "Game Paused!"
        : "Game Finished!"
    const showAlert = show ? true : false

    updateElement(elements.alertBox, "textContent", alert)

    if (showAlert) {
        elements.alertBox.classList.add("alert-add-animation")
        elements.alertBox.classList.remove("alert-remove-animation")
    } else {
        elements.alertBox.classList.remove("alert-add-animation")
        elements.alertBox.classList.add("alert-remove-animation")
    }
}

const updateQuoteText = () => {
    updateElement(elements.quoteText, "textContent", "")
    const toDisplayQuote =
        displayQuotes[state.indexesOfDisplayQuotes[state.quoteNo]]
    state.currentQuote = toDisplayQuote

    Array.from(toDisplayQuote).forEach(char => {
        const charSpan = document.createElement("span")
        updateElement(charSpan, "textContent", char)
        elements.quoteText.appendChild(charSpan)
    })

    if (state.quoteNo === displayQuotes.length - 1) state.quoteNo = 0
    else state.quoteNo += 1
}

const resetGame = () => {
    state = {
        ...defaultElementValues,
    }

    styleElement(elements.wpmBox, "display", "none")
    styleElement(elements.cpmBox, "display", "none")
    styleElement(elements.restartBtn, "display", "none")

    updateElement(elements.textInput, "disabled", false)
    updateElement(
        elements.quoteText,
        "textContent",
        "Click on the area below to start the game."
    )
    updateElement(elements.textInput, "value", "")
    updateElement(elements.errorsText, "textContent", `${state.totalErrors}`)
    updateElement(elements.timerText, "textContent", `${state.timeLeft}s`)
    updateElement(elements.accuracyText, "textContent", `100`)
}

const pauseGame = () => {
    state.isGamePaused = true
    resetTimer()
    updateAlertBox()
}

const finishGame = () => {
    state.isGameActive = false

    updateAlertBox()
    resetTimer()

    updateElement(elements.textInput, "disabled", true)
    updateElement(
        elements.quoteText,
        "textContent",
        "Click on restart to start a new game."
    )
    updateElement(elements.textInput, "value", "")

    const cpm = Math.round((state.characterTyped / state.timeElapsed) * 60)
    const wpm = Math.round((state.characterTyped / 5 / state.timeElapsed) * 60)

    updateElement(elements.cpmText, "textContent", cpm)
    updateElement(elements.wpmText, "textContent", wpm)

    styleElement(elements.wpmBox, "display", "flex")
    styleElement(elements.cpmBox, "display", "flex")
    styleElement(elements.restartBtn, "display", "block")
}

const startGame = () => {
    state.isGamePaused = false
    if (!state.isGameActive) {
        updateQuoteText()
        state.isGameActive = true
    }
    updateTimer()
    updateAlertBox()
}

const processInputContents = () => {
    const currentInputValue = elements.textInput.value
    const currentInputArr = [...currentInputValue]

    state.characterTyped++
    state.errors = 0

    const quoteSpanList = elements.quoteText.querySelectorAll("span")
    quoteSpanList.forEach((char, index) => {
        let typedChar = currentInputArr[index]

        if (!typedChar) char.className = ""
        else if (typedChar === char.innerText) {
            char.classList.add("correct_char")
            char.classList.remove("incorrect_char")
        } else if (typedChar != char.innerText) {
            char.classList.add("incorrect_char")
            char.classList.remove("correct_char")
            state.errors++
        }
    })

    updateElement(
        elements.errorsText,
        "textContent",
        state.totalErrors + state.errors
    )

    const correctCharacters =
        state.characterTyped - (state.totalErrors + state.errors)
    const accuracyVal = (correctCharacters / state.characterTyped) * 100
    updateElement(elements.accuracyText, "textContent", Math.floor(accuracyVal))

    if (currentInputArr.length == state.currentQuote.length) {
        updateQuoteText()
        updateElement(elements.textInput, "value", "")
        state.totalErrors += state.errors
    }
}

elements.textInput.addEventListener("input", processInputContents)

elements.textInput.addEventListener(
    "blur",
    state.timeElapsed === timerLimit ? finishGame : pauseGame
)

elements.textInput.addEventListener(
    "click",
    state.timeElapsed === timerLimit ? finishGame : startGame
)

elements.restartBtn.addEventListener("click", () => {
    updateAlertBox(false)
    resetGame()
})

window.addEventListener("load", resetGame)
