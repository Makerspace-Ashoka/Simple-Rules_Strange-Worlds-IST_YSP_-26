# Student Workshop Gallery

A Bauhaus-inspired gallery webpage to showcase student work from our high school workshop. This project features a responsive design with a clean, geometric layout and subtle animations.

## Features

- Responsive image grid that adapts to all screen sizes
- Simple content management through a directory-based system
- Markdown support for image descriptions and student information
- Bauhaus-inspired design elements
- Filter functionality to organize submissions by category
- Image modal view with detailed information

## Adding Content

### Directory Structure

To add new content to the gallery, create Markdown files in the `content` directory with the following structure:

```
content/
  project-title/
    index.md
    image.jpg
```

### Markdown Format

Each `index.md` file should follow this format:

```md
---
title: "Project Title"
author: "Student Name"
category: "photography|digital-art|mixed-media"
image: "./image.jpg"
---

Write your project description here. You can use **markdown** formatting.

Multiple paragraphs are supported.
```

## Development

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build

## Design

The design follows Bauhaus principles with:
- Bold primary colors (red, blue, yellow)
- Clean geometric shapes
- Asymmetric balance
- Typography hierarchy
- Strong contrast
- Purposeful white space

## Credits

Stock photos from [Pexels](https://www.pexels.com/)
