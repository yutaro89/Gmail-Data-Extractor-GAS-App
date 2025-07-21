/**
 * @OnlyCurrentDoc
 *
 * The above comment directs Apps Script to limit the scope of file
 * access for this script to only the current document containing it.
 * This is a good security practice.
 */

/**
 * Serves the web application's user interface.
 * This function is automatically called when a user accesses the web app's URL.
 *
 * @param {GoogleAppsScript.Events.DoGet} e The event parameter for a GET request.
 * @returns {GoogleAppsScript.HTML.HtmlOutput} The HTML output for the web page.
 */
function doGet(e) {
  const template = HtmlService.createTemplateFromFile('Index');
  return template.evaluate()
    .setTitle('Gmail Data Extractor')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Searches Gmail for threads matching the given query and extracts information from the first message of each thread.
 * This function is designed to be called from the client-side JavaScript.
 *
 * @param {string} searchQuery The search query string for Gmail (e.g., "is:unread").
 * @param {number} [maxResults=100] The maximum number of threads to retrieve. Defaults to 100, max is 500.
 * @returns {Array<Object>} An array of objects, where each object represents an email message.
 * @throws {Error} If the searchQuery is invalid or if a Gmail API error occurs.
 */
function getEmails(searchQuery, maxResults = 100) {
  // --- Input Validation ---
  if (!searchQuery || typeof searchQuery !== 'string' || searchQuery.trim() === '') {
    throw new Error('Search query must be a non-empty string.');
  }

  let adjustedMaxResults = parseInt(maxResults, 10);
  if (isNaN(adjustedMaxResults) || adjustedMaxResults <= 0) {
    adjustedMaxResults = 100; // Default if invalid
  }
  if (adjustedMaxResults > 500) {
    adjustedMaxResults = 500; // Enforce maximum limit
  }

  Logger.log(`Executing search with query: "${searchQuery}", maxResults: ${adjustedMaxResults}`);

  try {
    // --- Gmail Search ---
    const threads = GmailApp.search(searchQuery, 0, adjustedMaxResults);
    const emails = [];

    // --- Data Extraction ---
    threads.forEach(thread => {
      // スレッド内の最初のメッセージのみを対象とします
      const message = thread.getMessages()[0]; // Get the first message of each thread
      if (message) {
        let plainBody = '';
        try {
          // Isolate potential errors from getPlainBody()
          plainBody = message.getPlainBody();
        } catch (bodyError) {
          plainBody = `Error retrieving message body: ${bodyError.message}`;
          Logger.log(`Could not get plain body for message ID ${message.getId()}: ${bodyError.toString()}`);
        }

        // Create a snippet from the beginning of the plain body to avoid errors.
        const snippet = plainBody.substring(0, 250);

        emails.push({
          id: message.getId(),
          threadId: thread.getId(),
          from: message.getFrom(),
          subject: message.getSubject(),
          date: message.getDate().toISOString(),
          isUnread: message.isUnread(),
          snippet: snippet,
          plainBody: plainBody,
        });
      }
    });

    Logger.log(`Found ${emails.length} emails.`);
    return emails;

  } catch (e) {
    Logger.log(`Error during Gmail search: ${e.toString()}`);
    // Re-throw the error to be caught by the client-side FailureHandler
    throw new Error(`Failed to execute Gmail search. Original error: ${e.message}`);
  }
}
