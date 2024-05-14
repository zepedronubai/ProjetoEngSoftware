// filtrarFile.js

/**
 * Function to filter CSV file content.
 * @param {string} content - The content of the CSV file.
 */
function filtrarFile(content) {
    if (content == null) {
        console.error('Error: Content is null');
        return; // Exit early if content is null
    }

    // Content is not null, proceed with processing
    // Split CSV data into lines
    csvLines = content.split('\n');

    // Split the first array by ";" where the column headers will go
    columns = csvLines[0].split(';');

    // Remove the first line (column headers) from csvLines
    csvLines.shift();

    console.log(columns);
}

module.exports = filtrarFile;
