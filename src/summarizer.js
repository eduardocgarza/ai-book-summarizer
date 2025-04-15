const fs = require("fs");
const pdfParse = require("pdf-parse");
const { OpenAI } = require("openai");
const pLimit = require("p-limit");
const path = require("path");

const {
  OPENAI_API_KEY,
  OPENAI_MODEL,
  SUMMARY_PROMPT,
  MAX_CONCURRENT_REQUESTS,
} = require("./config");
const { writeSummary } = require("./utils");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Create concurrency limiter
const limit = pLimit(MAX_CONCURRENT_REQUESTS);

/**
 * Extracts text content from a PDF file
 * @param {string} filePath - Path to the PDF file
 * @returns {Promise<string>} - Extracted text from the PDF
 */
async function extractTextFromPdf(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`Error extracting text from ${filePath}:`, error);
    throw error;
  }
}

/**
 * Handles large texts by truncating if necessary
 * @param {string} text - PDF text content
 * @param {number} maxTokens - Maximum tokens to keep
 * @returns {string} - Possibly truncated text
 */
function handleLargeText(text, maxTokens = 12000) {
  // Very rough estimation: 1 token ≈ 4 characters for English text
  const approxTokens = text.length / 4;

  if (approxTokens > maxTokens) {
    // Keep introduction and truncate the rest
    const charsToKeep = maxTokens * 4;
    return (
      text.substring(0, charsToKeep) +
      "\n\n[Note: The document was truncated due to length constraints.]"
    );
  }

  return text;
}

/**
 * Generates a summary for a single PDF
 * @param {string} pdfPath - Path to the PDF file
 * @param {string} outputDirectory - Directory to save the summary
 * @returns {Promise<Object>} - Result of the summarization
 */
async function summarizePdf(pdfPath, outputDirectory) {
  const filename = path.basename(pdfPath);
  console.log(`Processing: ${filename}`);

  try {
    // Extract text from PDF
    const pdfText = await extractTextFromPdf(pdfPath);

    // Handle large documents
    const processedText = handleLargeText(pdfText);

    // Generate summary using OpenAI
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a professional document summarizer that creates clear, comprehensive summaries in markdown format.",
        },
        {
          role: "user",
          content: SUMMARY_PROMPT + processedText,
        },
      ],
      temperature: 0.3,
    });

    const summary = response.choices[0].message.content;

    // Write summary to file
    const outputPath = await writeSummary(outputDirectory, filename, summary);

    return {
      filename,
      success: true,
      outputPath,
      error: null,
    };
  } catch (error) {
    console.error(`Error summarizing ${filename}:`, error);
    return {
      filename,
      success: false,
      outputPath: null,
      error: error.message,
    };
  }
}

/**
 * Summarizes multiple PDFs in parallel
 * @param {string[]} pdfPaths - Array of paths to PDF files
 * @param {string} outputDirectory - Directory to save summaries
 * @returns {Promise<Object[]>} - Results of all summarization operations
 */
async function summarizeMultiplePdfs(pdfPaths, outputDirectory) {
  console.log(`Starting to process ${pdfPaths.length} PDF files...`);

  const tasks = pdfPaths.map((pdfPath) => {
    return limit(() => summarizePdf(pdfPath, outputDirectory));
  });

  const results = await Promise.all(tasks);

  // Count successes and failures
  const successes = results.filter((r) => r.success).length;
  const failures = results.filter((r) => !r.success).length;

  console.log(
    `Processing complete. Successes: ${successes}, Failures: ${failures}`
  );

  return results;
}

module.exports = {
  summarizePdf,
  summarizeMultiplePdfs,
};
