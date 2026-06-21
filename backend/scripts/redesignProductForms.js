// backend/scripts/redesignProductForms.js
const fs = require('fs');
const path = require('path');

const filesToRedesign = [
  path.join(__dirname, '../../frontend/src/views/AddProduct.vue'),
  path.join(__dirname, '../../frontend/src/views/EditWishlistProductModal.vue')
];

const replacements = [
  // Gradients
  { from: /from-violet-600/g, to: 'from-[#ff934b]' },
  { from: /to-indigo-600/g, to: 'to-[#ff5e62]' },
  { from: /from-indigo-600/g, to: 'from-[#ff5e62]' },
  
  // Text Colors
  { from: /text-indigo-600/g, to: 'text-[#ff934b]' },
  { from: /text-indigo-500/g, to: 'text-[#ff934b]' },
  { from: /text-indigo-700/g, to: 'text-[#e8803c]' },
  { from: /text-indigo-400/g, to: 'text-[#ff934b]/80' },
  
  // Background Colors
  { from: /bg-indigo-600/g, to: 'bg-[#ff934b]' },
  { from: /bg-indigo-5050/g, to: 'bg-[#ff934b]/50' },
  { from: /bg-indigo-500/g, to: 'bg-[#ff934b]' },
  { from: /bg-indigo-50/g, to: 'bg-[#ff934b]/10' },
  { from: /bg-indigo-100/g, to: 'bg-[#ff934b]/20' },
  
  // Hover & Focus States
  { from: /hover:bg-indigo-100/g, to: 'hover:bg-[#ff934b]/20' },
  { from: /hover:bg-indigo-50/g, to: 'hover:bg-[#ff934b]/10' },
  { from: /hover:bg-indigo-600/g, to: 'hover:bg-[#e8803c]' },
  { from: /hover:border-indigo-300/g, to: 'hover:border-[#ff934b]/55' },
  { from: /hover:border-indigo-500/g, to: 'hover:border-[#ff934b]' },
  
  // Borders
  { from: /border-indigo-500/g, to: 'border-[#ff934b]' },
  { from: /border-indigo-100/g, to: 'border-[#ff934b]/20' },
  
  // Focus ring/border
  { from: /focus:border-indigo-500/g, to: 'focus:border-[#ff934b]' },
  { from: /focus-within:border-indigo-500/g, to: 'focus-within:border-[#ff934b]' },
  { from: /focus:ring-indigo-500\/20/g, to: 'focus:ring-[#ff934b]/20' },
  { from: /focus:ring-indigo-500/g, to: 'focus:ring-[#ff934b]' },
  { from: /focus-within:ring-indigo-500\/20/g, to: 'focus-within:ring-[#ff934b]/20' },
  { from: /ring-indigo-500\/20/g, to: 'ring-[#ff934b]/20' }
];

console.log("Starting theme replacement...");

for (const filePath of filesToRedesign) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let replacedCount = 0;
    
    for (const r of replacements) {
      const match = content.match(r.from);
      if (match) {
        content = content.replace(r.from, r.to);
        replacedCount += match.length;
      }
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully redesigned ${path.basename(filePath)} (${replacedCount} replacements made)`);
  } else {
    console.error(`File not found: ${filePath}`);
  }
}
