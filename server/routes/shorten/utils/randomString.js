//creates 5 letter random strign [0-9] [a-z]
const randomString = (n) => {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < n; i++) 
        result += characters.charAt(Math.floor(Math.random() * characters.length));

    return result;
}

module.exports = randomString;
