import { PluginSettingTab, App, Setting } from "obsidian";
import QuickTagLinePlugin from "./main";

export interface ITagItem {
    value: string;
    isEnabled: boolean;
}

export interface QuickTagLineSettings {
    tags: ITagItem[];
    forbiddenChars:string;
}

export const DEFAULT_SETTINGS: QuickTagLineSettings = {
    tags: [
        { value: '#dzis', isEnabled: true },
        { value: '#miasto', isEnabled: true },
        { value: '#nie_zapomnij', isEnabled: true },
        { value: 'test', isEnabled: true },
        { value: 'test#forbidden%chars', isEnabled: true },
        { value: '', isEnabled: true },
        { value: '', isEnabled: true },
        { value: '', isEnabled: true },
        { value: '', isEnabled: true },
        { value: '', isEnabled: true },
    ],
    forbiddenChars:' `~!@#$%^&*()+=[]{}\\|;\':",.<>?',
};

export class SettingTab extends PluginSettingTab {
    plugin: QuickTagLinePlugin;

    constructor(app: App, plugin: QuickTagLinePlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        //todo update this
        const { containerEl } = this;

        containerEl.empty();
        const fragment = document.createDocumentFragment();
		containerEl.createEl('h1', { text: 'Quick Tag Line' });

	// 	const descriptionEl = containerEl.createEl('div');
    //     descriptionEl.createEl("p").append(
    //         "This plugin allows toggles 3 state intead of default two, it works nad looks perfectly when theme supports it eg. ",
    //         fragment.createEl('a', {
	// 			href: 'https://github.com/colineckert/obsidian-things',
	// 			text: 'Things',
	// 		}),
    //     );

    //     ///primaryStatesDescEl
    //     const primaryStatesDescEl = descriptionEl.createEl('div', {
	// 		cls: 'pattern-defaults',
	// 	});
	// 	primaryStatesDescEl.createEl('h3', { text: `Primary states` });

    //     const descriptionStatesEl = primaryStatesDescEl.createEl('ul');
	// 	descriptionStatesEl.createEl("li").append('empty: "- [ ] " ');
	// 	descriptionStatesEl.createEl("li").append('partial: "- [/] " ');
	// 	descriptionStatesEl.createEl("li").append('checked: "- [x] " ');

    //     ///additionalStatesDescEl
    //     const additionalStatesDescEl = descriptionEl.createEl('div', {
	// 		cls: 'pattern-defaults',
	// 	});
	// 	additionalStatesDescEl.createEl('h3', { text: `Additional states` });
    //     additionalStatesDescEl.createEl("p").append(
    //         fragment.createEl('a', {
	// 			href: 'https://github.com/colineckert/obsidian-things/blob/main/assets/checkbox-styles.png',
	// 			text: 'Quick reference',
	// 		}),
    //     );

        ///additionalStatesSettings
        this.plugin.settings.tags.forEach((tag, idx) => {
            new Setting(containerEl)
                .setName("tag #" + idx)
                // .setDesc("value")
                .addText((text) =>
                    text
                        .setPlaceholder("Enter tag name")
                        .setValue(tag.value)
                        .onChange(async (value) => {
                            tag.value = value;
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
