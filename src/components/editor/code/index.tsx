"use client"

import React from 'react'
import Editor, { Monaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import getTheme from './theme';

type Props = {}

export default function CodeEditor({ }: Props) {
    const editorRef = React.useRef<editor.IStandaloneCodeEditor | null>(null);
    const [codeContent, setCodeContent] = React.useState("");

    function handleEditorDidMount(editor: editor.IStandaloneCodeEditor, monaco: Monaco) {
        // Create the custom theme
        // monaco.editor.defineTheme('theme-dark', getTheme("dark"));
        // Set the custom theme
        
        editorRef.current = editor;
        editorRef.current.focus();
        
        // monaco.editor.setTheme('theme-dark');
    }

    return (
        <div className='w-full min-h-full h-auto'>
            <Editor
                height="calc(100dvh - 41px - 53px)"
                theme='vs-dark'
                defaultLanguage="typescript"
                defaultValue="// some comment"
                value={codeContent}
                onMount={handleEditorDidMount}
                onChange={(value, event) => {
                    setCodeContent(value ?? "");
                }}
                options={{
                    minimap: {
                        enabled: false
                    }
                }}
            />

        </div>
    )
}