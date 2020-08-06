// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import SidebarProvider, { SidebarEntry } from "./SidebarProvider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const sidebarProvider = new SidebarProvider();
	vscode.window.registerTreeDataProvider('sidebar', sidebarProvider);
	vscode.commands.registerCommand('sidebar.refreshEntry', () => sidebarProvider.refresh());
	vscode.commands.registerCommand(
		'sidebar.gotoLine',
		 (line: number) => {
			let editor = vscode.window.activeTextEditor;
			if (editor) {
				editor.revealRange(new vscode.Range(line - 1, 0, line, 255));
			}
		 });
}

// this method is called when your extension is deactivated
export function deactivate() {}
