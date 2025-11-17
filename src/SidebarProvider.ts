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

export default class SidebarProvider implements vscode.TreeDataProvider<ISidebarEntry> {
	private _onDidChangeTreeData: vscode.EventEmitter<ISidebarEntry | undefined> = new vscode.EventEmitter<ISidebarEntry | undefined>();
	readonly onDidChangeTreeData: vscode.Event<ISidebarEntry | undefined> = this._onDidChangeTreeData.event;

	private _errorList: ISidebarEntry[];
	private _errorLineList: ISidebarEntry[];
	private _warningLineList: ISidebarEntry[];
	private _parsed : boolean;

	constructor() {
		this._parsed = false;
		this._errorList = new Array<ISidebarEntry>(); 
		this._errorLineList = new Array<ISidebarEntry>(); 
		this._warningLineList = new Array<ISidebarEntry>(); 
	}

	refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	getTreeItem(element: any): vscode.TreeItem {
		const item = new vscode.TreeItem(element.label, element.collapsibleState);
		if (element.command) {
			item.command = element.command;
		}
		if (element.iconPath) {
			item.iconPath = element.iconPath as any;
		}
		item.contextValue = element.contextValue;
		return item;
	}

	getChildren(element?: any): Thenable<any[]> {
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

	private getRootElements(): ISidebarEntry[] {
		if (!this._parsed) {
			this.parseLog();
		}

		let entries = Array<ISidebarEntry>();

		entries.push(createSidebarEntry(
			SidebarEntryType.LoggedErrorList,
			"Logged Error List",
			0,
			vscode.TreeItemCollapsibleState.Collapsed,
			{
				command: '',
				title: '',
				arguments: undefined
			},
			vscode.Uri.file(path.join(__filename, '..', '..', 'resources', 'error-list.svg'))));

		entries.push(createSidebarEntry(
			SidebarEntryType.ErrorLineList,
			"Lines with Error Severity",
			0,
			vscode.TreeItemCollapsibleState.Collapsed,
			{
				command: '',
				title: '',
				arguments: undefined
			},
			vscode.Uri.file(path.join(__filename, '..', '..', 'resources', 'error-list.svg'))));

		entries.push(createSidebarEntry(
			SidebarEntryType.WarningLineList,
			"Lines with Warning Severity",
			0,
			vscode.TreeItemCollapsibleState.Collapsed,
			{
				command: '',
				title: '',
				arguments: undefined
			},
			vscode.Uri.file(path.join(__filename, '..', '..', 'resources', 'warning-list.svg'))));

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
							createSidebarEntry(
								SidebarEntryType.LoggedError,
								match[0] + ' at ' + i,
								i,
								vscode.TreeItemCollapsibleState.None,
								{
									command: 'sidebar.gotoLine',
									title: '',
									arguments: [i] 
								},
								vscode.Uri.file(path.join(__filename, '..', '..', 'resources', 'error.svg'))));
					}
				}

				// Processing for the Error Line List
				{
					let match = line.text.match("\\tError\\t");

					if (match)
					{
						this._errorLineList.push(
							createSidebarEntry(
								SidebarEntryType.ErrorLine,
								'Line ' + i,
								i,
								vscode.TreeItemCollapsibleState.None,
								{
									command: 'sidebar.gotoLine',
									title: '',
									arguments: [i] 
								},
								vscode.Uri.file(path.join(__filename, '..', '..', 'resources', 'error.svg'))));
					}
					else
					// Processing for the Warning Line List
					{
						match = line.text.match("\\tWarning\\t");

						if (match)
						{
							this._warningLineList.push(
								createSidebarEntry(
									SidebarEntryType.WarningLine,
									'Line ' + i,
									i,
									vscode.TreeItemCollapsibleState.None,
									{
										command: 'sidebar.gotoLine',
										title: '',
										arguments: [i] 
									},
									vscode.Uri.file(path.join(__filename, '..', '..', 'resources', 'warning.svg'))));
						}
					}
				}
			}
		}
	}
}

export interface ISidebarEntry {
	type: SidebarEntryType;
	label: string;
	line: number;
	collapsibleState: vscode.TreeItemCollapsibleState;
	command?: vscode.Command;
	iconPath?: string | vscode.Uri | { light: vscode.Uri; dark: vscode.Uri };
	contextValue?: string;
}

export function createSidebarEntry(
	type: SidebarEntryType,
	label: string,
	line: number,
	collapsibleState: vscode.TreeItemCollapsibleState,
	command?: vscode.Command,
	iconPath?: string | vscode.Uri | { light: vscode.Uri; dark: vscode.Uri }
): ISidebarEntry {
	return {
		type,
		label,
		line,
		collapsibleState,
		command,
		iconPath,
		contextValue: 'SidebarEntry'
	};
}

// exported marker to help tooling detect file updates
export const __spectacles_sidebar_provider_marker = true;