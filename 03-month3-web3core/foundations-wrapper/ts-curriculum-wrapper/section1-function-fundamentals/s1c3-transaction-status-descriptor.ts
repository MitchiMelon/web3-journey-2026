type StatusDescription = {
  label: string;
  color: string;
  actionRequired: boolean;
};

function describeTxStatus(statusCode: 0 | 1 | 2): StatusDescription {
  if (statusCode === 0) {
    return {
      label: "Failed",
      color: "#FF4444",
      actionRequired: true,
    };
  } else if (statusCode === 1) {
    return {
      label: "Confirmed",
      color: "#44FF44",
      actionRequired: false,
    };
  } else {
    return {
      label: "Pending",
      color: "#FFAA00",
      actionRequired: false,
    };
  }
}

console.log(describeTxStatus(0));
console.log(describeTxStatus(1));
console.log(describeTxStatus(2));
