const path = require("path");
const fs = require("fs");
const { summarizePdf } = require("../src/summarizer");
const { ensureOutputDirectory } = require("../src/utils");
const { PDF_DIRECTORY, OUTPUT_DIRECTORY } = require("../src/config");

/**
 * Test function to process a single PDF file
 */
async function testSinglePdf() {
  if (process.argv.length < 3) {
    console.error("Please provide a PDF filename to test.");
    console.error("Usage: npm run test-single <filename.pdf>");
    process.exit(1);
  }

  // Get filename from command line argument
  const requestedFile = process.argv[2];
  const pdfFilePath = path.join(PDF_DIRECTORY, requestedFile);

  // Check if file exists
  if (!fs.existsSync(pdfFilePath)) {
    console.error(`File not found: ${pdfFilePath}`);
    console.error(`Please make sure the file exists in ${PDF_DIRECTORY}`);
    process.exit(1);
  }

  console.log(`Testing summarization of: ${requestedFile}`);

  try {
    // Ensure output directory exists
    await ensureOutputDirectory(OUTPUT_DIRECTORY);

    // Process single PDF file
    const result = await summarizePdf(pdfFilePath, OUTPUT_DIRECTORY);

    if (result.success) {
      console.log(`\nSummary successfully generated: ${result.outputPath}`);
    } else {
      console.error(`\nFailed to generate summary: ${result.error}`);
    }
  } catch (error) {
    console.error("Error in test process:", error);
    process.exit(1);
  }
}

// Run the test function
testSinglePdf().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
