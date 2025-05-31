import { Plugin } from 'unified';
import { visit, SKIP } from 'unist-util-visit';
import { Literal, Parent, Node } from 'unist';
import baybayifyWord from '../../lib/baybayify';

// Plugin to transform ||text|| into custom 'baybayin' nodes
const remarkBaybayin: Plugin = () => {
  return (tree) => {
    visit(tree, 'text', (node: Literal, index: number | null, parent: Parent | null) => {
      if (!parent || typeof node.value !== 'string' || typeof index !== 'number') return;

      const regex = /\|\|(.+?)\|\|/g;
      const segments: Node[] = [];
      let lastIndex = 0;
      let match: RegExpExecArray | null;

      // Split the text node into segments based on ||...|| matches
      while ((match = regex.exec(node.value)) !== null) {
        if (match.index > lastIndex) {
          segments.push({
            type: 'text',
            value: node.value.slice(lastIndex, match.index),
          } as Literal);
        }
        segments.push({
          type: 'baybayin',
          data: {
            hName: 'span', // Use 'span' for inline, not 'div'
            hProperties: { className: 'font-baybayin' },
          },
          children: [
            {
              type: 'text',
              value: baybayifyWord(match[1]),
            }
          ]
        } as Node);
        lastIndex = regex.lastIndex;
      }

      if (lastIndex < node.value.length) {
        segments.push({
          type: 'text',
          value: node.value.slice(lastIndex),
        } as Literal);
      }

      // Only replace if there are baybayin segments
      if (segments.length > 1 || (segments.length === 1 && segments[0].type === 'baybayin')) {
        parent.children.splice(index, 1, ...segments);
        // Skip visiting the newly inserted nodes
        return [SKIP, index + segments.length];
      }
    });
  };
};

export default remarkBaybayin;
