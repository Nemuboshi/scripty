import type { RehypePlugin } from '@astrojs/markdown-remark';

type HastProperties = Record<string, unknown> & {
	className?: string | string[];
	style?: string;
};

type HastText = {
	type: 'text';
	value: string;
};

type HastElement = {
	type: 'element';
	tagName: string;
	properties?: HastProperties;
	children?: HastNode[];
};

type HastRoot = {
	type?: string;
	children?: HastNode[];
};

type HastNode = HastText | HastElement | HastRoot;

const INDENT_MARKER = /^([\u200b\ufeff]*)(\t+)/;
const INDENTABLE_TAGS = new Set(['p', 'li']);

function appendClass(properties: HastProperties, className: string) {
	const current = properties.className;

	if (Array.isArray(current)) {
		properties.className = [...current, className];
		return;
	}

	if (typeof current === 'string') {
		properties.className = `${current} ${className}`;
		return;
	}

	properties.className = [className];
}

function appendStyle(properties: HastProperties, declaration: string) {
	const current = properties.style;
	properties.style = current ? `${current}; ${declaration}` : declaration;
}

function isElement(node: HastNode): node is HastElement {
	return 'type' in node && node.type === 'element';
}

function isText(node: HastNode | undefined): node is HastText {
	return Boolean(node && 'type' in node && node.type === 'text');
}

function hasChildren(node: HastNode): node is HastNode & { children: HastNode[] } {
	return 'children' in node && Array.isArray(node.children);
}

function visit(node: HastNode) {
	if (!node || typeof node !== 'object') return;

	if (isElement(node) && INDENTABLE_TAGS.has(node.tagName)) {
		const firstChild = node.children?.[0];

		if (isText(firstChild)) {
			const match = firstChild.value.match(INDENT_MARKER);
			const matchedIndent = match?.[0];
			const tabs = match?.[2];

			if (matchedIndent && tabs) {
				node.properties ??= {};
				appendClass(node.properties, 'script-indent');
				appendStyle(node.properties, `--script-indent: ${tabs.length * 4}em`);
				firstChild.value = firstChild.value.slice(matchedIndent.length);
			}
		}
	}

	if (hasChildren(node)) {
		for (const child of node.children) {
			visit(child);
		}
	}
}

const rehypeScriptIndent: RehypePlugin = () => (tree) => visit(tree as HastNode);

export default rehypeScriptIndent;
