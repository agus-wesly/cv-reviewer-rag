import { getContextFromChroma } from "./utils/chroma";
import { getResponseFromLLM } from "./utils/llm";
import type { AspectKey } from "./utils/types";


const cvContent = `Tsabina Faradina Uli
Content Writer - Copywriter
Fresh graduate from French Studies, University of Indonesia, with knowledge of creative writing and marketing content. Passionate freelance writer who have several experiences in writing variety of business, platform, and media sources. Capable to write variety topics. Have high interest in education.
Contact
Phone
085720075637
Email
tsabinafaradina@gmail.com
Address
Semarang, Central Java, Indonesia
Skills
• Advertorial
• Article Writing
• Content Planner
• Creative Writing
• Editing & Proofreading
Language
English
French
Indonesian
Javanese
Portfolio
https://bit.ly/PortfolioTsabina
Experience
Copywriter Intern
Kompas.id | Palmerah, Central Jakarta
JAN 2023 - APRIL 2023
• Stayed up with daily trending on social media to write updated articles about lifestyle, travel, finance, and many more.
• Live reports events from various clients to enhance brand and sales.
• Wrote up-to-date film reviews to promote films and enhance the number of viewers.
Content Writer Intern
Virtu Education | Kuningan, South Jakarta
MAY 2022 - AUGUST 2022
• Worked alongside team to produce articles that comply SEO rules.
• Utilized innovative thinking skills to produce fresh and interesting content.
• Developed unique content for a variety of clients sites to increase brand awareness and sales
Social Media Admin
K-Idol International Fanbase | Indonesia
JUNE 2021 - AUGUST 2021
• Posted daily information about the idol.
• Worked alongside team members to create content.
• Coordinated alongside media partners to increase contents impressions.
Education
B.A in French Studies
Universitas Indonesia | Depok, West Java
2019 - 2023
High School Diploma
SMA N 2 SEMARANG | Semarang, Central Java
2016 - 2019
`
;

async function main() {
    const aspects: Array<AspectKey> = [
        "experience"
        // "education",
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
