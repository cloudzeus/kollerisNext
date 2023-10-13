function calculateAndRound(a, b) {
    const result = a * b;
    return Math.round(result * 100) / 100;
}
export default calculateAndRound;