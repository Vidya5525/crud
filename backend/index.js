import express from 'express';
import users from './MOCK_DATA.json' assert { type: 'json' };
import fs from 'fs';
const app = express();
const PORT = 5000;

app.use(express.urlencoded({extended:false}));
app.use(express.json()); 


//Routes

app.get('/api/users',(req,res)=>{
    return res.json(users);

});

app.post('/api/users/new',(req,res)=>{
    const body = req.body;
    users.push({...body, id: users.length + 1});
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(err)=>{
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Failed to save user' });
        }
        return res.json({status:'success',id:users.length});
    })
    

})

app.route('/api/users/:id')
.get((req,res)=>{
    const id = Number(req.params.id);
    const user = users.find(item=>item.id === id);
    if(!user){
        return res.json({ status: 'error', message: 'user not found' });
    }
    return res.json(user);
})
.put((req,res)=>{
    const id = Number(req.params.id);
    const index = users.findIndex(item=>item.id === id);

    users[index] = { ...users[index], ...req.body };

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Failed to update user' });
        }
        return res.json({ status: 'success', user: users[index] });
    })

})
.delete((req,res)=>{
    const id = Number(req.params.id);
    const index = users.findIndex(item=>item.id === id);

    users.splice(index,1)

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: 'Failed to delete user' });
        }
        return res.json({ status: 'success', message: `User with id ${id} deleted` });
    });

})



app.listen(PORT,()=>{
    console.log(`the port is running ${PORT}`);
});