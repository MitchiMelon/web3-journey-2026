type statusResponse = 

  | { status: 'ok'; data: unknown }
  | { status: 'error'; message: string }
  | Error;

function getRpcMessage(result: statusResponse) {
    if (!("status" in result)) {
        return result.message;
    }
    if (result.status === "ok") {
        return "Success";
    } else {
        return result.message
    }
}

console.log(getRpcMessage({ status: 'error', message: 'Insufficient funds' }));
console.log(getRpcMessage(new Error('Network timeout')));                      
console.log(getRpcMessage({ status: 'ok', data: { block: 123 } }));  
