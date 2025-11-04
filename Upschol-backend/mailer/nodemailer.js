
var aws = require('aws-sdk');
var rn = require('random-number');
var options = {
	min: 100000,
	max: 999999,
	integer: true
};

var ses = new aws.SES({
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	},
	region: process.env.AWS_REGION
});
const header = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>Verify Email</title><style>html,body{height:100%;width:100%;padding:0;margin:0}</style></head><body style="background-color: #fff; color: #2F4858; "><div style="color: #1890ff; font-size: 35px; padding: 20px 0; width: 100%;"><div style="border-bottom: 4px #5e72e4 solid; padding: 0 0 10px 10px; margin: 0 20px;"> 
    
<span style="padding: 20px; font-size: 20px;"><strong>UpSchol</strong></span></div></div>`;



function send(email, subject, data, dataType, source) {
	let body = {};
	if (dataType === 'HTML')
		body = {
			Html: {
				Data: data
			}
		};
	else if (dataType === 'TEXT')
		body = {
			Text: {
				Data: data
			}
		};
	var params = {
		Source: source,
		Destination: {
			ToAddresses: email,
		},
		Message: {
			Subject: { /* required */
				Data: subject
			},
			Body: body
		}
	};


	return ses.sendEmail(params).promise();
}

export async function sendEnquiryEmail(toAddress, full_name, school_name) {
	try {
		let data = `${header}<div style="padding: 20px; font-size: 20px;"><div style="margin-top: 30px;"><h2>New Enquiry Added </h2> Hey,<br/>A new Enquiry is added by ${full_name} of ${school_name}<br/> <br/><br/></div><div>Cheers,<br/>Team UpSchol</div></div></body></html>`;
		if (toAddress) {
			for (let i = 0; i < toAddress.length; i++) {
				let arr = [toAddress[i].email];
				send(arr, 'UpSchol', data, 'HTML', process.env.SES_EMAIL_NOREPLY);
			}
		}
		return true;
	} catch (error) {
		console.log(error)
		return false;
	}

}

export async function sendOTP(toAddress) {
	try {

		let otp = rn(options);
		let data = `${header}<div style="padding: 20px; font-size: 20px;"><div style="margin-top: 30px;"><h2>Your OTP </h2> Hey,<br/>Your one time verification code for UpSchol is ${otp}<br/> <br/><br/></div><div>Cheers,<br/>Team UpSchol</div></div></body></html>`;


		await send(toAddress, 'UpSchol', data, 'HTML', process.env.SES_EMAIL_NOREPLY);
		console.log('email for otp sent successfully ', otp);
		return otp;
	} catch (err) {
		console.log(err)
	}
}

export async function sendScholarShipEmail(users, form_data, response) {
	try {
		let formDataHTML = '';
		for (const key in form_data) {
			if (form_data.hasOwnProperty(key)) {
				formDataHTML += `<strong>${key}:</strong> ${form_data[key]}<br>`;
			}
		}

		let responseHTML = '';
		response.forEach(question => {
			responseHTML += `<div>
                        <strong>Question:</strong> ${question.question}<br>
                        <strong>Selected Option:</strong> ${question.selectedOption}<br>
                    </div>`;
			if (question.textInputValue) {
				responseHTML += `<strong>Text Input Value:</strong> ${question.textInputValue}<br>`;
			}
			responseHTML += '<br>';
		});

		let data = `${header}<div style="padding: 20px; font-size: 20px;"><div style="margin-top: 30px;"><h2>New Scholarship Requested </h2> Hey,<br/>A new Scholarship is Request with following details <br>${formDataHTML} <br><h3>Question Responses:</h3>
		${responseHTML} <br/> <br/><br/></div><div>Cheers,<br/>Team UpSchol</div></div></body></html>`;
		if (users) {
			let arr = [];
			for (let i = 0; i < users.length; i++) {
				arr.push(users[i].email);
			}
			send(arr, 'UpSchol', data, 'HTML', process.env.SES_EMAIL_NOREPLY);
		}

		return true;
	} catch (error) {
		console.log(error)
		return false;
	}
}


export async function sendEnquiryNotification({ name, email, phoneNumber, course, location, college }) {
    const recipientEmail = "upscholindia@gmail.com";
    const subject = "New Enquiry in UpSchol.com";
    const message = `Name: ${name},\nCourse: ${course},\nCollege: ${college},\nEmail: ${email},\nPhone: ${phoneNumber},\nLocation: ${location}`;

    const params = {
        Source: process.env.SES_EMAIL_NOREPLY,
        Destination: {
            ToAddresses: [recipientEmail],
        },
        Message: {
            Subject: { Data: subject },
            Body: {
                Text: { Data: message }
            }
        }
    };

    try {
        await ses.sendEmail(params).promise();
        console.log(`Enquiry email sent successfully. ${params.Destination.ToAddresses}`);
    } catch (error) {
        console.error("Error sending enquiry email:", error);
    }
}

export async function sendEnquiryNotificationmaninmims({ name, email, phoneNumber, location, college }) {
    const recipientEmail = "upscholindia@gmail.com";
    const subject = "New Enquiry in UpSchol.com";
    const message = `Name: ${name},\nCollege: ${college},\nEmail: ${email},\nPhone: ${phoneNumber},\nLocation: ${location}`;

    const params = {
        Source: process.env.SES_EMAIL_NOREPLY,
        Destination: {
            ToAddresses: [recipientEmail],
        },
        Message: {
            Subject: { Data: subject },
            Body: {
                Text: { Data: message }
            }
        }
    };

    try {
        await ses.sendEmail(params).promise();
        console.log(`Enquiry email sent successfully. ${params.Destination.ToAddresses}`);
    } catch (error) {
        console.error("Error sending enquiry email:", error);
    }
}

export async function sendEnquiryNotificationgetintouch({ lead }) {
    const recipientEmail = "upscholindia@gmail.com";
    const subject = "New Enquiry in UpSchol.com";
    const message = `${lead}`;

    const params = {
        Source: process.env.SES_EMAIL_NOREPLY,
        Destination: {
            ToAddresses: [recipientEmail],
        },
        Message: {
            Subject: { Data: subject },
            Body: {
                Text: { Data: message }
            }
        }
    };

    try {
        await ses.sendEmail(params).promise();
        console.log(`Enquiry email sent successfully. ${params.Destination.ToAddresses}`);
    } catch (error) {
        console.error("Error sending enquiry email:", error);
    }
}

async function sendEnquiryNotificationamity({ first_name, last_name, email, phoneNumber, course, college, location}) {
    const recipientEmail = "upscholindia@gmail.com";
    const subject = "New Enquiry in UpSchol.com";
    const message = `Name: ${first_name} ${last_name},\nCourse: ${course},\nCollege: ${college},\nEmail: ${email},\nPhone: ${phoneNumber},\nLocation: ${location}`;

    const params = {
        Source: process.env.SES_EMAIL_NOREPLY,
        Destination: {
            ToAddresses: [recipientEmail],
        },
        Message: {
            Subject: { Data: subject },
            Body: {
                Text: { Data: message }
            }
        }
    };

    try {
        await ses.sendEmail(params).promise();
        console.log(`Enquiry email sent successfully. ${params.Destination.ToAddresses}`);
    } catch (error) {
        console.error("Error sending enquiry email:", error);
    }
}

export default sendEnquiryNotificationamity