// ./utils/outputAction.ts
export function performOutputAction(
  generatedResponse: string,
  setResult: React.Dispatch<React.SetStateAction<string>>,
  setResultStyle: React.Dispatch<React.SetStateAction<string>>,
  setButtonStyle: React.Dispatch<React.SetStateAction<string>>
) {
  setResult(generatedResponse);
  setResultStyle(styles.result);
  setButtonStyle(styles.buttonshare);
}
