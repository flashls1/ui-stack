#!/usr/bin/env node

/**
 * UI Stack Component Generator CLI
 * 
 * Usage:
 *   node tools/generate-component.js <ComponentName> [--type=atom|molecule|organism|animation|pattern]
 * 
 * Examples:
 *   node tools/generate-component.js Modal --type=organism
 *   node tools/generate-component.js Tooltip --type=atom
 *   node tools/generate-component.js Ripple --type=animation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// Parse arguments
const args = process.argv.slice(2);
const componentName = args[0];
const typeArg = args.find(a => a.startsWith('--type='));
const type = typeArg ? typeArg.split('=')[1] : 'atom';

if (!componentName) {
    console.error('❌ Please provide a component name');
    console.log('\nUsage: node tools/generate-component.js <ComponentName> [--type=atom|molecule|organism|animation|pattern]');
    process.exit(1);
}

// Determine output directory
const typeDirectories = {
    atom: 'components/atoms',
    molecule: 'components/molecules',
    organism: 'components/organisms',
    animation: 'animations',
    pattern: 'patterns',
};

const baseDir = typeDirectories[type] || 'components/atoms';
const componentDir = path.join(ROOT, baseDir, componentName);

// Check if component already exists
if (fs.existsSync(componentDir)) {
    console.error(`❌ Component ${componentName} already exists at ${componentDir}`);
    process.exit(1);
}

// Templates
const componentTemplate = `import React from 'react';
import './${componentName}.css';

export interface ${componentName}Props {
  /** Additional className */
  className?: string;
  /** Children content */
  children?: React.ReactNode;
}

export const ${componentName}: React.FC<${componentName}Props> = ({
  className = '',
  children,
}) => {
  return (
    <div className={\`${componentName.toLowerCase()} \${className}\`}>
      {children}
    </div>
  );
};

export default ${componentName};
`;

const cssTemplate = `/* ${componentName} Component Styles */

.${componentName.toLowerCase()} {
  /* Base styles */
}

/* Variants */
.${componentName.toLowerCase()}--primary {
}

.${componentName.toLowerCase()}--secondary {
}

/* Sizes */
.${componentName.toLowerCase()}--sm {
}

.${componentName.toLowerCase()}--lg {
}
`;

const indexTemplate = `export { ${componentName}, type ${componentName}Props } from './${componentName}';
`;

const storyTemplate = `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} } from './${componentName}';

const meta: Meta<typeof ${componentName}> = {
  title: '${type.charAt(0).toUpperCase() + type.slice(1)}s/${componentName}',
  component: ${componentName},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: '${componentName} content',
  },
};

export const WithCustomClass: Story = {
  args: {
    children: '${componentName} with custom styling',
    className: 'custom-class',
  },
};
`;

const testTemplate = `import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ${componentName} } from './${componentName}';

describe('${componentName}', () => {
  it('renders children correctly', () => {
    render(<${componentName}>Test content</${componentName}>);
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <${componentName} className="custom-class">Content</${componentName}>
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
`;

// Create directory and files
console.log(`\n🚀 Generating ${componentName} component...\n`);

fs.mkdirSync(componentDir, { recursive: true });

const files = [
    { name: `${componentName}.tsx`, content: componentTemplate },
    { name: `${componentName}.css`, content: cssTemplate },
    { name: 'index.ts', content: indexTemplate },
    { name: `${componentName}.stories.tsx`, content: storyTemplate },
    { name: `${componentName}.test.tsx`, content: testTemplate },
];

files.forEach(file => {
    const filePath = path.join(componentDir, file.name);
    fs.writeFileSync(filePath, file.content);
    console.log(`  ✅ Created ${baseDir}/${componentName}/${file.name}`);
});

console.log(`
✨ Component ${componentName} generated successfully!

Next steps:
  1. Implement your component logic in ${componentName}.tsx
  2. Add styles in ${componentName}.css
  3. Run \`npm run storybook\` to see it in Storybook
  4. Run \`npm test\` to run the tests
`);
