//? CSS IMPORTAÇãO
import "./App.css";

//? REACT HOOKS
import { useCallback, useEffect, useState } from "react";

//! DATA
import { wordsList } from "./data/words.js";

//* COMPONENTS
import StartScreen from "./componets/StartScreen";
import Game from "./componets/Game";
import End from "./componets/End";

const stages = [
  { id: 1, name: "Start" },
  { id: 2, name: "Game" },
  { id: 3, name: "End" },
];

function App() {
  const [gameState, setGameState] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessdLetters, setGuessdLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(4);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    //! PICK A RANDOM CATEGORY
    const categories = Object.keys(words);
    const categoy =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    //! PICK A RANDOM WORD
    const word =
      words[categoy][Math.floor(Math.random() * words[categoy].length)];

    return { word, categoy };
  }, [words]);

  //! Stat the Secred word game.
  const startGame = useCallback(() => {
    //? CLEAR ALL LETTERS
    clearLetterState();

    //? PICK WORDS AND PICK CATEGORY
    const { word, categoy } = pickWordAndCategory();

    //? CREATE AN ARRAY OF LATTERS
    let wordLetters = word.split("");

    wordLetters = wordLetters.map((l) => l.toLowerCase());

    //? FILL STATES
    setPickedWord(word);
    setPickedCategory(categoy);
    setLetters(wordLetters);

    setGameState(stages[1].name);
  }, [pickWordAndCategory]);

  //! Process the  latter input.
  const verifyLatter = (letter) => {
    const normalizeLetter = letter.toLowerCase();

    //? CHECK IF LETTER HAS ALREADY BEEN UTILIZED
    if (
      guessdLetters.includes(normalizeLetter) ||
      wrongLetters.includes(normalizeLetter)
    ) {
      return;
    }

    //? PUSH GUESSED LETTER OR REMOVE LETTER
    if (letters.includes(normalizeLetter)) {
      setGuessdLetters((actualGuessdLetters) => [
        ...actualGuessdLetters,
        normalizeLetter,
      ]);
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizeLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  const clearLetterState = () => {
    setGuessdLetters([]);
    setWrongLetters([]);
  };

  //?CHECK IF GUESSES ENDED
  useEffect(() => {
    if (guesses <= 0) {
      //?RESET ALL STAGE
      clearLetterState();

      setGameState(stages[2].name);
    }
  }, [guesses]);

  //? CHECK WIN CONDITION
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];

    //? WIN CONDITION
    if (guessdLetters.length === uniqueLetters.length) {
      //?ADD SCORE
      setScore((actualScore) => (actualScore += 100));

      //? RESERT GAME WITH NEW WORD
      startGame();
    }
  }, [guessdLetters, letters, startGame]);

  //! Restart the Game.
  const retry = () => {
    setScore(0);
    setGuesses(4);

    setGameState(stages[0].name);
  };

  return (
    <div className="App">
      {gameState === "Start" && <StartScreen startGame={startGame} />}
      {gameState === "Game" && (
        <Game
          verifyLatter={verifyLatter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessdLetters={guessdLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameState === "End" && <End retry={retry} score={score} />}
    </div>
  );
}

export default App;
