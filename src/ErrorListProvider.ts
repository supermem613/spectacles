import * as vscode from 'vscode';
import * as path from 'path';

export default class ErrorListProvider implements vscode.TreeDataProvider<ErrorEntry> {

	private _onDidChangeTreeData: vscode.EventEmitter<ErrorEntry | undefined> = new vscode.EventEmitter<ErrorEntry | undefined>();
	readonly onDidChangeTreeData: vscode.Event<ErrorEntry | undefined> = this._onDidChangeTreeData.event;

	constructor() {
	}

	refresh(): void {
		this._onDidChangeTreeData.fire();
	}

	getTreeItem(element: ErrorEntry): vscode.TreeItem {
		return element;
	}

	getChildren(element?: ErrorEntry): Thenable<ErrorEntry[]> {
		if (element) {
			return Promise.resolve([]);
		}

		return Promise.resolve(this.getErrorsFromLog());
	}

	private getErrorsFromLog(): ErrorEntry[] {
        let errors = Array<ErrorEntry>();

        let editor = vscode.window.activeTextEditor;
		if (editor)
		{
			let lines = editor.document.lineCount;
			for (var i = 0; i < lines; i++)
			{
				let line = editor.document.lineAt(i);
				let match = line.text.match("\\bcsierr([_a-zA-Z.]*)\\b");

				if (match)
				{
					errors.push(
                        new ErrorEntry(
                            match[0],
                            i,
                            vscode.TreeItemCollapsibleState.None));
				}
			}
        }
        
        return errors;
        }
}

export class ErrorEntry extends vscode.TreeItem {

	constructor(
		public readonly label: string,
        public readonly line: number,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.label} at ${this.line}`;
	}

	get description(): string {
		return `at ${this.line}`;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'errorentry.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'dark', 'errorentry.svg')
	};

	contextValue = 'ErrorEntry';
}