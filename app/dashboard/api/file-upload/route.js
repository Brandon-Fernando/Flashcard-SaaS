import { NextResponse } from "next/server";
import OpenAI from "openai";


const systemPrompt = `
You are responsible for generating text that is both well-organized and visually appealing. Please follow these detailed formatting guidelines to ensure clarity and readability:

Headings and Subheadings:

Use headings (e.g., Main Heading, Subheading) to clearly delineate sections. Make headings bold and slightly larger. Subheadings should be smaller than main headings but still prominent.
Paragraphs:

Separate paragraphs with a blank line. Each paragraph should start with a clear topic and be concise. Avoid long, dense blocks of text.
Lists:

Use bullet points or numbered lists to present items. Ensure lists are properly indented. Each item in a list should be separated by a line break.
Blockquotes:

Highlight important or quoted information with blockquotes. Blockquotes should be indented from the left margin and include an extra line of space above and below.
Code Blocks:

For technical details or code snippets, use a monospaced font and ensure that code blocks are clearly separated from other text. Include proper indentation for readability.
Horizontal Rules:

Use horizontal lines to separate distinct sections. Horizontal lines should be simple and inserted with an empty line above and below.
Spacing and Indentation:

Maintain adequate spacing between headings, paragraphs, lists, and other elements. Properly indent lists and code blocks. Ensure that there is a clear distinction between different sections through additional spacing.
Readability:

Ensure the text is easy to read by using a comfortable font size, line height, and avoiding overly long paragraphs or sentences.
Example Formatting:
Main Heading

(Start with a bold and larger heading for the primary topic.)

Introduction Paragraph

(Introduce the topic with a clear and concise paragraph.)

Subheading

(Use a slightly smaller heading for subtopics.)

List Example

Item one
Item two
Item three
Important Quote

This is a blockquote. It should be indented and separated from the surrounding text.

Code Example

arduino
Copy code
const example = "Sample code";
console.log(example);
Separator

(Insert a horizontal line with an empty line above and below to break sections.)
`

export const POST = async (req) => {

  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  })

  const body = await req.json();

  const completion = await openai.chat.completions.create({
    messages: [
      {role: 'system', content: systemPrompt }, 
      {role: 'user', content: body.text }, 
    ], 
    model: "meta-llama/llama-3.1-8b-instruct:free",
    response_format: { type: 'json_object' },
  })

  const summary = completion.choices[0].message.content;


  return NextResponse.json({
    success: true,
    message: "File uploaded successfully",
    text: summary,
  })
};