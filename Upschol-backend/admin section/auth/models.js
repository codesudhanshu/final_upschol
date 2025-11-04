import md5 from 'md5'
export const patientRegistrationModel = (body) => {
    try {

        const model = {
            PATIENT_CODE: body.PATIENT_CODE,
            EMAIL: body.EMAIL,
            PHONE: body.PHONE,
            PASSWORD: md5(body.PHONE),
            VERIFY: 1
        }
        return model
    }
    catch (error) {
        throw error
    }
} 