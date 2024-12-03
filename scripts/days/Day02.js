var out = document.querySelector('#D02 .output');
var debug = false;

class Report {
	isIncreasing = true;
	values = [];
	failedAtIndex = -1;
	
	constructor(string) {
		if (string instanceof Array) {
			this.values = string;
		} else {
			let split = string.split(' ');
			for (let i = 0; i < split.length; ++i) {
				this.values.push(Number(split[i]));
			}
		}
		this.isIncreasing = this.values[0] < this.values[1];
		if (debug) {
			out.innerText += this.toString() + "\n";
		}
		for (let i = 1; i < this.values.length; ++i) {
			let a = this.values[i - 1];
			let b = this.values[i];
			if (! this.calcSafe(a, b)) {
				this.failedAtIndex = i - 1;
				if (debug)
					out.innerText += `Failed at Level ${this.failedAtIndex + 1}\n\n`;
				break;
			}
		}
		if (debug) {
			if (this.isSafe()) {
				out.innerText += `Report is safe.\n\n`;
			}
		}
	}
	
	isSafe() {
		return (this.failedAtIndex == -1);
	}
	
	calcSafe(a, b) {
		let diff = Math.abs(a - b);
			
		if (diff < 1 || diff > 3) {
			if (debug)
				out.innerText += `Safety failed. Diff out of range (${diff})\n`;
			return false;
		}
			
		if (this.isIncreasing && a > b) {
			if (debug)
				out.innerText += `Safety failed. Is increasing, but next is smaller (${a} > ${b})\n`;
			return false;
		} else if (! this.isIncreasing && a < b) {
			if (debug)
				out.innerText += `Safety failed. Is decreasing, but next is bigger (${a} < ${b})\n`;
			return false;
		}
		return true;
	}
	
	toString() {
		let s = `[`;
		this.values.forEach((v) => {
			s += `${v},`;
		});
		s += `]`;
		return s;
	}
}

window.aoc.d02 = {
	calc: function (event, dbg) {
		event.preventDefault();
		debug = dbg;
		out.innerText = '';
		
		let input = document.querySelector('#D02 .input').value.split("\n");
		let reports = [];
		input.forEach((line) => {
			let report = new Report(line);
			reports.push(report);
		});
		
		let safe = 0;
		let unsafe = 0;
		reports.forEach((report) => {
			if (report.isSafe())
				++safe;
			else
				++unsafe;
		});
		
		out.innerText += `Safe: ${safe} | Unsafe: ${unsafe}\n\n-------------------------------\n`;
		
		
		
		// Part 2
		let removeIndex = function (array, index) {
			return array.slice(0, index).concat(array.slice(index + 1));
		};
		reports.forEach((report) => {
			if (report.isSafe())
				return;
			
			for (let i = 0; i < report.values.length; ++i) {
				let temp = new Report(removeIndex(report.values, i));
				if (debug)
					out.innerText += `${report.toString()}\n`;
				if (temp.isSafe()) {
					if (debug)
						out.innerText += `Report found safe after removing Level ${i + 1}.\n`;
					++safe;
					--unsafe;
					return;
				}
			}
			if (debug)
				out.innerText += `^^^ Report cannot be salvaged. ^^^\n\n`;
		});
		
		out.innerText += `Safe: ${safe} | Unsafe: ${unsafe}\n\n-----------------\n`;
	},
};