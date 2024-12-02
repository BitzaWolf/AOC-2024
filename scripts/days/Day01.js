window.aoc.d01 = {
	out: document.querySelector('#D01 .output'),
	
	calc: function (event, debug) {
		event.preventDefault();
		this.out.innerText = '';
        let dtStart = performance.now();
		let dtEnd = -1;
		let dTime = -1;
		
		let input = document.querySelector('#D01 .input').value.split("\n");
		let result = 0;
		let leftList = [];
		let rightList = [];
		input.forEach((pair) => {
			let p = pair.split('   ');
			let left = Number(p[0]);
			let right = Number(p[1]);
			leftList.push(left);
			rightList.push(right);
		});
		dtEnd = performance.now();
		dTime = (dtEnd - dtStart) / 1000;
		dtStart = dtEnd;
		console.log(`Input list making time: ${dTime}s`);
		
		leftList.sort();
		rightList.sort();
		dtEnd = performance.now();
		dTime = (dtEnd - dtStart) / 1000;
		dtStart = dtEnd;
		console.log(`Sorting took: ${dTime}s`);
		
		if (debug)
			this.out.innerText += `${leftList} \n${rightList}\n`;
		for (let i = 0; i < leftList.length; ++i) {
			let left = leftList[i];
			let right = rightList[i];
			let diff = Math.abs(left - right); 
			result += diff;
			if (debug)
				this.out.innerText += `${left} ${right} | diff: ${diff} | result: ${result}\n`;
		}
		dtEnd = performance.now();
		dTime = (dtEnd - dtStart) / 1000;
		dtStart = dtEnd;
		console.log(`Calculating diffs took: ${dTime}s`);
		
		if (debug)
			this.out.innerText += "\n\n";
		this.out.innerText += `${result}\n--------------\n`;
		
		// Part 2
		let similarity = {};
		rightList.forEach((num) => {
			if (similarity[num])
				similarity[num] += 1;
			else
				similarity[num] = 1;
		});
		if (debug)
			this.out.innerText += `similarity\n${similarity}\n`;
		let score = 0;
		leftList.forEach((num) => {
			if (similarity[num])
				score += num * similarity[num];
			if (debug)
				this.out.innerText += `Looking at ${num}, found "${similarity[num]}", new score: ${score}\n`;
		});
		if (debug)
			this.out.innerText += "\n\n";
		this.out.innerText += `${score}`;
	},
};