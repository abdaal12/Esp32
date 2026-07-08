const express =
require("express");

const router =
express.Router();

const axios =
require("axios");

router.get(
"/status",
async (req,res)=>
{
    try
    {
        const result =
        await axios.get(
        "http://ESP32_IP/device-status"
        );

        res.json(
        result.data
        );
    }
    catch(err)
    {
        res.status(500)
        .json({
            success:false
        });
    }
});

module.exports =
router;