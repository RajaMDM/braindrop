/**
 * pdfLoader.js
 * Initialises pdf.js and provides a helper to extract full text from a PDF URL.
 * Extracted from index.legacy.html.
 */

const PDFJS_WORKER_URL =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

/**
 * Point the global pdfjsLib worker at the CDN-hosted worker script.
 * Safe to call multiple times — it's a no-op if pdfjsLib isn't loaded yet.
 */
export function initPdfJs() {
  try {
    if (typeof window !== 'undefined' && window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_URL;
    }
  } catch (err) {
    console.log('PDF loader unavailable:', err);
  }
}

/**
 * Load a PDF from a URL and extract all page text.
 *
 * Requires pdfjsLib to be available on `window` (loaded via <script> tag).
 * Call `initPdfJs()` once before using this function.
 *
 * @param {string} path - URL of the PDF file
 * @returns {Promise<string|null>} Concatenated text from all pages, or null on failure
 */
export async function loadPDF(path) {
  try {
    /* global pdfjsLib */
    const pdf = await pdfjsLib.getDocument(path).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item) => item.str).join(' ') + '\n\n';
    }
    return text;
  } catch (e) {
    console.warn('loadPDF failed for', path, e);
    return null;
  }
}
