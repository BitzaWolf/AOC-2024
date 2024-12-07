var out = document.querySelector('#D05 .output');
var debug = false;
var rules = {};

class Update {
	pages = [];
	part1Valid = false;
	
	constructor(strings) {
		strings.forEach((str) => {
			this.pages.push(Number(str));
		});
	}
	
	checkValidity() {
		if (debug) out.innerText += `Running report validity...\n`;
		// The first page can never be wrong
		this.part1Valid = true;
		for (let i = 1; i < this.pages.length; ++i) {
			let pageNum = this.pages[i];
			if (! rules[pageNum]) {
				if (debug) out.innerText += `    No rules found for page ${pageNum}. Valid page.\n`;
				continue;
			}
			if (debug) out.innerText += `    Checking ${pageNum}... `;
			for (let j = 0; j < i; ++j) {
				let beforePageNum = this.pages[j];
				if (rules[pageNum].includes(beforePageNum)) {
					if (debug) out.innerText += ` Error. Rule says ${pageNum} must be before ${beforePageNum} but is after.\nInvalid Report.\n\n`;
					this.part1Valid = false;
					return false;
				}
			}
			if (debug) out.innerText += ` No rules broken.\n`;
		}
		if (debug) out.innerText += `Valid Report!\n\n`;
		return true;
	}
	
	restoreOrder() {
		if (debug) out.innerText += `${this.pages}\n`;
		for (let i = 1; i < this.pages.length; ++i) {
			let pageNum = this.pages[i];
			if (! rules[pageNum]) {
				if (debug) out.innerText += `No rules found for page ${pageNum}. Valid page.\n`;
				continue;
			}
			if (debug) out.innerText += `Checking ${pageNum}... `;
			let broke = false;
			for (let j = 0; j < i; ++j) {
				let beforePageNum = this.pages[j];
				if (rules[pageNum].includes(beforePageNum)) {
					if (debug) out.innerText += ` Error. ${pageNum} must be before ${beforePageNum}. Swapping ${i}(${pageNum}) <-> ${j}(${beforePageNum}).\n`;
					this.pages[j] = pageNum;
					this.pages[i] = beforePageNum;
					if (debug) out.innerText += `    ${this.pages}\n    Continuing from ${j}.\n`;
					i = j - 1;
					broke = true;
					break;
				}
			}
			if (! broke && debug) out.innerText += ` No rules broken.\n`;
		}
		if (debug) out.innerText += `Done restoring. ${this.pages}\n\n`;
	}
}

window.aoc.d05 = {
	calc: function (event, dbg) {
		event.preventDefault();
		debug = dbg;
		out.innerText = '';
		
		let input = document.querySelector('#D05 .input').value.split("\n");
		rules = {};
		let pupdates = [];
		input.forEach((line) => {
			if (line.indexOf('|') != -1) {
				line = line.split('|');
				let a = Number(line[0]);
				let b = Number(line[1]);
				if (! rules[a])
					rules[a] = [];
				rules[a].push(b);
			} else if (line.indexOf(',') != -1) {
				pupdates.push(new Update(line.split(',')));
			}
		});
		
		// Honestly don't need to do this, but makes debugging easier and nicer to read.
		Object.keys(rules).forEach((key) => {
			rules[key].sort();
		});
		
		if (debug) {
			out.innerText += `Rules Table:\n`;
			Object.keys(rules).forEach((key) => {
				out.innerText += `${key} | `;
				rules[key].forEach((val) => {
					out.innerText += `${val}, `;
				});
				out.innerText += "\n";
			});
			out.innerText += `\nPupdates List:\n`;
			pupdates.forEach((pup) => {
				out.innerText += '[';
				pup.pages.forEach((item) => {
					out.innerText += `${item}, `;
				});
				out.innerText += "]\n";
			});
		}
		
		let sum = 0;
		pupdates.forEach((pup) => {
			let isValid = pup.checkValidity();
			if (isValid) {
				let middlePage = pup.pages[parseInt(pup.pages.length / 2)];
				if (debug) out.innerText += `<<${sum} + ${middlePage}`;
				sum += middlePage;
				if (debug) out.innerText += ` = ${sum}>>\n\n`;
			}
		});
		
		out.innerText += `${sum}\n----------------------------------------------\n`;
		
		// Part 2
		// For each invalid pupdate, fix it..?
		// When you come across an error, swap it with the problem number and set the page num counter to the index that was swapped.
		// Let's say 97,13,75,29,47 is pupdate and that there is no rule for 75.
		// 13 is fine, no rules.
		// 75 is fine in my pretend scenario here, no rules.
		// 29 must be before 13, so let's swap index 3 (29) and index 1 (13). Report is now 97,29,75,13,47
		// but now we must re-check 75 in case it must be before 29 (it must be).
		// index is now at 1 (the swapped index). 
		// 29 is fine. 75 errors because it must be before 29.
		// etc.
		sum = 0;
		pupdates.forEach((pup) => {
			if (pup.part1Valid)
				return; // skip
			pup.restoreOrder();
			let middlePage = pup.pages[parseInt(pup.pages.length / 2)];
			if (debug) out.innerText += `<<${sum} + ${middlePage}`;
			sum += middlePage;
			if (debug) out.innerText += ` = ${sum}>>\n\n`;
		});
		out.innerText += `${sum}`;
	}
};