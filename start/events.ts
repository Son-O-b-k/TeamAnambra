/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Event from '@ioc:Adonis/Core/Event'
import Mail from '@ioc:Adonis/Addons/Mail'
import Application from '@ioc:Adonis/Core/Application'
Event.on('send_ticket', async (user) => {
  try{
  await  Mail.send((message)=>{
    
    message.embed(Application.appRoot + "/app/Uploads/images/email_images/check-icon.png",
        'check'
        )
    message.embed(Application.appRoot + "/app/Uploads/images/email_images/facebook2x.png",
        'facebook2x'
        )
    message.embed(Application.appRoot + "/app/Uploads/images/email_images/twitter2x.png",
        'twitter2x'
        )
    message.embed(Application.appRoot + "/app/Uploads/images/email_images/instagram2x.png",
        'instagram2x'
        )
    message
    .from('support@anm.com','Anambra')
    //.from('successonyegbanokwu@gmail.com','Proudly Anambra')
    .to(user.email)
    //.to('sonobktech@gmail.com')
    .subject('Order Placement')
    .htmlView('ticket',{
      qrcode:user.qrcode
    })
  })
}catch(e){
  console.log(e)
}
})