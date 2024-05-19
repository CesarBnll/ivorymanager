const { getConnection } = require('../database/database');

const auth = async (req, res) => {
    try {
        const { email, pass } = req.body;
        let options = {
            title: 'Iniciar Sesión'
        }
        if (email == "" || pass == "") {
            options['message'] = "missing";
            return res.status(400).render('./login', options);
        }

        let connection = await getConnection();
        let user = await connection.query(`
            SELECT id, type
            FROM users
            WHERE email = '${email}' and password = '${pass}'
        `);
        if (user.length == 0) {
            options['message'] = "false";
            return res.status(400).render('./login', options);
        }
        
        req.session.user_id = user[0].id;
        if (user[0].type == 'admin') {
            return res.redirect('/admin');
        } else {
            return res.redirect('/users');
        }
    } catch(err) {
        return res.status(500).render(err.message);
    }
};

const recovery = async (req, res) => {
    try {
        const { email, new_pass } = req.body;
        let options = {
            title: 'Iniciar Sesión',
        }
        if ((email || new_pass) == "") {
            options['message'] = 'missing';
            console.log(options);
            return res.status(400).render('./recovery', options);
        }

        let connection = await getConnection();
        let update = await connection.query(`
            UPDATE users
            SET password = '${new_pass}'
            WHERE email = '${email}'
        `);
        if (update.affectedRows == 0) {
            options['message'] = 'false';
            return res.status(400).render('./recovery', options);
        }
        return res.redirect('/login?recovery=true');
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

module.exports = { auth, recovery }