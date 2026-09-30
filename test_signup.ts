import { registerSchema } from "./src/lib/auth/validation";

console.log("Testing updated registerSchema...");

// 1. Test Customer Registration Schema
const customerResult = registerSchema.safeParse({
  role: "customer",
  firstName: "John",
  lastName: "Doe",
  login: "john@example.com",
  password: "password123",
});

console.log("Customer validation success:", customerResult.success);

// 2. Test Handyman Registration Schema
const handymanResult = registerSchema.safeParse({
  role: "handyman",
  firstName: "Alex",
  lastName: "Smith",
  email: "alex@example.com",
  phone: "+995599123456",
  password: "password123",
  category: "handyman",
  sub: "წვრილმანი სარემონტო სამუშაოები",
  city: "tbilisi",
});

console.log("Handyman validation success:", handymanResult.success);
if (!handymanResult.success) {
  console.error(
    "Handyman validation error:",
    handymanResult.error.flatten().fieldErrors,
  );
}

if (customerResult.success && handymanResult.success) {
  console.log(
    "\n✅ validation.ts updated and verified successfully for both roles!",
  );
} else {
  console.error("\n❌ Validation test failed.");
  process.exit(1);
}
