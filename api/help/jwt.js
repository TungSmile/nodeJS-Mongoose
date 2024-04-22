// const jwt = require('jsonwebtoken');
// const SECRET = '12456'; 
// const auth = (req, res, next) => {
//   const authorization = req.headers.authorization;
//   if (authorization) {
//     const accessToken = authorization.split(' ')[1]; 
//     if (accessToken) {
//       jwt.verify(accessToken, SECRET, (err, payload) => {
//         if (err) {
//           return res.status(401).json({
//             error: err.message,
//             message: 'You are anonymous'
//           });
//         }
//         req.idUser = payload;
//         next(); 
//       });
//     } else {
//       return res.status(401).json({
//         message: 'You are anonymous'
//       });
//     }
//   } else {
//     return res.status(401).json({
//       message: 'You are anonymous'
//     });
//   }
// };

// module.exports = auth;