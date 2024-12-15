var out = document.querySelector('#D08 .output');
var debug = false;
var antennas = {};
var antiNodes = {};
var width = 0;
var height = 0;
var map = [];

class Antenna {
	pos = { x: 0, y: 0 };
	cha = 'ñ';
	
	constructor (c, x, y) {
		this.cha = c;
		this.pos.x = x;
		this.pos.y = y;
	}
}

window.aoc.d08 = {
	printMap: function () {
		map.forEach((row) => {
			out.append(`${row}\n`);
		});
	},
	
	calc: function (event, dbg) {
		event.preventDefault();
		debug = dbg;
		out.innerText = ''; // Replace with remove
		
		let input = document.querySelector('#D08 .input').value.split("\n");
		width = input[0].length;
		height = input.length;
		map = [];
		antiNodes = {};
		antennas = {};
		for (let row = 0; row < height; ++row) {
			map.push([]);
			for (let col = 0; col < width; ++col) {
				map[row].push('.');
				let c = input[row][col];
				if (c == '.')
					continue;
				
				let a = new Antenna(c, col, row);
				if (! antennas[c])
					antennas[c] = [];
				antennas[c].push(a);
			}
		}
		if (debug) {
			let keys = Object.keys(antennas);
			keys.forEach((key) => {
				out.append(`For antenna ${key}, found ${antennas[key].length}.\n`);
			});
		}
		
		// find and build antiNodes
		let antennaChars = Object.keys(antennas);
		let sum = 0;
		let uniqueLocations = 0;
		antennaChars.forEach((c) => {
			let antGroup = antennas[c];
			for (let i = 0; i < antGroup.length; ++i) {
				let a = antGroup[i];
				for (let j = 0; j < antGroup.length; ++j) {
					if (i == j)
						continue;
					let b = antGroup[j];
					if (debug) out.append(`Using (${a.pos.x}, ${a.pos.y}) vs (${b.pos.x}, ${b.pos.y}). `);
					let dx = b.pos.x - a.pos.x;
					let dy = b.pos.y - a.pos.y;
					let antiX = b.pos.x + dx;
					let antiY = b.pos.y + dy;
					if (debug) out.append(`Placing antinode ${c}@(${antiX},${antiY})...`);
					if (antiX < 0 || antiX >= width || antiY < 0 || antiY >= height) {
						if (debug) out.append(` OOB. skipping\n`);
						continue;
					}
					if (! antiNodes[c])
						antiNodes[c] = [];
					let alreadyExists = false;
					for (let k = 0; k < antiNodes[c].length; ++k) {
						if (antiNodes[c][k].x == antiX && antiNodes[c][k].y == antiY) {
							alreadyExists = true;
							if (debug) out.append(` Antinode already placed for this antenna. Skipping\n`);
							break;
						}
					}
					if (alreadyExists)
						continue;
					if (debug) out.append("\n");
					antiNodes[c].push({
						x: antiX,
						y: antiY
					});
					if (map[antiY][antiX] == '.') {
						map[antiY][antiX] = 0
						++uniqueLocations;
					}
					++map[antiY][antiX];
					++sum;
				}
			}
		});
		if (debug) {
			out.append(`\n`);
			map.forEach((row) => {
				row.forEach((c) => {
					if (c != '.' && c > 10)
						out.append('X');
					else
						out.append(c);
				});
				out.append("\n");
			});
			out.append("AntiNodes\n");
			let keys = Object.keys(antiNodes);
			keys.forEach((k) => {
				out.append(`${k} | ${antiNodes[k].length}\n`);
			});
			out.append("\n");
		}
		out.append(`${uniqueLocations}\n------------------------------------\n`);
		
		
		antennaChars.forEach((c) => {
			let antGroup = antennas[c];
			if (! antiNodes[c])
				antiNodes[c] = [];
			for (let i = 0; i < antGroup.length; ++i) {
				let a = antGroup[i];
				for (let j = 0; j < antGroup.length; ++j) {
					if (i == j) {
						if (map[a.pos.y][a.pos.x] == '.') {
							map[a.pos.y][a.pos.x] = 0
							++uniqueLocations;
						}
						continue;
					}
					let b = antGroup[j];
					let dx = b.pos.x - a.pos.x;
					let dy = b.pos.y - a.pos.y;
					let OOB = false;
					let mult = 2;
					while (! OOB) {
						let antiX = b.pos.x + dx * mult;
						let antiY = b.pos.y + dy * mult;
						if (debug) out.append(`Placing antinode ${c}@(${antiX},${antiY})...`);
						if (antiX < 0 || antiX >= width || antiY < 0 || antiY >= height) {
							if (debug) out.append(` OOB. ending\n`);
							OOB = true;
							break;
						} else {
							++mult;
						}
						let alreadyExists = false;
						for (let k = 0; k < antiNodes[c].length; ++k) {
							if (antiNodes[c][k].x == antiX && antiNodes[c][k].y == antiY) {
								alreadyExists = true;
								if (debug) out.append(` Antinode already placed for this antenna. Skipping\n`);
								break;
							}
						}
						if (alreadyExists)
							continue;
						
						if (debug) out.append("\n");
						antiNodes[c].push({
							x: antiX,
							y: antiY
						});
						if (map[antiY][antiX] == '.') {
							map[antiY][antiX] = 0
							++uniqueLocations;
						}
						++map[antiY][antiX];
					}
				}
			}
		});
		
		if (debug) {
			out.append(`\n`);
			map.forEach((row) => {
				row.forEach((c) => {
					if (c != '.' && c > 10)
						out.append('X');
					else
						out.append(c);
				});
				out.append("\n");
			});
			out.append("AntiNodes\n");
			let keys = Object.keys(antiNodes);
			keys.forEach((k) => {
				out.append(`${k} | ${antiNodes[k].length}\n`);
			});
			out.append("\n");
		}
		out.append(`${uniqueLocations}`);
	}
};