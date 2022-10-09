const qrcode = require('qrcode');
const crypto = require('crypto')
import Ticket from "App/Models/Ticket";
async function generateQRcode(ticket_info:string){
	const options={
		errorCorrectionLevel:"H",
		type:'terminal',
		quality:0.95,
		margin:1,
		color:{dark:'#039BE5',light:'#FFF'}
	}

	const d:string = await qrcode.toDataURL(ticket_info,options);
	return d;
}

async function generateTicketCode(){
	
	let code:string =  await crypto.randomBytes(5).toString("hex");
	if(code){
		let exist:any = await Ticket.findBy('ticket_code',code)
		if(exist?.id){
			return generateTicketCode();
		}else{
			return code;
		}
	}
}


export {
	generateQRcode,
	generateTicketCode
}