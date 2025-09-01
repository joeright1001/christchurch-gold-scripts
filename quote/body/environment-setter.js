document.addEventListener('DOMContentLoaded', () => {
    const environmentInput = document.getElementById('environment');
    if (environmentInput) {
        if (location.hostname.includes('webflow.io')) {
            environmentInput.value = 'STAGING';
        } else {
            environmentInput.value = 'PRODUCTION';
        }
    } else {
        console.error("Environment input field with ID 'environment' not found.");
    }
});
