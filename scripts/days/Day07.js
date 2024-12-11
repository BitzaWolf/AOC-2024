var out = document.querySelector('#D07 .output');
var debug = false;
var equations = [];

class Equation {
	result = 0;
	values = [];
	operators = [];
	solved = false;
	
	constructor(string) {
		let split = string.split(":");
		this.result = Number(split[0]);
		let vals = split[1].trim().split(" ");
		if (debug) out.append(`${this.result} =`);
		let dbgStr = '';
		for (let i = 0; i < vals.length; ++i) {
			this.values.push(Number(vals[i]));
			if (debug) dbgStr += ` ${this.values[i]} ?`;
		}
		if (debug) dbgStr = dbgStr.substr(0, dbgStr.length - 2);
		if (debug) out.append(`${dbgStr}\n`);
	}
	
	solve() {
		this.operators = [];
		let numOperators = this.values.length - 1;
		for (let i = 0; i < numOperators; ++i)
			this.operators.push('add');
		while (! this.solved) {
			let a = this.values[0];
			for (let i = 1; i < this.values.length; ++i) {
				let b = this.values[i];
				let op = this.operators[i - 1];
				switch(op) {
					case 'add':
						a += b;
						break;
					case 'mul':
						a *= b;
						break;
				}
			}
			this.solved = (a == this.result);
			if (! this.solved) {
				let allMul = true;
				for (let i = 0; i < this.operators.length; ++i) {
					if (this.operators[i] == 'add') {
						this.operators[i] = 'mul';
						allMul = false;
						break;
					} else {
						this.operators[i] = 'add';
					}
				}
				if (allMul) {
					if (debug) out.append(`Equation ${this.result} cannot be solved.\n`);
					break;
				}
			} else {
				if (debug) {
					out.append(`Solved. ${this.result} =`);
					let dbgStr = '';
					for (let i = 0; i < this.values.length - 1; ++i) {
						dbgStr += ` ${this.values[i]} ${this.operators[i]}`;
					}
					dbgStr += ` ${this.values[this.values.length - 1]}`;
					out.append(`${dbgStr}\n`);
				}
			}
		}
	}
	
	solveTwo() {
		this.operators = [];
		let numOperators = this.values.length - 1;
		for (let i = 0; i < numOperators; ++i)
			this.operators.push('con');
		while (! this.solved) {
			let a = this.values[0];
			for (let i = 1; i < this.values.length; ++i) {
				let b = this.values[i];
				let op = this.operators[i - 1];
				switch(op) {
					case 'con':
						a = Number(`${a}${b}`);
						break;
					case 'add':
						a += b;
						break;
					case 'mul':
						a *= b;
						break;
				}
			}
			this.solved = (a == this.result);
			if (! this.solved) {
				let allMul = true;
				for (let i = 0; i < this.operators.length; ++i) {
					if (this.operators[i] == 'con') {
						this.operators[i] = 'add';
						allMul = false;
						break;
					}
					if (this.operators[i] == 'add') {
						this.operators[i] = 'mul';
						allMul = false;
						break;
					} else {
						this.operators[i] = 'con';
					}
				}
				if (allMul) {
					if (debug) out.append(`Equation ${this.result} cannot be solved.\n`);
					break;
				}
			} else {
				if (debug) {
					out.append(`Solved. ${this.result} =`);
					let dbgStr = '';
					for (let i = 0; i < this.values.length - 1; ++i) {
						dbgStr += ` ${this.values[i]} ${this.operators[i]}`;
					}
					dbgStr += ` ${this.values[this.values.length - 1]}`;
					out.append(`${dbgStr}\n`);
				}
			}
		}
	}
}

window.aoc.d07 = {
	calc: function (event, dbg) {
		event.preventDefault();
		debug = dbg;
		out.innerText = '';
		
		equations = [];
		let input = document.querySelector('#D07 .input').value.split("\n");
		let sum = 0;
		input.forEach((line) => {
			let eq = new Equation(line);
			equations.push(eq);
			eq.solve();
			if (debug) out.append("\n");
			if (eq.solved) {
				sum += eq.result;
			}
		});
		out.append(`${sum}\n-------------------------------------\n`);
		
		sum = 0;
		equations.forEach((eq) => {
			eq.solveTwo();
			if (debug) out.append("\n");
			if (eq.solved) {
				sum += eq.result;
			}
		});
		out.append(`${sum}`);
	}
};