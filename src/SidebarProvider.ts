import * as vscode from 'vscode';
import * as path from 'path';

enum SidebarEntryType {
	ErrorList = 0,
	Error = 1
}

export default class SidebarProvider implements vscode.TreeDataProvider<SidebarEntry> {
	private _onDidChangeTreeData: vscode.EventEmitter<SidebarEntry | undefined> = new vscode.EventEmitter<SidebarEntry | undefined>();
	readonly onDidChangeTreeData: vscode.Event<SidebarEntry | undefined> = this._onDidChangeTreeData.event;

	private _errorList: Array<SidebarEntry>;
	private _parsed : boolean;

	constructor() {
		this._parsed = false;
		this._errorList = new Array<SidebarEntry>(); 
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: SidebarEntry): vscode.TreeItem {
		return element;
	}

	getChildren(element?: SidebarEntry): Thenable<SidebarEntry[]> {
		if (!element) {
			return Promise.resolve(this.getRootElements());
		}

		if (element.type === SidebarEntryType.ErrorList) {
			return Promise.resolve(this._errorList);
		}

		return Promise.resolve([]);
	}

	private getRootElements(): SidebarEntry[] {
		if (!this._parsed) {
			this.parseLog();
		}

		let entries = Array<SidebarEntry>();

		entries.push(new SidebarEntry(
			SidebarEntryType.ErrorList,
			"Error List",
			0,
			vscode.TreeItemCollapsibleState.Collapsed,
			{
				command: '',
				title: '',
				arguments: undefined
			},
			path.join(__filename, '..', '..', 'resources', 'error-list.svg')));

		return entries;
	}
		
	private parseLog() {
		let editor = vscode.window.activeTextEditor;
		if (editor)
		{
			let lines = editor.document.lineCount;
			for (var i = 0; i < lines; i++)
			{
				let line = editor.document.lineAt(i);

				// Processing for the Error List
				{
					let match = line.text.match("\\bcsierr[_a-zA-Z]*\\b|\\bcellerr[_a-zA-Z]*\\b");

					if (match)
					{
						this._errorList.push(
							new SidebarEntry(
								SidebarEntryType.Error,
								match[0] + ' at ' + i,
								i,
								vscode.TreeItemCollapsibleState.None,
								{
									command: 'sidebar.gotoLine',
									title: '',
									arguments: [i] 
								},
								path.join(__filename, '..', '..', 'resources', 'error.svg')));
					}
				}
			}
        }
    }
}

export class SidebarEntry extends vscode.TreeItem {
	constructor(
		public readonly type: SidebarEntryType,
		public readonly label: string,
        public readonly line: number,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly command?: vscode.Command,
		public readonly iconPath?: string | { light: string; dark: string } ) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return this.label;
	}

	get description(): string {
		return this.label;
	}

	contextValue = 'SidebarEntry';
}