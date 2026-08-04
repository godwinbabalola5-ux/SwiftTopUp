const generateReference = (type) => {

    return (
        type.toUpperCase() +
        Date.now() +
        Math.floor(Math.random() * 1000)
    );

};

module.exports = generateReference;