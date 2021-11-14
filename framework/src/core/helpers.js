function delay(ss) {
    return new Promise(resolve => setTimeout(resolve, ss * 1000))
}

module.exports = {
    delay
}