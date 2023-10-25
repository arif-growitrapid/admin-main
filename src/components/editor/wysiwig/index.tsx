'use client'

import React, { useState, useRef, useEffect } from 'react'
import prismComponents from "prismjs/components";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import CustomEditor from 'ckeditor5-custom-build/build/ckeditor';
import EditorToolbarConfig, { ButtonView } from './editor-toolbar.config';

// Collect all languages from prismjs
const languages = ["plane", ...Object.keys(prismComponents.languages).filter(e => ![
    "meta",
    "django"
].includes(e)).sort()];

type Props = {
    id: string;
    initialContent: string;
    shouldSaveLocally: boolean;
    update?: number;
    customToolbarButton?: {
        label: string;
        icon: string;
        tooltip: string;
        className?: string;
        onClick: () => void;
    };
    deleteLocalContent?: () => void;
    onSave?: (content: string) => void;
    onContentChange?: (content: string) => void;
}

export default function WysiwigEditor(props: Props) {
    const id = (props.id || "default") + ".editor";
    const localData = localStorage.getItem(id);
    const initialContent = ((localData && localData !== "") ? localData : props.initialContent) || "";

    // Custom Toolbar Button Plugin
    function CustomToolbarButton(editor: CKEditor<CustomEditor>["editor"]) {
        if (!editor) return;

        editor.ui.componentFactory.add('back_button', locale => {
            const view = new ButtonView();

            view.set({
                label: props.customToolbarButton?.label || "Back",
                icon: props.customToolbarButton?.icon || "back",
                tooltip: props.customToolbarButton?.tooltip || "Back",
                className: props.customToolbarButton?.className,
                onClick: props.customToolbarButton?.onClick || (() => { })
            });

            return view as any;
        });
    };

    // Get editor config from editor-toolbar.config.ts
    const editorConfig = useRef(EditorToolbarConfig({
        languages,
        // ckfinder: {
        //     uploadUrl: 'https://example.com/ckfinder/core/connector/php/connector.php?command=QuickUpload&type=Images&responseType=json'
        // }
    }));
    const [isEditorReady, setIsEditorReady] = useState(false);
    const EditorRef = useRef<CKEditor<CustomEditor>>() as React.MutableRefObject<CKEditor<CustomEditor>>;

    useEffect(() => {
        if (isEditorReady) {
            EditorRef.current.shouldComponentUpdate = () => false;
        }
    }, [props.update]);

    useEffect(() => {
        if (typeof props.onContentChange === "function") {
            props.onContentChange(initialContent);
        }
    }, [])

    return (
        <CKEditor
            ref={EditorRef}
            editor={CustomEditor}
            data={initialContent}
            config={{
                ...editorConfig.current,
                extraPlugins: [
                    ...(editorConfig.current.extraPlugins || []),
                    ...(props.customToolbarButton ? [CustomToolbarButton] : []),
                ],
            }}
            id={id}
            onReady={() => setIsEditorReady(true)}
            onChange={(event, editor) => {
                const data = editor.getData();

                if (typeof props.onContentChange === "function") {
                    props.onContentChange(data);
                }

                if (props.shouldSaveLocally) {
                    localStorage.setItem(id, data);
                }
            }}
        />
    )
}