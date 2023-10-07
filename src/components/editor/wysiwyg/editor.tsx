'use client';

import React, { useEffect, useState } from 'react'

// Import Lexical
import { EditorState, EditorThemeClasses } from 'lexical'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { InitialConfigType } from '@lexical/react/LexicalComposer'

// Import Lexical Plugins
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { CharacterLimitPlugin } from '@lexical/react/LexicalCharacterLimitPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { ClearEditorPlugin } from '@lexical/react/LexicalClearEditorPlugin';
import LexicalClickableLinkPlugin from '@lexical/react/LexicalClickableLinkPlugin';
import { HashtagPlugin } from '@lexical/react/LexicalHashtagPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';

import useLexicalEditable from '@lexical/react/useLexicalEditable';
import { useAppSelector } from '@/redux/store'

// Import local Lexical Plugins
import ActionsPlugin from './plugins/ActionsPlugin';
import AutoEmbedPlugin from './plugins/AutoEmbedPlugin';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import CodeActionMenuPlugin from './plugins/CodeActionMenuPlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import CollapsiblePlugin from './plugins/CollapsiblePlugin';
import ComponentPickerPlugin from './plugins/ComponentPickerPlugin';
import ContextMenuPlugin from './plugins/ContextMenuPlugin';
import DragDropPaste from './plugins/DragDropPastePlugin';
import DraggableBlockPlugin from './plugins/DraggableBlockPlugin';
import EmojiPickerPlugin from './plugins/EmojiPickerPlugin';
import EmojisPlugin from './plugins/EmojisPlugin';
import EquationsPlugin from './plugins/EquationsPlugin';
import ExcalidrawPlugin from './plugins/ExcalidrawPlugin';
import FigmaPlugin from './plugins/FigmaPlugin';
import FloatingLinkEditorPlugin from './plugins/FloatingLinkEditorPlugin';
import FloatingTextFormatToolbarPlugin from './plugins/FloatingTextFormatToolbarPlugin';
import ImagesPlugin from './plugins/ImagesPlugin';
import InlineImagePlugin from './plugins/InlineImagePlugin';
import KeywordsPlugin from './plugins/KeywordsPlugin';
import { LayoutPlugin } from './plugins/LayoutPlugin/LayoutPlugin';
import LinkPlugin from './plugins/LinkPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import MarkdownShortcutPlugin from './plugins/MarkdownShortcutPlugin';
import { MaxLengthPlugin } from './plugins/MaxLengthPlugin';
import MentionsPlugin from './plugins/MentionsPlugin';
import PageBreakPlugin from './plugins/PageBreakPlugin';
import PollPlugin from './plugins/PollPlugin';
import SpeechToTextPlugin from './plugins/SpeechToTextPlugin';
import TabFocusPlugin from './plugins/TabFocusPlugin';
import TableCellActionMenuPlugin from './plugins/TableActionMenuPlugin';
import TableCellResizer from './plugins/TableCellResizer';
import { TablePlugin as NewTablePlugin } from './plugins/TablePlugin';
import TwitterPlugin from './plugins/TwitterPlugin';
import YouTubePlugin from './plugins/YouTubePlugin';

// Import local Lexical Nodes
import TableCellNodes from './nodes/TableCellNodes'
import { onError } from './functions'
import Placeholder from './ui/Placeholder'
import ToolbarPlugin from './plugins/ToolbarPlugin'
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme'

function MyCustomAutoFocusPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        // Focus the editor when the effect fires!
        editor.focus();
    }, [editor]);

    return null;
}

function OnChangePlugin({ onChange }: { onChange: (editorState: EditorState) => void }) {
    // Access the editor through the LexicalComposerContext
    const [editor] = useLexicalComposerContext();
    // Wrap our listener in useEffect to handle the teardown and avoid stale references.
    useEffect(() => {
        // most listeners return a teardown function that can be called to clean them up.
        return editor.registerUpdateListener(({ editorState }) => {
            // call onChange here to pass the latest state up to the parent.
            onChange(editorState);
        });
    }, [editor, onChange]);

    return null;
}

export default function Editor({
    onChange,
}: {
    onChange: (editorState: EditorState) => void;
}) {
    const historyState = useAppSelector(state => state.history);
    const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
    const [floatingAnchorElem, setFloatingAnchorElem] = useState<HTMLDivElement | HTMLElement | undefined>();
    const isEditable = useLexicalEditable();

    const placeholder = <Placeholder>Enter your content here...</Placeholder>;

    const onRef = (_floatingAnchorElem: HTMLDivElement) => {
        if (_floatingAnchorElem !== null) {
            setFloatingAnchorElem(_floatingAnchorElem);
        }
    };

    const cellConfig: InitialConfigType = {
        namespace: 'TableCell',
        onError,
        nodes: [...TableCellNodes],
        theme: PlaygroundEditorTheme,
    };

    return (
        <>
            <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />

            <div className='editor-container'>

                {/* Lexical Plugins */}
                <HistoryPlugin externalHistoryState={historyState} />
                <ListPlugin />
                <CheckListPlugin />
                <TablePlugin
                    hasCellMerge={true}
                    hasCellBackgroundColor={true}
                />
                <AutoFocusPlugin />
                <ClearEditorPlugin />
                <HashtagPlugin />
                <HorizontalRulePlugin />
                <RichTextPlugin
                    contentEditable={
                        <div className="editor-scroller">
                            <div className="editor" ref={onRef}>
                                <ContentEditable className="TableNode__contentEditable" />
                            </div>
                        </div>
                    }
                    placeholder={placeholder}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <TabIndentationPlugin />
                <LexicalClickableLinkPlugin />

                {/* Local Plugins */}
                <ClearEditorPlugin />
                <ComponentPickerPlugin />
                <EmojiPickerPlugin />
                <AutoEmbedPlugin />
                <DragDropPaste />
                <MentionsPlugin />
                <EmojisPlugin />
                <KeywordsPlugin />
                <SpeechToTextPlugin />
                <AutoLinkPlugin />
                <MarkdownShortcutPlugin />
                <CodeHighlightPlugin />
                <ListPlugin />
                <CheckListPlugin />
                <ListMaxIndentLevelPlugin maxDepth={7} />
                <TablePlugin
                    hasCellMerge={true}
                    hasCellBackgroundColor={true}
                />
                <TableCellResizer />
                <NewTablePlugin cellEditorConfig={cellConfig as any}>
                    <AutoFocusPlugin />
                    <RichTextPlugin
                        contentEditable={
                            <ContentEditable className="TableNode__contentEditable" />
                        }
                        placeholder={null}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    <MentionsPlugin />
                    <HistoryPlugin />
                    <ImagesPlugin captionsEnabled={false} />
                    <LinkPlugin />
                    <LexicalClickableLinkPlugin />
                    <FloatingTextFormatToolbarPlugin />
                </NewTablePlugin>
                <ImagesPlugin />
                <InlineImagePlugin />
                <LinkPlugin />
                <PollPlugin />
                <TwitterPlugin />
                <YouTubePlugin />
                <FigmaPlugin />
                {!isEditable && <LexicalClickableLinkPlugin />}
                <HorizontalRulePlugin />
                <EquationsPlugin />
                <ExcalidrawPlugin />
                <TabFocusPlugin />
                <TabIndentationPlugin />
                <CollapsiblePlugin />
                <PageBreakPlugin />
                <LayoutPlugin />

                <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
                <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
                <FloatingLinkEditorPlugin
                    anchorElem={floatingAnchorElem}
                    isLinkEditMode={isLinkEditMode}
                    setIsLinkEditMode={setIsLinkEditMode}
                />
                <TableCellActionMenuPlugin
                    anchorElem={floatingAnchorElem}
                    cellMerge={true}
                />
                <FloatingTextFormatToolbarPlugin
                    anchorElem={floatingAnchorElem}
                />

                <MyCustomAutoFocusPlugin />
                <OnChangePlugin onChange={onChange} />

            </div>
        </>
    )
}