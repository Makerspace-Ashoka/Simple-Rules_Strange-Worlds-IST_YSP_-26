# Content Directory

This directory contains all the student submissions for the gallery. Each project should be in its own folder with an index.md file and associated image files.

## Directory Structure

```
content/
  project-name/
    index.md
    image.jpg
    (additional images if needed)
```

## Markdown File Format

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

## Categories

Use one of these categories for proper filtering:
- photography
- digital-art
- mixed-media

## Images

- Main images should have a 4:3 aspect ratio for consistent display
- Additional images can be included in the markdown content
- Keep image file sizes reasonable (under 1MB) for better performance
- Acceptable formats: jpg, png, webp

## Example

```md
---
title: "Urban Perspectives"
author: "Marcus Chen"
category: "photography"
image: "./urban-perspective.jpg"
---

My photography series examines urban architecture through a Bauhaus lens, focusing on how light, shadow, and form interact in modern city landscapes.

Each photograph captures the essence of functionalism while highlighting the beauty in everyday structures. I was particularly inspired by László Moholy-Nagy's photographic explorations.
```