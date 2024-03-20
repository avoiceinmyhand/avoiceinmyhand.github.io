// This ensures that the DOM is fully loaded before trying to access elements
document.addEventListener("DOMContentLoaded", function () {
    // Update to current year
    document.querySelector("currentyear").innerHTML = new Date().getFullYear().toString();
    // Access the <select> element
    const selectElement = document.querySelector('select');
    // Access the <textarea> element
    const textareaElement = document.querySelector('textarea');
    // Access the <button> element
    const buttonElement = document.querySelector('button');
    // Access the <input type="checkbox"> element
    const checkBoxSaveClear = document.getElementById('save-clear');
    // Load previous state if applicable
    checkBoxSaveClear.checked = localStorage.getItem('saveClearListState') === 'true';
    // Access ordered element
    const orderedListElement = document.querySelector('ol');
    // Access text list
    const textList = new Set(JSON.parse(localStorage.getItem('textList')) || []);
    // Load previous text list if applicable
    loadTextList(textList)
    // Access Speech Synthesis - Holds text and voice
    let utterance;
    // Access buddy
    let buddy;

    // Observe check box
    checkBoxSaveClear.addEventListener('click', function () {
        // Save Clear List State
        localStorage.setItem('saveClearListState', checkBoxSaveClear.checked)
        // When unchecked clear the list and update UI
        if (!checkBoxSaveClear.checked) {
            // Clear list
            textList.clear()
            // Store the list
            localStorage.setItem('textList', JSON.stringify(Array.from(textList)));
            // Populate UI
            loadTextList(textList);
        }
    });

    // Populate or Update UI List
    function loadTextList(textList) {
        // Clear
        orderedListElement.innerHTML = "";
        // Rebuild
        textList.forEach((item) => {
            const listItem = document.createElement('li');
            listItem.textContent = item;
            // Add a click event listener to all list items
            listItem.addEventListener('click', function () {
                speak(item)
            });
            listItem.style.cursor = 'pointer';
            orderedListElement.appendChild(listItem);
        });
    }

    <!-- Init buddy Bonzi | Clippy | F1 | Genie | Genius | Links | Merlin | Peedy | Rocky | Rover -->
    clippy.load('Peedy', function (agent) {
        buddy = agent;
        agent.show();
        agent.speak('Welcome.');
    });

    // Populate the <select> element with the voices
    speechSynthesis.addEventListener('voiceschanged', function () {
        // create utterance after voice has loaded
        utterance = new SpeechSynthesisUtterance();
        // Populate the select options here
        for (let voice of speechSynthesis.getVoices()) {
            let selected = voice.name === selectElement.value ? "selected" : "";
            let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
            selectElement.insertAdjacentHTML("beforeend", option);
        }
        // Load the previous voice selection if applicable, or set a default value
        selectElement.value = localStorage.getItem('selectedVoice') || 'Google UK English Male';
    });

    // Add an event listener to save the selected voice when it changes
    selectElement.addEventListener('change', function () {
        localStorage.setItem('selectedVoice', selectElement.value);
    });

    // Add a click event listener to the button
    buttonElement.addEventListener('click', function () {
        // This function will be called when the button is clicked
        // Disable multiple clicks
        buttonElement.disabled = true;
        // Only speak if there is text
        if (textareaElement.value.trim()) {
            // User wants to store the text to the text list
            if (checkBoxSaveClear.checked) {
                // Add in list
                textList.add(textareaElement.value.trim())
                // Store list
                localStorage.setItem('textList', JSON.stringify(Array.from(textList)));
                // Populate or Update UI
                loadTextList(textList);
            }
            // Speak the text
            speak(textareaElement.value.trim())
        } else {
            // Speak the text Error
            speak("Please enter text before clicking the button.")
        }
    });

    // Handle all the speech
    function speak(text) {
        // Buddy clear queue, animation and balloon
        buddy.stop()
        // Buddy speak
        buddy.speak(text)
        // Set text for the utterance
        utterance.text = text;
        // Set voice for the utterance (you can choose based on the selected option in your <select>)
        utterance.voice = speechSynthesis.getVoices().find(voice => voice.name === selectElement.value);
        // Speak the utterance
        speechSynthesis.speak(utterance);
        // Clean up after speech completion
        utterance.addEventListener('end', cleanUp)
    }

    // Clean Up and animate after speech
    function cleanUp() {
        buttonElement.disabled = false;
        buddy.animate();
        textareaElement.value = "";
    }

    // Function to perform the drag
    function performDrag() {
        // Select the div with the class "clippy"
        const clippyElement = document.querySelector('.clippy');

        // Check if the element is found
        if (clippyElement) {
            // Create a new MouseEvent for a mousedown event
            const mouseDownEvent = new MouseEvent('mousedown', {bubbles: true, cancelable: true});

            // Dispatch the mousedown event on the clippy element
            clippyElement.dispatchEvent(mouseDownEvent);

            // Create a new MouseEvent for a mousemove event
            const mouseMoveEvent = new MouseEvent('mousemove', {bubbles: true, cancelable: true});

            // Set the clientX property to simulate a drag to the right
            mouseMoveEvent.clientX += 5;

            // Dispatch the mousemove event on the clippy element
            clippyElement.dispatchEvent(mouseMoveEvent);

            // Create a new MouseEvent for a mouseup event
            const mouseUpEvent = new MouseEvent('mouseup', {bubbles: true, cancelable: true});

            // Dispatch the mouseup event on the clippy element
            clippyElement.dispatchEvent(mouseUpEvent);
        } else {
            console.error('Clippy element not found.');
        }
    }

    // Wait for 3 seconds (adjust the delay as needed)
    setTimeout(performDrag, 3000);


});
