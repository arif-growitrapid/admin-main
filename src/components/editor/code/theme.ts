import chroma from 'chroma-js';
import { editor } from 'monaco-editor';
import getColors from './colors';

export default function getTheme(theme: string): editor.IStandaloneThemeData {
    const themes = (options: { [key: string]: string }) => options[theme]; // Usage: themes({ light: "lightblue", dark: "darkblue" })
    const rawColors = getColors(theme)
    const color = changeColorToHexAlphas(rawColors) as typeof rawColors;
    const scale = color.scale; // Usage: scale.blue[6]

    const onlyDark = (color: string) => {
        return themes({ dark: color })
    }

    const lightDark = (light: string, dark: string) => {
        return themes({ light: light, dark: dark })
    }

    const alpha = (color: string, alpha: number) => {
        return chroma(color).alpha(alpha).hex()
    }

    return {
        base: 'vs-dark',
        inherit: true,
        colors: ({
            "activityBar.background": "#090b10",
            "activityBar.border": "#00000060",
            "activityBar.foreground": "#8f93a2",
            "activityBarBadge.background": "#80cbc4",
            "activityBarBadge.foreground": "#000000",
            "badge.background": "#00000030",
            "badge.foreground": "#464b5d",
            "breadcrumb.activeSelectionForeground": "#80cbc4",
            "breadcrumb.background": "#0f111a",
            "breadcrumb.focusForeground": "#8f93a2",
            "breadcrumb.foreground": "#4b526d",
            "breadcrumbPicker.background": "#090b10",
            "button.background": "#717cb450",
            "debugToolBar.background": "#0f111a",
            "diffEditor.insertedTextBackground": "#c3e88d15",
            "diffEditor.removedTextBackground": "#ff537020",
            "dropdown.background": "#0f111a",
            "dropdown.border": "#ffffff10",
            "editor.background": "#0f111a",
            "editor.findMatchBackground": "#000000",
            "editor.findMatchBorder": "#80cbc4",
            "editor.findMatchHighlightBackground": "#00000050",
            "editor.findMatchHighlightBorder": "#ffffff50",
            "editor.foreground": "#8f93a2",
            "editor.lineHighlightBackground": "#00000050",
            "editor.selectionBackground": "#717cb450",
            "editor.selectionHighlightBackground": "#ffcc0020",
            "editorBracketMatch.background": "#0f111a",
            "editorBracketMatch.border": "#ffcc0050",
            "editorCursor.foreground": "#ffcc00",
            "editorError.foreground": "#ff537070",
            "editorGroup.border": "#00000030",
            "editorGroupHeader.tabsBackground": "#0f111a",
            "editorGutter.addedBackground": "#c3e88d60",
            "editorGutter.deletedBackground": "#ff537060",
            "editorGutter.modifiedBackground": "#82aaff60",
            "editorHoverWidget.background": "#0f111a",
            "editorHoverWidget.border": "#ffffff10",
            "editorIndentGuide.activeBackground": "#3b3f51",
            "editorIndentGuide.background": "#3b3f5170",
            "editorInfo.foreground": "#82aaff70",
            "editorLineNumber.activeForeground": "#4b526d",
            "editorLineNumber.foreground": "#3b3f5180",
            "editorLink.activeForeground": "#8f93a2",
            "editorMarkerNavigation.background": "#8f93a205",
            "editorOverviewRuler.border": "#0f111a",
            "editorOverviewRuler.errorForeground": "#ff537040",
            "editorOverviewRuler.findMatchForeground": "#80cbc4",
            "editorOverviewRuler.infoForeground": "#82aaff40",
            "editorOverviewRuler.warningForeground": "#ffcb6b40",
            "editorRuler.foreground": "#3b3f51",
            "editorSuggestWidget.background": "#0f111a",
            "editorSuggestWidget.border": "#ffffff10",
            "editorSuggestWidget.foreground": "#8f93a2",
            "editorSuggestWidget.highlightForeground": "#80cbc4",
            "editorSuggestWidget.selectedBackground": "#00000050",
            "editorWarning.foreground": "#ffcb6b70",
            "editorWhitespace.foreground": "#8f93a240",
            "editorWidget.background": "#090b10",
            "editorWidget.border": "#ff0000",
            "editorWidget.resizeBorder": "#80cbc4",
            "extensionButton.prominentBackground": "#c3e88d90",
            "extensionButton.prominentHoverBackground": "#c3e88d",
            "focusBorder": "#ffffff00",
            "gitDecoration.conflictingResourceForeground": "#ffcb6b90",
            "gitDecoration.deletedResourceForeground": "#ff537090",
            "gitDecoration.ignoredResourceForeground": "#4b526d90",
            "gitDecoration.modifiedResourceForeground": "#82aaff90",
            "gitDecoration.untrackedResourceForeground": "#c3e88d90",
            "input.background": "#1a1c25",
            "input.border": "#ffffff10",
            "input.foreground": "#eeffff",
            "input.placeholderForeground": "#8f93a260",
            "inputOption.activeBackground": "#8f93a230",
            "inputOption.activeBorder": "#8f93a230",
            "inputValidation.errorBorder": "#ff537050",
            "inputValidation.infoBorder": "#82aaff50",
            "inputValidation.warningBorder": "#ffcb6b50",
            "list.activeSelectionBackground": "#090b10",
            "list.activeSelectionForeground": "#80cbc4",
            "list.focusBackground": "#8f93a220",
            "list.focusForeground": "#8f93a2",
            "list.highlightForeground": "#80cbc4",
            "list.hoverBackground": "#090b10",
            "list.hoverForeground": "#ffffff",
            "list.inactiveSelectionBackground": "#00000030",
            "list.inactiveSelectionForeground": "#80cbc4",
            "listFilterWidget.background": "#00000030",
            "listFilterWidget.noMatchesOutline": "#00000030",
            "listFilterWidget.outline": "#00000030",
            "menu.background": "#0f111a",
            "menu.foreground": "#8f93a2",
            "menu.selectionBackground": "#00000050",
            "menu.selectionBorder": "#00000030",
            "menu.selectionForeground": "#80cbc4",
            "menu.separatorBackground": "#8f93a2",
            "menubar.selectionBackground": "#00000030",
            "menubar.selectionBorder": "#00000030",
            "menubar.selectionForeground": "#80cbc4",
            "notificationLink.foreground": "#80cbc4",
            "notifications.background": "#0f111a",
            "notifications.foreground": "#8f93a2",
            "panel.background": "#090b10",
            "panel.border": "#00000060",
            "panelTitle.activeBorder": "#80cbc4",
            "panelTitle.activeForeground": "#ffffff",
            "panelTitle.inactiveForeground": "#8f93a2",
            "peekView.border": "#00000030",
            "peekViewEditor.background": "#8f93a205",
            "peekViewEditor.matchHighlightBackground": "#717cb450",
            "peekViewEditorGutter.background": "#8f93a205",
            "peekViewResult.background": "#8f93a205",
            "peekViewResult.matchHighlightBackground": "#717cb450",
            "peekViewResult.selectionBackground": "#4b526d70",
            "peekViewTitle.background": "#8f93a205",
            "peekViewTitleDescription.foreground": "#8f93a260",
            "pickerGroup.foreground": "#80cbc4",
            "progressBar.background": "#80cbc4",
            "scrollbar.shadow": "#0f111a00",
            "scrollbarSlider.activeBackground": "#80cbc4",
            "scrollbarSlider.background": "#8f93a220",
            "scrollbarSlider.hoverBackground": "#8f93a210",
            "selection.background": "#80cbc4",
            "settings.checkboxBackground": "#090b10",
            "settings.checkboxForeground": "#8f93a2",
            "settings.dropdownBackground": "#090b10",
            "settings.dropdownForeground": "#8f93a2",
            "settings.headerForeground": "#80cbc4",
            "settings.modifiedItemIndicator": "#80cbc4",
            "settings.numberInputBackground": "#090b10",
            "settings.numberInputForeground": "#8f93a2",
            "settings.textInputBackground": "#090b10",
            "settings.textInputForeground": "#8f93a2",
            "sideBar.background": "#090b10",
            "sideBar.border": "#00000060",
            "sideBar.foreground": "#4b526d",
            "sideBarSectionHeader.background": "#090b10",
            "sideBarSectionHeader.border": "#00000060",
            "sideBarTitle.foreground": "#8f93a2",
            "statusBar.background": "#090b10",
            "statusBar.border": "#00000060",
            "statusBar.debuggingBackground": "#c792ea",
            "statusBar.debuggingForeground": "#ffffff",
            "statusBar.foreground": "#4b526d",
            "statusBar.noFolderBackground": "#0f111a",
            "statusBarItem.hoverBackground": "#464b5d20",
            "statusBarItem.remoteBackground": "#80cbc4",
            "statusBarItem.remoteForeground": "#000000",
            "tab.activeBorder": "#80cbc4",
            "tab.activeForeground": "#ffffff",
            "tab.activeModifiedBorder": "#4b526d",
            "tab.border": "#0f111a",
            "tab.inactiveBackground": "#0f111a",
            "tab.inactiveForeground": "#4b526d",
            "tab.unfocusedActiveBorder": "#464b5d",
            "tab.unfocusedActiveForeground": "#8f93a2",
            "terminal.ansiBlack": "#000000",
            "terminal.ansiBlue": "#82aaff",
            "terminal.ansiBrightBlack": "#464b5d",
            "terminal.ansiBrightBlue": "#82aaff",
            "terminal.ansiBrightCyan": "#89ddff",
            "terminal.ansiBrightGreen": "#c3e88d",
            "terminal.ansiBrightMagenta": "#c792ea",
            "terminal.ansiBrightRed": "#ff5370",
            "terminal.ansiBrightWhite": "#ffffff",
            "terminal.ansiBrightYellow": "#ffcb6b",
            "terminal.ansiCyan": "#89ddff",
            "terminal.ansiGreen": "#c3e88d",
            "terminal.ansiMagenta": "#c792ea",
            "terminal.ansiRed": "#ff5370",
            "terminal.ansiWhite": "#ffffff",
            "terminal.ansiYellow": "#ffcb6b",
            "terminalCursor.background": "#000000",
            "terminalCursor.foreground": "#ffcb6b",
            "textLink.activeForeground": "#8f93a2",
            "textLink.foreground": "#80cbc4",
            "titleBar.activeBackground": "#090b10",
            "titleBar.activeForeground": "#8f93a2",
            "titleBar.border": "#00000060",
            "titleBar.inactiveBackground": "#090b10",
            "titleBar.inactiveForeground": "#4b526d",
            "tree.indentGuidesStroke": "#3b3f51",
            "widget.shadow": "#00000030"
        }),
        "rules": [
            {
                scope: ["comment", "punctuation.definition.comment", "string.comment"],
                settings: {
                    foreground: lightDark(scale.gray[5], scale.gray[3])
                },
            },
            {
                scope: [
                    "constant.other.placeholder",
                    "constant.character"
                ],
                settings: {
                    foreground: lightDark(scale.red[5], scale.red[3])
                },
            },
            {
                scope: [
                    "constant",
                    "entity.name.constant",
                    "variable.other.constant",
                    "variable.other.enummember",
                    "variable.language",
                    "entity",
                ],
                settings: {
                    foreground: lightDark(scale.blue[6], scale.blue[2])
                },
            },
            {
                scope: [
                    "entity.name",
                    "meta.export.default",
                    "meta.definition.variable"
                ],
                settings: {
                    foreground: lightDark(scale.orange[6], scale.orange[2])
                },
            },
            {
                scope: [
                    "variable.parameter.function",
                    "meta.jsx.children",
                    "meta.block",
                    "meta.tag.attributes",
                    "entity.name.constant",
                    "meta.object.member",
                    "meta.embedded.expression"
                ],
                settings: {
                    foreground: color.fg.default,
                },
            },
            {
                "scope": "entity.name.function",
                "settings": {
                    foreground: lightDark(scale.purple[5], scale.purple[2])
                }
            },
            {
                "scope": [
                    "entity.name.tag",
                    "support.class.component"
                ],
                settings: {
                    foreground: lightDark(scale.green[6], scale.green[1])
                },
            },
            {
                scope: "keyword",
                settings: {
                    foreground: lightDark(scale.red[5], scale.red[3])
                },
            },
            {
                scope: ["storage", "storage.type"],
                settings: {
                    foreground: lightDark(scale.red[5], scale.red[3])
                },
            },
            {
                scope: [
                    "storage.modifier.package",
                    "storage.modifier.import",
                    "storage.type.java",
                ],
                settings: {
                    foreground: color.fg.default,
                },
            },
            {
                scope: [
                    "string",
                    "string punctuation.section.embedded source",
                ],
                settings: {
                    foreground: lightDark(scale.blue[8], scale.blue[1])
                },
            },
            {
                scope: "support",
                settings: {
                    foreground: lightDark(scale.blue[6], scale.blue[2])
                },
            },
            {
                scope: "meta.property-name",
                settings: {
                    foreground: lightDark(scale.blue[6], scale.blue[2])
                },
            },
            {
                scope: "variable",
                settings: {
                    foreground: lightDark(scale.orange[6], scale.orange[2])
                },
            },
            {
                scope: "variable.other",
                settings: {
                    foreground: color.fg.default,
                },
            },
            {
                scope: "invalid.broken",
                settings: {
                    fontStyle: "italic",
                    foreground: lightDark(scale.red[7], scale.red[2])
                },
            },
            {
                scope: "invalid.deprecated",
                settings: {
                    fontStyle: "italic",
                    foreground: lightDark(scale.red[7], scale.red[2])
                },
            },
            {
                scope: "invalid.illegal",
                settings: {
                    fontStyle: "italic",
                    foreground: lightDark(scale.red[7], scale.red[2])
                },
            },
            {
                scope: "invalid.unimplemented",
                settings: {
                    fontStyle: "italic",
                    foreground: lightDark(scale.red[7], scale.red[2])
                },
            },
            {
                scope: "carriage-return",
                settings: {
                    fontStyle: "italic underline",
                    background: lightDark(scale.red[5], scale.red[3]),
                    foreground: lightDark(scale.gray[0], scale.gray[0]),
                    content: "^M",
                },
            },
            {
                scope: "message.error",
                settings: {
                    foreground: lightDark(scale.red[7], scale.red[2])
                },
            },
            {
                scope: "string variable",
                settings: {
                    foreground: lightDark(scale.blue[6], scale.blue[2])
                },
            },
            {
                scope: ["source.regexp", "string.regexp"],
                settings: {
                    foreground: lightDark(scale.blue[8], scale.blue[1])
                },
            },
            {
                scope: [
                    "string.regexp.character-class",
                    "string.regexp constant.character.escape",
                    "string.regexp source.ruby.embedded",
                    "string.regexp string.regexp.arbitrary-repitition",
                ],
                settings: {
                    foreground: lightDark(scale.blue[8], scale.blue[1])
                },
            },
            {
                scope: "string.regexp constant.character.escape",
                settings: {
                    fontStyle: "bold",
                    foreground: lightDark(scale.green[6], scale.green[1])
                },
            },
            {
                scope: "support.constant",
                settings: {
                    foreground: lightDark(scale.blue[6], scale.blue[2])
                },
            },
            {
                scope: "support.variable",
                settings: {
                    foreground: lightDark(scale.blue[6], scale.blue[2])
                },
            },
            {
                scope: "support.type.property-name.json",
                settings: {
                    foreground: lightDark(scale.green[6], scale.green[1])
                },
            },
            {
                scope: "meta.module-reference",
                settings: {
                    foreground: lightDark(scale.blue[6], scale.blue[2])
                },
            },
            {
                scope: "punctuation.definition.list.begin.markdown",
                settings: {
                    foreground: lightDark(scale.orange[6], scale.orange[2])
                },
            },
            {
                scope: ["markup.heading", "markup.heading entity.name"],
                settings: {
                    fontStyle: "bold",
                    foreground: lightDark(scale.blue[6], scale.blue[2])
                },
            },
            {
                scope: "markup.quote",
                settings: {
                    foreground: lightDark(scale.green[6], scale.green[1])
                },
            },
            {
                scope: "markup.italic",
                settings: {
                    fontStyle: "italic",
                    foreground: color.fg.default,
                },
            },
            {
                scope: "markup.bold",
                settings: {
                    fontStyle: "bold",
                    foreground: color.fg.default,
                },
            },
            {
                scope: ["markup.underline"],
                settings: {
                    fontStyle: "underline",
                },
            },
            {
                scope: ["markup.strikethrough"],
                settings: {
                    fontStyle: "strikethrough",
                },
            },
            {
                scope: "markup.inline.raw",
                settings: {
                    foreground: lightDark(scale.blue[6], scale.blue[2])
                },
            },
            {
                scope: [
                    "markup.deleted",
                    "meta.diff.header.from-file",
                    "punctuation.definition.deleted",
                ],
                settings: {
                    background: lightDark(scale.red[0], scale.red[9]),
                    foreground: lightDark(scale.red[7], scale.red[2])
                },
            },
            {
                scope: ["punctuation.section.embedded"],
                settings: {
                    foreground: lightDark(scale.red[5], scale.red[3])
                },
            },
            {
                scope: [
                    "markup.inserted",
                    "meta.diff.header.to-file",
                    "punctuation.definition.inserted",
                ],
                settings: {
                    background: lightDark(scale.green[0], scale.green[9]),
                    foreground: lightDark(scale.green[6], scale.green[1])
                },
            },
            {
                scope: ["markup.changed", "punctuation.definition.changed"],
                settings: {
                    background: lightDark(scale.orange[1], scale.orange[8]),
                    foreground: lightDark(scale.orange[6], scale.orange[2])
                },
            },
            {
                scope: ["markup.ignored", "markup.untracked"],
                settings: {
                    foreground: lightDark(scale.gray[1], scale.gray[8]),
                    background: lightDark(scale.blue[6], scale.blue[2])
                },
            },
            {
                scope: "meta.diff.range",
                settings: {
                    foreground: lightDark(scale.purple[5], scale.purple[2]),
                    fontStyle: "bold",
                },
            },
            {
                scope: "meta.diff.header",
                settings: {
                    foreground: lightDark(scale.blue[6], scale.blue[2])
                },
            },
            {
                scope: "meta.separator",
                settings: {
                    fontStyle: "bold",
                    foreground: lightDark(scale.blue[6], scale.blue[2])
                },
            },
            {
                scope: "meta.output",
                settings: {
                    foreground: lightDark(scale.blue[6], scale.blue[2])
                },
            },
            {
                scope: [
                    "brackethighlighter.tag",
                    "brackethighlighter.curly",
                    "brackethighlighter.round",
                    "brackethighlighter.square",
                    "brackethighlighter.angle",
                    "brackethighlighter.quote",
                ],
                settings: {
                    foreground: lightDark(scale.gray[6], scale.gray[3])
                },
            },
            {
                scope: "brackethighlighter.unmatched",
                settings: {
                    foreground: lightDark(scale.red[7], scale.red[2])
                },
            },
            {
                scope: ["constant.other.reference.link", "string.other.link"],
                settings: {
                    foreground: lightDark(scale.blue[8], scale.blue[1]),
                },
            },
        ].map((rule: {
            scope: string[] | string;
            settings: {
                foreground?: string;
                background?: string;
                fontStyle?: string;
            };
        }) => ({
            token: typeof rule.scope === 'string' ? rule.scope : rule.scope.join(' '),
            foreground: rule.settings.foreground,
            background: rule.settings.background,
            fontStyle: rule.settings.fontStyle,
        })),
    }
};

// Convert to hex
// VS Code doesn't support other formats like hsl, rgba etc.

function changeColorToHexAlphas(obj: any) {
    if (typeof obj === 'object') {
        for (var keys in obj) {
            if (typeof obj[keys] === 'object') {
                changeColorToHexAlphas(obj[keys])
            } else {
                let keyValue = obj[keys]
                if (chroma.valid(keyValue)) {
                    obj[keys] = chroma(keyValue).hex() || "#000000";
                }
            }
        }
    }
    return obj;
}