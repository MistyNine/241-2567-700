const BASE_URL = 'http://localhost:8000'
window.onload = async () => {
    await loadData()
}

const loadData = async () => {
    console.log('user page onload')
    //1. load all user จาก API ที่เราสร้างไว้
    const response = await axios.get (`${BASE_URL}/users`)
    console.log( response.data )

    const userDOM = document.getElementById('user')
    //2.นำ user ทั้งหมด load กลับเข้าไป html 
    
    let htmlData = '<div>'
    for(let i = 0; i < response.data.length; i++){
    let user = response.data[i]
    htmlData += `<tr> 
        <td>${user.id}</td>
        <td>${user.firstname}</td>
        <td>${user.lastname}</td>
        <td>${user.age}</td>
        <td>${user.gender}</td>
        <td>${user.interests}</td>
        <td>${user.description}</td>
        <td>
            <a href='index.html?id=${user.id}'><button class='edit'>Edit</button></a>    
            <button class='delete' data-id='${user.id}'>Delete</button>
        </td>
    </tr>  `;
    }
    htmlData += `</div >`
    userDOM.innerHTML = htmlData

    //3. ให้ปุ่ม Delete ทำงาน
    const deleteDOM = document.getElementsByClassName('delete')
    for(let i = 0; i < deleteDOM.length; i++){
    deleteDOM[i].addEventListener('click', async (event) => {
        //ดึง id ของ user ที่ต้องการลบ
        const id =  event.target.dataset.id
        try{
            await axios.delete(`${BASE_URL}/users/${id}`)
            loadData()// recusive function คือ การเรียก function ตัวเอง 
        }catch(error){
            console.log('error',error);
            
      }
    })
}
}