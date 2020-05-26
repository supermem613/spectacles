'use strict';

import * as moment from 'moment';
import * as vscode from 'vscode';

export class TimeIntervalManipulator {
	constructor() {
    }

    public durationToString(duration: moment.Duration): string {
        let text = '';

        if (duration.asDays() >= 1) {
            text += Math.floor(duration.asDays()) + 'd';
        }
        
        if (text !== '') {
            text += ', ' + duration.hours() + 'h';
        } else if (duration.hours() !== 0) {
            text += duration.hours() + 'h';
        }

        if (text !== '') {
            text += ', ' + duration.minutes() + 'min';
        } else if (duration.minutes() !== 0) {
            text += duration.minutes() + 'min';

        }
        if (text !== '') {
            text += ', ' + duration.seconds() + 's';
        } else if (duration.seconds() !== 0) {
            text += duration.seconds() + 's';
        }
        
        if (text !== '') {
            text += ', ' + duration.milliseconds() + 'ms';
        } else {
            text += duration.milliseconds() + 'ms';
        }

        return 'Selected Elapsed Time: ' + text;
    }

    // "10/15/2014 22:53:33.682\t" is a typical example.
    public calculateDuration(fromLine: string, toLine: string): moment.Duration | undefined {
        let matchFrom = fromLine.match("^([a-zA-Z0-9:\/\. ]*)\t");
        let matchTo = toLine.match("^([a-zA-Z0-9:\/\. ]*)\t");

        if (!matchFrom || !matchTo || (matchFrom.length === 0) || (matchTo.length === 0)) {
            return undefined;
        }

        const momentFrom = moment.utc(matchFrom[1], 'MM/DD/YYYY HH:mm:ss.SSS');
        const momentTo = moment.utc(matchTo[1], 'MM/DD/YYYY HH:mm:ss.SSS');

        if (!momentFrom.isValid() || !momentTo.isValid()) {
            return undefined;
        }

        const diff = momentTo.diff(momentFrom, 'milliseconds');

        return moment.duration(diff);
    }
}

export class TimeIntervalController {
    private _timeIntervalManipulator: TimeIntervalManipulator;
    private _disposable: vscode.Disposable;
    private _statusBarItem: vscode.StatusBarItem;

    constructor(timeIntervalManipulator: TimeIntervalManipulator) {
        this._timeIntervalManipulator = timeIntervalManipulator;

        this._statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);

        const subscriptions: vscode.Disposable[] = [];
        vscode.window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        vscode.window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        this.updateTimePeriod();

        this._disposable = vscode.Disposable.from(...subscriptions);
    }

    public dispose() {
        this._statusBarItem.dispose();
        this._disposable.dispose();
    }

    public updateTimePeriod() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            this._statusBarItem?.hide();
            return;
        }

        if (editor.document.languageId !== 'ULS') {
            this._statusBarItem?.hide();
            return;
        }

        if (this._statusBarItem) {
            this._statusBarItem.text = '';
        }

        const fromLineNumber = editor.selection.start.line;
        const endLineNumber = editor.selection.end.line;
           
        if (fromLineNumber === endLineNumber) {
            this._statusBarItem?.hide();
            return;
        }

        const fromLine = editor.document.lineAt(fromLineNumber);
        let toLine: vscode.TextLine;

        // Check if the last line goes to the end of the line and skip / retract as needed
        if (editor.selection.end.character === 0) {
            toLine = editor.document.lineAt(endLineNumber - 1);
        } else {
            toLine = editor.document.lineAt(endLineNumber);
        }

        const duration = this._timeIntervalManipulator.calculateDuration(fromLine.text, toLine.text);
        if (duration === undefined) {
            this._statusBarItem?.hide();
            return;
        }

        this._statusBarItem.text = this._timeIntervalManipulator.durationToString(duration);
        this._statusBarItem.show();
    }

    private _onEvent() {
        this.updateTimePeriod();
    }
}