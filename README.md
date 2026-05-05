# C TRACK APP

Building an application that will handle consignment delivery to it various destination and ensure that the recipient recieved same in good condition and where there's service failure all parties will be notify.

## Requirements

- Authentication: Bcrypt, jsonwebtoken, express-validator, Middleware
- Email service: nodemailer
- Logging: FS or Pino 
- External API: axios or fetch
- Frontend and Backend Connection: react-native
-  Caching: redis
- Websockets: socket.io node http
- Testing: jest
- Database - sequelize and mysql2
- Error handling
- RBAC
- CORS

## API ENDPOINTS
- localhost:4000/api/banks(GET Method)
- http://localhost:4000/api/order(POST Method)
- http://localhost:4000/api/chipdifference?bank=ACB(GET Method by :id)
- http://localhost:4000/api/auth/register(POST Method)
- http://localhost:4000/api/auth/getemailotp(POST Method)
- http://localhost:4000/api/auth/signin(POST Method)
- http://localhost:4000/api/admin/all-user(GET Method)
- http://localhost:4000/api/admin/all-order(GET Method)
- http://localhost:4000/api/admin/all-delivery(GET Method)
- http://localhost:4000/api/admin/all-chipsdifference?bank=FBN(GET Method by :id)
- http://localhost:4000/api/admin/all-info(GET Method)
- http://localhost:4000/api/admin/uuid(DELETE Method)
- http://localhost:4000/api/auth/forgotpassword(POST Method)
- http://localhost:4000/api/auth/signout(POST Method)