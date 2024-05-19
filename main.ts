import { Notice, Plugin } from 'obsidian';
import { FileSystemAdapter, TAbstractFile } from 'obsidian';
import { OrganiseCommand } from 'src/command';
import { SelectFileModal } from 'src/modal';

const DEFAULT_SETTINGS = { rows: [] }

export default class InboxOrganisePlugin extends Plugin {

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'process-inbox-files',
			name: 'Process Inbox Files',
			callback: () => new OrganiseCommand(this.app),
		});
	}

	async loadSettings() {
	}

	async saveSettings() {
	}
}
