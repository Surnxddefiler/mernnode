const { Router } = require('express');
const Nicotine = require('../models/nicotine.model')
const router = Router()

router.put('/updateamount', async (req, res) => {
    const { arr } = req.body
    try {
        for (const el of arr) {
            const found = await Nicotine.findOne({ 'product.name': el.name, 'product.mark': el.mark, 'product.nicotine': el.nicotine });
            if (found) {
                found.product.forEach((product) => {
                    if (product.name === el.name) {
                            const index = found.product.indexOf(product)
                            if (index > -1) {
                                found.product.splice(index, 1)
                            }
                    }
                });
                await found.save();
            }
        }
    }
    catch (e) {
        res.status(500).json({ message: `${e}` })
    }
})

router.put('/changecost', async(req, res)=>{
    try{
        const {e}=req.body
        const type=e.type
        const name=e.name
        const cost=e.cost
        const existingRecord = await Nicotine.findOne({ type});
        if(existingRecord){
            existingRecord.product.forEach((obj)=>{
                if (obj.name===name) {
                    obj.cost=cost
                }
            })
        }
        await existingRecord.save()

    }
    catch(e){

    }
})

router.post('/postProduct', async (req, res) => {
    try {
        const {e} = req.body;
        const type=e.type
        const existingRecord = await Nicotine.findOne({ type });
        existingRecord.product.push({
            name: e.name,
            nicotine: e.nicotine,
            cost: e.cost,
            mark: e.mark,
            ammount: e.ammount,

        })
        await existingRecord.save();
    }
    catch (e) {
        res.status(500).json({ message: `${e}` })
    }
})




router.get('/', async (req, res) => {
    try {
        const nicotine = await Nicotine.find({});
        console.log(nicotine)
        res.json({ data: nicotine })
    }
    catch (e) {
        res.status(500).json({ message: 'pizdec' })
    }
})
router.get('/:id', async (req, res) => {
    try {
        const nicotine = await Nicotine.findById(req.params.id);
        console.log(nicotine)
        res.json({ data: nicotine })
    }
    catch (e) {
        res.status(500).json({ message: 'pizdec' })
    }
})

module.exports = router