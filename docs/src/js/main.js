import { loadGallery } from './gallery.js';
import { setupModal } from './modal.js';
import { setupFilters } from './filters.js';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load gallery items
  loadGallery()
    .then(() => {
      console.log('Gallery loaded successfully');
      // Set up modal functionality
      setupModal();
      // Set up filter functionality
      setupFilters();
    })
    .catch(error => {
      console.error('Error loading gallery:', error);
      document.querySelector('.loading-indicator').innerHTML = `
        <div class="error-message">
          <h3>Failed to load gallery</h3>
          <p>Please try refreshing the page or contact support if the issue persists.</p>
        </div>
      `;
    });
});