// Set up modal functionality
export function setupModal() {
  const modal = document.getElementById('image-modal');
  const closeButton = document.querySelector('.close-modal');
  
  // Close modal when clicking the close button
  closeButton.addEventListener('click', closeModal);
  
  // Close modal when clicking outside the content
  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal();
    }
  });
  
  // Close modal when pressing escape key
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
  
  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset modal content after transition ends
    setTimeout(() => {
      if (!modal.classList.contains('active')) {
        document.getElementById('modal-image').src = '';
        document.getElementById('modal-title').textContent = '';
        document.getElementById('modal-author').textContent = '';
        document.getElementById('modal-description').innerHTML = '';
      }
    }, 300);
  }
}