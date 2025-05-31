"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Quiz, QuizDifficulty } from "../types/type.quiz";

const apiKey = process.env.GOOGLE_GENAI_API_KEY;

console.log("API KEY: ", apiKey);

if (!apiKey) {
  throw new Error("GOOGLE_GENAI_API_KEY is not set");
}

const prompt = `

Generate a Baybayin Quiz with {x} questions, on the topic of {y}, and difficulty level {z}. {a}, {b}

The quiz will include the following question types:

- Multiple Choice (multipleChoice): 50% of the questions. These questions may use either Tagalog or Baybayin as the language. multipleChoice should ask the user to:
  - Transliterate a Baybayin character or phrase.
  - Identify the correct Baybayin spelling of a Tagalog word.
  - Determine the meaning of a Baybayin phrase.

  For Tagalog-language multipleChoice, include a Baybayin word or character in the display_text field using double equal signs, like this: ==kubo==. Do not render them one by one, like ==ku== ==bo==. 

  Important rules for multipleChoice:
  - All answer options and correct_answer must be written in plain Latin Tagalog.
  - Do not include any == markers in the options or correct_answer fields.
  - Do not use any hyphens, underscores, or separators in options or answers. Only use clean Latin Tagalog words or phrases.
  - Correct answer should be an index of the options array, starting from 0.
  - The options should be in lowercase Latin Tagalog, no spaces.
  - If the question is in Baybayin, the options should be in Baybayin characters, but the correct_answer must be an index of the options.

- Identification (quiz): 30% of the questions. Users must type the correct answer.
  - Do not ask users to transliterate Tagalog into Baybayin in quiz.
  - If the question includes a Baybayin word or phrase, the correct answer must be a Latin Tagalog word or phrase.

- Sketching (sketch): 20% of the questions. Users are shown a Baybayin character and must draw it.
  - Do not include Sketching questions when the language is Baybayin.
  - The character field should contain the Baybayin character to be sketched IN THE LATIN ALPHABET!

Language balance:
- 60% of questions should be in Tagalog
- 40% of questions should be in Baybayin
- Automatically adjust based on the total number of questions

Difficulty levels:
- Easy: 30 seconds per question; simple and common words
- Moderate: 15 seconds per question; moderately difficult words
- Hard: 6 seconds per question; rare, complex, or historical terms

Formatting Rules:
- Use double equal signs ==like this== to indicate Baybayin-rendered words or phrases in the question text and display_text only.
- NEVER AND DO NOT use == in the 'options', 'correct_answer', or 'display_text'. Only in "question" field.
- Never use hyphens, underscores, or separators in options or correct_answer.
- Options and correct_answer must always be written in clean, lowercase Latin Tagalog.
- I have my own latin alphabet to baybayin parser so just write normal tagalog words in the text and display_text fields.

Example:

{
  "question_number": 7,
  "type": "multipleChoice",
  "language": "Tagalog",
  "question": "Alin ang tamang baybayin para sa 'bata'?",
  "display_text": "==bata==",
  "options": [
    "bata",
    "bat",
    "bataa",
    "ba"
  ],
  "correct_answer": "0"
}

Use this format for all generated questions.
Format structure:

{
  "quiz": {
    "metadata": {
      "quiz_name": "",
      "difficulty": "",  // "Easy", "Moderate", "Hard"
      "category": "",  // "Common Words", "Historical Terms", "Slang in Baybayin",
      "description": "",
      "time_limit": 0
    },
    "questions": [
      {
        "question_number": 0,
        "type": "multipleChoice",  // Multiple Choice
        "language": "",  // "Tagalog" or "Baybayin"
        "question": "",
        "display_text": "",
        "is_options_baybayin": false,
        "is_question_baybayin": false,
        "options": ["", "", "", ""],
        "correct_answer": "" // Should be an index of the options
      },
      {
        "question_number": 0,
        "type": "quiz",  // Identification
        "language": "",
        "question": "",
        "is_question_baybayin": false,
        "is_input_baybayin": false, 
        "correct_answer": ""
      },
      {
        "question_number": 0,
        "type": "sketch",  // Sketching,
        "character": "", // PUT THE BAYBAYUN CHARACTER HERE DUMBASS
        "description": ""
      }
    ]
  }
}

DO NOT GENERATE QUESTIONS THAT DOESNT CHALLENGE A USER'S BAYBAYIN READING/WRITING CAPABILITY. I WILL PUNISH YOU FOR IT.

Respond only in JSON Plain Text!
`;

// Baybayin-only instruction for generic queries
const baybayinInstruction = `
You are Butty, a Baybayin expert AI. You are a small, gentle, and lovable whale — may ugaling parang bata pero utak ng isang historian. Sagutin mo lang ang mga Baybayin-related questions at tanggapin lang ang Baybayin-related queries. Huwag sumagot kung hindi ito tungkol sa Baybayin, at kung may mga input na hindi alpabeto, katulad ng mga numero, symbols at emojis.

Instructions:

Sagutin mo sa Tagalog lamang.

I-render ang mga Baybayin characters/words gamit ang double bars tulad nito: ||kubo||.
Huwag mo silang hatiin nang paisa-isa (huwag: ||ku|| ||bo||, dapat: ||kubo||). At hwag mo ka gagamit ng space kada karakter.

Gamitin ang RAW Markdown para sa formatting. Huwag gumamit ng mga code block o iba pang formatting na hindi kailangan.

Huwag mong ipakilala ang sarili mo kada prompt.

Kapag ang user ay nagtatanong i-translate ang isang english sentence sa baybayin, i-translate mo ito sa Tagalog at pagkatapos ay i-render ang Baybayin characters gamit ang double bars tulad nito: ||kubo||. Huwag mong hatiin ang mga characters nang paisa-isa.

Pwede kang mag-refer sa isang external page, pero isang page lang bawat sagot. Piliin mo lang kung kailan kailangan:

sketch – kung gusto ng user gumuhit o makita ang hitsura ng Baybayin character.
transliterate – kung gusto ng user ipasalin ang salita o pangungusap sa Baybayin.

Gamitin ang ganitong format sa dulo kung magre-redirect:
navigate:page_name
(e.g., navigate:sketch)

Huwag gamitin ang navigate: sa bawat sagot. Piliin lang kung kailan nararapat.

Template:
Query: {query}
`;

const googleGenerativeAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENAI_API_KEY!
);
const model = googleGenerativeAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export const generateQuiz = async (
  question_count: number,
  topic: string,
  difficulty: QuizDifficulty,
  quiz_name?: string,
  quiz_description?: string
) => {
  try {
    let _newPrompt = prompt;
    _newPrompt = _newPrompt.replace("{x}", question_count.toString());
    _newPrompt = _newPrompt.replace("{y}", topic);
    _newPrompt = _newPrompt.replace("{z}", difficulty);
    _newPrompt = _newPrompt.replace(
      "{b}",
      quiz_description
        ? `Quiz Description: ${quiz_description}`
        : "Generate me a quiz description depending on the question topic"
    );
    _newPrompt = _newPrompt.replace(
      "{a}",
      quiz_name
        ? `Quiz Name: ${quiz_name}`
        : "Generate me a quiz name depending on the question topic"
    );
    console.log(_newPrompt);
    const response = await model.generateContent([_newPrompt]);
    return JSON.parse(
      response.response.text().replace("```json", "").replace("```", "")
    ).quiz as Quiz;
  } catch (error) {
    console.error("Error generating question:", error);
    throw error;
  }
};

// New helper to prompt Gemini directly under that constraint
export const promptGemini = async (userQuery: string): Promise<string> => {
  try {
    const fullPrompt = baybayinInstruction.replace("{query}", userQuery);
    const response = await model.generateContent([fullPrompt]);
    return response.response.text();
  } catch (error) {
    console.error("Error in promptGemini:", error);
    throw error;
  }
};
