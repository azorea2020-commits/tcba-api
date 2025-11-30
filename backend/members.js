<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>TCBA Members</title>
  <style>
    body {
      background: #fff5d7;
      font-family: Arial, sans-serif;
      padding: 20px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    table, th, td {
      border: 1px solid #ccc;
    }
    th, td {
      padding: 8px;
      text-align: left;
    }
    #members-status {
      margin-top: 10px;
      color: #444;
    }
    form {
      margin-top: 20px;
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
    }
    input {
      margin: 5px 0;
      padding: 5px;
      width: 100%;
    }
  </style>
</head>
<body>
  <h1>🐝 TCBA Members</h1>
  <div id="members-status">Loading members...</div>
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody id="members-list"></tbody>
  </table>

  <form onsubmit="addMember(event)">
    <h2>Add New Member</h2>
    <input id="new-name" type="text" placeholder="Name" required />
    <input id="new-email" type="email" placeholder="Email" required />
    <input id="new-password" type="password" placeholder="Password" required />
    <button type="submit">Add Member</button>
  </form>

  <script src="members.js" defer></script>
</body>
</html>
