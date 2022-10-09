import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema , rules } from '@ioc:Adonis/Core/Validator'
import Application from '@ioc:Adonis/Core/Application'
const md5 = require('md5')
import Admin from 'App/Models/Admin'
import Ticket from 'App/Models/Ticket'
const log = require("log-to-file")

export default class AdminsController {

    /**
	**ADMIN LOGIN
	**/
	public async login({request,auth,response}:HttpContextContract){
        try{
            //START VALIDATION
            await request.validate({schema:schema.create({
                email: schema.string({trim:true} , [rules.required() , rules.maxLength(50) , rules.email()]),
                password: schema.string({trim:true} , [rules.required() , rules.maxLength(100)])
            })});
    
            //AFTER SUCCESSFUL INPUT VALIDATION
            const user = await Admin.findBy('email',request.input("email"));
            if(user){
           
                let apiToken: object;
                 const password = await md5(request.input("password"));
                    if (password === user.password) {
                        try {
                             apiToken = await auth.use("api").generate(user, { expiresIn: '2 day' });
                           // return response.json({ error: false, message: token.tokenHash, email: user.email, id: user.id, uuid: user.uuid });
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
               
                return response.json({ error: false, token: apiToken, user: user})    
            }
            else{
                return response.json({ error: true, message: "User does not exist" })
            }
        }catch(e){
          await log(JSON.stringify({
                 "CONT": "AdminsController", 
                 "FUNC": "login",
                  "MESSAGE": e.message
                   }), Application.appRoot + "/app/Uploads/error_logs/mylogs", '\r\n')
            return response.json({ error:true , message:'Login error, check details'})
        }
    }
    /**
     * 
     * CREATE ADMIN
     */
    public async createAdmin({request,auth,response}:HttpContextContract){
        try {
            await auth.use('api').authenticate();
            await request.validate({schema:schema.create({
                email : schema.string({trim:false} , [rules.required()]),
                password : schema.string({trim:false}, [rules.required()]),
                level : schema.number.nullableAndOptional()
            })})

            await Admin.create({
                email : request.input('email'),
                password : request.input('password'),
                level : request.input('level')
            })
             return response.json({error:false, message:'Admin added'})
        } catch (e) {
            await log(JSON.stringify({
                "CONT": "AdminsController", 
                "FUNC": "createAdmin",
                 "MESSAGE": e.message
                  }), Application.appRoot + "/app/Uploads/error_logs/mylogs", '\r\n')
           return response.json({ error:true , message:'Admin creation failed'})
        }
    }

    /**
	 * 
	* ADMIN LOGOUT
	 */
	public async logout({auth,response}:HttpContextContract){
		try {
			await auth.use('api').logout();
			return response.json({error:false , message:'Logged out successfully'})
		} catch (e) {
			await log(JSON.stringify({
				"CONT": "EventsController", 
				"FUNC": "logout",
				 "MESSAGE": e.message
				  }), Application.appRoot + "/app/Uploads/error_logs/mylogs", '\r\n')
		   return response.json({ error:true , message:'Could not logout'})
		}
	}

    /**
     * UPDATE ADMIN LEVEL 
     */
    public async updateLevel({params,auth,response}:HttpContextContract){
        try {
            await auth.use('api').authenticate()
            if(params.admin && params.level){
                let admin:any = await Admin.find(params.admin);
                if(admin && admin.id!==params.admin){
                    admin.level = params.level;
                    await admin.save();
                    return response.json({error:false , message:'Admin level updated'})
                }else{
                    return response.json({error:true , message:'Invalid request'})
                }
            }
        } catch (e) {
            await log(JSON.stringify({
				"CONT": "AdminsController", 
				"FUNC": "updateLevel",
				 "MESSAGE": e.message
				  }), Application.appRoot + "/app/Uploads/error_logs/mylogs", '\r\n')
		   return response.json({ error:true , message:'Invalid request'})
        }
    }
//AVAILABLE FOR ORDINARI ADMIN S
    public async verifyTicket({params,auth,response}:HttpContextContract){
        try {
            await auth.use('api').authenticate();
            let ticket = await Ticket.findBy('ticket_code', params.ticket_code);
            if(ticket){
                return response.json({error:false, message:ticket})
            }else{
                return response.json({error:true , message:'Invalid ticket'})
            }
        } catch (e) {
            await log(JSON.stringify({
				"CONT": "AdminsController", 
				"FUNC": "verifyTicket",
				 "MESSAGE": e.message
				  }), Application.appRoot + "/app/Uploads/error_logs/mylogs", '\r\n')
		   return response.status(401).json({ error:true , message:'Invalid request'})
        }
    }
//AVAILABLE FOR SUPER ADMINS
    public async viewTicket({params,auth,response}:HttpContextContract){
        try {
            let admin = await auth.use('api').authenticate();
            if(admin.level==5){
                let tickets = await Ticket.query().select('*').paginate(params.page,10)
                return response.json({error:false, response:tickets})
            }else{
                return response.status(201).json({error:true, message:'You do not have the permission'})
            }
        } catch (e) {
            await log(JSON.stringify({
				"CONT": "viewTicket", 
				"FUNC": "updateLevel",
				 "MESSAGE": e.message
				  }), Application.appRoot + "/app/Uploads/error_logs/mylogs", '\r\n')
		   return response.status(401).json({ error:true , message:'Invalid request'})
        }
    }

//AVAILABLE FOR SUPER ADMINS
    public async deleteTicket({params,auth,response}:HttpContextContract){
        try {
            let admin = await auth.use('api').authenticate()
            if(admin.level==5){
                await Ticket.query().where('ticket','=',params.ticket)
                return response.json({error:false, message:'Ticket removed'})
            }else{
                return response.status(401).json({error:true, message:'You do not have the permission'})
            }
            let tickets = await Ticket.query().select('*').paginate(params.page,10)
            return response.json({error:false, response:tickets})
        } catch (e) {
            await log(JSON.stringify({
                "CONT": "viewTicket", 
                "FUNC": "deleteTicket",
                "MESSAGE": e.message
                }), Application.appRoot + "/app/Uploads/error_logs/mylogs", '\r\n')
        return response.status(401).json({ error:true , message:'Invalid request'})
        }
    }

}
