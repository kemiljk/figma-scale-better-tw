figma.showUI(__html__, { themeColors: true, width: 300, height: 444 });
const nodeTypes = ['DOCUMENT', 'PAGE', 'SLICE'];

function makeSelection(node: any) {
  if (figma.currentPage.selection.length > 0 && !nodeTypes.includes(node.type)) {
    const selectionWidth = node.width;
    figma.ui.postMessage({ width: selectionWidth });
    const selectionHeight = node.height;
    figma.ui.postMessage({ height: selectionHeight });
  }
  return;
}

figma.on('selectionchange', () => {
  makeSelection(figma.currentPage.selection[0]);
});

// Helper function to calculate scale origin offset
function getScaleOriginOffset(node: SceneNode, scaleOrigin: { x: number; y: number }) {
  // Convert 0-2 grid position to actual position ratios (0 = 0%, 1 = 50%, 2 = 100%)
  const xRatio = scaleOrigin.x / 2;
  const yRatio = scaleOrigin.y / 2;

  return {
    x: node.x + node.width * xRatio,
    y: node.y + node.height * yRatio,
  };
}

// Helper function to apply scaling with origin
function scaleFromOrigin(
  node: SceneNode,
  scale: number,
  scaleOrigin: { x: number; y: number },
  roundingFactor: number = 1
) {
  const origin = getScaleOriginOffset(node, scaleOrigin);
  const originalX = node.x;
  const originalY = node.y;
  const originalWidth = node.width;
  const originalHeight = node.height;

  // Calculate new dimensions
  const newWidth = Math.round((originalWidth * scale) / roundingFactor) * roundingFactor;
  const newHeight = Math.round((originalHeight * scale) / roundingFactor) * roundingFactor;

  // Calculate position offset to maintain scale origin point
  const xOffset = origin.x - (origin.x - originalX) * scale;
  const yOffset = origin.y - (origin.y - originalY) * scale;

  // Apply the transformation
  if ('rescale' in node && 'resize' in node) {
    (node as any).rescale(scale);
    (node as any).resize(newWidth, newHeight);
    node.x = Math.round(xOffset);
    node.y = Math.round(yOffset);
  }
}

figma.ui.onmessage = (msg) => {
  if (msg.type === 'update-scale-origin') {
    // No need to notify here, just store the value if needed
    return;
  }

  if (msg.type === 'scale-value') {
    const { selection } = figma.currentPage;

    if (selection.length === 0) {
      figma.notify('Please select at least one node to resize.');
      return;
    }

    const result = msg.scaleAmount / 100;

    for (const node of selection) {
      if (!nodeTypes.includes(node.type)) {
        scaleFromOrigin(node, result, msg.scaleOrigin, msg.roundingFactor);
        figma.notify(`Rescaled to ${node.width}px wide and ${node.height}px high`);
      }
    }

    if (msg.checkboxOn === true) {
      figma.closePlugin();
    }
  }

  if (msg.type === 'scale-width-value') {
    const { selection } = figma.currentPage;

    if (selection.length === 0) {
      figma.notify('Please select at least one node to resize.');
      return;
    }

    for (const node of selection) {
      if (!nodeTypes.includes(node.type)) {
        const result = msg.scaleWidthAmount / node.width;
        scaleFromOrigin(node, result, msg.scaleOrigin, msg.roundingFactor);
        figma.notify(`Rescaled to ${node.width}px wide`);
      }
    }

    if (msg.checkboxOn === true) {
      figma.closePlugin();
    }
  }

  if (msg.type === 'scale-max-width-value') {
    const { selection } = figma.currentPage;

    if (selection.length === 0) {
      figma.notify('Please select at least one node to resize.');
      return;
    }

    const widths = selection.map((node) => node.width);
    const uniqueWidths = [...new Set(widths)];

    if (uniqueWidths.length === 1) {
      figma.notify('All selected nodes have the same width.');
      return;
    }

    const maxWidth = Math.max(...widths);

    for (const node of selection) {
      if (!nodeTypes.includes(node.type)) {
        if (node.width !== maxWidth) {
          const scaleWidth = maxWidth / node.width;
          scaleFromOrigin(node, scaleWidth, msg.scaleOrigin, msg.roundingFactor);
          figma.notify(`Rescaled to ${node.width}px wide`);
        }
      }
    }

    if (msg.checkboxOn === true) {
      figma.closePlugin();
    }
  }

  if (msg.type === 'scale-min-width-value') {
    const { selection } = figma.currentPage;

    if (selection.length === 0) {
      figma.notify('Please select at least one node to resize.');
      return;
    }

    const widths = selection.map((node) => node.width);
    const uniqueWidths = [...new Set(widths)];

    if (uniqueWidths.length === 1) {
      figma.notify('All selected nodes have the same width.');
      return;
    }

    const minWidth = Math.min(...widths);

    for (const node of selection) {
      if (!nodeTypes.includes(node.type)) {
        if (node.width !== minWidth) {
          const scaleWidth = minWidth / node.width;
          scaleFromOrigin(node, scaleWidth, msg.scaleOrigin, msg.roundingFactor);
          figma.notify(`Rescaled to ${node.width}px wide`);
        }
      }
    }

    if (msg.checkboxOn === true) {
      figma.closePlugin();
    }
  }

  if (msg.type === 'scale-height-value') {
    const { selection } = figma.currentPage;

    if (selection.length === 0) {
      figma.notify('Please select at least one node to resize.');
      return;
    }

    if (msg.scaleHeightAmount === 0) {
      figma.notify('Please enter a non-zero scale height amount.');
      return;
    }

    for (const node of selection) {
      if (!nodeTypes.includes(node.type)) {
        const scaleHeight = msg.scaleHeightAmount / node.height;
        scaleFromOrigin(node, scaleHeight, msg.scaleOrigin, msg.roundingFactor);
        figma.notify(`Rescaled to ${node.height}px high`);
      }
    }

    if (msg.checkboxOn === true) {
      figma.closePlugin();
    }
  }

  if (msg.type === 'scale-max-height-value') {
    const { selection } = figma.currentPage;

    if (selection.length === 0) {
      figma.notify('Please select at least one node to resize.');
      return;
    }

    const heights = selection.map((node) => node.height);
    const maxHeight = Math.max(...heights);

    if (maxHeight === Infinity) {
      figma.notify('All selected nodes have the same height.');
      return;
    }

    for (const node of selection) {
      if (!nodeTypes.includes(node.type)) {
        if (node.height !== maxHeight) {
          const scaleHeight = maxHeight / node.height;
          scaleFromOrigin(node, scaleHeight, msg.scaleOrigin, msg.roundingFactor);
          figma.notify(`Rescaled to ${node.height}px high`);
        }
      }
    }

    if (msg.checkboxOn === true) {
      figma.closePlugin();
    }
  }

  if (msg.type === 'scale-min-height-value') {
    const { selection } = figma.currentPage;

    if (selection.length === 0) {
      figma.notify('Please select at least one node to resize.');
      return;
    }

    const heights = selection.map((node) => node.height);
    const minHeight = Math.min(...heights);

    if (minHeight === Infinity) {
      figma.notify('All selected nodes have the same height.');
      return;
    }

    for (const node of selection) {
      if (!nodeTypes.includes(node.type)) {
        if (node.height !== minHeight) {
          const scaleHeight = minHeight / node.height;
          scaleFromOrigin(node, scaleHeight, msg.scaleOrigin, msg.roundingFactor);
          figma.notify(`Rescaled to ${node.height}px high`);
        }
      }
    }

    if (msg.checkboxOn === true) {
      figma.closePlugin();
    }
  }
};
