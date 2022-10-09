import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Ticket extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user: number

  @column()
  public boarding_location:string 

  @column()
  public destination:string 

  @column()
  public vehicle_number:string 

  @column()
  public seat_number:number 

  @column()
  public ticket_code:string

  @column()
  public qrcode:string

  @column()
  public boarding_time:string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
