const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const cors = require('cors');
 
const port = 8000;
app.use(bodyParser.json());
app.use(cors());
 
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


const vallidateData = (userData) => {
    let errors =[]


    if (!userData.firstName) {
        errors.push('กรุณากรอกชื่อ')

    if (!userData.lastName) {
        errors.push('กรุณากรอกนามสกุล')
    }
    if (!userData.age) {
        errors.push('กรุณากรอกอายุ')
    }
    if (!userData.gender) {
        errors.push('กรุณาเลือกเพศ')
    }
    if (!userData.interests) {
        errors.push('กรุณาเลือกความสนใจ')
    }if (!userData.description) {
        errors.push('กรุณากรอกคำอธิบาย')
    }
    return errors
}
    
}












 
// path = GET /users สำหรับ get users ทั้งหมดที่บันทึกไว้
app.get('/users', async (req, res) => {
    const results = await conn.query('SELECT * FROM users')
    res.json(results[0])
})
 
// path = POST /users สำหรับสร้าง users ใหม่บันทึกเข้าไป
app.post('/users', async (req, res) => {
   
    try{
        let user = req.body;
            const errors = vallidateData(user)
            if(errors.length > 0){
                throw {
                    message:'กรุณากรอกข้อมูลให้ครบถ้วน',
                    errors: errors
                }
            }
        const results = await conn.query('INSERT INTO users SET ?', user)
        res.json({
            message: 'Create user successfully',
            data: results[0]
        })
    }catch(error){
        const errorMessage = error.message || 'something went wrong'
        const errors = error.errors || []
        console.error('error: ', error.message)
        res.status(500).json({
            message: errorMessage,
            errors: errors
        })
    }
})
 
// path = GET /users/:id สำหรับดึง users รายคนออกมา
app.get('/users/:id', async(req, res) => {
    try{
        let id = req.params.id;
        const results = await conn.query('SELECT * FROM users WHERE id = ?', id)
        if(results[0].length  == 0){
            throw { statusCode: 404, message: 'user not found' }
        }
        res.json(results[0][0])
    }catch(error){
        console.error('error: ', error.message)
        let statusCode = error.statusCode || 500
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })
    }
})
 
 
//path: PUT /users/:id สำหรับแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put('/users/:id', async(req, res) => {
   
    try{
        let id = req.params.id;
        let updateUser = req.body;
        const results = await conn.query(
            'UPDATE users SET ? WHERE id = ?  ', 
            [updateUser, id])
        res.json({
            message: 'Update user successfully',
            data: results[0]
        })
    }catch(error){
        console.error('error: ', error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })
    }
})
 
//path: DELETE /users/:id สำหรับลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete('/users/:id', async(req, res) => {
    try{
        let id = req.params.id;
        const results = await conn.query('DELETE from users WHERE id = ?  ', parseInt(id))
        res.json({
            message: 'Delete user successfully',
            data: results[0]
        })
    }catch(error){
        console.error('error: ', error.message)
        res.status(500).json({
            message: 'something went wrong',
            errorMessage: error.message
        })
    }
    
})
 
app.listen(port, async (req, res) => {
    await initMySQL()
    console.log('Http Server is running on port' + port)
})
