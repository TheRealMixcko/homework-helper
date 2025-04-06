async function getAnswer() {
  const input = document.getElementById("userInput").value;
  const responseBox = document.getElementById("responseBox");
  

  responseBox.innerHTML = "Thinking... 🤔";

  const HF_API_KEY = "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";

  const prompt = `Answer the following question in a short, direct way, without any explanations or steps: "${input}"`;

  try {
    const result = await fetch("https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    });

    if (!result.ok) throw new Error(`HTTP error! status: ${result.status}`);

    const data = await result.json();
    const fullText = data[0]?.generated_text || "Hmm... I didn't get that.";

    const clean = fullText.split("Explain this:")[1]?.trim() || fullText;

    // Render as Markdown
    responseBox.innerHTML = marked.parse(clean);
  } catch (err) {
    console.error("Error:", err);
    responseBox.innerText = "Sorry, something went wrong. Try again!";
  }
}

function copyAnswer() {
  const text = document.getElementById("responseBox").innerText;
  navigator.clipboard.writeText(text)
    .then(() => alert("Copied to clipboard!"))
    .catch(err => console.error("Copy failed:", err));
}

function readAloud() {
  const text = document.getElementById("responseBox").innerText;
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.rate = 1;
  window.speechSynthesis.speak(speech);
}
