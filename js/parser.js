// js/parser.js

async function parseContent() {
    const content = {};
    const response = await fetch('content/content-list.json');
    const fileList = await response.json();

    for (const filePath of fileList) {
        try {
            const fileResponse = await fetch(filePath);
            const fileContent = await fileResponse.text();
            
            const { attributes, body } = parseFrontmatter(fileContent);

            if (attributes.lecture) {
                // The lecture attribute is now just the lecture ID, e.g., "lecture-1"
                // The module is determined by the folder structure.
                const pathParts = filePath.split('/');
                const module = pathParts[1]; // e.g., "modul-1"
                const lecture = attributes.lecture;

                if (!content[module]) {
                    content[module] = { lectures: {} };
                }
                if (!content[module].lectures[lecture]) {
                    content[module].lectures[lecture] = { content: '', questions: [] };
                }

                if (attributes.type === 'learning-content') {
                    content[module].lectures[lecture].content += marked.parse(body);
                } else if (attributes.type === 'multiple-choice') {
                    const question = {
                        topic: attributes.topic,
                        question: attributes.question,
                        options: attributes.options,
                        correctAnswer: attributes.correctAnswer,
                        explanation: marked.parse(body)
                    };
                    content[module].lectures[lecture].questions.push(question);
                }
            }
        } catch (error) {
            console.error('Error parsing file:', filePath, error);
        }
    }
    return content;
}

function parseFrontmatter(content) {
    const frontmatterRegex = /^---([\s\S]*?)---/;
    const match = frontmatterRegex.exec(content);
    if (match) {
        const frontmatter = match[1];
        const body = content.slice(match[0].length);
        const attributes = jsyaml.load(frontmatter);
        return { attributes, body };
    }
    return { attributes: {}, body: content };
}
