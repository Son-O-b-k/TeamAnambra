/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

//METHOD FOR USERS CONTROLLER
Route.post('api/user_login' , 'UsersController.login')
Route.get('api/user_logout', 'UsersController.logout')
Route.post('api/user_register' , 'UsersController.register')
Route.post('api/buy_ticket' , 'UsersController.buyTicket')
Route.get('api/my_tickets' , 'UsersController.viewMyTickets')
Route.get('api/my_data', 'UsersController.fetchUserData')

//ROUTE FOR ADMINCONTROLLER 
Route.post('api/admin_login' , 'AdminsController.login')
Route.get('api/admin_logout' , 'AdminsController.logout')
Route.post('api/admin_create_admin', 'AdminsController.createAdmin')
Route.get('api/update_admin_level/:admin/:level' , 'AdminsController.updateLevel')
Route.get('api/verify_ticket/:ticket_code', 'AdminsController.verifyTicket')
Route.get('api/view_tickets/:page' , 'UsersController.viewTicket')
Route.get('api/delete_ticket/:ticket' , 'UsersController.deleteTicket');

Route.get('/', async () => {
  return { hello: 'world' }
})
