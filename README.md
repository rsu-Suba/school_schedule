# School Schedule App

This is a web application for managing school schedules.

## Google Apps Script Setup

To improve performance, the app uses a Google Apps Script to fetch data from a Google Sheet. The script is designed to be fast and efficient, but it requires a one-time setup to enable a daily trigger for cleaning up old data.

### Trigger Setup Instructions

1.  **Open the Google Apps Script Editor:**
    *   Open the Google Sheet that is connected to this application.
    *   Go to `Extensions > Apps Script`.

2.  **Select the function to run:**
    *   In the Apps Script editor, go to `Edit > Current project's triggers`.
    *   Click on the `+ Add Trigger` button in the bottom right corner.

3.  **Configure the trigger:**
    *   Choose which function to run: `deleteOldRows`
    *   Choose which deployment should run: `Head`
    *   Select event source: `Time-driven`
    *   Select type of time based trigger: `Day timer`
    *   Select time of day: `2am - 3am` (or any other time that is convenient for you)
    *   Click `Save`.

This will set up a daily trigger to automatically clean up old data from the sheet, which will significantly improve the performance of the application.