import { PluginSettingTab, App, Setting } from "obsidian";
import QuickTagLinePlugin from "./main";

export interface ITagItem {
    name: string;
    isEnabled: boolean;
}

export interface QuickTagLineSettings {
    tags: ITagItem[];
    forbiddenChars: string;
    safeSpecialChar:string;

}

export const DEFAULT_SETTINGS: QuickTagLineSettings = {
    tags: [
        { name: "#dzis", isEnabled: true },
        { name: "#miasto", isEnabled: true },
        { name: "#nie_zapomnij", isEnabled: true },
        { name: "test", isEnabled: true },
        { name: "test#forbidden%chars", isEnabled: true },
        { name: "", isEnabled: true },
        { name: "", isEnabled: true },
        { name: "", isEnabled: true },
        { name: "", isEnabled: true },
        { name: "", isEnabled: true },
    ],
    forbiddenChars: " `~!@#$%^&*()+=[]{}\\|;':\",.<>?",
    safeSpecialChar: "_",
};

export class SettingTab extends PluginSettingTab {
    plugin: QuickTagLinePlugin;

    constructor(app: App, plugin: QuickTagLinePlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();
        // const fragment = document.createDocumentFragment();
        // containerEl.createEl('h1', { text: 'Quick Tag Line' });

        const descriptionEl = containerEl.createEl("div");
        descriptionEl
            .createEl("p")
            .append(
                "This plugin allows toggle tags in file content - single line, especially lists"
            );

        ///tagsDescEl
        const tagsDescEl = descriptionEl.createEl("div", {
            cls: "defaults",
        });
        tagsDescEl.createEl("h3", { text: `Tags` });

        ///tagsSettings
        this.plugin.settings.tags.forEach((tag, idx) => {
            new Setting(containerEl)
                .setName("Tag name " + tag.name)
                // .setDesc("value")
                .addText((text) =>
                    text
                        .setPlaceholder("Enter tag name")
                        .setValue(tag.name)
                        .onChange(async (value) => {
                            tag.name = value;
                            await this.plugin.saveSettings();
                        })
                )
                .addToggle((toggle) =>
                    toggle.setValue(tag.isEnabled).onChange(async (value) => {
                        tag.isEnabled = value;
                        await this.plugin.saveSettings();
                    })
                );
        });
    }
}
