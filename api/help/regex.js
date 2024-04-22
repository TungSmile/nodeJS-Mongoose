const userNameRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,10}$/;
const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,10}$/;
const phoneRegex = /^\d{10}$/;



module.exports = {
    checkUserName,
    checkPassword
};

function checkUserName(str) {
    let check = userNameRegex.test(str)
    return check;
}
function checkPassword(str) {
    let check = passwordRegex.test(str)
    return check;
}