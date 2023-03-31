import * as vscode from 'vscode';
import * as path from 'path';

enum SidebarEntryType {
	LoggedErrorList = 0,
	LoggedError = 1,
	ErrorLineList = 2,
	ErrorLine = 3,
	WarningLineList = 4,
	WarningLine = 5,
}

export default class SidebarProvider implements vscode.TreeDataProvider<SidebarEntry> {
	private _onDidChangeTreeData: vscode.EventEmitter<SidebarEntry | undefined> = new vscode.EventEmitter<SidebarEntry | undefined>();
	readonly onDidChangeTreeData: vscode.Event<SidebarEntry | undefined> = this._onDidChangeTreeData.event;

	private _errorList: Array<SidebarEntry>;
	private _errorLineList: Array<SidebarEntry>;
	private _warningLineList: Array<SidebarEntry>;
	private _parsed : boolean;

	constructor() {
		this._parsed = false;
		this._errorList = new Array<SidebarEntry>(); 
		this._errorLineList = new Array<SidebarEntry>(); 
		this._warningLineList = new Array<SidebarEntry>(); 
	}

	refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	getTreeItem(element: SidebarEntry): vscode.TreeItem {
		return element;
	}

	getChildren(element?: SidebarEntry): Thenable<SidebarEntry[]> {
		if (!element) {
			return Promise.resolve(this.getRootElements());
		}

		if (element.type === SidebarEntryType.LoggedErrorList) {
			return Promise.resolve(this._errorList);
		} else if (element.type === SidebarEntryType.ErrorLineList) {
			return Promise.resolve(this._errorLineList);
		} else if (element.type === SidebarEntryType.WarningLineList) {
			return Promise.resolve(this._warningLineList);
		}

		return Promise.resolve([]);
	}

	private getRootElements(): SidebarEntry[] {
		if (!this._parsed) {
			this.parseLog();
		}

		let entries = Array<SidebarEntry>();

		entries.push(new SidebarEntry(
			SidebarEntryType.LoggedErrorList,
			"Logged Error List",
			0,
			vscode.TreeItemCollapsibleState.Collapsed,
			{
				command: '',
				title: '',
				arguments: undefined
			},
			path.join(__filename, '..', '..', 'resources', 'error-list.svg')));

		entries.push(new SidebarEntry(
			SidebarEntryType.ErrorLineList,
			"Lines with Error Severity",
			0,
			vscode.TreeItemCollapsibleState.Collapsed,
			{
				command: '',
				title: '',
				arguments: undefined
			},
			path.join(__filename, '..', '..', 'resources', 'error-list.svg')));

		entries.push(new SidebarEntry(
			SidebarEntryType.WarningLineList,
			"Lines with Warning Severity",
			0,
			vscode.TreeItemCollapsibleState.Collapsed,
			{
				command: '',
				title: '',
				arguments: undefined
			},
			path.join(__filename, '..', '..', 'resources', 'warning-list.svg')));

		return entries;
	}
		
	private parseLog() {
		let editor = vscode.window.activeTextEditor;
		if (editor)
		{
			let lines = editor.document.lineCount;
			const errorRegex = vscode.workspace.getConfiguration('spectacles').get('errorRegex', 'csierr[_a-zA-Z]*|cellerr[_a-zA-Z]*');
			for (var i = 0; i < lines; i++)
			{
				let line = editor.document.lineAt(i);

				// Processing for the Error List
				if (errorRegex)
				{
					let match = line.text.match(errorRegex);

					if (match)
					{
						this._errorList.push(
							new SidebarEntry(
								SidebarEntryType.LoggedError,
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

				// Processing for the Error Line List
				{
					let match = line.text.match("\\tError\\t");

					if (match)
					{
						this._errorLineList.push(
							new SidebarEntry(
								SidebarEntryType.ErrorLine,
								'Line ' + i,
								i,
								vscode.TreeItemCollapsibleState.None,
								{
									command: 'sidebar.gotoLine',
									title: '',
									arguments: [i] 
								},
								path.join(__filename, '..', '..', 'resources', 'error.svg')));
					}
					else
					// Processing for the Warning Line List
					{
						match = line.text.match("\\tWarning\\t");

						if (match)
						{
							this._warningLineList.push(
								new SidebarEntry(
									SidebarEntryType.ErrorLine,
									'Line ' + i,
									i,
									vscode.TreeItemCollapsibleState.None,
									{
										command: 'sidebar.gotoLine',
										title: '',
										arguments: [i] 
									},
									path.join(__filename, '..', '..', 'resources', 'warning.svg')));
						}
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

	contextValue = 'SidebarEntry';
}