import * as vscode from 'vscode';
import * as path from 'path';

enum SidebarEntryType {
	ErrorList = 0,
	Error = 1
}

export default class SidebarProvider implements vscode.TreeDataProvider<SidebarEntry> {

	private _onDidChangeTreeData: vscode.EventEmitter<SidebarEntry | undefined> = new vscode.EventEmitter<SidebarEntry | undefined>();
	readonly onDidChangeTreeData: vscode.Event<SidebarEntry | undefined> = this._onDidChangeTreeData.event;

	constructor() {
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
			return Promise.resolve(this.getErrorList());
		}

		return Promise.resolve([]);
	}

	private getRootElements(): SidebarEntry[] {
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

	private getErrorList(): SidebarEntry[] {
        let errors = Array<SidebarEntry>();

        let editor = vscode.window.activeTextEditor;
		if (editor)
		{
			let lines = editor.document.lineCount;
			for (var i = 0; i < lines; i++)
			{
				let line = editor.document.lineAt(i);
				let match = line.text.match("\\bcsierr[_a-zA-Z]*\\b|\\bcellerr[_a-zA-Z]*\\b");

				if (match)
				{
					errors.push(
                        new SidebarEntry(
							SidebarEntryType.Error,
                            match[0] + ' at ' + i,
                            i,
							vscode.TreeItemCollapsibleState.None,
							{
								command: 'errorList.goto',
								title: '',
								arguments: [i] 
							},
							path.join(__filename, '..', '..', 'resources', 'error.svg')));
				}
			}
        }
        
        return errors;
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