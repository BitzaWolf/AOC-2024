var out = document.querySelector('#D04 .output');
var debug = false;

class LetterNode {
	letter = '';
	neighbors = ['|', '/', '_', '\\', '|', '/', '_', '\\'];
	
	constructor(ltr) {
		this.letter = ltr;
	}
	
	toString() {
		let s = `${this.neighbors[1].letter ?? '+'}${this.neighbors[2].letter ?? '-'}${this.neighbors[3].letter ?? '+'}\n`;
		s +=    `${this.neighbors[0].letter ?? '|'}${             this.letter       }${this.neighbors[4].letter ?? '|'}\n`;
		s +=    `${this.neighbors[7].letter ?? '+'}${this.neighbors[6].letter ?? '-'}${this.neighbors[5].letter ?? '+'}`;
		return s;
	}
}

window.aoc.d04 = {
	calc: function (event, dbg) {
		event.preventDefault();
		debug = dbg;
		out.innerText = '';
		
		let input = document.querySelector('#D04 .input').value.split("\n");
		let width = input[0].length;
		let height = input.length;
		
		let completedGrid = [];
		let inputGrid = [];
		input.forEach((line) => {
			let emptyLine = [];
			let temp = [];
			for (let i = 0; i < line.length; ++i) {
				temp.push(new LetterNode(line[i]));
				emptyLine.push('.');
			}
			completedGrid.push(emptyLine);
			inputGrid.push(temp);
		});

		for (let row = 0; row < height; ++row) {
			for (let col = 0; col < width; ++col) {
				let letter = inputGrid[row][col];
				if (col > 0)
					letter.neighbors[0] = inputGrid[row][col - 1];
				if (row > 0 && col > 0)
					letter.neighbors[1] = inputGrid[row - 1][col - 1];
				if (row > 0)
					letter.neighbors[2] = inputGrid[row - 1][col];
				if (row > 0 && col < width - 1)
					letter.neighbors[3] = inputGrid[row - 1][col + 1];
				if (col < width - 1)
					letter.neighbors[4] = inputGrid[row][col + 1];
				if (col < width - 1 && row < height - 1)
					letter.neighbors[5] = inputGrid[row + 1][col + 1];
				if (row < height - 1)
					letter.neighbors[6] = inputGrid[row + 1][col];
				if (row < height - 1 && col > 0)
					letter.neighbors[7] = inputGrid[row + 1][col - 1];
			}
		}
		// if (debug) out.innerText += `Does this look right? (0, 0)\n${inputGrid[0][0].toString()}\n\n`;
		// if (debug) out.innerText += `Does this look right? (8, 3)\n${inputGrid[8][3].toString()}\n\n`;
		// if (debug) out.innerText += `Does this look right? (9, 3)\n${inputGrid[9][3].toString()}\n\n`;
		
		// We now have a linked-list but as a grid for the letters.
		// Algorithm will be to go through the grid and find nodes with the letter X
		// From that node, travel in each cardinal direction to its neighbor nodes
		// looking for 'M' then 'A' then 'S' in the same direction
		
		let printGrid = function (grid) {
			let s = '';
			grid.forEach((row) => {
				row.forEach((letter) => {
					s += letter;
				});
				s += "\n";
			});
			return s;
		}
		
		let foundWords = 0;
		for (let row = 0; row < height; ++row) {
			for (let col = 0; col < width; ++col) {
				let letter = inputGrid[row][col];
				if (letter.letter != 'X')
					continue;
				if (debug) out.innerText += `Found an X at (${row},${col}).\n`;
				for (let i = 0; i < 8; ++i) {
					if (letter.neighbors[i].letter == 'M' &&
						letter.neighbors[i].neighbors && letter.neighbors[i].neighbors[i].letter == 'A' &&
						letter.neighbors[i].neighbors[i].neighbors && letter.neighbors[i].neighbors[i].neighbors[i].letter == 'S')
						{
							if (debug) {
								out.innerText += `Found an XMAS! Starting at (${row}, ${col}) going ${i} direction.\n`;
								completedGrid[row][col] = 'X';
								let dx = 1;
								let dy = 1;
								if (i == 0 || i == 1 || i == 7) dx = -1;
								if (i == 2 || i == 6) dx = 0;
								if (i == 1 || i == 2 || i == 3) dy = -1;
								if (i == 0 || i == 4) dy = 0;
								completedGrid[row + dy][col + dx] = 'M';
								completedGrid[row + dy * 2][col + dx * 2] = 'A';
								completedGrid[row + dy * 3][col + dx * 3] = 'S';
								out.innerText += printGrid(completedGrid) + "\n";
							}
							++foundWords;
						}
				}
				if (debug) out.innerText += "\n";
			}
		}
		out.innerText += `Found ${foundWords}\n--------------------------------------\n`;
		
		
		// Part 2
		completedGrid.forEach((row) => {
			row.fill('.');
		});
		foundWords = 0;
		for (let row = 0; row < height; ++row) {
			for (let col = 0; col < width; ++col) {
				let letter = inputGrid[row][col];
				if (letter.letter != 'A')
					continue;
				if (debug) out.innerText += `Found an A at (${row},${col}).\n`;
				let count = 0;
				if (letter.neighbors[1] && letter.neighbors[1].letter == 'M' && letter.neighbors[5] && letter.neighbors[5].letter == 'S')
					++count;
				if (letter.neighbors[3] && letter.neighbors[3].letter == 'M' && letter.neighbors[7] && letter.neighbors[7].letter == 'S')
					++count;
				if (letter.neighbors[5] && letter.neighbors[5].letter == 'M' && letter.neighbors[1] && letter.neighbors[1].letter == 'S')
					++count;
				if (letter.neighbors[7] && letter.neighbors[7].letter == 'M' && letter.neighbors[3] && letter.neighbors[3].letter == 'S')
					++count;
				if (debug) out.innerText += `Found ${count} MAS's\n`;
				if (count == 2) {
					if (debug) {
						out.innerText += `Found an X-MAS @(${row}, ${col})!\n`;
						completedGrid[row][col] = 'A';
						if (letter.neighbors[1] && letter.neighbors[1].letter == 'M' && letter.neighbors[5] && letter.neighbors[5].letter == 'S') {
							completedGrid[row - 1][col - 1] = 'M';
							completedGrid[row + 1][col + 1] = 'S';
						}
						if (letter.neighbors[3] && letter.neighbors[3].letter == 'M' && letter.neighbors[7] && letter.neighbors[7].letter == 'S') {
							completedGrid[row - 1][col + 1] = 'M';
							completedGrid[row + 1][col - 1] = 'S';
						}
						if (letter.neighbors[5] && letter.neighbors[5].letter == 'M' && letter.neighbors[1] && letter.neighbors[1].letter == 'S') {
							completedGrid[row + 1][col + 1] = 'M';
							completedGrid[row - 1][col - 1] = 'S';
						}
						if (letter.neighbors[7] && letter.neighbors[7].letter == 'M' && letter.neighbors[3] && letter.neighbors[3].letter == 'S') {
							completedGrid[row + 1][col - 1] = 'M';
							completedGrid[row - 1][col + 1] = 'S';
						}
						out.innerText += printGrid(completedGrid) + "\n";
					}
					++foundWords;
				}
				if (debug) out.innerText += "\n";
			}
		}
		out.innerText += `Found ${foundWords}`;
	},
};