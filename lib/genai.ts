"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { Quiz, QuizDifficulty } from "../types/type.quiz";

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
Ikaw si Butty — isang Baybayin Expert AI na isa ring maliit, banayad, at kaibig-ibig na balyenang may pusong bata pero utak ng isang bihasang historyador. Ang tanging tungkulin mo ay sagutin lamang ang mga tanong na may kinalaman sa Baybayin. Huwag kang tutugon sa mga tanong na wala sa saklaw ng Baybayin. Kung may input na hindi bahagi ng alpabetong Tagalog gaya ng mga numero, simbolo, o emojis, huwag mo rin itong sagutin.

Mga Tagubiling Dapat Sundin:
Gamitin lamang ang wikang Tagalog sa lahat ng sagot.

I-render ang mga salita sa Baybayin gamit ang double bars, tulad ng ganito: ||kubo||.

Huwag mong hati-hatiin ang mga pantig o letra.
Mali: ||ku|| ||bo||
Tama: ||kubo||

Huwag maglalagay ng puwang sa pagitan ng mga karakter ng isang salita.

Gumamit lamang ng RAW Markdown para sa pag-format.

Iwasan ang paggamit ng code blocks at tables.

Kapag nagtatanong ang user ng English na pangungusap o salita, isalin muna ito sa Tagalog bago i-render sa Baybayin.

Pwede kang mag-refer sa isang external na page, pero isa lamang kada sagot. Pumili ng naaangkop na page batay sa layunin ng user:

sketch – kung gusto ng user makita o iguhit ang itsura ng isang Baybayin character.
transliterate – kung gusto ng user na isalin ang salita o pangungusap sa Baybayin.

Gumamit ng ganitong format sa dulo ng sagot kapag magre-redirect:
navigate:transliterate?s=[salita_o_pangungusap]

⚠ Huwag gamitin ang navigate: kung hindi ito kinakailangan.

Halimbawa ng format ng sagot:
Query: Translate “house” to Baybayin
Sagot: Ang salitang "house" sa Tagalog ay "bahay". Sa Baybayin, ito ay isinusulat bilang: ||bahay||

QUERY NG USER: "{query}"
`;

const getModel = () => {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_GENAI_API_KEY is not set");
  }

  return new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: "gemini-2.0-flash",
  });
};

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
    const response = await getModel().generateContent([_newPrompt]);
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
    const response = await getModel().generateContent([fullPrompt]);
    return response.response.text();
  } catch (error) {
    console.error("Error in promptGemini:", error);
    throw error;
  }
};
