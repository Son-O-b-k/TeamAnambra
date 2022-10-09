import { DateTime } from 'luxon'
import { BaseModel, column , beforeSave} from '@ioc:Adonis/Lucid/Orm'
const md5 = require('md5')
export default class Admin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email:string

  @column()
  public password:string 

  @column()
  public level:number 

  @column()
 public status:number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (admin: Admin) {
    if (admin.$dirty.password) {
      admin.password = await md5(admin.password)
    }
  }
}
