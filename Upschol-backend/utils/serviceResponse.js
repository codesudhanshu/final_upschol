module.exports =  (body) => {
    const model = {
        status: body.status,
        result: body.result ? body.result : null,
        error: body.error ? body.error.message : null,
        version: '1.0',
        allowed: body.allowed,
    }

    return model;
};
