// Main JavaScript file for the Nutritional Science Learning App

document.addEventListener('DOMContentLoaded', async () => {
    let APP_CONTENT = {};
    let currentModuleId = null;
    let currentLectureId = null;
    let quizData = null;
    let currentQuestionIndex = 0;
    let userScore = 0;

    const views = {
        welcome: document.getElementById('welcome-view'),
        moduleMap: document.getElementById('module-map-view'),
        lecture: document.getElementById('lecture-view'),
        quiz: document.getElementById('quiz-view')
    };

    const buttons = {
        start: document.getElementById('start-button'),
        backToMap: document.getElementById('back-to-map-button'),
        startQuiz: document.getElementById('start-quiz-button')
    };

    const inputs = {
        name: document.getElementById('name-input')
    };

    const displays = {
        welcomeMessage: document.getElementById('welcome-message')
    };

    // --- View Management ---
    function showView(viewId) {
        Object.values(views).forEach(view => {
            if (view) view.style.display = 'none';
        });
        if (views[viewId]) {
            views[viewId].style.display = 'block';
        }
    }

    // --- App Initialization ---
    async function init() {
        APP_CONTENT = await parseContent();
        const progress = getUserProgress();
        if (progress && progress.userName) {
            displays.welcomeMessage.textContent = `Willkommen zurück, ${progress.userName}!`;
            loadModules();
            showView('moduleMap');
        } else {
            showView('welcome');
        }
    }

    // --- Module Loading ---
    function loadModules() {
        const moduleGrid = document.getElementById('module-grid');
        moduleGrid.innerHTML = ''; // Clear existing modules

        // This is a placeholder for where module metadata would be defined
        const modulesMeta = {
            'modul-1': { title: 'Modul 1: Grundlagen', ects: 5, status: 'unlocked' }
        };

        for (const moduleId in modulesMeta) {
            const moduleMeta = modulesMeta[moduleId];
            const card = createModuleCard(moduleId, moduleMeta);
            moduleGrid.appendChild(card);
        }
    }

    function createModuleCard(moduleId, moduleMeta) {
        const card = document.createElement('div');
        card.className = 'module-card bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer';
        if (moduleMeta.status === 'locked') {
            card.classList.add('locked', 'opacity-50', 'cursor-not-allowed');
        }
        
        card.innerHTML = `
            <h3 class="text-xl font-bold mb-2">${moduleMeta.title}</h3>
            <p class="text-gray-600 mb-4">${moduleMeta.ects} ECTS</p>
            <div class="status-badge text-sm font-semibold inline-block px-3 py-1 rounded-full ${moduleMeta.status === 'locked' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}">
                ${moduleMeta.status}
            </div>
        `;
        
        card.addEventListener('click', () => {
            if (moduleMeta.status !== 'locked') {
                currentModuleId = moduleId;
                displayLecturesForModule(moduleId);
            } else {
                alert('Dieses Modul ist gesperrt!');
            }
        });

        return card;
    }

    function displayLecturesForModule(moduleId) {
        const module = APP_CONTENT[moduleId];
        if (!module || !module.lectures) {
            alert('Für dieses Modul wurden keine Vorlesungen gefunden.');
            return;
        }

        const lectureContentDiv = document.getElementById('lecture-content');
        lectureContentDiv.innerHTML = `<h2 class="text-2xl font-bold mb-4">Vorlesungen für ${moduleId}</h2>`;

        const lectureList = document.createElement('ul');
        lectureList.className = 'space-y-2';
        for (const lectureId in module.lectures) {
            const listItem = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = lectureId; // Or a proper title if available
            button.className = 'w-full text-left p-3 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors';
            button.onclick = () => displayLectureContent(moduleId, lectureId);
            listItem.appendChild(button);
            lectureList.appendChild(listItem);
        }
        lectureContentDiv.appendChild(lectureList);
        
        buttons.startQuiz.style.display = 'none'; // Hide quiz button until a lecture is chosen
        showView('lecture');
    }

    function displayLectureContent(moduleId, lectureId) {
        currentLectureId = lectureId;
        const lecture = APP_CONTENT[moduleId].lectures[lectureId];
        const lectureContentDiv = document.getElementById('lecture-content');
        lectureContentDiv.innerHTML = `<h2 class="text-2xl font-bold mb-4">${lectureId}</h2>` + lecture.content;
        
        buttons.startQuiz.style.display = lecture.questions.length > 0 ? 'block' : 'none';
        showView('lecture');
    }


    // --- Quiz Logic ---
    function startQuiz() {
        const lecture = APP_CONTENT[currentModuleId]?.lectures[currentLectureId];
        if (lecture && lecture.questions.length > 0) {
            quizData = {
                lectureId: currentLectureId,
                questions: lecture.questions
            };
            currentQuestionIndex = 0;
            userScore = 0;
            renderCurrentQuestion();
            showView('quiz');
        } else {
            alert('Für diese Vorlesung wurde kein Quiz gefunden.');
            showView('lecture');
        }
    }

    function renderCurrentQuestion() {
        const quizContentDiv = document.getElementById('quiz-content');
        quizContentDiv.innerHTML = ''; // Clear previous content

        const questionData = quizData.questions[currentQuestionIndex];
        if (!questionData) {
            finishQuiz();
            return;
        }

        const questionEl = document.createElement('p');
        questionEl.className = 'quiz-question text-xl font-semibold mb-6';
        questionEl.textContent = `Frage ${currentQuestionIndex + 1}/${quizData.questions.length}: ${questionData.question}`;
        quizContentDiv.appendChild(questionEl);

        const optionsList = document.createElement('div');
        optionsList.className = 'quiz-options space-y-3';

        questionData.options.forEach(optionText => {
            const label = document.createElement('label');
            label.className = 'option-label block p-4 border rounded-lg hover:bg-gray-100 cursor-pointer';
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'quiz-option';
            radio.value = optionText;
            radio.className = 'mr-3';

            label.appendChild(radio);
            label.appendChild(document.createTextNode(optionText));
            optionsList.appendChild(label);
        });

        quizContentDiv.appendChild(optionsList);

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Antwort abschicken';
        submitButton.className = 'mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300';
        submitButton.addEventListener('click', () => {
            const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
            if (selectedOption) {
                checkAnswer(selectedOption.value, questionData.correctAnswer);
            } else {
                alert('Bitte wähle eine Antwort aus.');
            }
        });
        quizContentDiv.appendChild(submitButton);
    }

    function checkAnswer(selectedValue, correctAnswer) {
        if (selectedValue === correctAnswer) {
            userScore++;
        }
        currentQuestionIndex++;
        renderCurrentQuestion();
    }

    function finishQuiz() {
        const finalScore = (userScore / quizData.questions.length) * 100;
        
        updateLectureProgress(currentModuleId, quizData.lectureId, finalScore);

        alert(`Quiz beendet!\nDeine Punktzahl: ${finalScore.toFixed(0)}%`);
        
        quizData = null;
        currentQuestionIndex = 0;
        userScore = 0;
        loadModules(); // Reload modules to show updated progress
        showView('moduleMap');
    }

    // --- Event Listeners ---
    if (buttons.start) {
        buttons.start.addEventListener('click', () => {
            const userName = inputs.name.value.trim();
            if (userName) {
                let progress = getUserProgress();
                if (!progress) {
                    progress = getInitialProgress(userName);
                } else {
                    progress.userName = userName;
                }
                saveUserProgress(progress);
                displays.welcomeMessage.textContent = `Willkommen, ${userName}!`;
                loadModules();
                showView('moduleMap');
            } else {
                alert('Bitte gib deinen Namen ein.');
            }
        });
    }

    if (buttons.backToMap) {
        buttons.backToMap.addEventListener('click', () => {
            showView('moduleMap');
        });
    }

    if (buttons.startQuiz) {
        buttons.startQuiz.addEventListener('click', startQuiz);
    }

    // --- Initial Load ---
    init();
});
