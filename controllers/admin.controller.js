const { getConnection } = require('../database/database');

const getTables = async (req, res) => {
    try {
        console.log(req.session);
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }

        const connection = await getConnection();
        const table1 = await connection.query(`
            SELECT name, (SELECT count(*) FROM keysets WHERE apartment = apartments.id) as 'keys'
            FROM apartments
        `);
        const table3 = await connection.query("SELECT * FROM users");
        let apartments = [];
        let users = [];
        table1.forEach(apartment => {
            apartments.push(apartment.name);
        })
        table3.forEach(user => {
            users.push(user.name);
        })
        let = options = { 
            title: "Vista General",
            tab1: "default",
            tab2: "tab2",
            tab3: "tab3",
            table1: table1,
            table3: table3,
            keysets: null,
            apartments: apartments,
            users: users,
            message: ""
        };
        return res.status(200).render('./admin/general', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

const getTablesSearch = async (req, res) => {
    try {
        const connection = await getConnection();
        const table1 = await connection.query(`
            SELECT name, (SELECT count(*) FROM keysets WHERE apartment = apartments.id) as 'keys'
            FROM apartments
        `);
        const table3 = await connection.query("SELECT * FROM users");
        let apartments = [];
        let users = [];
        table1.forEach(apartment => {
            apartments.push(apartment.name);
        })
        table3.forEach(user => {
            users.push(user.name);
        })
        let options = { 
            title: "Vista General",
            tab1: "tab1",
            tab2: "default",
            tab3: "tab3",
            table1: table1,
            table3: table3,
            keysets: null,
            apartments: apartments,
            users: users,
            message: ""
        };
        return res.status(200).render('./admin/general', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

const getGeneralKeysets = async (req, res) => {
    try {
        const { apartment, user } = req.body;
        const connection = await getConnection();
        const table1 = await connection.query(`
            SELECT name, (SELECT count(*) FROM keysets WHERE apartment = apartments.id) as 'keys'
            FROM apartments
        `);
        const table3 = await connection.query("SELECT * FROM users");
        let options = { 
            title: "Vista General",
            tab1: "tab1",
            tab2: "default",
            tab3: "tab3",
            table1: table1,
            table3: table3,
            apartments: null,
            users: null
        };
        if (apartment == "" && user == "") {
            options["message"] = "missing";
            options["keysets"] = null;
            return res.status(400).render("./admin/general", options);
        }
        let query = `
            SELECT name, extra,
                (SELECT name FROM apartments WHERE id = keysets.apartment) as "apartment",
                (SELECT name FROM users WHERE id = keysets.user) as "user"
            FROM keysets
        `;

        if (apartment != "") {
            let apartment_id = await connection.query("SELECT id FROM apartments WHERE name = ?", apartment);
            query += `WHERE apartment = ${apartment_id[0].id}`;
        }
        if (user != "") {
            if (apartment != "") {
                query += " and "
            } else {
                query += "WHERE "
            }
            let user_id = await connection.query("SELECT id FROM users WHERE name = ?", user);
            query += `user = ${user_id[0].id}`;
        }
        options["message"] = "";
        options["keysets"] = await connection.query(query);
        return res.status(200).render('./admin/general', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

const renderApartments = async (req, res) => {
    try {
        console.log(req.session);
        if (!req.session.user_id) {
            return res.render('/login?redirect=true');
        }

        const connection = await getConnection();
        let apartments = await connection.query("SELECT name FROM apartments");
        apartments = JSON.stringify(apartments);
        let options = {
            title: "Editar Apartamentos",
            tab1: "default",
            tab2: "tab2",
            message: "",
            search_msg: "",
            apartments: apartments
        }
        return res.status(200).render('./admin/apartments', options);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

const insertApartment = async (req, res) => {
    try {
        const { name, description } = req.body;
        const connection = await getConnection();
        let apartments = await connection.query("SELECT name FROM apartments");
        apartments = JSON.stringify(apartments);
        let options = {
            title: "Editar Apartamentos",
            tab1: "default",
            tab2: "tab2",
            search_msg: "",
            apartments: apartments
        }
        if (name == "") {
            options["message"] = "missing";
            return res.status(400).render('./admin/apartments', options);
        }
        options["message"] = "success";
        const apartment = { name, description };
        await connection.query(`INSERT INTO apartments SET ?`, apartment);
        return res.status(200).render('./admin/apartments', options);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

const deleteApartment = async (req, res) => {
    try {
        const { search } = req.body;
        const connection = await getConnection();
        let apartments = await connection.query("SELECT name FROM apartments");
        apartments = JSON.stringify(apartments);
        let options = {
            title: "Editar Apartamentos",
            tab1: "tab1",
            tab2: "default",
            message: "",
            apartments: apartments
        }
        if (search == "") {
            options["search_msg"] = "missing";
            res.status(400).render('./admin/apartments', options);
            return;
        }
        options["search_msg"] = "success";
        await connection.query("DELETE FROM apartments WHERE name = ?", search);
        return res.status(200).render('./admin/apartments', options);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const renderKeysets = async (req, res) => {
    try {
        console.log(req.session);
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }

        const connection = await getConnection();
        let apartments = await connection.query("SELECT name FROM apartments");
        apartments = JSON.stringify(apartments);
        let options = {
            title: "Editar Llaves",
            tab1: "default",
            tab2: "tab2",
            message: "",
            search_msg: "",
            delete_msg: "",
            apartments: apartments,
            keysets: null
        }
        return res.status(200).render('./admin/keysets', options);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

const insertKeyset = async (req, res) => {
    try {
        let { name, apartment, extra } = req.body;
        if (extra != 'yes') extra = 'no';
        const connection = await getConnection();
        let apartments = await connection.query("SELECT name FROM apartments");
        apartments = JSON.stringify(apartments);
        const options = {
            title: "Editar Llaves",
            tab1: "default",
            tab2: "tab2",
            message: "",
            search_msg: "",
            keysets: null,
            apartments: apartments
        }
        if (name == "" || apartment == "") {
            options["message"] = "missing";
            return res.status(400).render('./admin/keysets', options);
        }
        options["message"] = "success";
        apartment = await connection.query("SELECT id FROM apartments WHERE name = ?", apartment);
        const keyset = { name: name, apartment: apartment[0].id, extra: extra, user: 1 };
        console.log(keyset);
        await connection.query(`INSERT INTO keysets SET ?`, keyset);
        return res.status(200).render('./admin/keysets', options);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

const getKeysets = async (req, res) => {
    try {
        let { apartment } = req.body;
        const connection = await getConnection();
        let options = {
            title: "Editar Apartamentos",
            tab1: "tab1",
            tab2: "default",
            message: "",
            delete_msg: ""
        }
        if (apartment == "") {
            let apartments = await connection.query("SELECT name FROM apartments");
            apartments = JSON.stringify(apartments);
            options["search_msg"] = "missing";
            options["apartments"] = apartments;
            options["keysets"] = null;
            res.status(400).render('./admin/keysets', options);
            return;
        }
        let name = apartment;
        apartment = await connection.query("SELECT id FROM apartments WHERE name = ?", apartment);
        apartment[0]["name"] = name;
        let keysets = await connection.query(`
            SELECT name 
            FROM keysets 
            WHERE apartment = ?
        `, apartment[0].id);
        keysets = JSON.stringify(keysets);
        apartment = JSON.stringify(apartment[0]);
        options["search_msg"] = "success";
        options["apartments"] = apartment;
        options["keysets"] = keysets;
        return res.status(200).render('./admin/keysets', options);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const deleteKeyset = async (req, res) => {
    console.log("\n PENE \n");
    try {
        console.log("\n HOLA \n");
        const { k_name, apartment } = req.body;
        console.log(req.body);
        const connection = await getConnection();
        let apartments = await connection.query("SELECT name FROM apartments");
        apartments = JSON.stringify(apartments);
        let options = {
            title: "Editar Apartamentos",
            tab1: "tab1",
            tab2: "default",
            message: "",
            search_msg: "",
            apartments: apartments
        }
        if (k_name == "") {
            let keysets = await connection.query("SELECT name FROM keysets WHERE apartment = ?", apartment);
            options["keysets"] = keysets;
            options["delete_msg"] = "missing";
            res.status(400).render('./admin/apartments', options);
            return;
        }
        options["delete_msg"] = "success";
        options['keysets'] = null;
        apartment = connection.query("SELECT id FROM apartments WHERE name = ?", apartment);
        let keyset = { name: k_name, apartment: apartment };
        console.log(keyset);
        // await connection.query("DELETE FROM keysets WHERE (name, apartment) = ?", keyset);
        return res.status(200).render('./admin/apartments', options);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

const renderUsers = (req, res) => {
    try {
        console.log(req.session);
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }

        let options = {
            title: "Editar Usuarios",
            tab1: "default",
            tab2: "tab2",
            message: "",
            message_del: ""
        }
        return res.status(200).render('./admin/users', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

const insertUser = async (req, res) => {
    try {
        let { name, email, phone, admin } = req.body;
        let options = {
            title: "Editar Usuarios",
            tab1: "default",
            tab2: "tab2",
            message_del: ""
        }
        if ((name || email || phone) == "") {
            options["message"] = "missing";
            return res.status(400).render('./admin/users', options);
        }
        options["message"] = "success";
        const connection = await getConnection();
        let user = {
            name: name,
            email: email,
            phone: phone,
        }
        if (admin == 'yes') user["type"] = 'admin';
        await connection.query("INSERT INTO users SET ?", user);
        return res.status(200).render('./admin/users', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

const deleteUser = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);
        let options = {
            title: "Editar Usuarios",
            tab1: "tab1",
            tab2: "default",
            message: ""
        };
        if (email == "") {
            options["message_del"] = "missing";
            return res.status(400).render('./admin/users', options);
        }
        options["message_del"] = "success";
        const connection = await getConnection();
        await connection.query("DELETE FROM users WHERE email = ?", email);
        return res.status(200).render('./admin/users', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

const renderHistory = async (req, res) => {
    try {
        console.log(req.session);
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }

        let options = { title: "Historial de Movimientos" };
        const connection = await getConnection();
        options["history"] = await connection.query(`
            SELECT moveDate, 
                (SELECT name FROM users WHERE id = history.sender) as "sender",
                (SELECT name FROM users WHERE id = history.receiver) as "receiver",
                (SELECT name FROM keysets WHERE id = history.keyset) as "keyset",
                (SELECT (SELECT name FROM apartments WHERE id = keysets.apartment) as "apartment" FROM keysets WHERE id = history.keyset) as "keyset_apt"
            FROM history
        `);
        return res.status(200).render('./admin/history', options);
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
    getTables,
    getTablesSearch,
    getGeneralKeysets,
    renderApartments,
    insertApartment,
    deleteApartment,
    renderKeysets,
    insertKeyset,
    getKeysets,
    deleteKeyset,
    renderUsers,
    insertUser,
    deleteUser,
    renderHistory
}
