const { getConnection } = require('../database/database');

const render_pickup = async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }
        let options = {
            title: "Recoger Llave",
            message: "",
            keysets: "",
            action: "/users/pickup-keys"
        }
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
            title: "Recoger Llave",
            keysets: "",
            message: "",
            action: "/users/pick-up"
        }
        const connection = await getConnection();
        if (apartment == "") {
            options['action'] = "/users/pickup-keys"
            options["apartments"] = await connection.query("SELECT name FROM apartments");
            options["message"] = "missing";
            return res.status(400).render('./users/pick-up', options);
        } 
        let keysets = await connection.query(`
            SELECT name
            FROM keysets
            WHERE apartment = (SELECT id FROM apartments WHERE name = '${apartment}') and 
                  user = '1'
        `);
        options["apartments"] = JSON.stringify({name: apartment});
        keysets = JSON.stringify(keysets);
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
        let { apartment, keyset } = req.body;
        let options = {
            title: "Recoger Llave",
            message: "",
            keysets: "",
            action: "/users/pickup-keys"
        }
        if (keyset == '') {
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
            SET user = '${user}'
            WHERE name = '${keyset}' and apartment = '${apartment[0].id}'
        `);
        keyset = await connection.query(`
            SELECT id
            FROM keysets
            WHERE name = '${keyset}' and apartment = '${apartment[0].id}'
        `);
        await connection.query(`
            INSERT INTO history (sender, receiver, keyset)
            VALUES ('1', '${user}', '${keyset[0].id}')
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
            title: "Recoger Llave",
            message: "",
            keysets: "",
            action: "/users/return-keys"
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
            title: "Recoger Llave",
            keysets: "",
            message: "",
            action: "/users/return"
        }
        const connection = await getConnection();
        if (apartment == "") {
            options['action'] = "/users/return-keys"
            options["apartments"] = await connection.query("SELECT name FROM apartments");
            options["message"] = "missing";
            return res.status(400).render('./users/return', options);
        } 
        let user = req.session.user_id;
        let keysets = await connection.query(`
            SELECT name
            FROM keysets
            WHERE apartment = (SELECT id FROM apartments WHERE name = '${apartment}') and 
                  user = '${user}'
        `);
        options["apartments"] = JSON.stringify({name: apartment});
        keysets = JSON.stringify(keysets);
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
            title: "Recoger Llave",
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
            SET user = '1'
            WHERE name = '${keyset}' and apartment = '${apartment[0].id}'
        `);
        keyset = await connection.query(`
            SELECT id
            FROM keysets
            WHERE name = '${keyset}' and apartment = '${apartment[0].id}'
        `);
        await connection.query(`
            INSERT INTO history (sender, receiver, keyset)
            VALUES ('${user}', '1', '${keyset[0].id}')
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
            title: "Consultar Llave",
            message: "",
            keysets: null
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
        console.log(apartment);
        let options = {
            title: "Consultar Llave",
            message: "",
            apartments: apartment
        }
        const connection = await getConnection();
        let apartment_id = await connection.query(`SELECT id FROM apartments WHERE name = '${apartment}'`);
        let keysets = await connection.query(`
            SELECT name, extra,
                (SELECT name FROM apartments WHERE id = keysets.apartment) as "apartment",
                (SELECT name FROM users WHERE id = keysets.user) as "user"
            FROM keysets
            WHERE apartment = '${apartment_id[0].id}'
        `);
        options["keysets"] = keysets;
        console.log(keysets);
        return res.status(200).render('./users/query', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};


const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/login');
};

module.exports = {
    logout,
    render_pickup,
    pickup_getKeysets,
    pick_up,
    render_query,
    query,
    render_return,
    return_getKeysets,
    returnKey
}