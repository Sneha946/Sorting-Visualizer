const arrayContainer = document.getElementById("array-container");
let array = [];
let speed = document.getElementById("speed").value;
let isSorting = false;
let isPaused = false;
let currentI = 0, currentJ = 0; // Track sorting position







// Sorting Function Wrappers
async function sortAndMeasure(arr, containerId, algorithm, timeId) {
    let bars = document.getElementById(containerId).children;
    let startTime = performance.now(); // Start timing

    if (algorithm === "bubbleSort") {
        await bubbleSort(arr, bars);
    } else if (algorithm === "quickSort") {
        await quickSort(arr, 0, arr.length - 1, bars);
    } else if (algorithm === "mergeSort") {
        await mergeSort(arr, 0, arr.length - 1, bars);
    } else if (algorithm === "insertionSort") {
        await insertionSort(arr, bars);
    } else if (algorithm === "selectionSort") {
        await selectionSort(arr, bars);
    }

    let endTime = performance.now(); // End timing
    document.getElementById(timeId).textContent = (endTime - startTime).toFixed(2);
}

// Function to start the battle
function startBattle() {
    let algorithm1 = document.getElementById("algorithm1").value;
    let algorithm2 = document.getElementById("algorithm2").value;

    let arr = generateArray(); // Generate the same array for both
    let arr1 = [...arr]; // Clone for first algorithm
    let arr2 = [...arr]; // Clone for second algorithm

    renderBars(arr1, "array-container1");
    renderBars(arr2, "array-container2");

    sortAndMeasure(arr1, "array-container1", algorithm1, "time1");
    sortAndMeasure(arr2, "array-container2", algorithm2, "time2");
}

document.getElementById("algorithm-select").addEventListener("change", function() {
    let complexityBox = document.getElementById("complexity");
    if (this.value !== "Choose an algorithm") {
        complexityBox.style.display = "block"; // Show complexity box
        updateComplexity(this.value); // Update complexity details
    } else {
        complexityBox.style.display = "none"; // Hide if no algorithm selected
    }
});


document.getElementById("algorithm-select").addEventListener("change", function() {
    let complexityBox = document.getElementById("complexity");
    if (this.value !== "Choose an algorithm") {
        complexityBox.style.display = "block"; // Show complexity box
        updateComplexity(this.value); // Update complexity details
    } else {
        complexityBox.style.display = "none"; // Hide if no algorithm selected
    }
});

// Function to Update Time & Space Complexity
function updateComplexity(algorithm) {
    let timeComplexity = document.getElementById("time-complexity");
    let spaceComplexity = document.getElementById("space-complexity");

    const complexities = {
        bubbleSort: { time: "O(n²)", space: "O(1)" },
        selectionSort: { time: "O(n²)", space: "O(1)" },
        insertionSort: { time: "O(n²) (worst), O(n) (best)", space: "O(1)" },
        quickSort: { time: "O(n log n) (avg), O(n²) (worst)", space: "O(log n)" },
        mergeSort: { time: "O(n log n)", space: "O(n)" }
    };

    if (complexities[algorithm]) {
        timeComplexity.innerHTML = `Time Complexity: ${complexities[algorithm].time}`;
        spaceComplexity.innerHTML = `Space Complexity: ${complexities[algorithm].space}`;
    }
}

// Swap function with delay
async function swap(bar1, bar2) {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (!isSorting) return; // Stop sorting if stopped

            let tempHeight = bar1.style.height;
            let tempValue = bar1.childNodes[0].innerText;

            bar1.style.height = bar2.style.height;
            bar2.style.height = tempHeight;

            bar1.childNodes[0].innerText = bar2.childNodes[0].innerText;
            bar2.childNodes[0].innerText = tempValue;

            resolve();
        }, 500 - document.getElementById("speed").value);
    });
}

// Bubble Sort
async function bubbleSort() {
    let bars = document.getElementsByClassName("bar");
    isSorting = true;
    isPaused = false;

    for (; currentI < array.length - 1 && isSorting; currentI++) {
        for (; currentJ < array.length - currentI - 1 && isSorting; currentJ++) {
            bars[currentJ].style.backgroundColor = "red";
            bars[currentJ + 1].style.backgroundColor = "red";

            if (array[currentJ] > array[currentJ + 1]) {
                await swap(bars[currentJ], bars[currentJ + 1]);
                [array[currentJ], array[currentJ + 1]] = [array[currentJ + 1], array[currentJ]];
            }

            bars[currentJ].style.backgroundColor = "cyan";
            bars[currentJ + 1].style.backgroundColor = "cyan";

            if (!isSorting) return;
        }
        bars[array.length - currentI - 1].style.backgroundColor = "green";
        currentJ = 0;
    }
}

// Selection Sort
async function selectionSort() {
    let bars = document.getElementsByClassName("bar");
    isSorting = true;
    isPaused = false;

    for (; currentI < array.length - 1 && isSorting; currentI++) {
        let minIdx = currentI;
        bars[minIdx].style.backgroundColor = "red";

        for (let j = currentI + 1; j < array.length && isSorting; j++) {
            bars[j].style.backgroundColor = "yellow";
            await new Promise(resolve => setTimeout(resolve, 500 - document.getElementById("speed").value));

            if (array[j] < array[minIdx]) {
                bars[minIdx].style.backgroundColor = "cyan";
                minIdx = j;
                bars[minIdx].style.backgroundColor = "red";
            } else {
                bars[j].style.backgroundColor = "cyan";
            }
        }

        if (minIdx !== currentI) {
            await swap(bars[currentI], bars[minIdx]);
            [array[currentI], array[minIdx]] = [array[minIdx], array[currentI]];
        }
        bars[currentI].style.backgroundColor = "green";
    }
}

// Insertion Sort
async function insertionSort() {
    let bars = document.getElementsByClassName("bar");
    isSorting = true;
    isPaused = false;

    for (; currentI < array.length && isSorting; currentI++) {
        let key = array[currentI];
        let j = currentI - 1;

        bars[currentI].style.backgroundColor = "red";
        await new Promise(resolve => setTimeout(resolve, 500 - document.getElementById("speed").value));

        while (j >= 0 && array[j] > key && isSorting) {
            await swap(bars[j], bars[j + 1]);
            array[j + 1] = array[j];
            bars[j].style.backgroundColor = "yellow";
            j--;
        }
        array[j + 1] = key;
        bars[currentI].style.backgroundColor = "green";
    }
}

// Start sorting (Resume if stopped)
function startSorting() {
    if (!isSorting) {
        let algo = document.getElementById("algorithm-select").value;
        console.log(algo);
        if (algo === "bubbleSort") bubbleSort();
        else if (algo === "selectionSort") selectionSort();
        else if (algo === "insertionSort") insertionSort();
    }
}

// Stop sorting (Pause)
function stopSorting() {
    isSorting = false;
    isPaused = true;
}

// Update speed dynamically
document.getElementById("speed").addEventListener("input", function () {
    speed = this.value;
    document.getElementById("speed-value").innerText = speed;
});

// Generate random array
function generateArray() {
    isSorting = false;
    isPaused = false;
    currentI = 0;
    currentJ = 0;
    array = [];
    arrayContainer.innerHTML = "";

    for (let i = 0; i < 25; i++) {
        let value = Math.floor(Math.random() * 100) + 1;
        array.push(value);

        let bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = `${value * 3}px`;

        let label = document.createElement("span");
        label.innerText = value;
        bar.appendChild(label);

        arrayContainer.appendChild(bar);
    }
}

// Generate initial array on page load
window.onload = generateArray;
