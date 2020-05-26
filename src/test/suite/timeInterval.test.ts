'use strict';

import * as moment from 'moment';
import * as assert from 'assert';
import { TimeIntervalManipulator, TimeIntervalController } from "../../timeInterval";

suite('TimeInterval', () => {

    test('Generates duration string (zero)".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ seconds: 0 });
        const expected = 'Selected Elapsed Time: ' + input.asMilliseconds() + 'ms';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('Generates duration string (milliseconds)".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ seconds: 0 });
        const expected = 'Selected Elapsed Time: ' + input.asMilliseconds() + 'ms';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('Generates duration string (seconds)".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ seconds: 42 });
        const expected = 'Selected Elapsed Time: ' + input.asSeconds() + 's';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('Generates duration string (minutes)".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ minutes: 42 });
        const expected = 'Selected Elapsed Time: ' + input.asMinutes() + 'min';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('Generates duration string (hours)".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ hours: 11 });
        const expected = 'Selected Elapsed Time: ' + input.asHours() + 'h';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('Generates duration string (days)".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ days: 11 });
        const expected = 'Selected Elapsed Time: ' + input.asDays() + 'd';
        
        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('Generates duration string (milliseconds + seconds)".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ seconds: 10, milliseconds: 13 });
        const expected = 'Selected Elapsed Time: ' + input.seconds() + 's, ' + input.milliseconds() + 'ms';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('Generates duration string (milliseconds + seconds + minutes)".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ minutes: 32, seconds: 10, milliseconds: 13 });
        const expected = 'Selected Elapsed Time: ' + input.minutes() + 'min, ' + input.seconds() + 's, ' + input.milliseconds() + 'ms';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('Generates duration string (milliseconds + minutes)".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ minutes: 32, milliseconds: 13 });
        const expected = 'Selected Elapsed Time: ' + input.minutes() + 'min, ' + input.milliseconds() + 'ms';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('Generates duration string (milliseconds + seconds + minutes + hours)".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ hours:7, minutes: 32, seconds: 10, milliseconds: 13 });
        const expected = 'Selected Elapsed Time: ' + input.hours() + 'h, ' + input.minutes() + 'min, ' + input.seconds() + 's, ' + input.milliseconds() + 'ms';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('Generates duration string (milliseconds + hours)".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ hours: 3, milliseconds: 13 });
        const expected = 'Selected Elapsed Time: ' + input.hours() + 'h, ' + input.milliseconds() + 'ms';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('Generates duration string (milliseconds + seconds + minutes + hours + days)".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ days:3, hours:7, minutes: 32, seconds: 10, milliseconds: 13 });
        const expected = 'Selected Elapsed Time: ' + input.days() + 'd, ' + input.hours() + 'h, ' + input.minutes() + 'min, ' + input.seconds() + 's, ' + input.milliseconds() + 'ms';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('Generates duration string (many days)".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ years: 2 });
        const expected = 'Selected Elapsed Time: ' + input.asDays() + 'd';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('Calculates duration from ULS log (milliseconds)', () => {
        let testObject = new TimeIntervalManipulator();

        const firstLine = '10/15/2014 22:53:33.648	11940	11596	CSI Logging	ttidLogCentralTable	5	Information	--------Committing transaction [aye6e]';
        const lastLine = '10/15/2014 22:53:33.656	11940	11596	CSI Logging	ttidLogCentralTableDB	5	Information	--------Incrementing revision column on row to 36';
        const expected = moment.duration({ milliseconds: 8, });

        const result = testObject.calculateDuration(firstLine, lastLine);

        assert.notEqual(undefined, result);
        assert.equal(expected.asMilliseconds(), result?.asMilliseconds());
    });

    test('Calculates duration from ULS log (seconds)', () => {
        let testObject = new TimeIntervalManipulator();

        const firstLine = '10/15/2014 22:53:33.648	11940	11596	CSI Logging	ttidLogCentralTable	5	Information	--------Committing transaction [aye6e]';
        const lastLine = '10/15/2014 22:53:44.648	11940	11596	CSI Logging	ttidLogCentralTableDB	5	Information	--------Incrementing revision column on row to 36';
        const expected = moment.duration({ seconds: 11, });

        const result = testObject.calculateDuration(firstLine, lastLine);

        assert.notEqual(undefined, result);
        assert.equal(expected.asMilliseconds(), result?.asMilliseconds());
    });

    test('Calculates duration from ULS log (minutes)', () => {
        let testObject = new TimeIntervalManipulator();

        const firstLine = '10/15/2014 22:53:33.648	11940	11596	CSI Logging	ttidLogCentralTable	5	Information	--------Committing transaction [aye6e]';
        const lastLine = '10/15/2014 22:55:33.648	11940	11596	CSI Logging	ttidLogCentralTableDB	5	Information	--------Incrementing revision column on row to 36';
        const expected = moment.duration({ minutes: 2, });

        const result = testObject.calculateDuration(firstLine, lastLine);

        assert.notEqual(undefined, result);
        assert.equal(expected.asMilliseconds(), result?.asMilliseconds());
    });

    test('Calculates duration from ULS log (hours)', () => {
        let testObject = new TimeIntervalManipulator();

        const firstLine = '10/15/2014 21:53:33.648	11940	11596	CSI Logging	ttidLogCentralTable	5	Information	--------Committing transaction [aye6e]';
        const lastLine = '10/15/2014 23:53:33.648	11940	11596	CSI Logging	ttidLogCentralTableDB	5	Information	--------Incrementing revision column on row to 36';
        const expected = moment.duration({ hours: 2, });

        const result = testObject.calculateDuration(firstLine, lastLine);

        assert.notEqual(undefined, result);
        assert.equal(expected.asMilliseconds(), result?.asMilliseconds());
    });

    test('Calculates duration from ULS log (days)', () => {
        let testObject = new TimeIntervalManipulator();

        const firstLine = '10/15/2014 21:53:33.648	11940	11596	CSI Logging	ttidLogCentralTable	5	Information	--------Committing transaction [aye6e]';
        const lastLine = '10/17/2014 21:53:33.648	11940	11596	CSI Logging	ttidLogCentralTableDB	5	Information	--------Incrementing revision column on row to 36';
        const expected = moment.duration({ days: 2, });

        const result = testObject.calculateDuration(firstLine, lastLine);

        assert.notEqual(undefined, result);
        assert.equal(expected.asMilliseconds(), result?.asMilliseconds());
    });

    test('Calculates duration from ULS log (months)', () => {
        let testObject = new TimeIntervalManipulator();

        const firstLine = '10/15/2014 21:53:33.648	11940	11596	CSI Logging	ttidLogCentralTable	5	Information	--------Committing transaction [aye6e]';
        const lastLine = '12/15/2014 21:53:33.648	11940	11596	CSI Logging	ttidLogCentralTableDB	5	Information	--------Incrementing revision column on row to 36';
        const expected = moment.duration({ months: 2, });

        const result = testObject.calculateDuration(firstLine, lastLine);

        assert.notEqual(undefined, result);
        assert.equal(expected.asMilliseconds(), result?.asMilliseconds());
    });

    test('Calculates duration from ULS log (years)', () => {
        let testObject = new TimeIntervalManipulator();

        const firstLine = '10/15/2001 21:53:33.648	11940	11596	CSI Logging	ttidLogCentralTable	5	Information	--------Committing transaction [aye6e]';
        const lastLine = '10/15/2003 21:53:33.648	11940	11596	CSI Logging	ttidLogCentralTableDB	5	Information	--------Incrementing revision column on row to 36';
        const expected = moment.duration({ years: 2, });

        const result = testObject.calculateDuration(firstLine, lastLine);

        assert.notEqual(undefined, result);
        assert.equal(expected.asMilliseconds(), result?.asMilliseconds());
    });
});