const { Router } = require("express");
const authController = require('../controllers/authControllers');
const { requireAuth, checkUser } = require('../middleware/authMiddleware');

const router = Router();

router.get('*', checkUser);
router.get('/', authController.home);
router.get('/smoothies', requireAuth, authController.smoothies);

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);


module.exports = router;

