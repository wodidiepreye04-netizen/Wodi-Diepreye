/**
 * ========================================
 * GOOGLE APPS SCRIPT - WEB APP ENDPOINT
 * ========================================
 * 
 * SETUP INSTRUCTIONS:
 * 
 * 1. Open your Google Sheet where you want to store form submissions
 * 2. Go to Extensions > Apps Script
 * 3. Delete any default code and paste this entire script
 * 4. Click "Deploy" > "New deployment"
 * 5. Select type: "Web app"
 * 6. Configure:
 *    - Description: "Portfolio Contact Form"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 7. Click "Deploy"
 * 8. Copy the Web App URL
 * 9. Paste the URL into the WEB_APP_URL constant in script.js
 * 
 * SHEET SETUP:
 * Make sure your Google Sheet has a sheet named "ContactSubmissions"
 * or change the SHEET_NAME constant below to match your sheet name.
 * 
 * The script will automatically create headers if they don't exist.
 */

// ========================================
// CONFIGURATION
// ========================================
const SHEET_NAME = 'ContactSubmissions';

// ========================================
// MAIN HANDLER - Receives POST requests
// ========================================
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet and target sheet
    const sheet = getOrCreateSheet(SHEET_NAME);
    
    // Ensure headers exist
    ensureHeaders(sheet);
    
    // Prepare the row data
    const rowData = [
      new Date(),                    // Timestamp
      data.name || '',               // Name
      data.email || '',              // Email
      data.project || '',            // Project Details
      'New',                         // Status
      ''                             // Notes (empty by default)
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'success',
        'message': 'Data saved successfully'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error for debugging
    Logger.log('Error: ' + error.toString());
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        'status': 'error',
        'message': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Get existing sheet or create new one
 */
function getOrCreateSheet(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  return sheet;
}

/**
 * Ensure the sheet has proper headers
 */
function ensureHeaders(sheet) {
  const headers = ['Timestamp', 'Name', 'Email', 'Project Details', 'Status', 'Notes'];
  
  // Check if headers already exist
  if (sheet.getLastRow() === 0) {
    // Add headers if sheet is empty
    sheet.appendRow(headers);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#007AFF');
    headerRange.setFontColor('#FFFFFF');
    
    // Set column widths
    sheet.setColumnWidth(1, 150);  // Timestamp
    sheet.setColumnWidth(2, 150);  // Name
    sheet.setColumnWidth(3, 200);  // Email
    sheet.setColumnWidth(4, 350);  // Project Details
    sheet.setColumnWidth(5, 100);  // Status
    sheet.setColumnWidth(6, 200);  // Notes
    
    // Freeze header row
    sheet.setFrozenRows(1);
  }
}

/**
 * Optional: Test function to verify setup
 * Run this function manually to test if everything works
 */
function testSetup() {
  const sheet = getOrCreateSheet(SHEET_NAME);
  ensureHeaders(sheet);
  
  // Add test data
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    project: 'This is a test submission to verify the Google Apps Script is working correctly.'
  };
  
  const rowData = [
    new Date(),
    testData.name,
    testData.email,
    testData.project,
    'Test',
    'This is a test entry'
  ];
  
  sheet.appendRow(rowData);
  
  Logger.log('Test completed successfully!');
}
