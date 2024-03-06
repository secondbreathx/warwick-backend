const {Kpi} = require('../models/kpi');
const express = require('express');
const router = express.Router();

router.get(`/`, async (req, res) =>{
    const kpiList = await Kpi.find();
    const transformedList = kpiList.map(({ _id, name, attribute }) => ({ id: _id, name, attribute }));
    if(!transformedList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(transformedList);
})

router.get('/:id', async(req,res)=>{
    const kpi = await Kpi.findById(req.params.id);
    if(!kpi) {
        res.status(500).json({message: 'The kpi with the given attribute was not found.'})
    } 
    res.status(200).send(team);
})



router.post('/', async (req,res)=>{
    let kpi = new Kpi({
        name: req.body.name,
        attribute: req.body.attribute
    })
    try {
        kpi = await kpi.save();
        if(!kpi)
        return res.status(400).send('the kpi cannot be created!')
        res.send({name : kpi.name, attribute: kpi.attribute, id: kpi.id});

    }catch(err){
        if(err.code === 11000){
            return res.status(400).json("You need to use unique kpi name or kpi attribute");
         }
    }
})


router.put('/:id',async (req, res)=> {
    const kpi = await Kpi.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            attribute: req.body.attribute
        },
        { new: true}
    )
    if(!kpi)
    return res.status(400).send('the kpi cannot be created!')

    res.send(kpi);
})

router.delete('/:id', (req, res)=>{
    Kpi.findByIdAndRemove(req.params.id).then(kpi =>{
        if(kpi) {
            return res.status(200).json({success: true, message: 'the kpi is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "kpi not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

module.exports =router;