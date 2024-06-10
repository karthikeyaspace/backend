function errorHandler(error, name, from){
    let loggerFunction = console.log

    loggerFunction("--------START-------");
    loggerFunction("Error: ", error);

    if(from === 'axios'){
        if(error.response){
            loggerFunction("Error Response: ", error.response.data);
            loggerFunction("Error Response Status: ", error.response.status);
            loggerFunction("Error Response Headers: ", error.response.headers);
        }
        else if(error.request){
            loggerFunction("Error Request: ", error.request);
        }
        else{
            loggerFunction("Error Message: ", error.message);
        }
        loggerFunction(error.toJSON());
    }
    else if(from === 'firebase'){
        loggerFunction("Error Code: ", error.code);
        loggerFunction("Error Message: ", error.message);
    }
    else if(from === 'express'){
        loggerFunction("Error Message: ", error.message);
    }
    else{
        loggerFunction("Error Message: ", error.message);
    }

    loggerFunction("---------END-------");
}

module.exports = {
    errorHandler
}