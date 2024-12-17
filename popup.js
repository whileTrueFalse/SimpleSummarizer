document.addEventListener('DOMContentLoaded', function() {
    const summarizeBtn = document.getElementById('summarizeBtn');
    const summaryDiv = document.getElementById('summary');
    const loadingDiv = document.getElementById('loading');

    summarizeBtn.addEventListener('click', async () => {
        try {
            loadingDiv.style.display = 'block';
            summaryDiv.textContent = '';

            // Get the active tab
            let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            // Execute script to get page content
            const result = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: getPageContent,
            });

            const content = result[0].result;
            
            // Call the summarization API
            const summary = await summarizeText(content);
            
            // Display the summary
            summaryDiv.textContent = summary;
        } catch (error) {
            summaryDiv.textContent = 'Error: Could not summarize the page. ' + error.message;
        } finally {
            loadingDiv.style.display = 'none';
        }
    });
});

// Function to get page content
function getPageContent() {
    // Get all paragraph elements
    const paragraphs = document.getElementsByTagName('p');
    let content = '';
    
    // Combine text from all paragraphs
    for (let p of paragraphs) {
        content += p.textContent + ' ';
    }
    
    // Clean up the text
    return content.trim();
}

// Function to summarize text using an API
async function summarizeText(text) {
    // For demonstration, we'll use a simple extractive summarization
    // In a real implementation, you would want to use an API service
    
    // Split text into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    
    // Select first few sentences as a summary
    const summaryLength = Math.min(3, sentences.length);
    const summary = sentences.slice(0, summaryLength).join(' ');
    
    return summary || 'No content found to summarize.';
}
