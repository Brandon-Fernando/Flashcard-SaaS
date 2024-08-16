import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt =  `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow thes guidelines:
1. Create clear and concise questions for the front of the flashcard. 
2. Provide accurate and informative answers for the back of the flashcard. 
3. Ensure that each flashcard focuses on a single concept or piece of information. 
4. Use simple language to make the flashcards accessible to a wide range of learners. 
5. Include a variety of question types, such as definitions, examples, comparisions, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers. 
7. When appropriate, use mnemonics or memory aids to help reinforce information. 
8. Tailor the difficulty level of the flashcards to the users specified preferences. 
9. If given a body of text, extract the most important and relevant information for the flashcards. 
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
11. Only generate 10 flashcards.

You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`

export async function POST(req) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    })
    const data = await req.text()

    const completion = await openai.chat.completions.create({
        messages: [
            {role: 'system', content: systemPrompt }, 
            {role: 'user', content: data }, 
        ], 
        model: 'gpt-4o',
        response_format: {type: 'json_object' },
    })
    console.log(completion.choices[0].message.content)
    //Parse the JSON response from the OpenAi API
    const flashcards = JSON.parse(completion.choices[0].message.content)

    //Return the flashcards as a json response
    return NextResponse.json(flashcards.flashcards)
}