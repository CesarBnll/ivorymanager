const { getConnection } = require('../database/database');

const render_pickup = async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }
        let options = {
            title: "Recoger Llavero",
            message: "",
            keysets: "",
            action: "/users/pickup-keys"
        }
        if (req.query.msg) { options["message"] = req.query.msg; }
        const connection = await getConnection();
        let apartments = await connection.query(`SELECT name FROM apartments`);
        apartments = JSON.stringify(apartments);
        options["apartments"] = apartments;
        return res.status(200).render('./users/pick-up', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

const pickup_getKeysets = async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }
        let { apartment } = req.body;
        let options = {
            title: "Recoger Llavero",
            keysets: "",
            message: "",
            action: "/users/pick-up"
        }
        const connection = await getConnection();
        if (apartment == "") {
            return res.redirect('/users/pick-up?msg=missing');
        }
        let keysets = await connection.query(`
            SELECT name
            FROM keysets
            WHERE apartment = (SELECT id FROM apartments WHERE name = '${apartment}') and 
                  location = 'Oficina'
        `);
        if (keysets.length == 0) {
            return res.redirect('/users/pick-up?msg=fail');
        }
        options["apartments"] = JSON.stringify({name: apartment});
        options["keysets"] = keysets;
        return res.status(200).render('./users/pick-up', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

const pick_up = async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }
        let { apartment, keyset, location } = req.body;
        let options = {
            title: "Recoger Llavero",
            message: "",
            keysets: "",
            action: "/users/pickup-keys"
        }
        if (keyset == '' || location == '') {
            options["apartments"] = JSON.stringify({name: apartment});
            options["message"] = "missing";
            return res.status(400).render('./users/pick-up', options);
        } 
        const connection = await getConnection();
        let apartments = await connection.query(`SELECT name FROM apartments`);
        apartments = JSON.stringify(apartments);
        options["apartments"] = apartments;
        let user = req.session.user_id;
        apartment = await connection.query("SELECT id FROM apartments WHERE name = ?", apartment);
        await connection.query(`
            UPDATE keysets
            SET user = '${user}', location = '${location}'
            WHERE name = '${keyset}' and apartment = '${apartment[0].id}'
        `);
        keyset = await connection.query(`
            SELECT id
            FROM keysets
            WHERE name = '${keyset}' and apartment = '${apartment[0].id}'
        `);
        await connection.query(`
            INSERT INTO user_history (user, keyset, action, location, apartment)
            VALUES ('${user}', '${keyset[0].id}', 'Recoger', '${location}', '${apartment[0].id}')
        `);
        options['message'] = 'success';
        return res.status(200).render('./users/pick-up', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};


const render_return = async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }
        let options = {
            title: "Devolver Llavero",
            message: "",
            keysets: "",
            action: "/users/return-keys"
        }
        if (req.query.msg) {
          options["message"] = req.query.msg;
        }
        const connection = await getConnection();
        let apartments = await connection.query(`SELECT name FROM apartments`);
        apartments = JSON.stringify(apartments);
        options["apartments"] = apartments;
        return res.status(200).render('./users/return', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

const return_getKeysets = async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }
        let { apartment } = req.body;
        let options = {
            title: "Devolver Llavero",
            keysets: "",
            message: "",
            action: "/users/return"
        }
        const connection = await getConnection();
        if (apartment == "") {
            return res.redirect('/users/return?msg=missing');
        } 
        let user = req.session.user_id;
        let keysets = await connection.query(`
            SELECT name
            FROM keysets
            WHERE apartment = (SELECT id FROM apartments WHERE name = '${apartment}') and 
                  location != 'Oficina'
        `);
        if (keysets.length == 0) {
            return res.redirect('/users/return?msg=fail');
        }
        options["apartments"] = JSON.stringify({name: apartment});
        options["keysets"] = keysets;
        return res.status(200).render('./users/return', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

const returnKey = async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }
        let { apartment, keyset } = req.body;
        let options = {
            title: "Devolver Llavero",
            message: "",
            keysets: "",
            action: "/users/return-keys"
        }
        if (keyset == '') {
            options["apartments"] = JSON.stringify({name: apartment});
            options["message"] = "missing";
            return res.status(400).render('./users/return', options);
        } 
        const connection = await getConnection();
        let apartments = await connection.query(`SELECT name FROM apartments`);
        apartments = JSON.stringify(apartments);
        options["apartments"] = apartments;
        let user = req.session.user_id;
        apartment = await connection.query("SELECT id FROM apartments WHERE name = ?", apartment);
        await connection.query(`
            UPDATE keysets
            SET location = 'Oficina', user = '${user}'
            WHERE name = '${keyset}' and apartment = '${apartment[0].id}'
        `);
        keyset = await connection.query(`
            SELECT id
            FROM keysets
            WHERE name = '${keyset}' and apartment = '${apartment[0].id}'
        `);
        await connection.query(`
            INSERT INTO user_history (user, keyset, action, location, apartment)
            VALUES ('${user}', '${keyset[0].id}', 'Devolver', 'Oficina', '${apartment[0].id}')
        `);
        options['message'] = 'success';
        return res.status(200).render('./users/return', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};


const render_query = async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }
        let options = {
            title: "Consultar Llavero",
            message: "",
            keysets: null
        }
        if (req.query.msg) {
            options["message"] = req.query.msg;
        }
        const connection = await getConnection();
        let apartments = await connection.query(`SELECT name FROM apartments`);
        apartments = JSON.stringify(apartments);
        options["apartments"] = apartments;
        return res.status(200).render('./users/query', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

const query = async (req, res) => {
    try {
        let { apartment } = req.body
        let options = {
            title: "Consultar Llavero",
            message: "",
            apartments: null
        }
        if (apartment == "") {
          return res.redirect('/users/query?msg=missing');
        }
        const connection = await getConnection();
        let apartment_id = await connection.query(`SELECT id FROM apartments WHERE name = '${apartment}'`);
        if (apartment_id.length == 0) {
          return res.redirect('/users/query?msg=fail')
        }
        let keysets = await connection.query(`
            SELECT name, location, description,
                (SELECT name FROM apartments WHERE id = keysets.apartment) as "apartment",
                (SELECT name FROM users WHERE id = keysets.user) as "user"
            FROM keysets
            WHERE apartment = '${apartment_id[0].id}'
        `);
        options["keysets"] = keysets;
        return res.status(200).render('./users/query', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};


module.exports = {
    render_pickup,
    pickup_getKeysets,
    pick_up,
    render_query,
    query,
    render_return,
    return_getKeysets,
    returnKey
}