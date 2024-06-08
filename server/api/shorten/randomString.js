//creates 5 letter random strign [0-9] [a-z]
require('dotenv').config();

const randomString = () => {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) 
        result += characters.charAt(Math.floor(Math.random() * characters.length));

    return {shortUrl: result};
}

module.exports = randomString;
