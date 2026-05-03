const supabaseClient = supabase.createClient(
  "https://qagfyyqfzhczoyhuihiv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZ2Z5eXFmemhjem95aHVpaGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4Mjc1MDIsImV4cCI6MjA5MzQwMzUwMn0.Idn8QeB0RKhgB2FB9jft7Gtp164S7aeSy3hRYSOMFVE"
);

let currentUser;

/* LOGIN */
async function login(email, password){
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if(error){
    alert(error.message);
    return;
  }

  window.location.href = "dashboard.html";
}

/* SIGNUP */
async function signup(email, password){
  const { error } = await supabaseClient.auth.signUp({
    email,
    password
  });

  if(error){
    alert(error.message);
  } else {
    alert("Account created. Login now.");
  }
}

/* CHECK SESSION */
async function getUser(){
  const { data } = await supabaseClient.auth.getSession();
  return data.session?.user || null;
}

/* LOGOUT */
async function logout(){
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}

/* GET DATA */
async function getActivities(){
  const { data } = await supabaseClient
    .from("activities")
    .select("*")
    .order("created_at", { ascending:false });

  return data || [];
}

/* ADD DATA */
async function addActivity(obj){
  await supabaseClient.from("activities").insert([obj]);
}
