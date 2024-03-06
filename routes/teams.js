const {Team} = require('../models/team');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const teamList = await Team.find();
    const transformedList = teamList.map(({ _id, name, number }) => ({ id: _id, name, number }));
    if(!transformedList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(transformedList);
});

router.get('/:id', async(req,res)=>{
    const team = await Team.findById(req.params.id);
    if(!team) {
        res.status(500).json({message: 'The team with the given number was not found.'})
    } 
    res.status(200).send(team);
})

router.post('/', async (req,res)=>{
    let team = new Team({
        name: req.body.name,
        number: req.body.number
    })

    try {
        team = await team.save();
        if(!team)
        return res.status(400).send('the team cannot be created!')
        res.send({name : team.name, number: team.number, id: team.id});

    }catch(err){
        if(err.code === 11000){
            return res.status(400).json("You need to use unique team name or team number");
         }
    }
})


router.put('/:id',async (req, res)=> {
    const team = await Team.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            number: req.body.number
        },
        { new: true}
    )

    if(!team)
    return res.status(400).send('the team cannot be created!')

    res.send(team);
})

router.delete('/:id', (req, res)=>{
    Team.findByIdAndRemove(req.params.id).then(category =>{
        if(team) {
            return res.status(200).json({success: true, message: 'the team is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "team not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

module.exports =router;