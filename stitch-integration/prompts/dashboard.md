# Dashboard Layout Prompt

Generate a modern analytics dashboard with the following structure:

## Layout Structure

### Desktop (1280px+)
- Fixed sidebar navigation (260px width) on the left
- Main content area with header and scrollable body
- Header: Page title, search bar, user avatar, notifications
- Content: Grid of stat cards (4 columns) at top, main chart, recent activity list

### Tablet (768px - 1279px)
- Collapsible sidebar (icon-only mode, 72px)
- 2-column grid for stat cards
- Stack chart and activity list vertically

### Mobile (<768px)
- Bottom navigation bar instead of sidebar
- Single column layout
- Sticky header with hamburger menu

## Components to Use

- **Navbar**: Glass variant with blur, sticky
- **Sidebar**: Dark glass background, icon + text navigation items
- **Cards**: Glass variant for stat cards, elevated variant for main chart
- **Badges**: For status indicators (success, warning, error states)
- **Buttons**: Primary gradient for main CTA, ghost for secondary actions

## Visual Effects

- Glassmorphism on cards and navigation
- Subtle glow on active sidebar items
- Gradient text for main heading
- Animated number counters on stat cards
- Smooth page transitions

## Color Usage

- Primary gradient for key metrics and CTAs
- Secondary accent for charts and data visualization
- Success/Warning/Error for status indicators
- Glass effects on all containers

## Accessibility

- Skip to main content link
- Proper heading hierarchy (h1 for page title, h2 for sections)
- ARIA labels on icon-only buttons
- Focus visible states on all interactive elements
- Keyboard navigation support in sidebar
