// MIT License. Code from https://github.com/1c7/srt-parser-2

interface Line {
	id: string;
	startTime: string;
	startSeconds: number;
	endTime: string;
	endSeconds: number;
	text: string;
}

class Parser {
	seperator = ',';

	timestampToSeconds(srtTimestamp: string) {
		const [rest, millisecondsString] = srtTimestamp.split(',');
		const milliseconds = parseInt(millisecondsString);
		const [hours, minutes, seconds] = rest.split(':').map((x) => parseInt(x));
		const result = milliseconds * 0.001 + seconds + 60 * minutes + 3600 * hours;

		return Math.round(result * 1000) / 1000;
	}

	correctFormat(time: string) {
		const str = time.replace('.', ',');

		let hour = null;
		let minute = null;
		let second = null;
		let millisecond = null;

		const [front, ms] = str.split(',');
		millisecond = this.fixed_str_digit(3, ms);

		const [a_hour, a_minute, a_second] = front.split(':');
		hour = this.fixed_str_digit(2, a_hour, false);
		minute = this.fixed_str_digit(2, a_minute, false);
		second = this.fixed_str_digit(2, a_second, false);

		return `${hour}:${minute}:${second},${millisecond}`;
	}

	private fixed_str_digit(how_many_digit: number, str: string, padEnd = true) {
		if (str.length == how_many_digit) {
			return str;
		}
		if (str.length > how_many_digit) {
			return str.slice(0, how_many_digit);
		}
		if (str.length < how_many_digit) {
			if (padEnd) {
				return str.padEnd(how_many_digit, '0');
			} else {
				return str.padStart(how_many_digit, '0');
			}
		}
	}

	private tryComma(data: string) {
		data = data.replace(/\r/g, '');
		const regex =
			/(\d+)\n(\d{1,2}:\d{2}:\d{2},\d{1,3}) --> (\d{1,2}:\d{2}:\d{2},\d{1,3})/g;
		const data_array = data.split(regex);
		data_array.shift();
		return data_array;
	}

	private tryDot(data: string) {
		data = data.replace(/\r/g, '');
		const regex =
			/(\d+)\n(\d{1,2}:\d{2}:\d{2}\.\d{1,3}) --> (\d{1,2}:\d{2}:\d{2}\.\d{1,3})/g;
		const data_array = data.split(regex);
		data_array.shift();
		this.seperator = '.';
		return data_array;
	}

	fromSrt(data: string) {
		const originalData = data;
		let data_array = this.tryComma(originalData);
		if (data_array.length == 0) {
			data_array = this.tryDot(originalData);
		}

		const items = [];
		for (let i = 0; i < data_array.length; i += 4) {
			const startTime = this.correctFormat(data_array[i + 1].trim());
			const endTime = this.correctFormat(data_array[i + 2].trim());
			const new_line = {
				id: data_array[i].trim(),
				startTime,
				startSeconds: this.timestampToSeconds(startTime),
				endTime,
				endSeconds: this.timestampToSeconds(endTime),
				text: data_array[i + 3].trim(),
			};
			items.push(new_line);
		}

		return items;
	}

	toSrt(data: Array<Line>) {
		let res = '';

		const end_of_line = '\r\n';
		for (let i = 0; i < data.length; i++) {
			const s = data[i];
			res += s.id + end_of_line;
			res += s.startTime + ' --> ' + s.endTime + end_of_line;
			res += s.text.replace('\n', end_of_line) + end_of_line + end_of_line;
		}

		return res;
	}
}

export default Parser;
export type { Line };
