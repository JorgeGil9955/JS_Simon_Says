
let buttonColours = ["red","blue","green","yellow"]
let gamePattern = []
let userClickedPattern = []
var userTurn = false
let gameStarted = false
var roundCount = 1


const updateTopScore = () => {
    let topScore = localStorage.getItem("top-score")? localStorage.getItem("top-score") : 0
    if(roundCount > topScore){
        localStorage.setItem("top-score", roundCount-1)
    }
    $("#top-score").text("Top score: " + topScore)
}
updateTopScore()

const nextSequence = async () => {
    $("#level-title").text("Level "+ roundCount)
    userTurn = false
    roundCount++
    await new Promise(r => setTimeout(r, 1000))
    userClickedPattern.length = 0
    let randomNumber = Math.round((Math.random()*3))
    let randomChosenColour = buttonColours[randomNumber]

    gamePattern.push(randomChosenColour)
    console.log(randomChosenColour)

    for (let i = 0; i < gamePattern.length-1; i++){
        $("#" + gamePattern[i]).fadeOut(100).fadeIn(100)
        playSound(gamePattern[i])
        await new Promise(r => setTimeout(r, 400))
    }
    $("#" + randomChosenColour).fadeOut(100).fadeIn(100)
    playSound(randomChosenColour)

    userTurn = true
}

$(".btn").click(function() {
    if(!userTurn) return
    let pressedColour = $(this).attr("id")
    userClickedPattern.push(pressedColour)

    $(this).fadeOut(100).fadeIn(100)
    playSound(pressedColour)

    checkAnswer()
})

const playSound = (button) => {
    let audio = new Audio("sounds/" + button + ".mp3")
    audio.play()
}

const checkAnswer = () => {
    if(JSON.stringify(userClickedPattern) != JSON.stringify(gamePattern.slice(0, userClickedPattern.length))) {
        gameOver()
        return
    }
    if((userClickedPattern.length === gamePattern.length) && (userClickedPattern[userClickedPattern.length - 1] === gamePattern[gamePattern.length - 1])){
        console.log(userClickedPattern[userClickedPattern.length])
        nextSequence()
    }
}

const gameOver = () => {
    userTurn = false
    gameStarted = false
    updateTopScore()
    roundCount = 1
    gamePattern.length = 0
    userClickedPattern.length = 0
    playSound("wrong")

    $("#level-title").text("Game Over!")
    $("body").addClass("game-over")
    setTimeout(() => {
        $("body").removeClass("game-over")
    }, 200)
    $("#play-btn").show()
}

$("#play-btn").click(() => {
    if(!gameStarted){
        gameStarted = true
        $("#play-btn").hide()
        nextSequence()
    } 
})