```stylemd-ui
{
  "version": 1,
  "brand": "Levain Bakery",
  "accentColor": "#e8006f",
  "description": "Design system built around minimalism and modularity, using a clean, almost monochromatic palette with subtle greys, crisp typography (often their custom Inter-based font), and generous whitespace to keep the focus on content.",
  "heroHeadline": "Mother's Day is coming!",
  "tags": ["D2C", "Vibrant", "Warm", "Vintage"],
  "typographyTitle": "Typography",
  "typographyIntro": "A composed hierarchy for page storytelling",
  "typographyAside": "Orchestrate systems intelligently. Used for secondary heading moments and supporting display contrasts.",
  "fonts": [
    {
      "name": "Platform",
      "sample": "Aa Bb",
      "role": "HEADING SYSTEM",
      "dark": true,
      "weights": "Medium",
      "badge": "HEADING SYSTEM",
      "body": "Used for titles and heading text"
    },
    {
      "name": "National",
      "sample": "Aa Bb",
      "role": "BODY SYSTEM",
      "dark": false,
      "weights": "Regular, Medium",
      "badge": "BODY SYSTEM",
      "body": "Used for secondary heading and body copy."
    }
  ],
  "palette": [
    {
      "name": "Primary",
      "hex": "#000000",
      "swatches": ["#fafafa", "#f5f5f5", "#e0e0e0", "#bdbdbd", "#9e9e9e", "#757575", "#616161", "#424242", "#212121", "#000000", "#000000"]
    },
    {
      "name": "Secondary",
      "hex": "#e8006f",
      "swatches": ["#fff0f5", "#fce4ec", "#f8bbd0", "#f48fb1", "#f06292", "#ec407a", "#e91e63", "#c2185b", "#880e4f", "#e8006f", "#e8006f"]
    },
    {
      "name": "Tertiary",
      "hex": "#2d2bb5",
      "swatches": ["#f5f5ff", "#e8eaf6", "#c5cae9", "#9fa8da", "#7986cb", "#5c6bc0", "#3f51b5", "#3949ab", "#2d2bb5", "#1a178a", "#1a178a"]
    },
    {
      "name": "Neutral",
      "hex": "#f9c74f",
      "swatches": ["#fffef5", "#fffde7", "#fff9c4", "#fff59d", "#fff176", "#ffee58", "#ffeb3b", "#fdd835", "#f9c74f", "#c8a200", "#c8a200"]
    }
  ]
}
```

# Levain Bakery — narrative design notes

## Overview

This block is **plain markdown** after the structured `stylemd-ui` fence. It still renders below the rich preview (separated by a horizontal rule) so authors can add long-form guidance.

## Voice & tone

- Warm, celebratory, NYC-rooted.
- Short sentences in merchandising modules; longer copy only in stories.

## Components (summary)

- Primary CTA uses the **accent** pink at `#e8006f`.
- Cards use generous radius and soft shadows consistent with the palette rows above.
