const { summarizeMultiplePdfs } = require("./summarizer");
const { getPdfFiles, ensureOutputDirectory } = require("./utils");
const { PDF_DIRECTORY, OUTPUT_DIRECTORY } = require("./config");

/**
 * Main function to run the PDF summarization process
 */
async function main() {
  console.log(`Starting PDF summarization process...`);
  console.log(`PDF directory: ${PDF_DIRECTORY}`);
  console.log(`Output directory: ${OUTPUT_DIRECTORY}`);

  try {
    // Ensure output directory exists
    await ensureOutputDirectory(OUTPUT_DIRECTORY);

    // Get all PDF files from the directory
    const pdfFiles = await getPdfFiles(PDF_DIRECTORY);

    if (pdfFiles.length === 0) {
      console.log(`No PDF files found in ${PDF_DIRECTORY}`);
      return;
    }

    console.log(`Found ${pdfFiles.length} PDF files to process.`);

    // Process all PDFs in parallel (with concurrency limits)
    const results = await summarizeMultiplePdfs(pdfFiles, OUTPUT_DIRECTORY);

    // Generate summary report
    console.log("\n===== Summary Report =====");

    const successful = results.filter((r) => r.success);
    console.log(
      `Successfully processed: ${successful.length}/${pdfFiles.length}`
    );

    if (successful.length > 0) {
      console.log("\nSuccessfully generated summaries:");
      successful.forEach((result) => {
        console.log(`- ${result.filename} => ${result.outputPath}`);
      });
    }

    const failed = results.filter((r) => !r.success);
    if (failed.length > 0) {
      console.log("\nFailed to process:");
      failed.forEach((result) => {
        console.log(`- ${result.filename}: ${result.error}`);
      });
    }

    console.log("\nPDF summarization process completed.");
  } catch (error) {
    console.error("Error in main process:", error);
    process.exit(1);
  }
}

// Run the main function
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
