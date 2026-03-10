import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { createClient } from "@supabase/supabase-js";

// Charger les variables d'environnement
dotenv.config();

const SALT_ROUNDS = 10;

async function seed(): Promise<void> {
  // Valider les variables d'environnement requises
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const adminName = process.env.ADMIN_NAME || "Admin";
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis");
    process.exit(1);
  }

  if (!adminEmail || !adminPassword) {
    console.error("❌ ADMIN_EMAIL et ADMIN_PASSWORD sont requis");
    process.exit(1);
  }

  // Créer le client Supabase avec service_role
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log("🌱 Seed — Création du compte admin...");

  // Vérifier si un admin existe déjà
  const { data: existingAdmin } = await supabase
    .from("users")
    .select("id, email")
    .eq("email", adminEmail)
    .single();

  if (existingAdmin) {
    console.log(`✅ Un admin avec l'email ${adminEmail} existe déjà. Aucune action nécessaire.`);
    process.exit(0);
  }

  // Hasher le mot de passe
  const hashedPassword = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  // Insérer l'admin
  const { data: newAdmin, error } = await supabase
    .from("users")
    .insert({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    })
    .select("id, name, email, role")
    .single();

  if (error) {
    console.error("❌ Erreur lors de la création de l'admin :", error.message);
    process.exit(1);
  }

  console.log("✅ Compte admin créé avec succès :");
  console.log(`   📧 Email : ${newAdmin.email}`);
  console.log(`   👤 Nom : ${newAdmin.name}`);
  console.log(`   🔑 Rôle : ${newAdmin.role}`);
  console.log(`   🆔 ID : ${newAdmin.id}`);
}

seed().catch((err) => {
  console.error("❌ Erreur inattendue lors du seed :", err);
  process.exit(1);
});
