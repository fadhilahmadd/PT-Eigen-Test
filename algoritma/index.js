const express = require('express')
const app = express()
const port = 3000

//reveserse alphabet
function reverseAlphabet(str) {
  const letters = str.match(/[a-zA-Z]/g) || [];
  const numbers = str.match(/\d+/g) || [];
  return letters.reverse().join('') + numbers.join('');
}

const result1 = reverseAlphabet("NEGIE1");
console.log('1. Reverse Alphabet');
console.log(result1);
console.log();

//kata terpanjang
function longestWord(sentence) {
  const words = sentence.split(' ');
  let longest = words[0];

  for (let i = 1; i < words.length; i++) {
    if (words[i].length > longest.length) {
      longest = words[i];
    }
  }
  return `${longest}: ${longest.length} characters`;
}

const sentence = "Saya sangat senang mengerjakan soal algoritma";
const result2 = longestWord(sentence);
console.log('2. Kata Terpanjang');
console.log(result2);
console.log();

//hitung kejadian
function hitungKejadian(input, query) {
  return query.map(q => input.filter(word => word === q).length);
}

const input = ['xc', 'dz', 'bbb', 'dz'];
const query = ['bbb', 'ac', 'dz'];
const result3 = hitungKejadian(input, query);
console.log('3. Hitung Kejadian');
console.log(result3);
console.log();

//diagonal
function diagonal(matrix) {
  let diagonal1 = 0;
  let diagonal2 = 0;

  for (let i = 0; i < matrix.length; i++) {
    diagonal1 += matrix[i][i];
    diagonal2 += matrix[i][matrix.length - 1 - i];
  }
  return Math.abs(diagonal1 - diagonal2);
}

const matrix = [
  [1, 2, 0], 
  [4, 5, 6], 
  [7, 8, 9]
];
const result4 = diagonal(matrix);
console.log('4. Diagonal');
console.log(result4);

app.listen(port, () => {

})