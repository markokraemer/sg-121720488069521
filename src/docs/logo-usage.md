# CRM Pro Logo Usage Guidelines

## Overview

The CRM Pro logo is a key element of our brand identity. It represents our commitment to connectivity, organization, and customer relations. This document provides guidelines for the proper usage of the CRM Pro logo across various applications.

## Logo Description

The CRM Pro logo consists of a stylized circular design within a square shape, representing interconnectedness and the cyclical nature of customer relationships. The logo is designed to be simple, memorable, and effective across various mediums.

## Color Variations

The logo adapts to light and dark modes:

- Light mode: Primary color background with white elements
- Dark mode: Primary color background with dark (#1a1a1a) elements

## Usage Guidelines

1. **Spacing**: Always maintain clear space around the logo to ensure its visibility and impact. The minimum clear space should be at least 25% of the logo's width on all sides.

2. **Sizing**: The logo should never be reproduced smaller than 24px in height to ensure legibility.

3. **Modifications**: Do not modify, distort, or alter the logo in any way. Always use the approved SVG file.

4. **Background**: The logo should always be placed on a background that provides sufficient contrast.

5. **Animations**: When using animations, ensure they are subtle and professional. The current implementation includes rotation and scaling effects on hover.

## Implementation

The logo is implemented as an inline SVG in the `Layout.jsx` component. This allows for easy color changes based on the theme and smooth animations.

```jsx
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 ease-in-out transform group-hover:scale-110">
  {/* SVG content */}
</svg>
```

## Accessibility

Always include appropriate alternative text when using the logo in digital applications. In the current implementation, we use a title attribute and a screen-reader-only span:

```jsx
<span className="navbar-logo group" title="CRM Pro">
  {/* SVG logo */}
  <span className="sr-only">CRM Pro</span>
</span>
```

## File Formats

- Use the SVG format for digital applications to ensure scalability.
- For print applications, use high-resolution PNG files or vector formats (AI, EPS).

## Variations

Currently, we use a single version of the logo. If additional variations (e.g., monochrome, horizontal layout) are needed for specific use cases, they should be created and documented here.

## Contact

For any questions regarding logo usage or to request logo files, please contact the design team at design@crmpro.com.

Remember, consistent use of our logo helps build and maintain our brand identity. Always refer to these guidelines when using the CRM Pro logo.