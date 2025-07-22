const { getConnection } = require('../database/database');


const getTables = async (req, res) => {
    try {
        if ((!req.session.user_id) || req.session.user_type != 'admin') {
            return res.redirect('/login?redirect=true');
        }

        const connection = await getConnection();
        const table1 = await connection.query(`
            SELECT name, (SELECT count(*) FROM keysets WHERE apartment = apartments.id) as 'keys'
            FROM apartments
            ORDER BY name
        `);
        const table3 = await connection.query("SELECT * FROM users ORDER BY name");
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
            ORDER BY name
        `);
        const table3 = await connection.query("SELECT * FROM users ORDER BY name");
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
            ORDER BY name
        `);
        const table3 = await connection.query("SELECT * FROM users ORDER BY name");
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
            SELECT name, location, description,
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
        if ((!req.session.user_id) || req.session.user_type != 'admin') {
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
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }
        let { name, description } = req.body;
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
        let user = req.session.user_id;
        description = `Insertó el apartamento ${name}`;
        const admin_log = { user, description }
        await connection.query(`INSERT INTO admin_history SET ?`, admin_log);
        return res.status(200).render('./admin/apartments', options);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

const deleteApartment = async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }
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
        let user = req.session.user_id;
        let description = `Eliminó el apartamento ${search}`;
        const admin_log = { user, description };
        await connection.query(`INSERT INTO admin_history SET ?`, admin_log);
        return res.status(200).render('./admin/apartments', options);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


const renderKeysets = async (req, res) => {
    try {
        if ((!req.session.user_id) || req.session.user_type != 'admin') {
            return res.redirect('/login?redirect=true');
        }

        const connection = await getConnection();
        let apartments = await connection.query("SELECT name FROM apartments");
        apartments = JSON.stringify(apartments);
        let options = {
            title: "Editar Llaveros",
            tab1: "default",
            tab2: "tab2",
            action: '/admin/keysets:getKeysets',
            message: "",
            search_msg: "",
            delete_msg: "",
            apartments: apartments,
            keysets: null
        }
        if (req.query.delete) {
          options['tab1'] = 'tab1';
          options["tab2"] = 'default';
        }
        if (req.query.missing) { options['message'] = 'missing' }
        if (req.query.delete_miss) { options['delete_msg'] = 'missing'; }
        if (req.query.success) { options['message'] = 'success' }
        if (req.query.delete_success) { options['delete_msg'] = 'success' }
        return res.status(200).render('./admin/keysets', options);
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

const insertKeyset = async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }

        let { name, apartment, keys } = req.body;
        const connection = await getConnection();
        let apartments = await connection.query("SELECT name FROM apartments");
        apartments = JSON.stringify(apartments);
        if (name == "" || apartment == "") {
            return res.redirect('/admin/keysets?missing=true');
        }
        let apt_name = apartment;
        apartment = await connection.query("SELECT id FROM apartments WHERE name = ?", apartment);
        let user = req.session.user_id;
        const keyset = { name: name, apartment: apartment[0].id, location: 'Oficina', user: user, description: keys };
        await connection.query(`INSERT INTO keysets SET ?`, keyset);
        let description = `Insertó la llave ${name} de ${apt_name}`;
        const admin_log = { user, description }
        await connection.query(`INSERT INTO admin_history SET ?`, admin_log);
        return res.redirect('/admin/keysets?success=true');
    } catch (err) {
        return res.status(500).send(err.message);
    }
};

const getKeysets = async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }
        let { apartment } = req.body;
        const connection = await getConnection();
        let options = {
            title: "Editar Llaveros",
            tab1: "tab1",
            tab2: "default",
            action: '/admin/deleteKeyset',
            message: "",
            delete_msg: ""
        }
        if (apartment == "") {
            return res.redirect('/admin/keysets?delete=true&delete_miss=true');
        }
        let name = apartment;
        apartment = await connection.query("SELECT id FROM apartments WHERE name = ?", apartment);
        apartment[0]["name"] = name;
        let keysets = await connection.query(`
            SELECT name 
            FROM keysets 
            WHERE apartment = ?
        `, apartment[0].id);
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
    try {
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }
        let { k_name, apartment } = req.body;
        const connection = await getConnection();
        let options = {
            title: "Editar Llaveros",
            tab1: "tab1",
            tab2: "default",
            message: ""
        }
        if (k_name == undefined) {
            apartment = await connection.query("SELECT id, name FROM apartments WHERE name = ?", apartment);
            options["keysets"] = await connection.query("SELECT name FROM keysets WHERE apartment = ?", apartment[0].id);
            apartment = JSON.stringify(apartment[0]);
            console.log(options["keysets"]);
            options["apartments"] = apartment;
            options["action"] = '/admin/deleteKeyset';
            options["search_msg"] = "success";
            options["delete_msg"] = "missing:keyset";
            return res.status(400).render('./admin/keysets', options);
        }
        options["delete_msg"] = "success";
        options['keysets'] = null;
        let apt_name = apartment;
        apartment = await connection.query("SELECT id FROM apartments WHERE name = ?", apartment);
        await connection.query(`DELETE FROM keysets WHERE name = '${k_name}' and apartment = ${apartment[0].id}`);
        let user = req.session.user_id;
        let description = `Eliminó la llave ${k_name} de ${apt_name}`;
        const admin_log = { user, description };
        await connection.query(`INSERT INTO admin_history SET ?`, admin_log);
        return res.redirect('/admin/keysets?delete=true&delete_success=true');
    } catch (err) {
        res.status(500).send(err.message);
    }
};


const renderUsers = (req, res) => {
    try {
        if ((!req.session.user_id) || req.session.user_type != 'admin') {
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
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }
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
            password: '12345678',
            type: 'user'
        }
        if (admin == 'yes') { user["type"] = 'admin' };
        await connection.query("INSERT INTO users SET ?", user);
        user = req.session.user_id;
        let description = `Insertó el usuario ${name}`;
        const admin_log = { user, description }
        await connection.query(`INSERT INTO admin_history SET ?`, admin_log);
        return res.status(200).render('./admin/users', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

const deleteUser = async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.redirect('/login?redirect=true');
        }
        const { email } = req.body;
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
        let name = await connection.query("SELECT name FROM users WHERE email = ?", email);
        await connection.query("DELETE FROM users WHERE email = ?", email);
        let user = req.session.user_id;
        let description = `Eliminó el usuario ${name}`;
        const admin_log = { user, description }
        await connection.query(`INSERT INTO admin_history SET ?`, admin_log);
        return res.status(200).render('./admin/users', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};


function  completeMonth(short) {
    switch(short) {
      case 'Jan':
        return 'Enero';
      case 'Feb':
        return 'Febrero';
      case 'Mar':
        return 'Marzo';
      case 'Apr':
        return 'Abril';
      case 'May':
        return 'Mayo';
      case 'Jun':
        return 'Junio';
      case 'Jul':
        return 'Julio';
      case 'Aug':
        return 'Agosto';
      case 'Sep':
        return 'Septiembre';
      case 'Oct':
        return 'Octubre';
      case 'Nov':
        return 'Noviembre';
      default:
        return 'Diciembre';
    }
}

const renderHistory = async (req, res) => {
    try {
        if ((!req.session.user_id) || req.session.user_type != 'admin') {
            return res.redirect('/login?redirect=true');
        }

        let options = {
            title: "Historial de Movimientos",
            tab1: "default",
            tab2: "tab2",
            admin_history: null,
            user_history: null,
            msg_user: null,
            msg_admin: null
        };
      
        const connection = await getConnection();
        options['users'] = [];
        let users = await connection.query(`
            SELECT name
            FROM users
        `);
        users.forEach((user) => {
            options['users'].push(user.name);
        });
        
        options["apartments"] = [];
        let apartments = await connection.query(`
            SELECT name
            FROM apartments
        `);
        apartments.forEach((apartment) => {
            options['apartments'].push(apartment.name);
        });
      
        return res.status(200).render('./admin/history', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

const renderHAdmins = async (req, res) => {
    try {
        if ((!req.session.user_id) || req.session.user_type != 'admin') {
            return res.redirect('/login?redirect=true');
        }

        let options = {
            title: "Historial de Movimientos",
            tab1: "tab1",
            tab2: "default",
            admin_history: null,
            user_history: null,
            msg_user: null,
            msg_admin: null
        };
      
        const connection = await getConnection();
        options['users'] = [];
        let users = await connection.query(`
            SELECT name
            FROM users
        `);
        users.forEach((user) => {
            options['users'].push(user.name);
        });
        
        options["apartments"] = [];
        let apartments = await connection.query(`
            SELECT name
            FROM apartments
        `);
        apartments.forEach((apartment) => {
            options['apartments'].push(apartment.name);
        });
      
        return res.status(200).render('./admin/history', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
}

const historyUsers = async (req, res) => {
    try {
        if ((!req.session.user_id) || req.session.user_type != 'admin') {
            return res.redirect('/login?redirect=true');
        }
      
        const { apartment, date } = req.body;
        let options = {
            title: "Historial de Movimientos",
            tab1: "default",
            tab2: "tab2",
            admin_history: null,
            apartments: null,
            msg_user: null,
            msg_admin: null
        };
        
        const connection = await getConnection();
        let query = `
            SELECT moveDate, location, action,
                (SELECT name FROM users WHERE id = user_history.user) as "user",
                (SELECT name FROM keysets WHERE id = user_history.keyset) as "keyset",
                (SELECT name FROM apartments WHERE id = user_history.apartment) as "apartment"
            FROM user_history
        `;
        if (apartment != "") {
            let apt_id = await connection.query(`SELECT id FROM apartments WHERE name = '${apartment}'`);
            query += ` WHERE apartment = ${apt_id[0].id}`;
        }
        if (date != "") {
            if (apartment != "") { query += " and " }
            else { query += " WHERE " }
            query += `CAST(moveDate as DATE) = '${date}'
            `;
        } query += ` ORDER BY moveDate DESC`;
        options["user_history"] = await connection.query(query);
        if (options["user_history"].length == 0) {
            options["user_history"] = null;
            options["msg_user"] = 'not found';
        } else {
            options["user_history"].forEach((row) => {
                let tdate = String(row.moveDate).split(' ');
                row.moveDate = tdate[2] + ' ' + completeMonth(tdate[1]) + ' ' + tdate[3];
            });
        }
      
        options['users'] = [];
        let users = await connection.query(`
            SELECT name
            FROM users
        `);
        users.forEach((user) => {
            options['users'].push(user.name);
        });
      
        return res.status(200).render('./admin/history', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

const historyAdmins = async (req, res) => {
    try {
        if ((!req.session.user_id) || req.session.user_type != 'admin') {
            return res.redirect('/login?redirect=true');
        }
      
        const { user, date } = req.body;
        let options = {
            title: "Historial de Movimientos",
            tab1: "tab1",
            tab2: "default",
            user_history: null,
            users: null,
            msg_user: null,
            msg_admin: null
        };
        
        const connection = await getConnection();
        let query = `
            SELECT actionDate, description,
                (SELECT name FROM users WHERE id = admin_history.user) as "user"
            FROM admin_history
        `;
        if (user != "") {
            let user_id = await connection.query(`SELECT id FROM users WHERE name = "${user}"`);
            query += `  WHERE user = ${user_id[0].id}`;
        }
        if (date != "") {
            if (user != "") { query += " and " }
            else { query += "  WHERE " }
            query += `CAST(actionDate as DATE) = '${date}'
            `;
        } query += "  ORDER BY actionDate DESC";
        options["admin_history"] = await connection.query(query);
        if (options["admin_history"].length == 0) {
            options["admin_history"] = null;
            options["msg_admin"] = 'not found';
        } else {
            options["admin_history"].forEach((row) => {
                let tdate = String(row.actionDate).split(' ');
                row.actionDate = tdate[2] + ' ' + completeMonth(tdate[1]) + ' ' + tdate[3];
            });
        }
      
        options["apartments"] = [];
        let apartments = await connection.query(`
            SELECT name
            FROM apartments
        `);
        apartments.forEach((apartment) => {
            options['apartments'].push(apartment.name);
        });
        
        return res.status(200).render('./admin/history', options);
    } catch (err) {
        return res.status(500).render(err.message);
    }
};

module.exports = {
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
    renderHistory,
    renderHAdmins,
    historyUsers,
    historyAdmins
}
