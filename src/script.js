const buttonNavigations = document.querySelectorAll(`[data-target]`);

const inputFile = document.getElementById("input-file");
const labelInputFile = document.getElementById("label-input-file");
const submitButton = document.getElementById("btn-submit");
const loadingContainer = document.getElementById('loading');
const analysisContainer = document.getElementById('analysis');
const cvNameContainer = document.getElementById('cv-name-container');
const cvNameParagraph = document.getElementById('cv-name-paragraph');
// const loadingParagraph = document.getElementById("loading");



const result = {
    contactInformation: {
        analysis: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum tempore exercitationem asperiores cumque excepturi reprehenderit fugiat corporis, ad odit molestias.",
        keysteps: ['Step 1', 'Step 2'],
        score: 60,
    },
    skill: {
        analysis: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum tempore exercitationem asperiores cumque excepturi reprehenderit fugiat corporis, ad odit molestias.",
        keysteps: ['Step 1', 'Step 2'],
        score: 80,
    },
    profesionalSummary: {
        analysis: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum tempore exercitationem asperiores cumque excepturi reprehenderit fugiat corporis, ad odit molestias.",
        keysteps: ['Step 1', 'Step 2'],
        score: 30,
    },
    experience: {
        analysis: "Lorem Ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum tempore exercitationem asperiores cumque excepturi reprehenderit fugiat corporis, ad odit molestias.",
        keysteps: ['Step 1', 'Step 2'],
        score: 80,
    },
    education: {
        analysis: "Lorem Ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum tempore exercitationem asperiores cumque excepturi reprehenderit fugiat corporis, ad odit molestias.",
        keysteps: ['Step 1', 'Step 2'],
        score: 80,
    },
    // errorWriting: {
    //     analysis: "Lorem Ipsum",
    //     keysteps: ['Step 1', 'Step 2'],
    //     score: 80,
    // },
    overall: {
        analysis: "Lorem Ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum tempore exercitationem asperiores cumque excepturi reprehenderit fugiat corporis, ad odit molestias.",
        score: 60,
    },
};

for (let i = 0; i < buttonNavigations.length; ++i) {
    buttonNavigations[i].addEventListener('click', () => {
        scrollToSection(buttonNavigations[i].dataset.target);
    });
}

inputFile.addEventListener('change', () => {
    cvNameContainer.classList.remove('hidden');
    const cv = inputFile.files[0];
    cvNameParagraph.textContent = cv.name;
})

submitButton.addEventListener("click", async () => {
    try {
        const formData = new FormData();
        const cv = inputFile.files[0];
        if (!cv) {
            alert("Tolong input CV terlebih dahulu");
            return;
        }
        formData.set("cv", inputFile.files[0]);

        inputFile.disabled = true;
        loadingContainer.classList.remove('hidden');
        analysisContainer.classList.add('hidden');
        labelInputFile.style.cursor = 'not-allowed';
        submitButton.textContent = "Loading...";
        submitButton.disabled = true;

        // await sleep(5000);
         const resp = await fetch("/review", {
             method: "POST",
             body: formData,
         });

        const result = await resp.json();
        console.log(result);
        console.log(Object.keys(result));

        inputFile.disabled = false;
        labelInputFile.style.cursor = 'pointer';
        submitButton.textContent = "Review Sekarang";
        submitButton.disabled = false;
        loadingContainer.classList.add('hidden');
        analysisContainer.classList.remove('hidden');
        renderResultToScreen(result);
    } catch (error) {
        console.log(error);
    }
});

function sleep(time = 2000) {
    return new Promise(res => {
        setTimeout(() => {
            res(null);
        }, time)
    })
}


function scrollToSection(targetId) {
    const container = document.getElementById('content-container');
    const targetEl = document.getElementById(targetId);
    const containerY = container.getBoundingClientRect().top;
    const targetY = targetEl.getBoundingClientRect().top;
    container.scrollTo({
        top: container.scrollTop + (targetY - containerY),
        behavior: 'smooth'
    })
}

function renderResultToScreen(result) {
    const parent = document.getElementById('content-container');
    const overallElement = createOverallElement(result['overall']);
    parent.appendChild(overallElement);
    Object.keys(result).forEach((key) => {
        if (key !== 'overall') {
            const newElement = createNewElement(key, result);
            parent.appendChild(newElement);
        }
    });
}

function createOverallElement(content) {
    const newElement = document.createElement('div');
    newElement.id = "overall-analysis";
    newElement.className = "flex items-center text-black gap-5 bg-white p-4 lg:p-6 rounded-lg border relative z-[5] content";

    const contentContainer = document.createElement('div');
    contentContainer.className = "text-neutral-900";
    newElement.appendChild(contentContainer);

    const titleParagraph = document.createElement('p');
    titleParagraph.textContent = "Overall Impression";
    titleParagraph.className = "text-[#183F78] text-sm lg:text-base font-extrabold mb-3";
    contentContainer.appendChild(titleParagraph);

    const contentParagraph = document.createElement('p');
    contentParagraph.textContent = content.analysis;
    contentParagraph.className = "text-xs lg:text-sm font-medium  text-justify";
    contentContainer.appendChild(contentParagraph);

    const scoreContainer = document.createElement('div');
    scoreContainer.className = `flex flex-col items-center justify-center rounded-full border p-5`;
    scoreContainer.style.background = getScoreColor(content.score, 0.2);
    newElement.appendChild(scoreContainer);

    const scoreParagraph = document.createElement('p');
    scoreParagraph.textContent = "SCORE";
    scoreParagraph.className = "text-xs font-medium";
    scoreContainer.appendChild(scoreParagraph);

    const scoreParagraphText = document.createElement('strong');
    scoreParagraphText.textContent = `${content.score}%`;
    scoreParagraphText.className = "text-lg font-extrabold text-green-800";
    scoreParagraphText.style.color = getScoreColor(content.score);
    scoreContainer.appendChild(scoreParagraphText);

    return newElement;
}

function createNewElement(key, result) {
    const id = `${key}-analysis`;
    const content = result[key];
    const newElement = document.createElement('div');
    newElement.id = id;
    newElement.className = "flex flex-col text-black bg-white p-4 lg:p-6 rounded-lg border relative z-[5] content";
    const headingContainer = document.createElement('div');
    headingContainer.className = "flex justify-between";
    newElement.appendChild(headingContainer);

    const titleParagraph = document.createElement('p');
    titleParagraph.textContent = key.split(/(?=[A-Z])/).join(" ");
    titleParagraph.className = "text-[#183F78] text-sm lg:text-base font-extrabold mb-3 capitalize";

    const scoreParagraph = document.createElement('p');
    scoreParagraph.textContent = "Score : ";
    scoreParagraph.className = "text-sm lg:text-base text-neutral-600 font-bold";
    const scoreParagraphText = document.createElement('strong');
    scoreParagraphText.textContent = `${content.score}%`;
    scoreParagraphText.style.color = getScoreColor(content.score);
    scoreParagraph.appendChild(scoreParagraphText);

    headingContainer.appendChild(titleParagraph);
    headingContainer.appendChild(scoreParagraph);

    const mainContainer = document.createElement('div');
    mainContainer.className = "flex flex-col gap-2 text-xs lg:text-sm font-medium text-justify text-neutral-900";
    newElement.appendChild(mainContainer);


    const analysisContainer = document.createElement('div');
    analysisContainer.className = "space-y-1 md:space-y-2";
    mainContainer.appendChild(analysisContainer);

    const analysisTitle = document.createElement('p');
    analysisTitle.textContent = "Analysis";
    analysisTitle.className = "font-bold";
    analysisContainer.appendChild(analysisTitle);

    const analysisContent = document.createElement('p');
    analysisContent.textContent = content.analysis;
    analysisContainer.appendChild(analysisContent);

    const keyStepContainer = document.createElement('div');
    keyStepContainer.className = "space-y-1 md:space-y-2";
    mainContainer.appendChild(keyStepContainer);


    const stepContainer = document.createElement('div');
    stepContainer.className = "space-y-1";
    keyStepContainer.appendChild(stepContainer);

    const keyStepTitle = document.createElement('p');
    keyStepTitle.textContent = "Key Steps";
    keyStepTitle.className = "font-bold";
    stepContainer.appendChild(keyStepTitle);

    if (content.keySteps) {
        for (let i = 0; i < content.keySteps.length; ++i) {
            const keyStepText = document.createElement('p');
            keyStepText.textContent = content.keySteps[i];
            stepContainer.appendChild(keyStepText);
        }
    }

    return newElement;
}

function getScoreColor(score, opacity = 1) {
    if (score < 50) return `rgb(217 25 25 / ${opacity})`;
    else if (score > 50 && score < 70) return `rgb(235 151 23 / ${opacity})`;
    else return `rgb(4 131 98 / ${opacity})`;
}
