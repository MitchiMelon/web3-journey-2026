type ApiResponse<T> =
  | {status: "success"; data: T; timestamp: number}
  | {status: "error"; error: string; code: number; timestamp: number}
  | {status: "redirect"; url: string; timestamp: number};

function isSuccess<T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & {status: "success"} {
  return response.status === "success";
}

function handleResponse<T>(response: ApiResponse<T> & {status: "success"}): T;
function handleResponse<T>(response: ApiResponse<T> & {status: "error"}): never;
function handleResponse<T>(response: ApiResponse<T> & {status: "redirect"}): string;

function handleResponse<T>(response: ApiResponse<T>): T | string {
  if (response.status === "success") {
    return response.data;                  
  } else if (response.status === "error") {
    throw new Error(`${response.error} (${response.code})`);
  } else {
    return `Redirecting to ${response.url}`;
  }
}

function freezeResponse<T>(response: ApiResponse<T>): Readonly<ApiResponse<T>> {
  return response;   
}

function logResponse(response: ApiResponse<unknown>): void {
  const ts = new Date(response.timestamp).toISOString();
  if (response.status === "success") {
    // data is T, which is unknown: we stringify it
    const dataStr = JSON.stringify(response.data);
    console.log(`Success at ${ts}: data=${dataStr}`);
  } else if (response.status === "error") {
    console.log(`Error at ${ts}: ${response.error} (${response.code})`);
  } else {
    console.log(`Redirect at ${ts}: url=${response.url}`);
  }
}

const successResponse: ApiResponse<{ name: string; age: number }> = {
  status: "success",
  data: { name: "Alice", age: 30 },
  timestamp: Date.now()
};

const errorResponse: ApiResponse<any> = {
  status: "error",
  error: "Not Found",
  code: 404,
  timestamp: Date.now()
};

const redirectResponse: ApiResponse<never> = {
  status: "redirect",
  url: "/login",
  timestamp: Date.now()
};

// Test handleResponse
console.log(handleResponse(successResponse));   // { name: 'Alice', age: 30 }
// console.log(handleResponse(errorResponse)); // would throw Error('Not Found (404)')
console.log(handleResponse(redirectResponse));   // 'Redirecting to /login'

// Test freezeResponse
const frozen = freezeResponse(successResponse);
// frozen.data.name = "Bob";  // ❌ Error: Cannot assign to 'name' because it is a read-only property.

// Test logResponse
logResponse(successResponse);   // e.g., "Success at 2024-…: data={"name":"Alice","age":30}"
logResponse(errorResponse);     // "Error at …: Not Found (404)"
logResponse(redirectResponse);  // "Redirect at …: url=/login"