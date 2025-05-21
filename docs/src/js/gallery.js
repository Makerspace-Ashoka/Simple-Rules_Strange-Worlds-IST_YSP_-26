import { marked } from 'marked';

// This function will load gallery items from the content folder
export async function loadGallery() {
  const galleryElement = document.getElementById('gallery');

  try {
    // In a real implementation, this would fetch from a directory or API
    // For demo purposes, we'll use sample data
    const galleryItems = await fetchGalleryItems();

    // Remove loading indicator
    const loadingIndicator = document.querySelector('.loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }

    // Append gallery items to the gallery container
    galleryItems.forEach(item => {
      galleryElement.appendChild(createGalleryItemElement(item));
    });

    return galleryItems;
  } catch (error) {
    console.error('Error loading gallery items:', error);
    throw error;
  }
}

// Create a gallery item element
function createGalleryItemElement(item) {
  const galleryItem = document.createElement('div');
  galleryItem.className = 'gallery-item';
  galleryItem.dataset.category = item.category;

  galleryItem.innerHTML = `
    <img
      src="${item.imageSrc}"
      alt="${item.title}"
      class="gallery-item-image"
      loading="lazy"
    >
    <div class="gallery-item-info">
      <h3 class="gallery-item-title">${item.title}</h3>
      <p class="gallery-item-author">By ${item.author}</p>
      <span class="gallery-item-category">${item.category}</span>
    </div>
  `;

  // Add click event to open modal
  galleryItem.addEventListener('click', () => {
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalAuthor = document.getElementById('modal-author');
    const modalDescription = document.getElementById('modal-description');

    modalImage.src = item.imageSrc;
    modalImage.alt = item.title;
    modalTitle.textContent = item.title;
    modalAuthor.textContent = `By ${item.author}`;
    modalDescription.innerHTML = marked.parse(item.description);

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  return galleryItem;
}

// Fetch gallery items from content or API
async function fetchGalleryItems() {
  // In a real implementation, this would load from a directory or API
  // For demonstration, we'll return sample data
  return [
    {
      title: "Geometric Abstractions",
      author: "Emma Johnson",
      category: "digital-art",
      imageSrc: "https://images.pexels.com/photos/2110951/pexels-photo-2110951.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "This project explores the balance between rigid geometric forms and organic shapes. Inspired by Bauhaus principles, I created a series of digital compositions that play with perception and spatial relationships.\n\nThe colors are derived from primary hues, paying homage to the Bauhaus color theory while introducing a contemporary digital aesthetic."
    },
    {
      title: "Urban Perspectives",
      author: "Marcus Chen",
      category: "photography",
      imageSrc: "https://images.pexels.com/photos/2119706/pexels-photo-2119706.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "My photography series examines urban architecture through a Bauhaus lens, focusing on how light, shadow, and form interact in modern city landscapes.\n\nEach photograph captures the essence of functionalism while highlighting the beauty in everyday structures. I was particularly inspired by László Moholy-Nagy's photographic explorations."
    },
    {
      title: "Material Explorations",
      author: "Sofia Rodriguez",
      category: "mixed-media",
      imageSrc: "https://images.pexels.com/photos/2570059/pexels-photo-2570059.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "This mixed-media project combines various materials to create textural compositions based on Bauhaus principles. I experimented with paper, fabric, and found objects to explore how different textures interact within a structured framework.\n\nThe work reflects the Bauhaus integration of crafts and fine arts while maintaining a strong focus on geometric form and functional design."
    },
    {
      title: "Typographic Rhythm",
      author: "James Wilson",
      category: "digital-art",
      imageSrc: "https://images.pexels.com/photos/3651597/pexels-photo-3651597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "This typography project explores how letterforms can create visual rhythm and spatial dynamics. Inspired by Herbert Bayer's universal typeface, I developed a series of compositions that treat type as both communication and visual element.\n\nThe project investigates how typography can define space and create hierarchy through deliberate arrangement and scale."
    },
    {
      title: "Light Studies",
      author: "Aisha Patel",
      category: "photography",
      imageSrc: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "This photographic series explores how light interacts with simple geometric forms, inspired by the Bauhaus photography experiments of the 1920s.\n\nEach image captures a momentary interaction between light, shadow, and form, revealing how these elements can transform ordinary objects into abstract compositions."
    },
    {
      title: "Functional Objects",
      author: "Leo Kim",
      category: "mixed-media",
      imageSrc: "https://images.pexels.com/photos/2835171/pexels-photo-2835171.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "Inspired by the Bauhaus philosophy that form follows function, I created a series of small objects that serve both practical and aesthetic purposes.\n\nEach piece is designed with clean lines and primary shapes, combining different materials to explore contrast and complementarity while maintaining a focus on usability."
    },
    {
      title: "Color Theory Experiments",
      author: "Olivia Martinez",
      category: "digital-art",
      imageSrc: "https://images.pexels.com/photos/1910225/pexels-photo-1910225.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "This digital project explores Josef Albers' color theory principles through interactive compositions. I investigated how colors interact and influence perception when placed in various relationships.\n\nThe work demonstrates how the same color can appear completely different depending on its surrounding context, challenging our understanding of color as an absolute property."
    },
    {
      title: "Architectural Details",
      author: "David Park",
      category: "photography",
      imageSrc: "https://images.pexels.com/photos/1732414/pexels-photo-1732414.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description: "This photography series focuses on architectural details that embody Bauhaus principles in contemporary buildings.\n\nThe images highlight how the Bauhaus emphasis on clean lines, functionality, and materials continues to influence modern architecture around the world, creating a visual dialogue between past and present design philosophies."
    }
  ];
}
