const taskBuilder = require('../controllers/taskController');
const accountBuilder = require('../controllers/accountController');
const userBuilder = require('../controllers/userController');
const logRefBuilder = require('../controllers/LogRefController');



module.exports = app => {

  app.
    route('/ref')
    .post(accountBuilder.ref);

  app.route('/login')
    .post(userBuilder.loginAndRegister)
    .put(userBuilder.login);
  // login & register 
  app.route('/register')
    .post(userBuilder.create_a_User)
    .put(userBuilder.create_a_User_by_openID);

  // app.route('/registerWithRef')
  //   .post(userBuilder.create_a_UserWithRef);

  app.route('/users')
    .get(userBuilder.getUserById);

  app.route('/users/:rs')
    .post(userBuilder.update_res_User);

  app.route('/refence')
    .get(logRefBuilder.list_all_LogRefSchema)
    .post(logRefBuilder.add_ref_after);


  // app.route('/test/encrypt')
  //   .post(userBuilder.test);

  // app.route('/test/decrypt')
  //   .post(userBuilder.test1);

};