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

        this.settings.tags.forEach((tag, idx) => {
            if (!tag.isEnabled) {
                return;
            }
            
            this.addCommand({
                id: "toggle-tag-" + idx,
                name: "Toggle tag " + tag.name,
                editorCallback: (editor: Editor, view: MarkdownView) => {
                    const currentCursorPosition = editor.getCursor();
                    const startSelectionLineNo = editor.getCursor("from");
                    const endSelectionLineNo = editor.getCursor("to");

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
                    editor.setSelection(
                        startSelectionLineNo,
                        endSelectionLineNo
                    );
                },
            });
        });
    }

    applyTag(line: string, tag: ITagItem) {
        return line + ` ${tag.name}`;
    }

    removeTag(line: string, tag: ITagItem) {
        return line.replace(" " + tag.name, "");
    }

    private validateSettings() {
        this.settings.tags.forEach((s) => {
            if (s.name?.length < 1) {
                s.isEnabled = s.isEnabled = false;
                return; //todo return or continue?
            }

            if (s.name?.startsWith("#")) {
                s.name = s.name.slice(1);
            }

            this.settings.forbiddenChars
                .split("")
                .forEach((c) => (s.name = s.name.replace(c, this.settings.safeSpecialChar)));

            s.name = "#" + s.name;
        });
    }

    private hasThisTagAlready(currentLine: string, tag: ITagItem) {
        return currentLine.search(tag.name) >= 0;
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
