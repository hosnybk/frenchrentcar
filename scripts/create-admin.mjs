// Creates or resets an admin account. The password is typed in the terminal
// (hidden) and never stored or displayed in clear text.
// Usage: npm run admin:create -- someone@example.com [OWNER|ADMIN|STAFF]
import { createInterface } from "node:readline";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/admin/password.ts";

const email = (process.argv[2] ?? "").trim().toLowerCase();
const role = (process.argv[3] ?? "OWNER").toUpperCase();
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !["OWNER", "ADMIN", "STAFF"].includes(role)) {
  console.error("Usage: npm run admin:create -- email@example.com [OWNER|ADMIN|STAFF]");
  process.exit(1);
}

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (text) => {
      if (text.includes(question)) process.stdout.write(text);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
  });
}

const password = await askHidden("Mot de passe (12 caractères minimum) : ");
if (password.length < 12) {
  console.error("Mot de passe trop court : 12 caractères minimum.");
  process.exit(1);
}
const confirm = await askHidden("Confirmez le mot de passe : ");
if (confirm !== password) {
  console.error("Les deux mots de passe ne correspondent pas.");
  process.exit(1);
}

const prisma = new PrismaClient();
try {
  const passwordHash = await hashPassword(password);
  const user = await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash, role, active: true },
    update: { passwordHash, role, active: true },
  });
  // A password change signs out every existing session of this account.
  await prisma.adminSession.deleteMany({ where: { adminUserId: user.id } });
  console.log(`Compte administrateur prêt : ${email} (${role}).`);
} finally {
  await prisma.$disconnect();
}
