// Set up filter functionality
export function setupFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value
      const filterValue = button.dataset.filter;
      
      // Filter gallery items
      filterGalleryItems(filterValue);
    });
  });
  
  function filterGalleryItems(filter) {
    galleryItems.forEach(item => {
      // If filter is 'all' or item category matches filter
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = 'block';
        // Reset animation
        item.style.animation = 'none';
        // Trigger reflow
        void item.offsetWidth;
        // Re-add animation
        item.style.animation = 'fadeIn 0.5s ease forwards, slideUp 0.5s ease forwards';
      } else {
        item.style.display = 'none';
      }
    });
  }
}