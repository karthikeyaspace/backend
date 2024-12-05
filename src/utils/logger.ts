const errorHandler = (error: any, from: string) => {
  let log = console.log;

  log("--------START-------");
  log("Error: ", error);

  if (from === "axios") {
    if (error.response) {
      log("Error Response: ", error.response.data);
      log("Error Response Status: ", error.response.status);
      log("Error Response Headers: ", error.response.headers);
    } else if (error.request) {
      log("Error Request: ", error.request);
    } else {
      log("Error Message: ", error.message);
    }
    log(error.toJSON());
  } else if (from === "firebase") {
    log("Error Code: ", error.code);
    log("Error Message: ", error.message);
  } else if (from === "express") {
    log("Error Message: ", error.message);
  } else {
    log("Error Message: ", error.message);
  }

  log("---------END-------", from);
};

export { errorHandler };
