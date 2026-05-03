const supabaseClient = supabase.createClient(
  "https://qagfyyqfzhczoyhuihiv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZ2Z5eXFmemhjem95aHVpaGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4Mjc1MDIsImV4cCI6MjA5MzQwMzUwMn0.Idn8QeB0RKhgB2FB9jft7Gtp164S7aeSy3hRYSOMFVE"
);

let currentUser;

/* SESSION CHECK */
async function initAuth(){
  const { data } = await supabaseClient.auth.getSession();

  if(!data.session){
    window.location.href = "index.html";
    return;
  }

  currentUser = data.session.user;
}

/* LOGOUT */
async function logout(){
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}
