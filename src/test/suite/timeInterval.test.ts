'use strict';

import * as moment from 'moment';
import * as assert from 'assert';
import { TimeIntervalManipulator, TimeIntervalController } from "../../timeInterval";

const PREFIX = 'Selected Elapsed Time: ';

suite('TimeInterval', () => {
    test('Parses time correctly from ULS log (milliseconds)', () => {
        let testObject = new TimeIntervalManipulator();

        const firstLine = '10/15/2014 22:53:33.648	11940	11596	CSI Logging	ttidLogCentralTable	5	Information	--------Committing transaction [aye6e]';
        const lastLine = '10/15/2014 22:53:33.656	11940	11596	CSI Logging	ttidLogCentralTableDB	5	Information	--------Incrementing revision column on row to 36';
        const expected = moment.duration({ milliseconds: 8, });

        const result = testObject.calculateDuration(firstLine, lastLine);

        assert.notEqual(undefined, result);
        assert.equal(expected.asMilliseconds(), result?.asMilliseconds());
    });

    test('Parses time correctly from ULS log (seconds)', () => {
        let testObject = new TimeIntervalManipulator();

        const firstLine = '10/15/2014 22:53:33.648	11940	11596	CSI Logging	ttidLogCentralTable	5	Information	--------Committing transaction [aye6e]';
        const lastLine = '10/15/2014 22:53:44.648	11940	11596	CSI Logging	ttidLogCentralTableDB	5	Information	--------Incrementing revision column on row to 36';
        const expected = moment.duration({ seconds: 11, });

        const result = testObject.calculateDuration(firstLine, lastLine);

        assert.notEqual(undefined, result);
        assert.equal(expected.asMilliseconds(), result?.asMilliseconds());
    });

    test('Parses time correctly from ULS log (minutes)', () => {
        let testObject = new TimeIntervalManipulator();

        const firstLine = '10/15/2014 22:53:33.648	11940	11596	CSI Logging	ttidLogCentralTable	5	Information	--------Committing transaction [aye6e]';
        const lastLine = '10/15/2014 22:55:33.648	11940	11596	CSI Logging	ttidLogCentralTableDB	5	Information	--------Incrementing revision column on row to 36';
        const expected = moment.duration({ minutes: 2, });

        const result = testObject.calculateDuration(firstLine, lastLine);

        assert.notEqual(undefined, result);
        assert.equal(expected.asMilliseconds(), result?.asMilliseconds());
    });

    test('Parses time correctly from ULS log (hours)', () => {
        let testObject = new TimeIntervalManipulator();

        const firstLine = '10/15/2014 21:53:33.648	11940	11596	CSI Logging	ttidLogCentralTable	5	Information	--------Committing transaction [aye6e]';
        const lastLine = '10/15/2014 23:53:33.648	11940	11596	CSI Logging	ttidLogCentralTableDB	5	Information	--------Incrementing revision column on row to 36';
        const expected = moment.duration({ hours: 2, });

        const result = testObject.calculateDuration(firstLine, lastLine);

        assert.notEqual(undefined, result);
        assert.equal(expected.asMilliseconds(), result?.asMilliseconds());
    });

    test('Parses time correctly from ULS log (days)', () => {
        let testObject = new TimeIntervalManipulator();

        const firstLine = '10/15/2014 21:53:33.648	11940	11596	CSI Logging	ttidLogCentralTable	5	Information	--------Committing transaction [aye6e]';
        const lastLine = '10/17/2014 21:53:33.648	11940	11596	CSI Logging	ttidLogCentralTableDB	5	Information	--------Incrementing revision column on row to 36';
        const expected = moment.duration({ days: 2, });

        const result = testObject.calculateDuration(firstLine, lastLine);

        assert.notEqual(undefined, result);
        assert.equal(expected.asMilliseconds(), result?.asMilliseconds());
    });

    test('Parses time correctly from ULS log (months)', () => {
        let testObject = new TimeIntervalManipulator();

        const firstLine = '10/15/2014 21:53:33.648	11940	11596	CSI Logging	ttidLogCentralTable	5	Information	--------Committing transaction [aye6e]';
        const lastLine = '12/15/2014 21:53:33.648	11940	11596	CSI Logging	ttidLogCentralTableDB	5	Information	--------Incrementing revision column on row to 36';
        const expected = moment.duration({ months: 2, });

        const result = testObject.calculateDuration(firstLine, lastLine);

        assert.notEqual(undefined, result);
        assert.equal(expected.asMilliseconds(), result?.asMilliseconds());
    });

    test('Parses time correctly from ULS log (years)', () => {
        let testObject = new TimeIntervalManipulator();

        const firstLine = '10/15/2001 21:53:33.648	11940	11596	CSI Logging	ttidLogCentralTable	5	Information	--------Committing transaction [aye6e]';
        const lastLine = '10/15/2003 21:53:33.648	11940	11596	CSI Logging	ttidLogCentralTableDB	5	Information	--------Incrementing revision column on row to 36';
        const expected = moment.duration({ years: 2, });

        const result = testObject.calculateDuration(firstLine, lastLine);

        assert.notEqual(undefined, result);
        assert.equal(expected.asMilliseconds(), result?.asMilliseconds());
    });

    test('should only consist of "0 ms".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ seconds: 0 });
        const expected = PREFIX + input.asMilliseconds() + 'ms';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('should only consist of "ms".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ seconds: 0.123 });
        const expected = PREFIX + input.asMilliseconds() + 'ms';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('should only consist of "s" and "ms".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ seconds: 6.123 });
        const expected = PREFIX + input.seconds() + 's, '
            + input.milliseconds() + 'ms';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('should only consist of "min", "s" and "ms".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ seconds: 6.123, minutes: 3 });
        const expected = PREFIX + input.minutes() + 'min, '
            + input.seconds() + 's, '
            + input.milliseconds() + 'ms';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('should only consist of "h", "min", "s" and "ms".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ seconds: 6.123, minutes: 0, hours: 5 });
        const expected = PREFIX + input.hours() + 'h, '
            + input.minutes() + 'min, '
            + input.seconds() + 's, '
            + input.milliseconds() + 'ms';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });

    test('should consist of "d", "h", "min", "s" and "ms".', () => {
        let testObject = new TimeIntervalManipulator();
        const input = moment.duration({ seconds: 6.123, minutes: 0, hours: 5, days: 15, years: 2 });
        const expected = PREFIX + Math.floor(input.asDays()) + 'd, '
            + input.hours() + 'h, '
            + input.minutes() + 'min, '
            + input.seconds() + 's, '
            + input.milliseconds() + 'ms';

        const result = testObject.durationToString(input);

        assert.equal(expected, result);
    });
});