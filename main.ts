import { FuzzySuggestModal, Notice, Plugin, Setting } from 'obsidian';
import { FileSystemAdapter, TAbstractFile } from 'obsidian';
import { OrganiseCommand } from 'src/command';
import { SelectFileModal } from 'src/modal';
import { PluginSettingTab } from 'obsidian';
import { DEFAULT_SETTINGS } from 'src/data';
import { App } from 'obsidian';



export default class InboxOrganisePlugin extends Plugin {

	settings: typeof DEFAULT_SETTINGS;

	constructor(app: App, plugin: InboxOrganisePlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.settings = Object.assign({}, DEFAULT_SETTINGS);
	}

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'process-inbox-files',
			name: 'Process Inbox Files',
			callback: () => new OrganiseCommand(this.app, this.settings),
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
		
		this.addSettingTab(new InboxOrganiseSettingsTab(this.app, this));
	}


	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class InboxOrganiseSettingsTab extends PluginSettingTab {
	plugin: InboxOrganisePlugin;

	constructor(app: App, plugin: InboxOrganisePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Inbox Folder')
			.setDesc('Specify the inbox folder')
			.addText((text) =>
				text
					.setPlaceholder('Enter inbox folder')
					.setValue(this.plugin.settings.inboxFolder)
					.onChange(async (value) => {
						this.plugin.settings.inboxFolder = value;
						await this.plugin.saveSettings();
					})
			);
	}
}