import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
export default class extends BaseSeeder {
  public async run () {
    await User.create({firstname:'Success', lastname:'Onyegbanokwu', email:'sonobktech@gmail.com',password:'12345'})
    // Write your database queries inside the run method
  }
}
