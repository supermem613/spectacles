// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import SidebarProvider, { SidebarEntry } from "./SidebarProvider";

export function foldLines(foldLines: Array<number>) {
	const textEditor = vscode.window.activeTextEditor;
	if (!textEditor)
	{
		return;
	}
	const selection = textEditor.selection;
  
	for (const lineNumber of foldLines) {
	  textEditor.selection = new vscode.Selection(lineNumber, 0, lineNumber, 0);
	  vscode.commands.executeCommand('editor.fold');
	  console.log('folding ' + textEditor.selection.anchor.line);
	}
	textEditor.selection = selection;
	textEditor.revealRange(textEditor.selection, vscode.TextEditorRevealType.InCenter);
  }

class MyFoldingRangeProvider implements vscode.FoldingRangeProvider {
provideFoldingRanges(document: vscode.TextDocument, context: vscode.FoldingContext, token: vscode.CancellationToken): vscode.FoldingRange[] {
	let ranges = Array<vscode.FoldingRange>();

	for (var i = 0; i < document.lineCount - 1; i ++)
	{
		ranges.push(new vscode.FoldingRange(i, i + 1, vscode.FoldingRangeKind.Comment));
	}

	return ranges;
}
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "spectacles" is now active!');

	const sidebarProvider = new SidebarProvider();
	vscode.window.registerTreeDataProvider('sidebar', sidebarProvider);
	vscode.commands.registerCommand('sidebar.refreshEntry', () => sidebarProvider.refresh());
	vscode.commands.registerCommand(
		'errorList.goto',
		 (line: number) => 
		 {
			let editor = vscode.window.activeTextEditor;
			if (editor)
			{
				editor.revealRange(new vscode.Range(line - 1, 0, line, 255));
			}
		 });
		

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(vscode.commands.registerCommand('spectacles.trim', () => {
		// The code you place here will be executed every time your command is executed

		let array = Array<vscode.Range>();

		let editor = vscode.window.activeTextEditor;
		if (editor)
		{
			let lines = editor.document.lineCount;
			for (var i = 0; i < lines; i++)
			{
				let line = editor.document.lineAt(i);
				let match = line.text.match("\\tCentral Table");

				if (!match || (match.length === 0))
				{
					array.push(line.rangeIncludingLineBreak);
				}
			}
		
			editor.edit((edit) => {
				for (var i = 0; i < array.length; i++)
				{
					edit.delete(array[i]);
				}});
		}

		//foldLines(array);

		// Display a message box to the user
		vscode.window.showInformationMessage('Trim complete.');
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}