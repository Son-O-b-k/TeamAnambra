import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Admin from 'App/Models/Admin'
export default class extends BaseSeeder {
  public async run () {
    //ADMIN 
    await Admin.create({email:'driver@gmail.com' , password:'12345', level:1});
    await Admin.create({email:'reception@gmail.com' , password:'12345', level:1});
    //SUPER ADMIN
    await Admin.create({email:'manager@gmail.com' , password:'12345', level:5});
  }
}
