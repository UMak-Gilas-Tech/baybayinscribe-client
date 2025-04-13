import { GoogleGenerativeAI } from "@google/generative-ai";
import { Quiz, QuizDifficulty } from "../types/type.quiz"

const apiKey = process.env.GOOGLE_GENAI_API_KEY;

if (!apiKey) {
  throw new Error("GOOGLE_GENAI_API_KEY is not set");
}

const prompt = `

Generate a Baybayin Quiz with {x} questions, on the topic of {y}, and difficulty level {z}. {a}, {b}

The quiz will include the following question types:

- Multiple Choice (MCQ): 50% of the questions. These questions may use either Tagalog or Baybayin as the language. MCQs should ask the user to:
  - Transliterate a Baybayin character or phrase.
  - Identify the correct Baybayin spelling of a Tagalog word.
  - Determine the meaning of a Baybayin phrase.

  For Tagalog-language MCQs, include a Baybayin word or character in the display_text field using double equal signs, like this: ==kubo==.

  Important rules for MCQs:
  - All answer options and correct_answer must be written in plain Latin Tagalog.
  - Do not include any == markers in the options or correct_answer fields.
  - Do not use any hyphens, underscores, or separators in options or answers. Only use clean Latin Tagalog words or phrases.

- Identification (IDT): 30% of the questions. Users must type the correct answer.
  - Do not ask users to transliterate Tagalog into Baybayin in IDT.
  - If the question includes a Baybayin word or phrase, the correct answer must be a Latin Tagalog word or phrase.

- Sketching (SKT): 20% of the questions. Users are shown a Baybayin character and must draw it.
  - Do not include Sketching questions when the language is Baybayin.
  - The character field should contain the Baybayin character to be sketched IN LATIN

- Word Matching (optional): A matching-type activity with five Baybayin characters and five Latin transliterations in shuffled order. Users must match them correctly.

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
- Never use == in the options, correct_answer, or display_text. Only in "question" field.
- Never use hyphens, underscores, or separators in options or correct_answer.
- Options and correct_answer must always be written in clean, lowercase Latin Tagalog.

Baybayin-Compatible Character Format:
Use only the following values:
a,b,ba,be_bi,bo_bu,d_r,da_ra,de_di_re_ri,do_du_ro_ru,e_i,g,ga,ge_gi,go_gu,h,ha,he_hi,ho_hu,k,ka,ke_ki,ko_ku,l,la,le_li,lo_lu,m,ma,me_mi,mo_mu,n,na,ne_ni,ng,nga,nge_ngi,ngo_ngu,no_nu,o_u,p,pa,pe_pi,po_pu,s,sa,se_si,so_su,t,ta,te_ti,to_tu,w,wa,we_wi,wo_wu,y,ya,ye_yi,yo_yu

Notes:
- Append '+' to remove a vowel: 'ga+' = g, 'he_hi+' = h
- A lone consonant will auto-append 'a' unless it ends in '+' (e.g., 'g' = 'ga', but 'g+' = g)

Example:

{
  "question_number": 7,
  "type": "MCQ",
  "language": "Tagalog",
  "question": "Alin ang tamang baybayin para sa 'bata'?",
  "display_text": "==bata==",
  "options": [
    "bata",
    "bat",
    "bataa",
    "ba"
  ],
  "correct_answer": "bata"
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
        "type": "MCQ",  // Multiple Choice
        "language": "",  // "Tagalog" or "Baybayin"
        "question": "",
        "display_text": "",
        "is_options_baybayin": false,
        "is_question_baybayin": false,
        "options": ["", "", "", ""],
        "correct_answer": ""
      },
      {
        "question_number": 0,
        "type": "IDT",  // Identification
        "language": "",
        "question": "",
        "is_question_baybayin": false,
        "is_input_baybayin": false, 
        "correct_answer": ""
      },
      {
        "question_number": 0,
        "type": "SKT",  // Sketching,
        "character": "", // PUT THE BAYBAYUN CHARACTER HERE DUMBASS
        "description": ""
      }
    ]
  }
}

DO NOT GENERATE QUESTIONS THAT DOESNT CHALLENGE A USER'S BAYBAYIN READING/WRITING CAPABILITY. I WILL PUNISH YOU FOR IT.

Respond only in JSON Plain Text!
`

const googleGenerativeAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENAI_API_KEY!
);
const model = googleGenerativeAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

export const generateQuiz = async (question_count: number, topic: string, difficulty: QuizDifficulty, quiz_name?: string, quiz_description?: string) => {
  try {
    let _newPrompt = prompt;
    _newPrompt = _newPrompt.replace("{x}", question_count.toString());
    _newPrompt = _newPrompt.replace("{y}", topic);
    _newPrompt = _newPrompt.replace("{z}", difficulty);
    _newPrompt = _newPrompt.replace("{b}", quiz_description ? `Quiz Description: ${quiz_description}` : "Generate me a quiz description depending on the question topic");
    _newPrompt = _newPrompt.replace("{a}", quiz_name ? `Quiz Name: ${quiz_name}` : "Generate me a quiz name depending on the question topic");
    console.log(_newPrompt)
    const response = await model.generateContent([_newPrompt]);
    return JSON.parse(response.response.text().replace("```json", "").replace("```", "")).quiz as Quiz;
  } catch (error) {
    console.error("Error generating question:", error);
    throw error;
  }
};
