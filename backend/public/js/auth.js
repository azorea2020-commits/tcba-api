
// auth.js - unified login/signup handler
const API_ROOT = 'https://tcba-api.onrender.com'; // Render backend
function el(id){return document.getElementById(id)}
async function post(path, data){
  try{
    const res = await fetch(API_ROOT + path, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      credentials: 'include',
      body: JSON.stringify(data)
    });
    const json = await res.json().catch(()=>null);
    return {status: res.status, ok: res.ok, body: json};
  }catch(e){
    return {status:0, ok:false, error: String(e)};
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  const login = el('loginForm');
  if(login){
    login.addEventListener('submit', async (ev)=>{
      ev.preventDefault();
      el('loginBtn').disabled = true;
      const email = el('email').value.trim();
      const password = el('password').value;
      const r = await post('/login', {email,password});
      el('loginBtn').disabled = false;
      if(r.ok){
        // expected backend returns { success: true, user: {...} }
        window.location.href = '/'; // go to home
      } else {
        alert(r.body && r.body.error ? r.body.error : 'Login failed');
      }
    });
  }

  const signup = el('signupForm');
  if(signup){
    signup.addEventListener('submit', async (ev)=>{
      ev.preventDefault();
      el('signupBtn').disabled = true;
      const name = el('name').value.trim();
      const email = el('email').value.trim();
      const password = el('password').value;
      const r = await post('/signup', {name,email,password});
      el('signupBtn').disabled = false;
      if(r.ok){
        window.location.href = '/';
      } else {
        alert(r.body && r.body.error ? r.body.error : 'Signup failed');
      }
    });
  }
});
