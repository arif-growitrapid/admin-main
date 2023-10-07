import { Klass, LexicalNode } from "lexical";

import {CodeHighlightNode, CodeNode} from '@lexical/code';
import {HashtagNode} from '@lexical/hashtag';
import {AutoLinkNode, LinkNode} from '@lexical/link';
import {ListItemNode, ListNode} from '@lexical/list';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';

const PlaygroundNodes: Array<Klass<LexicalNode>> = [
    CodeHighlightNode,
    CodeNode,
    HashtagNode,
    AutoLinkNode,
    LinkNode,
    ListItemNode,
    ListNode,
    HeadingNode,
    QuoteNode,
];

export default PlaygroundNodes;
