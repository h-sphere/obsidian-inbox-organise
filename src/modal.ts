import { Notice, SuggestModal, TAbstractFile, TFolder } from "obsidian";

export interface Folder {
	title: string;
	file: TAbstractFile;
	path: string;
}

export class SelectFileModal extends SuggestModal<Folder> {

	isResolved: boolean = false;

	// Returns all available suggestions.
	getSuggestions(query: string): Folder[] {
		const folders: TAbstractFile[] = [];
		
		const vaultFolder = this.app.vault.getRoot()
		console.log('VAULT FOLDER', vaultFolder)

		

		if (vaultFolder && vaultFolder.children) {
			for (const child of vaultFolder.children) {
				console.log('CHILDREN', child)
				if (child instanceof TFolder) {
					console.log('i am folder', child)
					folders.push(child);
					const subfolders = child.children.filter((subfolder: TAbstractFile) => subfolder instanceof TFolder);
					folders.push(...subfolders);
				}
			}
		}
		console.log('folders', folders)
		const filteredFolders = folders.filter((folder) => {
			const folderName = folder.path.toLowerCase();
			const queryLower = query.toLowerCase();
			return folderName.includes(queryLower);
		});

		return filteredFolders.map((folder) => ({
			title: folder.name,
			file: folder,
			path: folder.path,
		}));
	}

	constructor(app: App, private message: string) {
		super(app);
	}

	onOpen(): void {
		super.onOpen();
		this.titleEl.setText(this.message);
		this.containerEl
			.find('.prompt')
			.createEl('div', { text: this.message, prepend: true, cls: 'prompt-header' });
		this.inputEl.focus();
	}

	onClose(): void {
		// Pretty ugly hack to handle the case where the user closes the modal without selecting a suggestion.
		setTimeout(() => {
			if (!this.isResolved) {
				console.log('ON CLOSE');
				this.reject();
			}
		})
	}

	private resolve: any;
	private reject: any;

	open(): Promise<Folder> {
		super.open();
		return new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}

	// Renders each suggestion item.
	renderSuggestion(folder: Folder, el: HTMLElement) {
		el.createEl('div', { text: folder.title });
		el.createEl('small', { text: folder.path });
	}

	// Perform action on the selected suggestion.
	onChooseSuggestion(folder: Folder, evt: MouseEvent | KeyboardEvent) {
		console.log('ON CHOOSE SUGGESTION')
		new Notice(`Selected ${folder.title}`);
		this.isResolved = true;
		this.resolve(folder);
	}
}