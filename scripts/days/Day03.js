var out = document.querySelector('#D03 .output');
var debug = false;

class Command {
	type = '';
	left = 0;
	right = 0;
	atIndex = -1;
	enabled = true;
	
	constructor() {
	}
	
	getValue() {
		return this.left * this.right;
	}
	
	toString() {
		return `${this.type}(${this.left},${this.right}) @${this.atIndex} ${this.enabled}`;
	}
}

window.aoc.d03 = {
	calc: function (event, dbg) {
		event.preventDefault();
		debug = dbg;
		out.innerText = '';
		
		let input = document.querySelector('#D03 .input').value;
		let index = input.indexOf("mul(");
		let validMuls = [];
		
		let parseNumber = function (i, endChar) {
			let numb = '';
			let result = {
				index: -1,
				number: null
			};
			
			while (! isNaN(Number.parseInt(input[i]))) {
				numb += input[i++];
			}
			result.number = Number(numb);
			if (debug)
				out.innerText += `Found number: ${numb}\n`;
			
			if (numb.length > 3 || numb.length == 0 || input[i++] != endChar) {
				if (debug)
					out.innerText += `Number too long, or no number found, or wrong endChar next "${input[i - 1]}" is not "${endChar}"\n`;
				result.number = null;
			}
			else if (debug)
				out.innerText += `Number Valid.\n`;
			result.index = i;
			return result;
		};
		
		let findNextCommand = function() {
			index = input.indexOf("mul(", index);
			if (debug)
				out.innerText += `Found next "mul(" at ${index}\n`;
		};
		
		while (index != -1) {
			let cmd = new Command();
			
			let command = input.substr(index, 3);
			cmd.atIndex = index;
			index += 4;
			cmd.type = command;
			
			let result = parseNumber(index, ',');
			index = result.index;
			if (! result.number) {
				if (debug)
					out.innerText += `Command invalid. Continuing.\n\n`;
				findNextCommand();
				continue;
			}
			cmd.left = result.number;
			
			result = parseNumber(index, ')');
			index = result.index;
			if (! result.number) {
				if (debug)
					out.innerText += `Command invalid. Continuing.\n\n`;
				findNextCommand();
				continue;
			}
			cmd.right = result.number;
			
			if (debug)
				out.innerText += `Command valid!\n\n`;
			validMuls.push(cmd);
			findNextCommand();
		}
		
		let sum = 0;
		validMuls.forEach((cmd) => {
			let val = cmd.getValue();
			if (debug)
				out.innerText += `Adding ${sum} += ${val} | ${cmd.left} * ${cmd.right}\n`;
			sum += val;
		});
		out.innerText += `Sum: ${sum}\n--------------------------------------\n`;
		
		
		// Part 2
		index = 0;
		let findDoDontCommand = function () {
			let cmdDo = input.indexOf("do()", index);
			let cmdDont = input.indexOf("don't()", index);
			let cmd = '';
			if (debug)
				out.innerText += `Looking for Do/Dont (${cmdDo} vs ${cmdDont})... `;
			if (cmdDo == -1 && cmdDont == -1) {
				if (debug)
					out.innerText += `No more commands found.\n`;
				index = -1;
				return null;
			}
			if (cmdDo == -1)
				cmdDo = 9999999999999;
			if (cmdDont == -1)
				cmdDont = 999999999999;
			if (cmdDo < cmdDont) {
				index = cmdDo;
				cmd = 'Do()';
			} else {
				index = cmdDont;
				cmd = "Don't()";
			}
			if (debug)
				out.innerText += `Found cmd "${cmd}" at ${index}\n`;
			return cmd;
		};
		
		let doCmd = findDoDontCommand();
		while (index != -1) {
			let setEnabled = (doCmd == "Do()");
			if (debug) out.innerText += `Setting enabled to ${setEnabled} for mul after index @${index}\n`;
			validMuls.forEach((mul) => {
				if (mul.atIndex > index) {
					mul.enabled = setEnabled;
					if (debug)
						out.innerText += `    Setting ${mul.toString()}\n`;
				}
			});
			if (debug) out.innerText += `\n`;
			index += 1;
			doCmd = findDoDontCommand();
		}
		
		sum = 0;
		validMuls.forEach((cmd) => {
			if (! cmd.enabled) {
				if (debug)
					out.innerText += `Skipping ${cmd.toString()}. Not enabled.\n`;
				return;
			}
			let val = cmd.getValue();
			if (debug)
				out.innerText += `Adding ${sum} += ${val} | ${cmd.left} * ${cmd.right}\n`;
			sum += val;
		});
		out.innerText += `Sum: ${sum}\n--------------------------------------\n`;
	},
};