var out = document.querySelector('#D06 .output');
var debug = false;
var debugP2 = false;
var map = [];
var width = 0, height = 0;

class Update {
	pages = [];
	
	constructor() {
	}
}

window.aoc.d06 = {
	calc: function (event, dbg, dbg2) {
		event.preventDefault();
		debug = dbg;
		debugP2 = dbg2;
		out.innerText = '';
		
		let input = document.querySelector('#D06 .input').value.split("\n");
		let row = 0;
		map = [];
		width = 0;
		height = 0;
		let startingPos = {};
		input.forEach((line) => {
			map.push(line.split(''));
			let pos = line.indexOf('^');
			if (pos != -1) {
				startingPos.x = pos;
				startingPos.y = row;
			}
			++row;
		});
		width = map[0].length;
		height = map.length;
		
		this.runPath(startingPos.x, startingPos.y, true);
		
		if (debugP2) this.printMap();
		
		let sum = 0;
		map.forEach((row) => {
			row.forEach((c) => {
				if (c == 'X')
					++sum;
			});
		});
		out.innerText += `${sum}\n----------------------------------\n`;
		
		let blocks = {};
		for (let row = 0; row < height; ++row) {
			for (let col = 0; col < width; ++col) {
				if (map[row][col] != 'X')
					continue;
				let oldChar = map[row][col];
				map[row][col] = '#';
				if (debugP2) {
					out.innerText += `Placing block at ${col}x,${row}y\n`;
					this.printMap();
				}
				if (this.runPath(startingPos.x, startingPos.y))
					blocks[`${col},${row}`] = true;
				map[row][col] = oldChar;
			}
		}
		out.innerText += `${Object.keys(blocks).length}`;
	},
		
	printMap: function () {
		for (let row = 0; row < height; ++row) {
			for (let col = 0; col < width; ++col) {
				out.innerText += map[row][col];
			}
			out.innerText += "\n";
		}
		out.innerText += "\n";
	},
	
	runPath: function (startingX, startingY, markPath) {
		let guard = {
			x: startingX,
			y: startingY,
			facing: 0, // 0 up, 1 right, 2 down, 3 left
		}
		let routes = {};
		
		if (debug) this.printMap();
		if (debug) out.innerText += `Starting at (${guard.x},${guard.y}).\n`;
		let inBounds = true;
		let guardInLoop = false;
		while (inBounds) {
			if (routes[`${guard.x},${guard.y},${guard.facing}`]) {
				if (debugP2) out.innerText += `We found a loop! ${guard.x},${guard.y} facing ${guard.facing}\n`;
				guardInLoop = true;
				break;
			} else {
				routes[`${guard.x},${guard.y},${guard.facing}`] = 1;
			}
			let dx = 0;
			let dy = 0;
			let character = '^';
			switch (guard.facing) {
				case 0:
					dy = -1;
					break;
				case 1:
					dx = 1;
					character = '>';
					break;
				case 2:
					dy = 1;
					character = 'v';
					break;
				case 3:
					dx = -1;
					character = '<';
					break;
			}
			
			let bonk = false;
			while (! bonk) {
				let nextX = guard.x + dx;
				let nextY = guard.y + dy;
				if (debug) out.innerText += `examining (${nextX}, ${nextY})... `;
				
				if (nextX >= width || nextX < 0) {
					if (debug) out.innerText += `OOB via X. Ending.\n\n`;
					inBounds = false;
					break;
				}
				if (nextY < 0 || nextY >= height) {
					if (debug) out.innerText += `OOB via Y. Ending.\n\n`;
					inBounds = false;
					break;
				}
				
				let next = map[nextY][nextX];
				if (debug) out.innerText += `Next is '${next}'. `;
				if (next == '#') {
					if (debug) out.innerText += `BONK!\n`;
					if (debug) this.printMap();
					bonk = true;
					guard.facing = (guard.facing + 1) % 4; // turn right
				} else {
					if (debug) out.innerText += `Empty. Head on!\n`;
					if (markPath) {
						map[guard.y][guard.x] = 'X';
						map[nextY][nextX] = character;
					}
					guard.x = nextX;
					guard.y = nextY;
				}
			} // end while not bonk
		} // end while inBounds
		if (! inBounds && markPath)
			map[guard.y][guard.x] = 'X';
		if (debug) this.printMap();
		return guardInLoop;
	}
};
/*
		Part 2
Place an obsticale at each path the guard walks and test to see if the guard is in a loop.
	How to test for being in a loop?
1) Record guard's routes. (position and orientation)
2) When embarking on a route, see if it matches a saved position and orientation.
*/