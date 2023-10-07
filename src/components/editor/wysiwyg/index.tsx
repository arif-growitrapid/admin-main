'use client';

import React, { useEffect, useState } from 'react'

import style from './style.module.scss';
import Editor from './editor';
import { EditorState } from 'lexical';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { onError } from './functions';
import allNodes from './nodes/PlaygroundNodes';
import PlaygroundEditorTheme from './themes/PlaygroundEditorTheme';

export default function WYSIWYG({ }: {}) {
    const [editorState, setEditorState] = useState<EditorState>();
    function onChange(editorState: EditorState) {
        setEditorState(editorState);
    }

    const initialConfig: InitialConfigType = {
        namespace: 'Editor',
        onError,
        nodes: [...allNodes],
        theme: PlaygroundEditorTheme,
    };

    return (
        <div>
            <LexicalComposer initialConfig={initialConfig}>
                <Editor
                    onChange={onChange}
                />
            </LexicalComposer>

            {editorState && (
                <div>
                    <h2>Editor State</h2>
                    <pre>{JSON.stringify(editorState, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}