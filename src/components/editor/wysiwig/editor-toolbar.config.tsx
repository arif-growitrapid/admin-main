// @ts-ignore
import DOMPurify from 'dompurify';
import type { EditorConfig } from "@ckeditor/ckeditor5-core";
import type { MentionFeed } from "@ckeditor/ckeditor5-mention";

import { customPostItemRenderer, customUserItemRenderer, getPosts, getUsers, MentionLinksPlugin } from './mention';

var re_weburl = new RegExp(
      "^" +
      // protocol identifier (optional)
      // short syntax // still required
      "(?:(?:(?:https?|ftp):)?\\/\\/)" +
      // user:pass BasicAuth (optional)
      "(?:\\S+(?::\\S*)?@)?" +
      "(?:" +
      // IP address exclusion
      // private & local networks
      "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
      "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
      "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broadcast addresses
      // (first & last IP address of each class)
      "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
      "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
      "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
      "|" +
      // host & domain names, may end with dot
      // can be replaced by a shortest alternative
      // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
      "(?:" +
      "(?:" +
      "[a-z0-9\\u00a1-\\uffff]" +
      "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
      ")?" +
      "[a-z0-9\\u00a1-\\uffff]\\." +
      ")+" +
      // TLD identifier name, may end with dot
      "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
      ")" +
      // port number (optional)
      "(?::\\d{2,5})?" +
      // resource path (optional)
      "(?:[/?#]\\S*)?" +
      "$", "i"
);

/**
 * 
 * @param {*} props 
 * @returns {import("@types/ckeditor__ckeditor5-core/src/editor/editorconfig").EditorConfig}
 */
export default function EditorToolbarConfig(props: EditorConfig & {
      languages: string[];
      mentionFeeds?: MentionFeed[];
      [key: string]: any;
}): EditorConfig {

      const { languages: _code_languages } = props;

      return {
            ...props,
            language: 'en',

            extraPlugins: [
                  ...(props.extraPlugins || []),
                  MentionLinksPlugin
            ],

            toolbar: {
                  items: [
                        'back_button',
                        '|',
                        'undo',
                        'redo',
                        '|',
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        'link',
                        'blockQuote',
                        'subscript',
                        'superscript',
                        'removeFormat',
                        '|',
                        'fontBackgroundColor',
                        'fontColor',
                        'fontFamily',
                        'fontSize',
                        'highlight',
                        '|',
                        'alignment',
                        'indent',
                        'outdent',
                        'bulletedList',
                        'numberedList',
                        'todoList',
                        'insertTable',
                        '|',
                        'imageInsert',
                        'mediaEmbed',
                        'specialCharacters',
                        'code',
                        'codeBlock',
                        'horizontalLine',
                        'htmlEmbed',
                        'pageBreak',
                        '|',
                        'findAndReplace',
                        'textPartLanguage',
                        'restrictedEditingException',
                        'sourceEditing',
                        'showBlocks',
                        'selectAll'
                  ],
                  removeItems: [],
                  shouldNotGroupWhenFull: false
            },
            heading: {
                  options: [
                        { model: 'paragraph', title: 'Paragraph Text', class: 'ck-heading_paragraph' },
                        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                        { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                        { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                        { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' },
                  ],
            },
            fontFamily: {
                  supportAllValues: true,
                  options: [
                        'default',
                        'Arial, Helvetica, sans-serif',
                        'Courier New, Courier, monospace',
                        'Georgia, serif',
                        'Lucida Sans Unicode, Lucida Grande, sans-serif',
                        'Tahoma, Geneva, sans-serif',
                        'Times New Roman, Times, serif',
                        'Trebuchet MS, Helvetica, sans-serif',
                        'Verdana, Geneva, sans-serif'
                  ]
            },
            fontSize: {
                  options: ['0.5', '0.6', '0.7', '0.8', '0.9', '1.0', '1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8', '1.9', '2.0'].map(val => ({
                        model: val,
                        title: `x${val}`,
                        view: {
                              name: 'span',
                              styles: {
                                    'font-size': `${val}rem`
                              }
                        }
                  })),
                  // supportAllValues: true
            },
            fontColor: {
                  colors,
                  columns: 10,
                  documentColors: 20,
                  colorPicker: {
                        format: 'hex',
                  }
            },
            fontBackgroundColor: {
                  colors,
                  columns: 10,
                  documentColors: 20,
                  colorPicker: {
                        format: 'hex',
                  }
            },
            image: {
                  toolbar: [
                        'imageStyle:inline',
                        'imageStyle:wrapText',
                        'imageStyle:alignCenter',
                        'imageStyle:breakText',
                        'imageStyle:side',
                        'imageStyle:sideLeft',
                        '|',
                        'imageResize:25',
                        'imageResize:50',
                        'imageResize:75',
                        'imageResize:original',
                        '|',
                        'imageTextAlternative',
                        'toggleImageCaption',
                        'linkImage'
                  ],
                  resizeUnit: '%',
                  resizeOptions: [
                        {
                              name: 'imageResize:original',
                              value: null,
                              icon: 'original'
                        },
                        {
                              name: 'imageResize:25',
                              value: '25',
                              icon: 'small'
                        },
                        {
                              name: 'imageResize:50',
                              value: '50',
                              icon: 'medium'
                        },
                        {
                              name: 'imageResize:75',
                              value: '75',
                              icon: 'large'
                        }
                  ],
                  insert: {
                        integrations: [
                              'insertImageViaUrl',
                              'openCKFinder'
                        ],
                        type: 'block'
                  },
                  styles: {
                        options: [
                              'inline', 'alignLeft', 'alignRight',
                              'alignCenter', 'alignBlockLeft', 'alignBlockRight',
                              'block', 'side'
                        ]
                  },
                  upload: {
                        types: ['png', 'jpeg', 'gif', 'bmp', 'webp', 'tiff'],
                  }
            },
            link: {
                  decorators: {
                        openInNewTab: {
                              mode: 'manual',
                              label: 'Open in a new tab',
                              defaultValue: true,			// This option will be selected by default.
                              attributes: {
                                    target: '_blank',
                                    rel: 'noopener noreferrer'
                              },
                        },
                  },
                  addTargetToExternalLinks: true,
                  defaultProtocol: 'https://',
            },
            table: {
                  contentToolbar: [
                        'tableColumn',
                        'tableRow',
                        'mergeTableCells',
                        'tableCellProperties',
                        'tableProperties',
                        'toggleTableCaption'
                  ],
                  defaultHeadings: { columns: 1, rows: 1 }
            },
            mediaEmbed: {
                  toolbar: [
                        'mediaEmbed',
                  ],
                  extraProviders: [
                        {
                              name: 'All',
                              // A URL regexp or an array of URL regexps:
                              url: re_weburl,

                              // To be defined only if the media are previewable:
                              html: (match: any) => {

                                    return (
                                          '<div style="position: relative; padding-bottom: 100%; height: 0; padding-bottom: 56.2493%;">' +
                                          `<iframe src="${match[0]}" ` +
                                          'style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" ' +
                                          'frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>' +
                                          '</iframe>' +
                                          '</div>'
                                    );
                              }
                        },
                  ],
                  previewsInData: true,
                  elementName: 'div',
                  providers: []
            },
            codeBlock: {
                  languages: _code_languages.map((_language: any) => {
                        return {
                              language: _language,
                              label: _language === "cs" ? "c#" : _language.toUpperCase()
                        };
                  }),
            },
            mention: {
                  feeds: [
                        ...props.mentionFeeds || [],
                        {
                              marker: '@',
                              feed: getUsers,
                              itemRenderer: customUserItemRenderer
                        },
                        {
                              marker: '#',
                              feed: getPosts,
                              itemRenderer: customPostItemRenderer
                        },
                  ],
                  commitKeys: [13, 32], // Enter, Space
                  dropdownLimit: 10,
            },
            htmlEmbed: {
                  showPreviews: true,
                  sanitizeHtml: (inputHtml: any) => {
                        // Strip unsafe elements and attributes, e.g.:
                        // the `<script>` elements and `on*` attributes.
                        const purify = DOMPurify(window);
                        const outputHtml = purify.sanitize(inputHtml, {
                              ADD_TAGS: ["NOTE"]
                        });
                        // const outputHtml = sanitizeHtml(inputHtml);

                        return {
                              html: outputHtml,
                              // true or false depending on whether the sanitizer stripped anything.
                              hasChanged: true
                        };
                  },
            },
            style: {
                  definitions: [
                        {
                              name: 'Info tag',
                              element: 'div',
                              classes: ['info-tag'],
                        }
                  ],
            },
      }

};


const colors = [
      // Black
      ...colorRow(0, 0, 10, true),
      ...colorRow(0, 100, 10),
      ...colorRow(30, 100, 10),
      ...colorRow(60, 100, 10),
      ...colorRow(90, 100, 10),
      ...colorRow(120, 100, 10),
      ...colorRow(150, 100, 10),
      ...colorRow(180, 100, 10),
      ...colorRow(210, 100, 10),
      ...colorRow(240, 100, 10),
      ...colorRow(270, 100, 10),
      ...colorRow(300, 100, 10),
      ...colorRow(330, 100, 10),
      ...colorRow(360, 100, 10),
];

function colorRow(h: number, s: number, row: number, isBlack?: boolean) {
      const palette = [];

      for (let i = 0; i < row; i++) {
            let index = isBlack ? i : (i + 1);
            let r = isBlack ? (row - 1) : (row + 1);

            palette.push({
                  color: `hsl(${h}, ${s}%, ${100 / r * index}%)`,
                  label: `hsl(${h}, ${s}%, ${100 / r * index}%)`,
                  hasBorder: true
            });
      }

      return palette;
}

export class ButtonView {
      element: HTMLButtonElement;

      constructor() {
            this.element = document.createElement('button');
            this.element.type = 'button';
            this.element.className = 'ck ck-button';
            this.element.setAttribute('data-cke-tooltip-position', 's');
      }

      // Set attributes on the button element.
      set(data: {
            label: string;
            icon: string;
            tooltip: string;
            className?: string;
            onClick: () => void;
      }) {
            this.element.setAttribute('data-cke-tooltip-text', data.tooltip);
            this.element.classList.add(data.className || "");
            this.element.innerHTML = data.icon + `<span class="ck ck-button__label">${data.label}</span>`;
            // Add classes to icon element.
            this.element.firstElementChild!.classList.value = "";
            this.element.firstElementChild!.classList.add("ck", "ck-icon", "ck-reset_all-excluded", "ck-icon_inherit-color", "ck-button__icon");

            // Add click listener.
            this.element.addEventListener('click', data.onClick);
      }

      render() {
            return this.element;
      }

      destroy() {
            this.element.remove();
      }
}
