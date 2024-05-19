import { Notice, Plugin } from 'obsidian';
import { FileSystemAdapter, TAbstractFile } from 'obsidian';
import { SelectFileModal } from 'src/modal';

const DEFAULT_SETTINGS = { rows: [] }

export default class InboxOrganisePlugin extends Plugin {

	async processInboxFiles() {
		console.log('Processing inbox files')
		
		const inboxFolder = this.app.vault.getAbstractFileByPath('Inbox');
		console.log('Inbox Folder', inboxFolder);
		if (!inboxFolder || !inboxFolder.children || inboxFolder.children.length === 0) {
			new Notice("Nothing to Organise",1500)
			return;
		}
		console.log(inboxFolder)

		const files = inboxFolder.children.filter((file: TAbstractFile) => file instanceof TAbstractFile);

		for (const file of files) {
			console.log(file.path)
			await this.app.workspace.openLinkText(file.path, file.path);
			// await sleep(1000)
			const destination = await this.askForDestinationCustom(file);
			console.log('got destination???', destination)
			if (destination) {
				await this.moveFile(file, destination.path);
			}
		}
	}

	async askForDestinationCustom(file: TAbstractFile) {
		console.log('LINKZ', this.app.metadataCache.getFileCache(file).links)
		const links = this.app.metadataCache.getFileCache(file).links;
		const resolvedLinks = links.map((link) => {
			const resolvedPath = this.app.metadataCache.getFirstLinkpathDest(link.link, file.path);
			return resolvedPath
		});
		console.log('RESOLVED LINKS', resolvedLinks)
		return new SelectFileModal(this.app, `Organising: ${file.name}`).open();
	}

	async moveFile(file: TAbstractFile, destination: string) {
		const adapter = this.app.vault.adapter as FileSystemAdapter;
		const newPath = `${destination}/${file.name}`;
		await adapter.rename(file.path, newPath);
	}

	async onload() {
		await this.loadSettings();

		this.addCommand({
			id: 'process-inbox-files',
			name: 'Process Inbox Files',
			callback: () => this.processInboxFiles(),
		});
	}

	async loadSettings() {
	}

	async saveSettings() {
	}
}
