import { DateTime } from 'luxon'
import { BaseModel, column , beforeSave} from '@ioc:Adonis/Lucid/Orm'
const md5 = require('md5')
export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public firstname:string

  @column()
  public lastname:string

  @column()
  public profile:string

  @column()
  public email:string

  @column()
  public password:string

  @column()
  public username:string

  @column()
  public new_pwd_code:string

  @column()
  public new_pwd_code_expire:number

  @column()
  public reg_type:string

  @column()
  public settings:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await md5(user.password)
    }
    user.settings=JSON.stringify({"phone_alert":true , "email_alert":true})
  }

}
