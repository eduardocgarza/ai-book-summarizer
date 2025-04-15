# PDF Summarizer

A Node.js tool for bulk summarization of PDF documents using OpenAI's API. This tool extracts text from PDF files and generates comprehensive summaries in Markdown format.

## Features

- Process multiple PDF files in parallel
- Control concurrency to manage API usage
- Generate well-structured summaries in Markdown format
- Option to test with a single file before bulk processing
- Detailed success/failure reporting

## Prerequisites

- Node.js (v14 or higher)
- OpenAI API key

## Installation

1. Clone this repository or download the source code

2. Install dependencies:

   ```
   npm install
   ```

3. Create a `.env` file based on the provided `.env.sample`:

   ```
   cp .env.sample .env
   ```

4. Edit the `.env` file and add your OpenAI API key

## Usage

### Directory Structure

Place your PDF files in the directory specified in your `.env` file (default is `./pdfs`).

### Process All PDFs

To process all PDF files in the configured directory:

```
npm start
```

### Test with a Single PDF

To test with a single PDF file:

```
npm run test-single filename.pdf
```

Replace `filename.pdf` with the name of the PDF file you want to process. The file should be located in the configured PDF directory.

## Configuration

You can customize the behavior by editing the `.env` file:

- `OPENAI_API_KEY`: Your OpenAI API key
- `OPENAI_MODEL`: The OpenAI model to use (default: gpt-4-turbo-preview)
- `PDF_DIRECTORY`: Directory containing PDF files (default: ./pdfs)
- `OUTPUT_DIRECTORY`: Directory for saving summaries (default: ./output)
- `MAX_CONCURRENT_REQUESTS`: Maximum number of concurrent API requests (default: 5)

## Output

Summaries are saved as Markdown files in the output directory. Each summary file is named after the original PDF with `_summary.md` appended.

## Limitations

- Very large PDFs may be truncated due to token limits
- Complex formatting, tables, and images in PDFs are not preserved in the summaries
- API costs can accumulate with large numbers of PDFs

## Error Handling

The tool provides detailed error reports in the console output. Failed files are reported at the end of the process.
