import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
const md5 = require('md5')
import { schema , rules } from '@ioc:Adonis/Core/Validator'
import User from "App/Models/User"
const log = require("log-to-file")
import Application from '@ioc:Adonis/Core/Application'
import { generateQRcode , generateTicketCode} from 'App/Services/Generators'
import Ticket from 'App/Models/Ticket'
import Event from '@ioc:Adonis/Core/Event'
export default class UsersController {
    /**
     * 
     * FUNCTION FOR USER LOGIN
     */
    public async login({request,auth,response}:HttpContextContract){
        try {
            //START VALIDATION
            await request.validate({schema:schema.create({
                email: schema.string({trim:true} , [rules.required() , rules.maxLength(50) , rules.email()]),
                password: schema.string({trim:true} , [rules.required() , rules.maxLength(100)])
            })});

            //AFTER SUCCESSFUL INPUT VALIDATION
        const user = await User.findBy('email',request.input("email"));
        if(user){
       
            let api_usersToken: object;
             const password = await md5(request.input("password"));
                if (password === user.password) {
                    try {
                         api_usersToken = await auth.use("api_users").generate(user, { expiresIn: '2 day' });
                    }
                    catch (e) {
                      //  console.log(e);
                        return response.json({ error: true, message: "Token Generation Failed" });
                    }
                }
                else {
                    return response.json({ error: true, message: "Invalid email or password" });
                }
             /***/
           
            return response.json({ error: false, token: api_usersToken, user: user})    
        }
        else{
            return response.json({ error: true, message: "User does not exist" })
        }

        } catch (e) {
            await log(JSON.stringify({
                "CONT": "UsersController", 
                "FUNC": "login", 
                "MESSAGE": e.message }),
             Application.appRoot + "/app/Uploads/error_log", '\r\n')

            return response.json({error:true , message:'An error occured'})
        }
    }
    /**
     * USER REGISTRATION FUNCTION
     */
  
    public async register({request,auth,response}:HttpContextContract){
        try {
            await request.validate({schema:schema.create({
                firstname: schema.string({trim:true} , [rules.required()]),
                lastname: schema.string({trim:true} , [rules.required()]),
                email : schema.string({trim:true} , [rules.required()]),
                password:schema.string({trim:true} , [rules.required()])
            })})
           //CHECK IF THE EMAIL ALREADY EXIST 
           let check_user = await User.findBy('email', request.input('email'));
           if(check_user){
               return response.json({error:true , message:'The email has been used.'})
           }
           //REGISTER THE ACCOUNT
            let user = await User.create({
                firstname : request.input('firstname'),
                lastname : request.input('lastname'),
                password : request.input('password'),
                email : request.input('email')
            });
            if(user.$isPersisted){
                const token = await auth.use("api_users").generate(user,{expiresIn:'100days'});
                return response.json({error:false, token:token,user:user})
            }else{
                return response.json({error:true , message:'Account creation failed'})
            }
        } catch (e) {
            await log(JSON.stringify({
                "CONT": "UsersController", 
                "FUNC": "login", 
                "MESSAGE": e.message }),
             Application.appRoot + "/app/Uploads/error_log", '\r\n')

            return response.json({error:true , message:'An error occured'})
        }
    }
    /**
     * FUNCTION FOR TICKET PURCHASE ASSUMING A SUCCESSFUL PAYMENT
     */
    public async buyTicket({request,auth,response}:HttpContextContract){
        try {
            try{
            let user = await auth.use('api_users').authenticate();
            if(user){
                //VALIDATE USER DATA 
                try{
                    await request.validate({schema:schema.create({
                        destination:schema.string({trim:false},[rules.required(), rules.maxLength(100)]),
                        boarding_location:schema.string({trim:false},[rules.required(), rules.maxLength(100)]),
                        vehicle_number:schema.string({trim:true},[rules.required(), rules.maxLength(50)]),
                        seat_number:schema.number([rules.required()]),
                        boarding_time:schema.string([rules.required()])
                    })})
                    let ticket_code:string = await generateTicketCode();
                    let ticket = new Ticket;
                    ticket.user = user.id;
                    ticket.boarding_location = request.input('boarding_location');
                    ticket.destination = request.input('destination');
                    ticket.vehicle_number = request.input('vehicle_number');
                    ticket.boarding_time = request.input('boarding_time')
                    ticket.seat_number = request.input('seat_number');
                    ticket.ticket_code = ticket_code;
                    let ticket_text:string = `User ID:${user.id}, TICKET ID:${ticket_code} , EMAIL:${user.email}, NAME:${user.firstname} ${user.lastname}, DESTINATION:${ticket.destination}, VEHICLE NO:${ticket.vehicle_number}, SEAT NO:${ticket.seat_number}, BOARDING TIME:${ticket.boarding_time}`
                    ticket.qrcode = await generateQRcode(ticket_text);
                    await ticket.save();
                    Event.emit('send_ticket',{email:user.email, qrcode:ticket.qrcode});
                    return response.status(200).json({error:false, message:'Ticket purchased'})
                }catch{return response.json({error:true , message:'Please check your inputs'});}
            }else{
                return response.status(401);
            }
        }catch{return response.status(401);}

        } catch (e) {
            await log(JSON.stringify({
                "CONT": "UsersController", 
                "FUNC": "fetchUserData", 
                "MESSAGE": e.message }),
             Application.appRoot + "/app/Uploads/error_log", '\r\n')
             return response.json({error:true, message:'An error occured'})
        }
    }

    /**
     * USER VIEW THEIR PURCHASED TICKETS
     */
    public async viewMyTickets({auth,response}:HttpContextContract){
        try {
            try{
                let user = await auth.use('api_users').authenticate();
                if(user){
                    let tickets = await Ticket.query().select('*').where('user','=',user.id);
                    return response.json({error:false, message:tickets})
                }else{
                    return response.json({error:true , message:'Invalid account'})
                }
            }catch{return response.status(401);}
        } catch (e) {
            await log(JSON.stringify({
                "CONT": "UsersController", 
                "FUNC": "viewMyTickets", 
                "MESSAGE": e.message }),
             Application.appRoot + "/app/Uploads/error_log", '\r\n')
             return response.json({error:true, message:'An error occured'})
        }
    }

    /**
     * FETCH USER INFORMATION 
     */
    public async fetchUserData({auth,response}:HttpContextContract){
        try {
            let data = await auth.use('api_users').authenticate()
            return response.json({error:false, message:data})
        } catch (e) {
            await log(JSON.stringify({
                "CONT": "UsersController", 
                "FUNC": "fetchUserData", 
                "MESSAGE": e.message }),
             Application.appRoot + "/app/Uploads/error_log", '\r\n')
             return response.json({error:true, message:'An error occured'})
        }
    }
}
