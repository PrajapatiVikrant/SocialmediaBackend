import { Router } from "express";
import profile from "../Controller/profile.controller.js";
import JWTverify from "../Middleware/JWTverify.js";
const route = Router();

route.get('/',JWTverify,profile.getProfile)
route.get('/otherprofile/:email',profile.showOtherProfile);
route.get('/:id',profile.showProfileByid);
route.put('/:user_id',profile.editProfile)
route.get('/connectionStatus/:user_id',JWTverify,profile.checkConnectionStatus)
route.post('/connectreq/:user_id',JWTverify,profile.sendConnectionReq)
route.get('/connection/:user_id',profile.ShowConnection);
route.post('/connect/:user_id/:user_name',JWTverify,profile.CreateConnection);




export default route;