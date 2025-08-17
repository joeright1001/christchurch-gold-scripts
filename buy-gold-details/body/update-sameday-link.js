document.addEventListener('DOMContentLoaded', () => {
  // Find the link element by its ID
  const sameDayCollectLink = document.getElementById('sameday-collect');

  if (sameDayCollectLink) {
    // Set the href to the pre-filtered URL for in-stock items
    const filteredUrl = '/buy-gold?filter=(data-stock-status=in-stock)';
    sameDayCollectLink.setAttribute('href', filteredUrl);
  } else {
    console.warn('Could not find the link element with ID "sameday-collect".');
  }
});
