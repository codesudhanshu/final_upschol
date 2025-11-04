export const patientCodeIncrementer = (previousId) => {
    let inputString = previousId;

    // Extract the numerical part from the string
    let numericPart = parseInt(inputString.match(/\d+/)[0]);

    // Increment the numerical part
    numericPart++;

    // Ensure the numeric part is at least of length 5
    let formattedNumericPart = numericPart.toString().padStart(4, '0');

    // Create the new string with the incremented value
    let incrementedString = inputString.replace(/\d+/, formattedNumericPart);

    return incrementedString;
};

export const doctorCodeIncrementer = (previousId) => {
    let inputString = previousId;

    // Extract the numerical part from the string
    let numericPart = parseInt(inputString.match(/\d+/)[0]);

    // Increment the numerical part
    numericPart++;

    // Ensure the numeric part is at least of length 5
    let formattedNumericPart = numericPart.toString().padStart(4, '0');

    // Create the new string with the incremented value
    let incrementedString = inputString.replace(/\d+/, formattedNumericPart);

    return incrementedString;
};


export const AppointmentCodeIncrementor = (previousId) => {
    let inputString = previousId;

    // Extract the numerical part from the string
    let numericPart = parseInt(inputString.match(/\d+/)[0]);

    // Increment the numerical part
    numericPart++;

    // Ensure the numeric part is at least of length 5
    let formattedNumericPart = numericPart.toString().padStart(4, '0');

    // Create the new string with the incremented value
    let incrementedString = inputString.replace(/\d+/, formattedNumericPart);

    return incrementedString;
};