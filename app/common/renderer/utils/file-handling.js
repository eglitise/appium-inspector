/**
 * Downloads a file from a given URL.
 * @param {string} href - The href string of the file type and data
 * @param {string} filename - The name of the file to save as
 */
export function downloadFile(href, filename) {
  let element = document.createElement('a');
  element.setAttribute('href', href);
  element.setAttribute('download', filename);
  element.style.display = 'none';

  document.body.appendChild(element);
  element.click();

  document.body.removeChild(element);
}

/**
 * Reads text from a list of uploaded files.
 * @param {RcFile[]} fileList - The list of files to read
 * @returns {Promise<Array>} - A promise resolving to an array of file contents
 */
export async function readTextFromUploadedFiles(fileList) {
  const fileReaderPromise = fileList.map((file) => {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = (event) =>
        resolve({
          fileName: file.name,
          content: event.target.result,
        });
      reader.onerror = (error) => {
        resolve({
          fileName: file.name,
          error: error.message,
        });
      };
      reader.readAsText(file);
    });
  });
  return await Promise.all(fileReaderPromise);
}
