// https://javascript-minifier.com
// https://obfuscator.io
// This ensures that the DOM is fully loaded before trying to access elements
document.addEventListener("DOMContentLoaded", () => {
    // Update to current year
    document.querySelector("currentyear").innerHTML = new Date().getFullYear().toString();
    // Access the <select> element
    const selectElement = document.querySelector('select');
    // Access the <textarea> element
    const textareaElement = document.querySelector('textarea');
    // Access the <button> element
    const buttonElement = document.querySelector('button');
    // Access the <input type="checkbox"> element with id save-clear
    const checkBoxSaveClear = document.getElementById('save-clear');
    // Access the <input type="checkbox"> element with id ask
    const checkBoxAsk = document.getElementById('ask');
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
    checkBoxSaveClear.addEventListener('click', () => {
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

    checkBoxAsk.addEventListener('click', () => {
        // Toggle Speak or Ask button text
        buttonElement.textContent = checkBoxAsk.checked ? "Ask" : "Speak";
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

    // Init buddy Bonzi | Clippy | F1 | Genie | Genius | Links | Merlin | Peedy | Rocky | Rover
    clippy.load('Peedy', function (agent) {
        buddy = agent;
        agent.show();
        agent.speak('Welcome.');
    });

    // Populate the <select> element with the voices
    speechSynthesis.addEventListener('voiceschanged', () => {
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
    selectElement.addEventListener('change', () => {
        localStorage.setItem('selectedVoice', selectElement.value);
    });

    // Add a click event listener to the button
    buttonElement.addEventListener('click', () => {
        // This function will be called when the button is clicked
        // Disable multiple clicks
        buttonElement.disabled = true;
        // Toggle handle speech or handle ask
        buttonElement.textContent == "Speak" ? handleSpeech() : handleAsk();
    });

    // Handle speech when button text is Speak
    function handleSpeech() {
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
    }

    // Handle query when button text is Ask
    function handleAsk() {
        // Only query if there is text
        if (textareaElement.value.trim()) {
            // Notify user
            speak("I'm thinking...");
            // Query the text
            query(textareaElement.value.trim())
        } else {
            // Speak the text Error
            speak("How can I assist you further.")
        }
    }

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

    // Query and await response
    function query(query) {
        const url = 'https://chatgpt-42.p.rapidapi.com/conversationgpt4';
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': '4f156fc308msha2452bf45ce5caep1c3b7djsn88ba42617606',
                'X-RapidAPI-Host': 'chatgpt-42.p.rapidapi.com'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: 'user',
                        content: query
                    }
                ],
                system_prompt: '',
                temperature: 0.9,
                top_k: 5,
                top_p: 0.9,
                max_tokens: 256,
                web_access: false
            })
        };

        // asynchronous function
        async function fetchData() {
            try {
                const response = await fetch(url, options);
                const result = await response.json();
                const resultText = result.result;
                speak("Done!");
                // Update UI
                customAlert.alert(resultText, "Done!");
            } catch (error) {
                console.error(error);
                speak('I\'m sorry, I couldn\'t process your request. Please try again.');
            }
        }

        fetchData();
    }

    // CustomAlert class definition
    function CustomAlert() {
        this.alert = function (message, title) {
            // Create elements for the dialog box
            let dialogoverlay = document.createElement('div');
            dialogoverlay.id = 'dialogoverlay';
            dialogoverlay.style.position = 'fixed';
            dialogoverlay.style.top = '0';
            dialogoverlay.style.left = '0';
            dialogoverlay.style.width = '100%';
            dialogoverlay.style.height = '100%';
            dialogoverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            dialogoverlay.style.zIndex = '1000';

            let dialogbox = document.createElement('div');
            dialogbox.id = 'dialogbox';
            dialogbox.style.position = 'fixed';
            dialogbox.style.top = '50%';
            dialogbox.style.left = '50%';
            dialogbox.style.transform = 'translate(-50%, -50%)';
            dialogbox.style.backgroundColor = '#fff';
            dialogbox.style.padding = '20px';
            dialogbox.style.borderRadius = '5px';
            dialogbox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
            dialogbox.style.zIndex = '1001';

            let dialogboxhead = document.createElement('div');
            dialogboxhead.id = 'dialogboxhead';
            dialogboxhead.textContent = title ? title : 'Alert';
            dialogboxhead.style.fontSize = '18px';
            dialogboxhead.style.fontWeight = 'bold';
            dialogboxhead.style.marginBottom = '10px';

            let dialogboxbody = document.createElement('div');
            dialogboxbody.id = 'dialogboxbody';
            dialogboxbody.textContent = message;
            dialogboxbody.style.fontSize = '16px';

            let dialogboxfoot = document.createElement('div');
            dialogboxfoot.id = 'dialogboxfoot';
            dialogboxfoot.style.textAlign = 'center';

            let okButton = document.createElement('button');
            okButton.textContent = 'OK';
            okButton.style.padding = '10px 20px';
            okButton.style.fontSize = '16px';
            okButton.style.border = 'none';
            okButton.style.backgroundColor = '#007bff';
            okButton.style.color = '#fff';
            okButton.style.cursor = 'pointer';
            okButton.style.borderRadius = '5px';
            okButton.addEventListener('click', this.ok);

            dialogboxfoot.appendChild(okButton);

            dialogbox.appendChild(dialogboxhead);
            dialogbox.appendChild(dialogboxbody);
            dialogbox.appendChild(dialogboxfoot);

            // Append dialog box and overlay to body
            document.body.appendChild(dialogoverlay);
            document.body.appendChild(dialogbox);
        }

        this.ok = function () {
            // Hide dialog box and overlay
            document.getElementById('dialogbox').remove();
            document.getElementById('dialogoverlay').remove();
        }
    }

    // Create CustomAlert instance
    const customAlert = new CustomAlert();

});
