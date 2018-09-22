const express = require("express");
const router = express.Router();
const request = require("request-promise");

const admin = require("firebase-admin");

router.post("/", async ({ body: {userToken} }, res) => {
    const options = {
        url : "https://kapi.kakao.com/v1/user/me",
        headers: {'Authorization' : "Bearer " + userToken}
    }
    
    try {
        const response = await request(options);
        const userData = JSON.parse(response);
        userData.uuid = "Kakao_" + userData.uuid;
        const customToken = await admin.auth().createCustomToken(userData.uuid);
        res.status(200).send({token : customToken, userData: userData});
    } catch(e) {
        res.status(400).send(e);
    }
});

module.exports = router;