import { Editor, MarkdownView, Plugin } from "obsidian";
import {
    DEFAULT_SETTINGS,
    ITagItem,
    QuickTagLineSettings,
    SettingTab,
} from "./settings-tab";

export default class QuickTagLinePlugin extends Plugin {
    settings: QuickTagLineSettings;

    async onload() {
        await this.loadSettings();
        this.validateSettings();

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new SettingTab(this.app, this));

        this.addCommand({
            id: "toggle-tag1",
            name: "Toggle tag1",
            editorCallback: (editor: Editor, view: MarkdownView) => {
                const pattern = /- \[.\] /;
                let currentCursorPosition = editor.getCursor();
                const startSelectionLineNo = editor.getCursor("from");
                const endSelectionLineNo = editor.getCursor("to");
                const tag = this.settings.tags[0];

                if (tag.isEnabled) {
                    for (
                        let lineNo = startSelectionLineNo.line;
                        lineNo <= endSelectionLineNo.line;
                        lineNo++
                    ) {
                        const currentLine = editor.getLine(lineNo);
                        let newLine = currentLine;

                        if (this.hasThisTagAlready(currentLine, tag)) {
                            newLine = this.removeTag(currentLine, tag);
                        } else {
                            newLine = this.applyTag(currentLine, tag);
                        }

                        editor.setLine(lineNo, newLine);
                    }
                }

                editor.setCursor(currentCursorPosition);
                editor.setSelection(startSelectionLineNo, endSelectionLineNo);
            },
        });

        this.addCommand({
            id: "toggle-additional-states",
            name: "Toggle Additional states",
            editorCallback: (editor: Editor, view: MarkdownView) => {
                const pattern = /- \[.\] /;
                const allStates = this.settings.tags;
                const currentCursorPosition = editor.getCursor();
                const startSelectionLineNo = editor.getCursor("from");
                const endSelectionLineNo = editor.getCursor("to");

                for (
                    let lineNo = startSelectionLineNo.line;
                    lineNo <= endSelectionLineNo.line;
                    lineNo++
                ) {
                    const currentLine = editor.getLine(lineNo);
                    let newLine = currentLine;

                    let currentStateIdx = allStates.findIndex((s) =>
                        currentLine.trimStart().startsWith(`- [${s.value}] `)
                    );

                    let nextState: ITagItem;
                    do {
                        currentStateIdx++;

                        if (currentStateIdx >= allStates.length) {
                            nextState = { value: " ", isEnabled: true };
                        } else {
                            nextState = allStates[currentStateIdx];
                        }
                    } while (!nextState.isEnabled);

                    newLine = currentLine.replace(
                        pattern,
                        `- [${nextState.value}] `
                    );

                    editor.setLine(lineNo, newLine);
                }

                editor.setCursor(currentCursorPosition);
                editor.setSelection(startSelectionLineNo, endSelectionLineNo);
            },
        });
    }

    applyTag(line: string, tag: ITagItem) {
        return line + ` ${tag.value}`;
    }

    removeTag(line: string, tag: ITagItem) {
        return line.replace(' '+tag.value, "");
    }

    private validateSettings() {
        this.settings.tags.forEach((s) => {
            if (s.value?.length < 1) {
                s.isEnabled = s.isEnabled = false;
                return; //todo czy continue?
            }

            if (s.value?.startsWith("#")) {
                s.value = s.value.slice(1);
            }

            this.settings.forbiddenChars
                .split("")
                .forEach((c) => (s.value = s.value.replace(c, "-")));

            s.value = "#" + s.value;
        });
    }

    private hasThisTagAlready(currentLine: string, tag: ITagItem) {
        return currentLine.search(tag.value) >= 0;
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign(
            {},
            DEFAULT_SETTINGS,
            await this.loadData()
        );
    }

    async saveSettings() {
        this.validateSettings();
        await this.saveData(this.settings);
    }
}
