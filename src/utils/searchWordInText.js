function searchWordInText(word, text) {
    const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(escapedWord, 'g');

    if (text.match(pattern)) {
        console.log(`Match found for '${word}'`);
    } else {
        console.log(`No match found for '${word}'`);
    }
}