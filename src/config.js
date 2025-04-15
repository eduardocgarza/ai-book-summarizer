require("dotenv").config();

// Directory containing PDF files to summarize
const PDF_DIRECTORY = process.env.PDF_DIRECTORY || "./pdfs";

// Directory for output summaries
const OUTPUT_DIRECTORY = process.env.OUTPUT_DIRECTORY || "./output";

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4-turbo-preview";

// Concurrency limit for API requests
const MAX_CONCURRENT_REQUESTS = parseInt(
  process.env.MAX_CONCURRENT_REQUESTS || "5"
);

// Prompt template for summarization
const SUMMARY_PROMPT = `
You are a professional document summarizer. Your task is to create a comprehensive 
summary of the provided PDF content. Follow these guidelines:

1. Begin with a brief overview of the document's main purpose and key findings
2. Create a structured summary with sections and subsections if applicable
3. Include all important concepts, arguments, and conclusions
4. Use bullet points for lists of features, benefits, or steps
5. Keep the language clear, concise, and professional
6. Format the response as Markdown
7. The summary should be thorough but concise, capturing all essential information

Here is the document content to summarize:

`;

module.exports = {
  PDF_DIRECTORY,
  OUTPUT_DIRECTORY,
  OPENAI_API_KEY,
  OPENAI_MODEL,
  MAX_CONCURRENT_REQUESTS,
  SUMMARY_PROMPT,
};
