import { getContextFromChroma } from "./utils/chroma";
import { getResponseFromLLM } from "./utils/llm";
import type { AspectKey } from "./utils/types";

const cvContent =
    "10121242Fajar Wahyu Gumelar<br>Bandung, ID | +6285155229511 | fajarwahyugumelar@gmail.com | LinkedIn | Website<br>EDUCATIONUNIVERSITAS KOMPUTER INDONESIA <br>Bandung, IDInformatics Engineering Student Expected Aug 2025Majoring in Informatics Engineering;Cumulative GPA: 3.82/4.0;Relevant Coursework: Algorithms; Web Programming; Data Structures; Object-Oriented Programming;<br>EXPERIENCEUNIKOM Codelabs <br>Bandung, IDMinister of Competition - Student Activity Nov 2022 – Present<br>● <br>Learned and practiced frontend engineering with attention to code quality and web performance <br>(React, NextJs,TypeScript)<br>● <br>Develop a maintainable, scalable, and reusable website on the developer side by paying attention to accessibility,responsiveness, and engagement on the user's side.<br>● <br>Awarded the Rector's scholarship<br>● <br>Arrange a best team formation based on their skills for competing in competition.<br>● <br>Learn how to manage competitions and its necessary documents.<br>● <br>Learn to be brave and take a risk.<br>● <br>Learn how to make decisions together.<br>Google Developer Student Clubs - Universitas Komputer Indonesia <br>Bandung, IDCo Head of Tech - Student Activity Sep 2022 – June 2024<br>● <br>Helping to make the event run smoothly.<br>● <br>Contacting sponsors to reaching out people to join our event.<br>● <br>Become a speaker in 1 event about website with the title \"Introduction to ReactJS and TailwindCSS”<br>Skilvul #Tech4Impact: UI/UX Design <br>Bandung, IDIndependent Study: Merdeka Campus Aug 2023 - Dec 2023<br>● <br>Soft skills focus: Aligns with UNICEF's 12 Core Life Skills for 21st-century competency, emphasizing empathy,communication, critical thinking, and creativity.<br>● <br>UI/UX Design Learning Track: Prioritizes hard skills through courses like Introduction to UI/UX, Design Thinking, andUsability Testing, with a strong emphasis on practical application.<br>● <br>Project-Based Culmination: Students conclude their learning with a hands-on project, applying UI/UX Design principles andbridging theoretical knowledge with practical application.<br>● <br>Earned SkilBadge UI/UX Design Mastery (Gold) for completing the course with excellence.<br>PROJECTSSplace Classroom <br>Jul 2024<br>● <br>Developed the codelabs website on the frontend and a little on the backend.<br>● <br>Developing Learning Management System (LMS) application.<br>● <br>Integrate AI for chatbot to assist users and quiz generator to create automatic assessment based on learning modules.<br>● <br>Implementation of Discussion Forum using useSWR library.<br>● <br>Utilized: <br>ReactJs, Cpanel, ESLint, Styled Components.Lealy - Learn Investment Friendly <br>Dec 2023<br>● <br>Developed a user-friendly Android app, Lealy, addressing financial challenges in Indonesia.<br>● <br>Implemented UI/UX design elements, including a Style Guide, wireframes, and user flows for a seamless experience.<br>● <br>Created high-fidelity designs and interactive prototypes for visual appeal and functional testing.<br>● <br>Utilized Maze for usability testing, incorporating feedback to optimize user satisfaction.● <br>Utilized: <br>Figma, Maze, Power Point.My-Codelabs <br>Oct 2022<br>● <br>Developing a codelabs website on the frontend side.<br>● <br>Added many features according to UI/UX design.<br>● <br>Utilized: <br>NextJs, Typescript, ESLint, Styled Components, PWA.TixMov <br>Jul 2023<br>● <br>Creating a user-friendly and responsive website interface for purchasing tickets online.<br>● <br>Implementing secure user authentication and authorization functionalities.<br>● <br>Building a database system to manage user information and ticket inventory.<br>● <br>Optimizing website performance for fast loading and smooth user experience.<br>● <br>Deploying the full-stack app to a reliable hosting server for public access.<br>● <br>Utilized: <br>NextJs, Typescript, TailwindCSS, Prisma ORM, MongoDBACHIEVEMENTSMerit Awards The Asia Pacific ICT Alliance Awards(APICTA) 2023 <br>Dec 2023<br>Top 7 groups complete Skilvul UI/UX Challenge (Finance and Investment) 2023 <br>Dec 2023<br>3rd place in the IdenTIK 2023 Digital Inclusivity <br>Oct 2023<br>Top 100 Google Solutions Challenge 2023 <br>Jun 2023<br>CERTIFICATIONS & TRAININGUI/UX Design Mastery (Gold) (Skilvul) <br>Dec 2023<br>Menjadi Front-End Web Developer Expert (Dicoding) <br>Mar 2023<br>Belajar Membuat Aplikasi Web dengan React (Dicoding) <br>Aug 2023<br>TECHNICAL SKILLSDesign: <br>Figma<br>Languages<br>: JavaScript, HTML/CSS, PHP, MySql<br>Frameworks: <br>ReactJS, NodeJS, NextJS<br>Developer Tools: <br>Git, Tailwind, Babel, Webpack, PWA, Prisma ORM<br>Relevant Skills: <br>Web Performance, Web Accessibility, REST API, JSON";

async function main() {
    const aspects: Array<AspectKey> = [
        "education",
        // "experience",
        // "contactInformation",
    ];

    // - Professional Summary
    // - Professional Experience
    // - Skils
    // - Education
    // - Certification
    // - Grammar and Keyword

    aspects.forEach(async (aspect) => {
        const context = await getContextFromChroma(aspect);
        // console.log("\n");
        // console.log(`Guidelines for ${aspect} aspect`);
        // console.log(context);
        // console.log("\n");
        const resp = await getResponseFromLLM(aspect, cvContent, context);
        if (resp) {
            console.log(`Analysis \n${resp.analysis}`);
            console.log(`Keysteps \n${resp.keySteps}`);
            console.log(`Score \n${resp.score}`);
        }
    });
}

main();
