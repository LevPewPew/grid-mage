let a = [1, 2];
let b = a;
console.log(b === a);

[a[0], a[1]] = ["A", "B"];

console.log(b === a);