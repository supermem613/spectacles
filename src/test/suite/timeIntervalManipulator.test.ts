'use strict';

import * as expect from 'expect';
import * as moment from 'moment';
import { TimeIntervalManipulator, TimeIntervalController } from "../../timeInterval";

describe('TimeIntervalManipulator', () => {
    let testObject: TimeIntervalManipulator;
    beforeEach(() => {
        testObject = new TimeIntervalManipulator();
    });

    describe('calculateDuration', () => {

        it('gets the correct timePeriod from "YYYY-MM-DD" and "DD.MM.YYYY".', () => {
            const firstLine = '2018-01-27 [0234ß\n\r0?234%&\n\r} my first logging';
            const lastLine = '28.02.2020 my third logging 0 $ % 34 & /)(34=}?23';
            const expected = moment.duration({ days: 1, months: 1, years: 2 });

            const result = testObject.calculateDuration(firstLine, lastLine);

            expect(result).not.toBe(undefined);
            expect(result?.asMilliseconds()).toBe(expected.asMilliseconds());
        });

        it('gets the correct timePeriod from "hh:mm:ss.sss" and "hh:mm:ss.sss".', () => {
            const firstLine = '10:38:28.935 [0234ß\n\b\r0?234%&\n\r} my first logging';
            const lastLine = '16:51:29,001 my third logging 0 $%34&/)(34=}?23';
            const expected = moment.duration({ seconds: 0.066, minutes: 13, hours: 6 });

            const result = testObject.calculateDuration(firstLine, lastLine);

            expect(result).not.toBe(undefined);
            expect(result?.asMilliseconds()).toBe(expected.asMilliseconds());
        });

        it('gets the correct timePeriod from "YYYY-MM-DDThh:mm:ss.sssZ" and "DD/MM/YYYThh:mm:ss,sssZ".', () => {
            const firstLine = '2018-01-27T10:38:28.935Z [0234ß\n\b\r0?234%&\n\r} my first logging';
            const lastLine = '2020-02-28T16:51:29.001Z my third logging 0 $%34&/)(34=}?23';
            const expected = moment.duration({ seconds: 0.066, minutes: 13, hours: 6, days: 1, months: 1, years: 2 });

            const result = testObject.calculateDuration(firstLine, lastLine);

            expect(result).not.toBe(undefined);
            expect(result?.asMilliseconds()).toBe(expected.asMilliseconds());
        });

        it('gets the correct timePeriod from "YYYY-MM-DD hh:mm:ss.sss" and "DD/MM/YYY hh:mm:ss,sss".', () => {
            const firstLine = '2018-01-27 10:38:28.935 [0234ß\n\b\r0?234%&\n\r} my first logging';
            const lastLine = '28/02/2020 16:51:29,001 my third logging 0 $%34&/)(34=}?23';
            const expected = moment.duration({ seconds: 0.066, minutes: 13, hours: 6, days: 1, months: 1, years: 2 });

            const result = testObject.calculateDuration(firstLine, lastLine);

            expect(result).not.toBe(undefined);
            expect(result?.asMilliseconds()).toBe(expected.asMilliseconds());
        });

        it('gets the correct timePeriod from "YYYY-MM-DD hh:mm" and MM/DD/YYYY hh:mm".', () => {
            const firstLine = '2018-01-27 10:38 [0234ß\n\b\r0?234%&\n\r} my first logging';
            const lastLine = '02/28/2020 16:51 my third logging 0 $%34&/)(34=}?23';
            const expected = moment.duration({ minutes: 13, hours: 6, days: 1, months: 1, years: 2 });

            const result = testObject.calculateDuration(firstLine, lastLine);

            expect(result).not.toBe(undefined);
            expect(result?.asMilliseconds()).toBe(expected.asMilliseconds());
        });

        it('should only consider log statements with the same format (length).', () => {
            const firstLine = '2018-01-27 [0234ß\n\b\r0?234%&\n\r} my first logging';
            const lastLine = '02/28/2020 my third logging 0 $%34&/)(34=}?23';
            const expected = moment.duration({ days: 1, months: 1, years: 2 });

            const result = testObject.calculateDuration(firstLine, lastLine);

            expect(result).not.toBe(undefined);
            expect(result?.asMilliseconds()).toBe(expected.asMilliseconds());
        });

        it('should only consider the first timestamp statement of a line.', () => {
            const firstLine = 'foo bar baz 2018-01-27 [0234ß\n\b\r0?234%&\n\r} my first logging';
            const lastLine = 'hello world 02/28/2020 my third logging 0 $%34&/)(34=}?23; 2021-03-29 my fourth statement on same line.';
            const expected = moment.duration({ days: 1, months: 1, years: 2 });

            const result = testObject.calculateDuration(firstLine, lastLine);

            expect(result).not.toBe(undefined);
            expect(result?.asMilliseconds()).toBe(expected.asMilliseconds());
        });
    });

    describe('durationToString', () => {
        const PREFIX = 'Selected: ';
        it('should only consist of "0 ms".', () => {
            const input = moment.duration({ seconds: 0 });
            const expected = PREFIX + input.asMilliseconds() + 'ms';

            const result = testObject.durationToString(input);

            expect(result).toBe(expected);
        });

        it('should only consist of "ms".', () => {
            const input = moment.duration({ seconds: 0.123 });
            const expected = PREFIX + input.asMilliseconds() + 'ms';

            const result = testObject.durationToString(input);

            expect(result).toBe(expected);
        });

        it('should only consist of "s" and "ms".', () => {
            const input = moment.duration({ seconds: 6.123 });
            const expected = PREFIX + input.seconds() + 's, '
                + input.milliseconds() + 'ms';

            const result = testObject.durationToString(input);

            expect(result).toBe(expected);
        });

        it('should only consist of "min", "s" and "ms".', () => {
            const input = moment.duration({ seconds: 6.123, minutes: 3 });
            const expected = PREFIX + input.minutes() + 'min, '
                + input.seconds() + 's, '
                + input.milliseconds() + 'ms';

            const result = testObject.durationToString(input);

            expect(result).toBe(expected);
        });

        it('should only consist of "h", "min", "s" and "ms".', () => {
            const input = moment.duration({ seconds: 6.123, minutes: 0, hours: 5 });
            const expected = PREFIX + input.hours() + 'h, '
                + input.minutes() + 'min, '
                + input.seconds() + 's, '
                + input.milliseconds() + 'ms';

            const result = testObject.durationToString(input);

            expect(result).toBe(expected);
        });

        it('should consist of "d", "h", "min", "s" and "ms".', () => {
            const input = moment.duration({ seconds: 6.123, minutes: 0, hours: 5, days: 15, years: 2 });
            const expected = PREFIX + Math.floor(input.asDays()) + 'd, '
                + input.hours() + 'h, '
                + input.minutes() + 'min, '
                + input.seconds() + 's, '
                + input.milliseconds() + 'ms';

            const result = testObject.durationToString(input);

            expect(result).toBe(expected);
        });
    });
});