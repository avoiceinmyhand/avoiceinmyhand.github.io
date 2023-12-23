// This ensures that the DOM is fully loaded before trying to access elements
document.addEventListener("DOMContentLoaded", function () {
    // Update to current year
    document.getElementsByTagName("currentyear")[0].innerHTML = new Date().getFullYear().toString();

    // Access the <select> element
    const selectElement = document.querySelector('select');
    // Access the <textarea> element
    const textareaElement = document.querySelector('textarea');
    // Access the <button> element
    const buttonElement = document.querySelector('button');
    // Access Speech Synthesis - Holds text and voice
    let utterance;

    clippy.load('Bonzi', function (agent) {
        agent.show();
        agent.speak('Welcome one, welcome all.');
    });

    // Populate the <select> element with the voices
    speechSynthesis.addEventListener('voiceschanged', function () {
        // create utterance after voice has loaded
        utterance = new SpeechSynthesisUtterance();
        // Populate the select options here
        for (let voice of speechSynthesis.getVoices()) {
            let selected = voice.name === "Google US English" ? "selected" : "";
            let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
            selectElement.insertAdjacentHTML("beforeend", option);
        }
    });

    // Add a click event listener to the button
    buttonElement.addEventListener('click', function () {
        // This function will be called when the button is clicked
        // Disable multiple clicks
        buttonElement.disabled = true;
        // Set text for the utterance
        utterance.text = textareaElement.value;
        // Set voice for the utterance (you can choose based on the selected option in your <select>)
        utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === selectElement.value);
        // Only speak if there is text
        if (textareaElement.value !== "") {
            // Speak the utterance
            speechSynthesis.speak(utterance);
        } else {
            utterance.text = "Please enter text before clicking the button."
            // Speak the utterance
            speechSynthesis.speak(utterance);
        }
        // Clean up
        utterance.addEventListener('end', cleanUp)
    });

    function cleanUp() {
        buttonElement.disabled = false;
    }

});
