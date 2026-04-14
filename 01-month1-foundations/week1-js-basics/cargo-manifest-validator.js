function normalizeUnits(manifest) {
 let manifestCopy = {...manifest};
 if (manifestCopy.unit === "lb") {
   manifestCopy.unit = "kg";
   manifestCopy.weight = manifestCopy.weight * 0.45;
 }
 return manifestCopy;
}


function validateManifest(manifest) {
 let errors = {};
 if (manifest.containerId === undefined) {
   errors.containerId = "Missing";
 } else if (!Number.isInteger(manifest.containerId) || manifest.containerId <= 0) {
   errors.containerId = "Invalid";
 }
  if (manifest.destination === undefined) {
   errors.destination = "Missing"; 
 } else if (typeof manifest.destination !== "string" || manifest.destination.trim() === "") {
   errors.destination = "Invalid";
 }
  if (manifest.weight === undefined) {
   errors.weight = "Missing";
 } else if (typeof manifest.weight !== "number" || Number.isNaN(manifest.weight) || manifest.weight <= 0) {
   errors.weight = "Invalid";
 }
  if (manifest.unit === undefined) {
   errors.unit = "Missing";
 } else if (manifest.unit !== "kg" && manifest.unit !== "lb") {
   errors.unit = "Invalid"; 
 }
  if (manifest.hazmat === undefined) {
   errors.hazmat = "Missing";
 } else if (typeof manifest.hazmat !== "boolean") {
   errors.hazmat = "Invalid";
 }
 return errors;
}


function processManifest(manifest) {
 const errors = validateManifest(manifest);
 const hasErrors = Object.keys(errors).length > 0;


 if (!hasErrors) {
   console.log(`Validation success: ${manifest.containerId}`);
   const normalized = normalizeUnits(manifest);
   console.log(`Total weight: ${normalized.weight} kg`);
 } else {
   console.log(`Validation error: ${manifest.containerId}`);
   console.log(errors);
 }
}


processManifest({containerId: -88, destination: "Soledad", weight: NaN});