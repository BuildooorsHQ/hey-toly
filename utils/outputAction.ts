// ./utils/outputAction.ts
import styles from "../pages/input.module.css";

export function logUserInput(input: string) {
  console.log("User input:", input);
}

export function performOutputAction(
  generatedResponse: string,
  setResult: React.Dispatch<React.SetStateAction<string>>,
  setResultStyle: React.Dispatch<React.SetStateAction<string>>,
  setButtonStyle: React.Dispatch<React.SetStateAction<string>>
) {
  return (tolyInput: string) => {
    logUserInput(tolyInput); // Log user input
    setResult(generatedResponse);

    // Log result
    console.log("Setting result:", generatedResponse);

    setResultStyle(styles.result);

    // Log styles
    console.log("Setting result style:", styles.result);

    setButtonStyle(styles.button);

    // Log styles
    console.log("Setting button style:", styles.button);
  };
}
