// ./utils/outputAction.ts
import styles from "../pages/input.module.css";
import logInteraction from "./logInteraction.ts";

export function performOutputAction(
  generatedResponse: string,
  setResult: React.Dispatch<React.SetStateAction<string>>,
  setResultStyle: React.Dispatch<React.SetStateAction<string>>,
  setButtonStyle: React.Dispatch<React.SetStateAction<string>>
) {
  return (userInput: string) => {
    setResult(generatedResponse);
    logInteraction(userInput, generatedResponse);

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
