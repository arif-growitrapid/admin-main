import { LexicalEditor } from "lexical";



export function onError(error: Error, editor: LexicalEditor) {
    console.error(error);
}