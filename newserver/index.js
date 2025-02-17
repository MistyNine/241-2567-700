
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();

const port = 8600;

app.use(bodyParser.json());

let users = []

let conn = null
const initMySQL = async () => {
    conn = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'webdb',
        port: 8830 
    })
}

/*
app.get('/testdbnew',async(req,res) => {
    try {
        const result = await conn.query('SELECT * FROM user')
        res.json(result[0])
    } catch (error) {
        console.log('error', error.message)
        res.staus(500).json({error: 'Error fetching users'})
        }
    })
*/

app.get('/users', async (req, res) => {
    const result = await conn.query('SELECT * FROM users')
    res.json(result[0])
})
      

// path: /user ใช้สำหรับการสร้างข้อมูล user ใหม่
app.post('/users', async(req, res) => { 
    let user = req.body;
    const result = conn.query('INSERT INTO users SET ?',   users) 
    console.log ('results', result)
    res.json({
        message: 'Create user successfully',
        data: result[0]
    })

})
// path: /users ใช้สำหรับการเเสดงข้อมูล user ทั้งหมด
app.get('/users', (req, res) => {
    let id = req.params.id;
    // ค้นหา user หรือ index ที่ต้องการดึงข้อมูล
    let selectedIndex = users.findIndex(user => user.id == id);

    res.json(selectedIndex)

})

//path: PUT /user/:id ใช้สำหรับการอัพเดทข้อมูล user ที่มี id ตามที่ระบุ
app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    let updateUser = req.body;  
    let selectedIndex = users.findIndex(user =>  user.id == id)
        users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname;
        users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname;
        users[selectedIndex].age = updateUser.age  || users[selectedIndex].age;
        users[selectedIndex].gender = updateUser.gender || users[selectedIndex].gender;
    

    res.json({
        message: 'Update user successfully',
        data:   {
    
            user: updateUser,
            indexUpdated: selectIndex
        }
    });
})

///path: DELETE /user/:id ใช้สำหรับการลบข้อมูล user ที่มี id ตามที่ระบุ
app.delete('/user/:id', (req, res) => {
    let id = req.params.id;
    //หา index ของ user ที่ต้องการลบ
    let selectedIndex = users.findIndex(user => user.id == id);
    
    //ลบ
    users.splice(selectedIndex, 1)
    res.json({
        message: 'Delete user successfully',
        indexDeleted: selectedIndex
    })
})



app.listen(port,async function (req,res)  {
    await initMySQL();
    console.log('Http Server is running on port' +port);
});

