const express = require('express');
const login_controller = require('../controllers/login.controller');
const admin_controller = require('../controllers/admin.controller');
const users_controller = require('../controllers/users.controller');
const router = express.Router();

/* Login page. */
router.get('/login', function(req, res, next) {
  let options = {
    title: "Iniciar Sesión",
    message: ""
  }
  if (req.query.redirect) {
    options["message"] = "auth";
  } else if (req.query.recovery) {
    options["message"] = "success";
  }
  res.render('login', options);
});
router.post('/login', login_controller.auth);

/* Recovery page. */
router.get('/login/recovery', function(req, res, next) {
  res.render('recovery', { title: 'Reestablecer', message: '' });
});
router.post('/login/recovery', login_controller.recovery);


/* Users pages. */
router.get('/users', function(req, res, next) {
  if (!req.session.user_id) {
    res.redirect('/login?redirect=true');
  } else {
    res.render('users', { title: "Ivory Llaves" });
  }
});
router.post('/users/logout', users_controller.logout);

router.get('/users/pick-up', users_controller.render_pickup);
router.post('/users/pickup-keys', users_controller.pickup_getKeysets);
router.post('/users/pick-up', users_controller.pick_up);

router.get('/users/query', users_controller.render_query);
router.post('/users/query', users_controller.query);

router.get('/users/return', users_controller.render_return);
router.post('/users/return-keys', users_controller.return_getKeysets);
router.post('/users/return', users_controller.returnKey);

/* Admin pages. */
router.get('/admin', function(req, res, next) {
  if (!req.session.user_id) {
    res.redirect('/login?redirect=true');
  } else {
    res.render('admin', { title: "Ivory Homes" });
  }
});
router.post('/admin/logout', admin_controller.logout);

router.get('/admin/general', admin_controller.getTables);
router.get('/admin/general:search', admin_controller.getTablesSearch);
router.post('/admin/general:getKeysets', admin_controller.getGeneralKeysets);

router.get('/admin/apartments', admin_controller.renderApartments);
router.post('/admin/apartments', admin_controller.insertApartment);
router.post('/admin/apartments:delete', admin_controller.deleteApartment);

router.get('/admin/keysets', admin_controller.renderKeysets);
router.post('/admin/keysets', admin_controller.insertKeyset);
router.post('/admin/keysets:getKeysets', admin_controller.getKeysets);
router.post('/admin/keysets:delete', admin_controller.deleteKeyset);

router.get('/admin/users', admin_controller.renderUsers);
router.post('/admin/users', admin_controller.insertUser);
router.post('/admin/users:delete', admin_controller.deleteUser);

router.get('/admin/history', admin_controller.renderHistory);

module.exports = router;
