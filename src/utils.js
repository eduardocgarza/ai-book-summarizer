const fs = require("fs").promises;
const path = require("path");

/**
 * Gets a list of all PDF files in the specified directory
 * @param {string} directory - Path to the directory containing PDF files
 * @returns {Promise<string[]>} - Array of paths to PDF files
 */
async function getPdfFiles(directory) {
  try {
    const files = await fs.readdir(directory);
    return files
      .filter((file) => path.extname(file).toLowerCase() === ".pdf")
      .map((file) => path.join(directory, file));
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    throw error;
  }
}

/**
 * Ensures the output directory exists
 * @param {string} directory - Path to the output directory
 * @returns {Promise<void>}
 */
async function ensureOutputDirectory(directory) {
  try {
    await fs.mkdir(directory, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${directory}:`, error);
    throw error;
  }
}

/**
 * Writes summary markdown to the output directory
 * @param {string} outputDirectory - Path to the output directory
 * @param {string} filename - Original PDF filename
 * @param {string} summary - Generated summary content
 * @returns {Promise<string>} - Path to the created file
 */
async function writeSummary(outputDirectory, filename, summary) {
  const baseName = path.basename(filename, ".pdf");
  const outputPath = path.join(outputDirectory, `${baseName}_summary.md`);

  try {
    await fs.writeFile(outputPath, summary, "utf8");
    return outputPath;
  } catch (error) {
    console.error(`Error writing summary for ${filename}:`, error);
    throw error;
  }
}

module.exports = {
  getPdfFiles,
  ensureOutputDirectory,
  writeSummary,
};
