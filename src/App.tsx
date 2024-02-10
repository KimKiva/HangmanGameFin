import { useCallback, useEffect, useState } from "react"
import words from "./sanalista.json"
import { HangmanDrawing } from "./HangmanDrawing"
import { HangmanWord } from "./HangmanWord"
import { Keyboard } from "./Keyboard"
import winSound from "./win-sound.wav";
import loseSound from "./lose-sound.wav";

function App(){
// arvotaan sana listalta
const [wordToGuess, setWordToGuess] = useState(() => {
  return words[Math.floor(Math.random() * words.length)]
})
// otetaan vastaan ja varastoidaan arvatut kirjaimet
const [guessedLetters, setGuessedLetters] = useState<string[]>([])

const inCorrectLetters = guessedLetters.filter(letter => 
!wordToGuess.includes(letter) 
)


const isLoser = inCorrectLetters.length >=6
const isWinner = wordToGuess
.split("")
.every(letter => guessedLetters.includes(letter))


const addGuessedLetter = useCallback(
  (letter: string) => {
  if (guessedLetters.includes(letter) || isLoser || isWinner) 
  return

  setGuessedLetters(currentLetters => [...currentLetters, letter])
}, 
[guessedLetters, isWinner, isLoser]
)

useEffect(() => {
  // Lataa äänitiedostot etukäteen
  const winAudio = new Audio(winSound);
  const loseAudio = new Audio(loseSound);
  winAudio.load();
  loseAudio.load();
}, []);

useEffect(() => {
 const handler = (e: KeyboardEvent) => {
  const key = e.key

  if(!key.match(/^[a-ö]$/)) return

  e.preventDefault()
  addGuessedLetter(key)
 }
 document.addEventListener("keypress", handler)

 return () => {
  document.removeEventListener("keypress", handler)
 }
}, [guessedLetters])

const handlePlayAgain = () => {
  window.location.reload(); // Päivitä sivu 
};

return <div 
style={{
  maxWidth: "800px",
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
  margin: "0 auto",
  alignItems: "center"
  }}
>

{isWinner && <audio src={winSound} autoPlay />}
{isLoser && <audio src={loseSound} autoPlay />}

<div style={{ fontSize: "1.5rem", textAlign: "center" }}>
        {isWinner && "Onneksi olkoon, voitit pelin!" }
        {isLoser && "Hävisit pelin!"}

        {isWinner && (
        <div style={{ fontSize: "1.5rem", textAlign: "center" }}>
          <button style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              textDecoration: "none",
            }}onClick={handlePlayAgain}>Pelaa uudelleen</button>
        </div>
      )}

      {isLoser && (
        <div style={{ fontSize: "2rem", textAlign: "center" }}>
          <button style={{
              padding: "10px 20px",
              backgroundColor: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              textDecoration: "none",
            }} onClick={handlePlayAgain}>Pelaa uudelleen</button>
        </div>
      )}
      </div>
  

  <HangmanDrawing numberOfGuesses={inCorrectLetters.length}></HangmanDrawing>
  <HangmanWord 
    reveal={isLoser}
    guessedLetters={guessedLetters} wordToGuess={wordToGuess}></HangmanWord>
  <div style={{ alignSelf: "stretch"}}>
  <Keyboard 
    disabled={isWinner || isLoser}
    activeLetters={guessedLetters.filter(letter =>
    wordToGuess.includes(letter)
    )}
    inactiveLetters={inCorrectLetters}
    addGuessedLetter={addGuessedLetter}
    >
    </Keyboard>

   
  </div>

</div>

}
export default App
